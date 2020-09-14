<template>
    <div class="point">
        <div class="mongolia" id="mongolia" @click.stop="creat_point">
            <div class="marker" v-for="(item,index) in markerArr" :key="index" :style="{left:item.x,top:item.y}" @click.stop="del_poit(index)"></div>
        </div>
    </div>
</template>
<script>
export default {
    name:'point',
    props:{
    },
    data(){
        return{
           markerArr:[] 
        }
    },
    methods:{
        // 打点
        creat_point(e){
            e = e || window.event;
            let x = e.offsetX || e.layerX;
            let y = e.offsetY || e.layerY;
            let obj = {
                x:x + 'px',
                y:y + 'px',
            }
            this.markerArr.push(obj);
        },
        // 删除点
        del_poit(index){
            this.markerArr.splice(index,1);
        },
    }
}
</script>
<style lang="less" scoped>
.point{
    width: 500px;
    height: 400px;
    margin: 0 auto;
    border: 1px solid #ccc;
    .mongolia{
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.01);
        position:relative;
        .marker{
            width: 10px;
            height: 10px;
            position: absolute;
            background:red;
        }
    }
}
</style>