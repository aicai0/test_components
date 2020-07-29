<template>
    <div class="map-point">
        <div class="button">
            <el-input class="input-number" v-model="pointLength" placeholder="请输入生成点数量" type="number"></el-input>
            <el-select v-model="select_data.value" :placeholder="select_data.placeholder">
                <el-option
                    v-for="item in select_data.options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
            </el-select>
            <el-button @click="addOneOverlayBatch">打点</el-button>
            <el-button @click="addAggreGationPoint">点聚合</el-button>
            <el-button @click="clearPonit">清除点</el-button>
            <el-button @click="visibleAreaPonit(true)">可见区域打点</el-button>
        </div>
        <div ref="myMap" :style="mapStyle" id="myMap" class="myMap"></div>
    </div>
</template>
<script>
import '../assets/js/mapJs/MarkerClusterer_min.js'
import '../assets/js/mapJs/TrafficControl_min.js'
import '../assets/js/mapJs/TextIconOverlay.js'
import '../assets/js/mapJs/BMapLib_GeoUtils.js'
import img from "../assets/imgs/marker.png";
export default {
    name:'mapPoint',
    props:{
        controlShow:{     // 是否显示缩放控件
            type:Boolean,
            default:true,
        },
        point:{           // 中心点
            type:Object,
            default(){
                return {
                    longitude: '105.000',
                    latitude: '38.000'
                }
            }
        },
        clickadd:{        // 点击打点
            type:Boolean,
            default:false,
        },
        zoom:{           // 缩放级别
            type:Number,
            default:5
        }
    },
    data(){
        return {
            map: '',
            mapStyle: {style: "midnight"},
            pointLength:1000,
            points:[],
            select_data:{
                placeholder:'请选择打点模式',
                options:[
                    {value:'1',label:'正常点'},
                    {value:'2',label:'海量点'},
                ],
                value:'2',
            },
            vevisibleFalg:false,
        }
    },
    
    mounted(){
        this.mapInit(this.point);
    },
    methods:{
        mapInit(point) {
            let vue = this;
            vue.map = new BMap.Map(vue.$refs.myMap);
            let marker = new BMap.Point(vue.point.longitude, vue.point.latitude);
            // 设置中心点以及缩放级别
            vue.map.centerAndZoom(marker, this.zoom?this.zoom:11);
            if(this.controlShow){
                vue.map.addControl(new BMap.NavigationControl());    //添加缩放控件
            }

            let ctrl = new BMapLib.TrafficControl({
		            showPanel: false //是否显示路况提示面板
            });     
            vue.map.addControl(ctrl);  
            // ctrl.showTraffic(); 

            // let traffic = new BMap.TrafficLayer();
            // vue.map.addTileLayer(traffic); 
            vue.map.enableScrollWheelZoom(true);                 //滚轮控制缩放
            vue.map.enableDoubleClickZoom(false);                //双击缩放控制
            //自定义点标注样式 Icon()中有3个参数：String类型的图片地址url；Size类型的图片大小；和可选参数IconOptions
            if (this.addOverlay) {
                let myIcon = new BMap.Icon(img, new BMap.Size(202, 120), {
                    anchor: new BMap.Size(110, 65),
                })
                let marker = new BMap.Marker(point, {icon: myIcon});
                vue.map.addOverlay(marker);      //打点
            }

            // 事件监听   获取点击点坐标 地图点击事件
            vue.map.addEventListener("click", (e) => {
                var center = vue.map.getCenter();
                if (vue.clickadd) {
                    this.addOneOverlay(e.point);
                }
                vue.$emit("mapClick", center);
            });
                
            // 设置地图风格样式  可自定义
            vue.map.setMapStyle(this.mapStyle);                  
            /**  tilesloaded 地图加载完成事件 */
            vue.map.addEventListener("tilesloaded", ()=>{
                let area = vue.map.getBounds();
                this.$emit("visibleArea",area);
                if(this.vevisibleFalg){
                    this.visibleAreaPonit();
                }
            });
            //对地图级别变化、移动结束后 监听获取可视区域
            vue.map.addEventListener("zoomend", ()=>{
                let area = vue.map.getBounds();
                let zoomSize = vue.map.getZoom();
                console.log(zoomSize);
                this.$emit("visibleArea",area);
                if(this.vevisibleFalg){
                    this.visibleAreaPonit();
                }
            });
            vue.map.addEventListener("moveend", ()=>{
                let area = vue.map.getBounds();
                this.$emit("visibleArea",area);
                if(this.vevisibleFalg){
                    this.visibleAreaPonit();
                }
            });
            // 坐标是否在可视区域范围内
            // let result = BMapLib.GeoUtils.isPointInRect(markers[i].point, map.getBounds());
        },
        // 创建点
        createPoint(){
            this.points = [];
            let i = 0;
            for (; i < this.pointLength; i++) {
                let pt = new BMap.Point(Math.random() * 40 + 85, Math.random() * 30 + 21);
                pt.id = i+1;
                this.points.push(pt);
	        }
        },
        // 批量打点
        addOneOverlayBatch(){
            this.createPoint();
            this.clearPonit();
            if(this.select_data.value === '1')             // 正常打点
            {
                this.addPoint(this.points)
            }else if(this.select_data.value === '2')       // 海量点
            {
                this.addMassivePoint(this.points)
            }
        },
        //  正常打点
        addPoint(points){
                points.forEach(point => {
                        let vue = this;
                        let myIcon = new BMap.Icon(img, new BMap.Size(202, 120), {
                            anchor: new BMap.Size(110, 65),
                        })
                        let marker = new BMap.Marker(point,{icon: myIcon});        // 创建标注  
                        marker.addEventListener('click', function(){
                            console.log(point,'click');
                            vue.$emit('pointClick',point);
                        });
                        this.map.addOverlay(marker); 
                });
        }, 
        //  海量点
        addMassivePoint(points,color){
                let vue = this;
                if (document.createElement('canvas').getContext) {  // 判断当前浏览器是否支持绘制海量点
                    let options = {
                        size: BMAP_POINT_SIZE_SMALL,
                        shape: BMAP_POINT_SHAPE_CIRCLE,
                        color: color?color:'red',
                    }
                    let pointCollection = new BMap.PointCollection(points, options);  // 初始化PointCollection
                    pointCollection.addEventListener('click', function (e) {
                        // console.log(e)
                        // alert('单击点的坐标为：' + e.point.lng + ',' + e.point.lat);  // 监听点击事件
                        let element = ''
                        for (var i = 0; i < points.length; i++) {
                            if (points[i].lng == e.point.lng && points[i].lat == e.point.lat) {
                                element = points[i];
                                break;
                            }
                        }
                        vue.$emit('pointClick',element);
                    });
                    this.map.addOverlay(pointCollection);  // 添加Overlay
                } else {
                    alert('请在chrome、safari、IE8+以上浏览器查看本示例');
                }
        },
        // 点聚合
        addAggreGationPoint(){
            console.log(BMapLib)
            this.createPoint();
            this.clearPonit();
            let markers = [];
            this.points.forEach(point => {
                    let marker = new BMap.Marker(point);        // 创建标注  
                    markers.push(marker)
            });
            this.markerClusterer = new BMapLib.MarkerClusterer(this.map, {markers:markers});
        },
        // 清楚点标记
        clearPonit(){
            this.map.clearOverlays();// 清除原标记
            if(this.markerClusterer){
                this.markerClusterer.clearMarkers()
            } 
        },
        // 设置地图缩放级别
        setZoom(zoom){
            this.map.setZoom(zoom);
        },
        visibleAreaPonit(first){
            if(first)this.setZoom(11);
            this.createPoint();
            this.clearPonit();
            this.vevisibleFalg = true;
            let j = 0;
            for(let i=0;i<this.points.length;i++){
                let point = this.points[i];
                let marker = new BMap.Marker(point);  
                let result = BMapLib.GeoUtils.isPointInRect(point, this.map.getBounds());
                // if(result == true && j<10) 
                if(result == true) 
                {
                    this.map.addOverlay(marker);
                    ++j;
                }
                // else if(result == true && j>=10)
                // {
                //     ++j;
                //     this.map.removeOverlay(marker);
                // }
                else this.map.removeOverlay(marker);
            }
        }
    },
    
}
</script>
<style lang="less" scoped>
@import '../assets/js/mapJs/TrafficControl_min.css';
.map-point{
    .button{
        text-align: left;
        margin-bottom: 10px;
        .input-number{
            width: 200px;
            margin-right: 10px;
        }
    }
    .myMap{
        width: 1000px;
        height: 800px;
    }
}
</style>