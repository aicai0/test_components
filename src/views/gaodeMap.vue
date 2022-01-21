<template>
    <div class="gaode-map base-map">
        <div class="button">
            <el-button @click="drawOne">打点</el-button>
            <el-button @click="drawCluster">海量点</el-button>
            <el-button>点聚合</el-button>
            <el-button>图层打点</el-button>
        </div>
        <div ref="baseMap" class="map-content" id="mapContainer"></div>
    </div>
</template>
<script>
import Vue from "vue/dist/vue.esm.js";
import comTest from "../components/comTest.vue"

import img1 from "../assets/icon/three/默认icon1.png"
import img2 from "../assets/icon/three/默认icon2.png"
export default {
    name: "gaodeMap",
    components:{
        comTest
    },
    props:{
        center:{
            type: Object,
            default(){
                return {
                    longitude:"114.892572",
                    latitude:"40.773237"
                }
            }
        }
    },
    data(){
        return {
            mapOption:{
                center: [],
                zoom: 12,
                resizeEnable: true,
                mapStyle: 'amap://styles/61cf1c9d8a8c986a77e0f7c711c90194',
                // mapStyle: 'amap://styles/70148c264547c13fb4abe42a19d29444',
                // pitch: 65, // 地图俯仰角度，有效范围 0 度- 83 度
                viewMode: '3D' // 地图模式
            },
        }
    },
    created(){},
    mounted(){
        this.initMap();
    },
    methods:{
        initMap(type="normal"){
            let mapOption = this.mapOption;
            mapOption.center = [this.center.longitude, this.center.latitude];
            const container = this.$refs.baseMap

            this.map = new AMap.Map(container, mapOption);

            this.map.on('complete', () => {
                //    this.drawPoint()
                this.fireProtectionSearch();
            })

            // 设置地图样式
            this.map.setMapStyle("amap://styles/01afd117ca4d621bcf5c4e1aafb6f065")
        },
        drawOne(){
            this.drawPoint()
        },
        drawPoint(point = {longitude:this.center.longitude, latitude:this.center.latitude,content:"张家口" }, markerType="default",){

            // let markerIcon = new AMap.Icon({
            //     // 图标尺寸
            //     size: new AMap.Size(26, 32),
            //     image: require(``)
            // });
            console.log(point, "pointpoint")
            let marker = new AMap.Marker({
                icon: "//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png",
                position: [point.longitude, point.latitude],
                offset: new AMap.Pixel(-13, -30)
            });

            marker.content =
                            `
                            <div class="window_info network" id="industryBox">
                                ${point.content}
                            </div>
                            `;

            let infoWindow = this.infoWindow ? this.infoWindow : this.createInfoWindow();

            let markerHover = (e) => {
                    infoWindow.setContent(e.target.content);
                    infoWindow.setOffset(new AMap.Pixel(0, -28));
                    infoWindow.open(this.map, e.target.getPosition());
            };

            let closeInfoWindow = () => {
                infoWindow.close();
            };

            marker.on('mouseover', markerHover);
            marker.on('mouseout', closeInfoWindow);

            marker.on("click", () => {
                this.createVueInfoWindow(infoWindow, point)
            });
            marker.setMap(this.map);
            return marker
        },
        createInfoWindow(offset){
            let infoWindow = new AMap.InfoWindow({
                isCustom: true,  //使用自定义窗体
                offset: offset,
                autoMove: true,
                closeWhenClickMap: true
            });

            this.infoWindow = infoWindow;
            return infoWindow;
        },
        createVueInfoWindow(infoWindow, point){
            // console.log(infoWindow,point)
            let Content = Vue.extend({
                name: "vueWindow",
                components: {
                    "comTest": comTest
                },
                data() {
                    return {
                        msg: point.content
                    };
                },
                methods: {
                    hello() {
                        console.log(10000000);
                    }
                },
                template: `<comTest :msg="msg"></comTest>`
            });

            let component = new Content().$mount();
            // console.log(component,"v")
            infoWindow.setContent(component.$el);
            infoWindow.open(this.map, [+point.longitude, +point.latitude]);
        },
        createPoint(){
            let resArr = []
            let i = 0;
            for (; i < 5000; i++) {
                let pt = new AMap.Marker({
                    map: this.map,
                    position: [Math.random() * 40 + 85, Math.random() * 30 + 21],
                    icon: img1,
                    offset: new AMap.Pixel(-0, -37),
                    title: `随机point——${i}`,
                    extData: {id: i+1, title: `随机point——${i}` },
                });
                pt.id = i+1;
                resArr.push(pt);
	        }
            return resArr
        },
        drawCluster(){
            let that = this;
            let markerArr = this.createPoint();
            this.map.plugin(["AMap.MarkerClusterer"],function(){
                let cluster = new AMap.MarkerClusterer(that.map, markerArr, {
                    maxZoom: 14, // 最大缩放级别
                    renderClusterMarker: that.generateMassMarks, // 自定义聚合点样式
                // renderMarker: _renderMarker,   // 自定义非聚合点样式
                });
            })
        },
        // 生成海量点
        generateMassMarks(context){
            // console.log(context,"context")
            var clusterCount = context.count;
            var div = document.createElement('div');
            let defaultColor = [
                {bgColor:"rgba(252,207,28,.6)", bdcolor:"rgba(252,207,28,1)"},
                {bgColor:"rgba(252,175,28,.6)", bdcolor:"rgba(252,175,28,1)"},
                {bgColor:"rgba(248,143,6,.6)", bdcolor:"rgba(248,143,6,1)"},
                {bgColor:"rgba(248,111,6,.6)", bdcolor:"rgba(248,111,6,1)"},
                {bgColor:"rgba(248,74,6,.6)", bdcolor:"rgba(248,74,6,1)"},
                {bgColor:"rgba(219,46,0,.6)", bdcolor:"rgba(219,46,0,1)"},
            ]
            let bgColor, bdColor;
            if(clusterCount >= 0 && clusterCount <= 5) {
                bgColor = defaultColor[0].bgColor;
                bdColor = defaultColor[0].bdcolor;
            } else if(clusterCount > 6 && clusterCount <= 25){
                bgColor = defaultColor[1].bgColor;
                bdColor = defaultColor[1].bdcolor;
            } else if(clusterCount > 25 && clusterCount <= 100) {
                bgColor = defaultColor[2].bgColor;
                bdColor = defaultColor[2].bdcolor;
            } else if(clusterCount > 100 && clusterCount <= 500) {
                bgColor = defaultColor[3].bgColor;
                bdColor = defaultColor[3].bdcolor;
            } else if(clusterCount > 500 && clusterCount <= 2000) {
                bgColor = defaultColor[4].bgColor;
                bdColor = defaultColor[4].bdcolor;
            }else if(clusterCount > 2000) {
                bgColor = defaultColor[5].bgColor;
                bdColor = defaultColor[5].bdcolor;
            }
            div.style.backgroundColor = bgColor;
            let size = Math.round(25 + Math.pow(clusterCount / this.keyUnitLength, 1 / 5) * 40);
            div.style.width = div.style.height = size + 'px';
            div.style.border = bdColor;
            div.style.borderRadius = size / 2 + 'px';
            div.innerHTML = context.count;
            div.style.lineHeight = size + 'px';
            div.style.color = '#ffffff';
            div.style.fontSize = '12px';
            div.style.textAlign = 'center';
            context.marker.setOffset(new AMap.Pixel(-size / 2, -size / 2));
            context.marker.setContent(div);
        },
        // 搜索消防相关信息
        async fireProtectionSearch(){
            let result = await this.keySearch("消防");
            // console.log(result,"消防关键字搜索")
            this.$emit("getFireResult",result.poiList.pois);
            // result.poiList.pois.forEach(point=>{
            //     let marker = this.drawPoint({longitude:point.location.lng, latitude:point.location.lat,content:point.name})
            //     this.markers.push(marker)
            // })
        },
        // 关键字搜索
        keySearch(keywords){
            return new Promise((resolve, reject)=>{
                AMap.plugin('AMap.PlaceSearch', function(){
                    let autoOptions = {
                        city: '张家口',
                        pageSize:50,
                        type:"汽车服务|汽车销售|汽车维修|摩托车服务|餐饮服务|购物服务|生活服务|体育休闲服务|医疗保健服务|住宿服务|风景名胜|商务住宅|政府机构及社会团体|科教文化服务|交通设施服务|金融保险服务|公司企业|道路附属设施|地名地址信息|公共设施"
                    }
                    let placeSearch = new AMap.PlaceSearch(autoOptions);
                    placeSearch.search(keywords, function(status, result) {
                        // 搜索成功时，result即是对应的匹配数据
                        // console.log(status,result)
                        if(status === "complete"){
                            resolve(result)
                        }else if(status === "error"){
                            reject(result)
                        }else if(status === "no_data"){
                            resolve([])
                        }
                    })
                })
            })

        }
    }
}
</script>
<style lang="less" scoped>
.gaode-map{
    width: 100%;
    height: 100%;
    .button{
        height: 40px;
        text-align: left;
        margin-bottom: 10px;
    }
    .map-content{
        width: 80%;
        height: 80%;
    }
}
</style>