/**
 * @fileoverview MarkerClusterer标记聚合器用来解决加载大量点要素到地图上产生覆盖现象的问题，并提高性能。
 * 主入口类是<a href="symbols/BMapLib.MarkerClusterer.html">MarkerClusterer</a>，
 * 基于Baidu Map API 1.2。
 *
 * @author Baidu Map Api Group
 * @version 1.2
 */

/**
 * @namespace BMap的所有library类均放在BMapLib命名空间下
 */
var BMapLib = (window.BMapLib = BMapLib || {});
(function () {
  /**
   * 判断给定的对象是否为数组
   * @param {Object} source 要测试的对象
   *
   * @return {Boolean} 如果是数组返回true，否则返回false
   */
  var isArray = function (source) {
    return Object.prototype.toString.call(source) === '[object Array]'
  }
  var debounce = function (fn, delay, context) {
    let args = arguments
    let timer = null
    context = context || this
    return function () {
      if (timer) {
        clearTimeout(timer)
        timer = setTimeout(function () {
          fn.apply(context, args)
        }, delay)
      } else {
        timer = setTimeout(function () {
          fn.apply(context, args)
        }, delay)
      }
    }
  }
  /**
   * 返回item在source中的索引位置
   * @param {Object} item 要测试的对象
   * @param {Array} source 数组
   *
   * @return {Number} 如果在数组内，返回索引，否则返回-1
   */
  var indexOf = function (item, source) {
    var index = -1
    if (isArray(source)) {
      if (source.indexOf) {
        index = source.indexOf(item)
      } else {
        for (var i = 0, m; (m = source[i]); i++) {
          if (m === item) {
            index = i
            break
          }
        }
      }
    }
    return index
  }

  /**
   *@exports MarkerClusterer as BMapLib.MarkerClusterer
   */
  var MarkerClusterer =
    /**
     * MarkerClusterer
     * @class 用来解决加载大量点要素到地图上产生覆盖现象的问题，并提高性能
     * @constructor
     * @param {Map} map 地图的一个实例。
     * @param {Json Object} options 可选参数，可选项包括：<br />
     *    markers {Array<Marker>} 要聚合的标记数组<br />
     *    girdSize {Number} 聚合计算时网格的像素大小，默认60<br />
     *    maxZoom {Number} 最大的聚合级别，大于该级别就不进行相应的聚合<br />
     *    minClusterSize {Number} 最小的聚合数量，小于该数量的不能成为一个聚合，默认为2<br />
     *    isAverangeCenter {Boolean} 聚合点的落脚位置是否是所有聚合在内点的平均值，默认为否，落脚在聚合内的第一个点<br />
     *    styles {Array<IconStyle>} 自定义聚合后的图标风格，请参考TextIconOverlay类<br />
     */
    (BMapLib.MarkerClusterer = function (map, options) {
      if (!map) {
        return
      }
      this._map = map
      this._datas = []
      this._clusters = []
      this.markersInMap = []
      this.clustersInMap = []
      this.gridSize_mercator = 0
      var opts = options || {}
      this._gridSize = opts['gridSize'] || 60
      this._maxZoom = opts['maxZoom'] || 18
      this._minClusterSize = opts['minClusterSize'] || 2
      this._isAverageCenter = false
      let projection = this._map.getMapType().getProjection()
      this.lngLatToPoint = projection.lngLatToPoint
      this._events = []
      this._current = {}
      this._lastCurrent = {}
      this.debounceRedraw = debounce(this._redraw, 10, this)
      if (opts['isAverageCenter'] !== undefined) {
        this._isAverageCenter = opts['isAverageCenter']
      }
      this._styles = opts['styles'] || []
      this._markerOptions = opts['markerOptions'] || {}
      var that = this
      this._map.addEventListener('zoomend', function () {
        that.debounceRedraw()
      })

      this._map.addEventListener('moveend', function () {
        that.debounceRedraw()
      })

      var mkrs = opts['data']
      isArray(mkrs) && this.addMarkers(mkrs)
      this._draw()
    })
  MarkerClusterer.prototype.addEventListener = function (
    type = 'click',
    target = 'marker',
    handler
  ) {
    this._events.push({ type, target, handler })
    this.debounceRedraw()
  }
  MarkerClusterer.prototype.removeAllEventListener = function () {
    this.markersInMap.forEach(marker => {
      this._removeEventListener(marker)
    })
    this.clustersInMap.forEach(cluster => {
      this._removeEventListener(cluster)
    })
    this._events = []
  }
  MarkerClusterer.prototype.removeEventListener = function (
    type = 'click',
    target = 'marker',
    handler
  ) {
    let idx = this._events.findIndex(
      _event =>
        _event.type === type &&
        _event.target === target &&
        _event.handler === handler
    )
    this._events.splice(idx, 1)
    this.debounceRedraw()
  }
  MarkerClusterer.prototype._removeEventListener = function (target) {
    if (
      target instanceof Cluster &&
      target._clusterMarker._removeEventListeners
    ) {
      target._clusterMarker._removeEventListeners.forEach(
        _removeEventListener => {
          _removeEventListener && _removeEventListener()
        }
      )
      target._clusterMarker._removeEventListeners = []
    } else if (
      target instanceof window.BMap.Marker &&
      target._removeEventListeners
    ) {
      target._removeEventListeners.forEach(_removeEventListener => {
        _removeEventListener && _removeEventListener()
      })
      target._removeEventListeners = []
    }
  }
  /****
   * 监听函数
   */
  MarkerClusterer.prototype._addEventListener = function (target) {
    if (target instanceof Cluster) {
      let clusterEvents = this._events.filter(e => e.target === 'cluster')
      clusterEvents.forEach(({ type, handler }) => {
        // 不这样做清除不了事件
        let _event = function () {
          handler.apply(target, arguments)
        }
        target._clusterMarker.addEventListener(type, _event)
        target._clusterMarker._removeEventListeners =
          target._clusterMarker._removeEventListener || []
        target._clusterMarker._removeEventListeners.push(function () {
          target._clusterMarker.removeEventListener(type, _event)
        })
      })
    } else if (target instanceof window.BMap.Marker) {
      let markerEvents = this._events.filter(e => e.target === 'marker')
      markerEvents.forEach(({ type, handler }) => {
        let _event = function () {
          handler.apply(target, arguments)
        }
        target.addEventListener(type, _event)
        target._removeEventListeners = target._removeEventListeners || []
        target._removeEventListeners.push(function () {
          target.removeEventListener(type, _event)
        })
      })
    }
  }
  /**
   * 添加要聚合的标记数组。
   * @param {Array<Marker>} markers 要聚合的标记数组
   *
   * @return 无返回值。
   */
  MarkerClusterer.prototype.addMarkers = function (datas) {
    this._datas = this._datas.concat(this.transferToMercator(datas))
    this._createClusters()
  }

  // 将经纬度坐标转换为墨托卡坐标,data为数据集合或单个
  MarkerClusterer.prototype.transferToMercator = function (data) {
    if (data instanceof Array) {
      data.forEach(item => {
        let pixel = this.lngLatToPoint(item.location)
        item.coordinates_mercator = [Math.round(pixel.x), Math.round(pixel.y)]
      })
    } else {
      let pixel = this.lngLatToPoint(data.location)
      data.coordinates_mercator = [Math.round(pixel.x), Math.round(pixel.y)]
    }
    return data
  }
  /**
   * 添加一个聚合的标记。
   * @param {window.BMap.Marker} marker 要聚合的单个标记。
   * @return 无返回值。
   */
  MarkerClusterer.prototype.addMarker = function (data) {
    this._datas.concat(this.transferToMercator(data))
    this._createClusters()
  }

  /**
   * 根据所给定的标记，创建聚合点，并且遍历所有聚合点
   * @return 无返回值
   */
  MarkerClusterer.prototype._createClusters = function () {
    let map = this._map
    let zoomUnit = Math.pow(2, 18 - map.getZoom())
    let mcCenter = this.lngLatToPoint(map.getCenter())
    let mapSize = map.getSize()
    let nwMc = new window.BMap.Pixel(
      mcCenter.x - (mapSize.width / 2) * zoomUnit,
      mcCenter.y + (mapSize.height / 2) * zoomUnit
    ) // 左上角墨卡托
    let seMc = new window.BMap.Pixel(
      mcCenter.x + (mapSize.width / 2) * zoomUnit,
      mcCenter.y - (mapSize.height / 2) * zoomUnit
    ) // 右下角墨卡托
    this.gridSize_mercator = this._gridSize * zoomUnit // gridSize转换到墨卡托坐标上的大小
    this._datas.forEach(item => {
      if (
        this._isPointInScreen(
          item.coordinates_mercator,
          [nwMc, seMc],
          this.gridSize_mercator
        )
      ) {
        this._addToClosestCluster(item)
      }
    })
  }

  /**
   * 根据标记的位置，把它添加到最近的聚合中
   * @param {window.BMap.Marker} marker 要进行聚合的单个标记
   *
   * @return 无返回值。
   */
  MarkerClusterer.prototype._addToClosestCluster = function (data) {
    let clusterToAddTo = null
    let distance
    let ponit = data.coordinates_mercator
    this._clusters.forEach(cluster => {
      if (cluster.isPointInCluster(ponit)) {
        let center = cluster.getMercatorCenter() // 获取聚合中心的墨卡托坐标
        // 计算点与聚合中心的距离, 取最近的一个聚合类
        let d =
          Math.pow(ponit[0] - center[0], 2) + Math.pow(ponit[1] - center[1], 2)
        // let d = Math.abs(ponit[0] - center[0])*Math.ceil(Math.sqrt(1 + Math.pow((ponit[1] - center[1])/(ponit[0] - center[0]), 2)))
        if (distance === undefined || d < distance) {
          distance = d
          clusterToAddTo = cluster
        }
      }
    })

    if (clusterToAddTo) {
      clusterToAddTo.addMarker(data)
    } else {
      var ncluster = new Cluster(this)
      ncluster.addMarker(data)
      this._clusters.push(ncluster)
    }

    clusterToAddTo = null
    distance = undefined
  }
  // 判断点位置是否在屏幕范围内,参数都为墨卡托坐标
  MarkerClusterer.prototype._isPointInScreen = function (
    point,
    bounds,
    gridSize
  ) {
    return (
      point[0] >= bounds[0].x - gridSize &&
      point[0] <= bounds[1].x + gridSize &&
      point[1] <= bounds[0].y + gridSize &&
      point[1] >= bounds[1].y - gridSize
    )
  }
  /**
   * 清除上一次的聚合的结果
   * @return 无返回值。
   */
  MarkerClusterer.prototype._clearLastClusters = function () {
    this.markersInMap.forEach(marker => {
      this._removeEventListener(marker)
      var tmplabel = marker.getLabel()
      this._map.removeOverlay(marker)
      marker.setLabel(tmplabel)
    })
    this.clustersInMap.forEach(cluster => {
      this._removeEventListener(cluster)
      cluster.remove()
    })
    this.markersInMap = []
    this.clustersInMap = []
    this._clusters = [] // 置空Cluster数组
  }

  /**
   * 删除单个标记
   * @param {window.BMap.Marker} marker 需要被删除的marker
   *
   * @return {Boolean} 删除成功返回true，否则返回false
   */
  MarkerClusterer.prototype._removeMarker = function (data) {
    var index = indexOf(data, this._datas)
    let marker = this.markersInMap.find(
      _marker => _marker._data === data && _marker.isInMap
    )
    if (index === -1) {
      return false
    }
    this._removeEventListener(marker)
    var tmplabel = marker.getLabel()
    this._map.removeOverlay(marker)
    marker.setLabel(tmplabel)
    this._datas.splice(index, 1)
    return true
  }

  /**
   * 删除单个标记
   * @param {window.BMap.Marker} marker 需要被删除的marker
   *
   * @return {Boolean} 删除成功返回true，否则返回false
   */
  MarkerClusterer.prototype.removeMarker = function (data) {
    var success = this._removeMarker(data)
    if (success) {
      this._clearLastClusters()
      this._createClusters()
    }
    return success
  }

  /**
   * 删除一组标记
   * @param {Array<window.BMap.Marker>} markers 需要被删除的marker数组
   *
   * @return {Boolean} 删除成功返回true，否则返回false
   */
  MarkerClusterer.prototype.removeMarkers = function (markers) {
    var success = false
    for (var i = 0; i < markers.length; i++) {
      var r = this._removeMarker(markers[i])
      success = success || r
    }

    if (success) {
      this._clearLastClusters()
      this._createClusters()
    }
    return success
  }

  /**
   * 从地图上彻底清除所有的标记
   * @return 无返回值
   */
  MarkerClusterer.prototype.clearMarkers = function () {
    this._clearLastClusters()
    this._datas = []
  }
  /**
   * 重新生成，比如改变了属性等
   * @return 无返回值
   */
  MarkerClusterer.prototype._redraw = function () {
    this._clearLastClusters()
    this._createClusters()
    this._draw()
  }
  MarkerClusterer.prototype._draw = function () {
    this.markersInMap = []
    this.clustersInMap = []
    if (this._map.getZoom() > this._maxZoom) {
      this._datas.forEach(data => {
        let marker = this._createMarker(data)
        this.markersInMap.push(marker)
      })
    } else {
      this._clusters.forEach(cluster => {
        if (cluster._datas.length >= this._minClusterSize) {
          this.clustersInMap.push(cluster)
        } else {
          cluster._datas.forEach(data => {
            let marker = this._createMarker(data)
            this.markersInMap.push(marker)
          })
        }
      })
    }
    this._filterSameLngLatMarker(this.markersInMap).forEach(marker => {
      if (marker.isInMap) {
        this._addEventListener(marker)
        this._map.addOverlay(marker)
      }
    })
    this.clustersInMap.forEach(cluster => {
      cluster._isReal = true
      this._addEventListener(cluster)
      this._map.addOverlay(cluster._clusterMarker)
      cluster._refresh()
      // cluster.addEventListener()
    })
  }
  MarkerClusterer.prototype._createMarker = function (data) {
    let opts =
      data === this._current.data
        ? Object.assign({}, this._markerOptions, this._current.markerOptions)
        : this._markerOptions
    let baiduPoint = new window.BMap.Point(data.location.lng.toFixed(6), data.location.lat.toFixed(6))
    let marker = new window.BMap.Marker(baiduPoint, opts)
    marker._data = data
    return marker
  }
  MarkerClusterer.prototype.setMarker = function (data, markerOptions) {
    // modify by ydf
    this._current = {
      data,
      markerOptions
    }
    if (this._lastCurrent.marker) {
      this._refreshMarker(this._lastCurrent.marker, this._markerOptions)
    }
    let markerInMap = this.markersInMap.find(marker => marker._data === this._current.data)
    this._lastCurrent = Object.assign({}, this._current, { marker: markerInMap || null })
    if (markerInMap) {
      let opts = Object.assign({}, this._markerOptions, markerOptions)
      this._refreshMarker(markerInMap, opts)
    } else {
      this.debounceRedraw()
    }
  }
  MarkerClusterer.prototype._refreshMarker = function (marker, opts) {
    opts.offset && marker.setOffset(opts.icon)
    opts.icon && marker.setIcon(opts.icon)
    opts.enableMassClear ? marker.enableMassClear() : marker.disableMassClear()
    opts.enableDragging ? marker.enableDragging() : marker.disableDragging()
    opts.rotation && marker.setRotation(opts.rotation)
    opts.shadow && marker.setShadow(opts.shadow)
    opts.title && marker.setTitle(opts.title)
  }
  MarkerClusterer.prototype.clearCurrent = function () {
    // modify by ydf
    this._current = {}
    this.debounceRedraw()
  }
  MarkerClusterer.prototype._filterSameLngLatMarker = function (markers) {
    let inMapMarkers = markers.filter(marker => marker.isInMap)
    let outMapMarkers = markers.filter(marker => !marker.isInMap)
    outMapMarkers.forEach(marker => {
      let inMarkers = inMapMarkers.find(
        m =>
          m.getPosition().lng === marker.getPosition().lng &&
          m.getPosition().lat === marker.getPosition().lat
      )
      if (!inMarkers) {
        inMapMarkers.push(marker)
        marker.isInMap = true
      } else {
        marker.isInMap = false
      }
    })
    let sameMarker = this._getSameLngLatMarker(inMapMarkers, this._current.data)
    let marker = markers.find(m => m._data === this._current.data)
    this._lastCurrent.marker = marker
    if (sameMarker && marker && sameMarker !== marker) {
      sameMarker.isInMap = false
      marker.isInMap = true
    }
    return markers
  }
  MarkerClusterer.prototype._getSameLngLatMarker = function (datas, data) {
    // modify by ydf
    return datas.find(_marker => {
      return (
        data &&
        _marker &&
        data.location &&
        _marker.getPosition() &&
        _marker.getPosition().lng === data.location.lng &&
        _marker.getPosition().lat === data.location.lat
      )
    })
  }
  /**
   * 获取网格大小
   * @return {Number} 网格大小
   */
  MarkerClusterer.prototype.getGridSize = function () {
    return this._gridSize
  }

  /**
   * 设置网格大小
   * @param {Number} size 网格大小
   * @return 无返回值
   */
  MarkerClusterer.prototype.setGridSize = function (size) {
    this._gridSize = size
    this.debounceRedraw()
  }

  /**
   * 获取聚合的最大缩放级别。
   * @return {Number} 聚合的最大缩放级别。
   */
  MarkerClusterer.prototype.getMaxZoom = function () {
    return this._maxZoom
  }

  /**
   * 设置聚合的最大缩放级别
   * @param {Number} maxZoom 聚合的最大缩放级别
   * @return 无返回值
   */
  MarkerClusterer.prototype.setMaxZoom = function (maxZoom) {
    this._maxZoom = maxZoom
    this.debounceRedraw()
  }

  /**
   * 获取聚合的样式风格集合
   * @return {Array<IconStyle>} 聚合的样式风格集合
   */
  MarkerClusterer.prototype.getStyles = function () {
    return this._styles
  }

  /**
   * 设置聚合的样式风格集合
   * @param {Array<IconStyle>} styles 样式风格数组
   * @return 无返回值
   */
  MarkerClusterer.prototype.setStyles = function (styles) {
    this._styles = styles
    this.debounceRedraw()
  }

  /**
   * 获取单个聚合的最小数量。
   * @return {Number} 单个聚合的最小数量。
   */
  MarkerClusterer.prototype.getMinClusterSize = function () {
    return this._minClusterSize
  }

  /**
   * 设置单个聚合的最小数量。
   * @param {Number} size 单个聚合的最小数量。
   * @return 无返回值。
   */
  MarkerClusterer.prototype.setMinClusterSize = function (size) {
    this._minClusterSize = size
    this.debounceRedraw()
  }

  /**
   * 获取单个聚合的落脚点是否是聚合内所有标记的平均中心。
   * @return {Boolean} true或false。
   */
  MarkerClusterer.prototype.isAverageCenter = function () {
    return this._isAverageCenter
  }

  /**
   * 获取聚合的Map实例。
   * @return {Map} Map的示例。
   */
  MarkerClusterer.prototype.getMap = function () {
    return this._map
  }

  /**
   * 获取所有的标记数组。
   * @return {Array<Marker>} 标记数组。
   */
  MarkerClusterer.prototype.getMarkers = function () {
    return this._datas
  }

  /**
   * 获取聚合的总数量。
   * @return {Number} 聚合的总数量。
   */
  MarkerClusterer.prototype.getClustersCount = function () {
    var count = 0
    for (var i = 0, cluster; (cluster = this._clusters[i]); i++) {
      cluster.isReal() && count++
    }
    return count
  }

  /**
   * @ignore
   * Cluster
   * @class 表示一个聚合对象，该聚合，包含有N个标记，这N个标记组成的范围，并有予以显示在Map上的TextIconOverlay等。
   * @constructor
   * @param {MarkerClusterer} markerClusterer 一个标记聚合器示例。
   */
  function Cluster (markerClusterer) {
    this._markerClusterer = markerClusterer
    this._map = markerClusterer.getMap()
    this._minClusterSize = markerClusterer.getMinClusterSize()
    this._isAverageCenter = markerClusterer.isAverageCenter()
    this.gridSize_mercator = markerClusterer.gridSize_mercator
    this.lngLatToPoint = markerClusterer.lngLatToPoint
    this._center = null // 落脚位置
    this._mercatorCenter = []
    this._datas = [] // 这个Cluster中所包含的markers
    this._isReal = false // 真的是个聚合

    this._clusterMarker = new BMapLib.TextIconOverlay(
      this._center,
      this._datas.length,
      { styles: this._markerClusterer.getStyles() }
    )
  }
  /**
   * 向该聚合添加一个标记。
   * @param {Marker} marker 要添加的标记。
   * @return 无返回值。
   */
  Cluster.prototype.addMarker = function (data) {
    if (this.isMarkerInCluster(data)) {
      return false
    }

    if (!this._center) {
      this._center = data.location
    } else {
      if (this._isAverageCenter) {
        var l = this._datas.length + 1
        var lat = (this._center.lat * (l - 1) + data.location.lat) / l
        var lng = (this._center.lng * (l - 1) + data.location.lng) / l
        this._center = new window.BMap.Point(lng, lat)
      } // 计算新的Center
    }
    var pixel = this.lngLatToPoint(this._center)
    this._mercatorCenter = [Math.round(pixel.x), Math.round(pixel.y)]
    this._datas.push(data)
  }

  /**
   * 判断一个标记是否在该聚合中。
   * @param {Marker} marker 要判断的标记。
   * @return {Boolean} true或false。
   */
  Cluster.prototype.isMarkerInCluster = function (data) {
    if (this._datas.indexOf) {
      return this._datas.indexOf(data) !== -1
    } else {
      for (var i = 0, m; (m = this._datas[i]); i++) {
        if (m === data) {
          return true
        }
      }
    }
    return false
  }

  Cluster.prototype.isReal = function () {
    return this._isReal
  }
  Cluster.prototype._refresh = function () {
    this._clusterMarker && this._clusterMarker.setPosition(this._center)
    this._clusterMarker && this._clusterMarker.setText(this._datas.length)
  }
  /**
   * 删除该聚合。
   * @return 无返回值。
   */
  Cluster.prototype.remove = function () {
    this._map.removeOverlay(this._clusterMarker)
    this._datas.length = 0
    delete this._datas
  }

  /**
   * 获取该聚合所包含的所有标记的最小外接矩形的范围。
   * @return {window.BMap.Bounds} 计算出的范围。
   */
  // Cluster.prototype.getBounds = function () {
  //   var bounds = new window.BMap.Bounds(this._center, this._center)
  //   for (var i = 0, data; (data = this._datas[i]); i++) {
  //     bounds.extend(data.location)
  //   }
  //   return bounds
  // }
  // 点是否在聚合范围内，point为墨卡托坐标
  Cluster.prototype.isPointInCluster = function (coordinates) {
    let gridSize = this.gridSize_mercator
    let center = this.getMercatorCenter()
    let result =
      coordinates[0] >= center[0] - gridSize &&
      coordinates[0] <= center[0] + gridSize &&
      coordinates[1] <= center[1] + gridSize &&
      coordinates[1] >= center[1] - gridSize
    return result
  }
  /**
   * 获取该聚合的落脚点。
   * @return {window.BMap.Point} 该聚合的落脚点。
   */
  Cluster.prototype.getCenter = function () {
    return this._center
  }
  Cluster.prototype.getMercatorCenter = function () {
    return this._mercatorCenter
  }
})()