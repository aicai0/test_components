<template>
<div class="canvasBox">
    <canvas class="myCanvas" id="myCanvas" ref="canvasLine">
        您的浏览器不支持 HTML5 canvas 标签。
    </canvas>
</div>
</template>
<script>
export default {
    name:'canvasDemo',
    data(){
        return {
            canvas:null,
            canvasArray:[],
            ctx: null
        }
    },
    mounted(){
        this.canvasInit();
    },
    methods:{
        canvasInit(){
            this.canvas = this.$refs.canvasLine;
            this.canvas.width = 1200;
            this.canvas.height = 300;
            this.ctx = this.canvas.getContext("2d");
            this.drawLine(0, 200, 1000)
        },
        drawLine(x, y, width){
            this.ctx.beginPath();
            this.ctx.moveTo(x, y);
            this.ctx.lineTo(x+width, y)

            this.ctx.lineWidth = 5;
            this.ctx.strokeStyle = "#c1d9ee";

            this.ctx.stroke();
            this.ctx.closePath();
            return {
                type: 'line',
                x:x,
                y:y,
                width:width
            };
        }
    }
}
</script>
<style lang="less" scoped>

</style>