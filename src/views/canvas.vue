<template>
<div class="canvasBox">
    <canvas class="myCanvas"  ref="canvasChart1">
        您的浏览器不支持 HTML5 canvas 标签。
    </canvas>
    <canvas class="myCanvas"  ref="canvasChart2">
        您的浏览器不支持 HTML5 canvas 标签。
    </canvas>
    <canvas class="myCanvas"  ref="canvasBall">
        您的浏览器不支持 HTML5 canvas 标签。
    </canvas>
    <canvas class="myCanvas"  ref="canvasLine">
        您的浏览器不支持 HTML5 canvas 标签。
    </canvas>
    <canvas class="myCanvas"  ref="canvasCircle">
        您的浏览器不支持 HTML5 canvas 标签。
    </canvas>
</div>
</template>
<script>
export default {
    name:'canvasDemo',
    data(){
        return {
            canvasLine:null,
            canvasArray:[],
            ctxLine: null,
            tangram:[
                {p:[{x:0,y:0},{x:800,y:0},{x:400,y:400}],color:"#caff67"},
                {p:[{x:0,y:0},{x:400,y:400},{x:0,y:800}],color:"#67becf"},
                {p:[{x:800,y:0},{x:800,y:400},{x:600,y:600},{x:600,y:200}],color:"#ef3d61"},
                {p:[{x:600,y:200},{x:600,y:600},{x:400,y:400}],color:"#f9f51a"},
                {p:[{x:400,y:400},{x:600,y:600},{x:400,y:800},{x:200,y:600}],color:"#a594c0"},
                {p:[{x:200,y:600},{x:400,y:800},{x:0,y:800}],color:"#fa8ecc"},
                {p:[{x:800,y:400},{x:800,y:800},{x:400,y:800}],color:"#f6ca29"},
            ],
            canvasCircle: null,
            ctxCircle: null,
            runBallConfig:{
                ballRadius: 20,
                startX: 30,
                startY: 30,
                vx: 5,
                vy: 0,
                g: 2,
            },
            canvasBall: null,
            ctxBall: null,
            canvasChart1: null,
            canvasChart1Ctx: null,
            lineConfig:{
                title:{
                    width:100,
                    height:20,
                    color: "black"
                },
                yBlank: 10,
                xBlank: 10,
                pointRadius: 3,
                lineStyle:{
                    color: "red",
                    width: 1,
                },
                xyLineStyle:{
                    color: "black",
                    width: 1,
                    height:5
                },
                font:{
                    width:10,
                    height:10,
                    color:"black"
                }
            },
            lineData:{
                left: "10%",
                top: "10%",
                bottom: "10%",
                right: "10%",
                xAxis:['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                yAxis:[820, 932, 901, 934, 1290, 1500, 1320],
            },
            canvasChart2: null,
            canvasChart2Ctx: null,
            pieData:[
                {value: 100,name: '幽州'},
                {value: 100,name: '荆州'},
                {value: 100, name: '荆州'},
                {value: 100, name: '兖州'},
                {value: 100, name: '益州'},
                // {value: 100, name: '西凉'}
            ],
            pieConfig:{
                center: ["50%", "50%"],
                radius: "60%",
                color: ['#c23531','#2f4554', '#61a0a8', '#d48265', '#91c7ae','#749f83',  '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3'],
                font:{
                    space:10,
                }
            }
        }
    },
    mounted(){
        this.canvasInit();
    },
    methods:{
        canvasInit(){
            this.canvasLine = this.$refs.canvasLine;
            this.canvasLine.width = 1200;
            this.canvasLine.height = 820;
            this.ctxLine = this.canvasLine.getContext("2d");
            // this.drawLine(0, 200, 1000)
            // this.drawDemo();
            this.drawTangram()

            this.canvasCircle = this.$refs.canvasCircle;
            this.canvasCircle.width = 1200;
            this.canvasCircle.height = 300;
            this.ctxCircle = this.canvasCircle.getContext("2d");
            this.drawCircle();
            this.drawRect();
            this.drawText();
            
            this.canvasBall = this.$refs.canvasBall;
            this.canvasBall.width = 1200;
            this.canvasBall.height = 400;
            this.ctxBall = this.canvasBall.getContext("2d");
            this.drawRunBall(this.runBallConfig.startX, this.runBallConfig.startY);
            setInterval(()=>{
                this.updateBall();
            },50)

            this.canvasChart1 = this.$refs.canvasChart1;
            this.canvasChart1.width = 600;
            this.canvasChart1.height = 400;
            this.canvasChart1Ctx = this.canvasChart1.getContext("2d");
            this.drawChartLine();

            this.canvasChart2 = this.$refs.canvasChart2;
            this.canvasChart2.width = 600;
            this.canvasChart2.height = 400;
            this.canvasChart2Ctx = this.canvasChart2.getContext("2d");
            this.drawChartPie();

        },
        // 绘制折线图
        drawChartLine(){
            let maxObj = this.getMax(this.lineData.yAxis)
            let top = this.canvasChart1.height / 100 * this.lineData.top.split("%")[0];
            let bottom = this.canvasChart1.height / 100 * this.lineData.bottom.split("%")[0];
            let left = this.canvasChart1.width / 100 * this.lineData.left.split("%")[0];
            let right = this.canvasChart1.width / 100 * this.lineData.right.split("%")[0];
            let lineHeight = this.canvasChart1.height - top - bottom;
            let lineWidth = this.canvasChart1.width - left - right;
            let averageWidth = (lineWidth - this.lineConfig.xBlank) / this.lineData.xAxis.length
            // 绘制坐标轴
            this.canvasChart1Ctx.beginPath();
            this.canvasChart1Ctx.moveTo(left, top);
            this.canvasChart1Ctx.lineTo(left, this.canvasChart1.height - bottom);
            this.canvasChart1Ctx.lineTo(this.canvasChart1.width - right, this.canvasChart1.height - bottom);
            this.canvasChart1Ctx.stroke();
            this.canvasChart1Ctx.closePath();
            
            // 绘制标题
            this.canvasChart1Ctx.beginPath();
            this.canvasChart1Ctx.fillStyle = this.lineConfig.title.color; //设置填充颜色为紫色
            this.canvasChart1Ctx.font = '10px "微软雅黑"'; //设置字体
            this.canvasChart1Ctx.textBaseline = 'bottom'; //设置字体底线对齐绘制基线
            this.canvasChart1Ctx.textAlign = 'center'; //设置字体对齐的方式
            this.canvasChart1Ctx.fillText("折线图",
                                          left + (lineWidth / 2) - (this.lineConfig.title.width) / 2,
                                          top - (this.lineConfig.title.height) / 2); //填充文字

            // 绘制箭头
            this.canvasChart1Ctx.beginPath();
            this.canvasChart1Ctx.moveTo(left, top);
            this.canvasChart1Ctx.lineTo(left - 5, top + 5);
            this.canvasChart1Ctx.stroke();
            this.canvasChart1Ctx.beginPath();
            this.canvasChart1Ctx.moveTo(left, top);
            this.canvasChart1Ctx.lineTo(left + 5, top + 5);
            this.canvasChart1Ctx.stroke();

            // 绘制箭头
            this.canvasChart1Ctx.beginPath();
            this.canvasChart1Ctx.moveTo(this.canvasChart1.width - right, this.canvasChart1.height - bottom);
            this.canvasChart1Ctx.lineTo(this.canvasChart1.width - right - 5, this.canvasChart1.height - bottom - 5);
            this.canvasChart1Ctx.stroke();
            this.canvasChart1Ctx.beginPath();
            this.canvasChart1Ctx.moveTo(this.canvasChart1.width - right, this.canvasChart1.height - bottom);
            this.canvasChart1Ctx.lineTo(this.canvasChart1.width - right - 5, this.canvasChart1.height - bottom + 5);
            this.canvasChart1Ctx.stroke();
            // 绘制y折线
            this.lineData.yAxis.forEach((num, index)=>{
                let x = this.getScaleX(left, averageWidth, index)
                let y = this.getScaleY(top, lineWidth, maxObj.max, num)
                // console.log(x,y,'y')
                if(index === 0){
                    this.canvasChart1Ctx.beginPath();
                    this.canvasChart1Ctx.lineWidth = this.lineConfig.lineStyle.width;
                    this.canvasChart1Ctx.strokeStyle = this.lineConfig.lineStyle.color;
                    this.canvasChart1Ctx.moveTo(x, y);
                }else{
                    this.canvasChart1Ctx.lineTo(x, y);
                    this.canvasChart1Ctx.stroke();
                }
                this.canvasChart1Ctx.beginPath();
                this.canvasChart1Ctx.fillStyle = "red";
                this.canvasChart1Ctx.arc(x, y, this.lineConfig.pointRadius, 0, 2*Math.PI);
                this.canvasChart1Ctx.stroke();
                this.canvasChart1Ctx.fill();
            })
            // y刻度
            for(let i=0; i<5; i++){
                let x = left
                let averageHeight = (lineHeight - this.lineConfig.yBlank) / 5
                let y = top + lineHeight - (i + 1) * averageHeight
                this.canvasChart1Ctx.beginPath();
                this.canvasChart1Ctx.moveTo(x, y);
                this.canvasChart1Ctx.lineTo(x - this.lineConfig.xyLineStyle.height, y);
                this.canvasChart1Ctx.lineWidth = this.lineConfig.xyLineStyle.width;
                this.canvasChart1Ctx.strokeStyle = this.lineConfig.xyLineStyle.color;
                this.canvasChart1Ctx.stroke();

                this.canvasChart1Ctx.fillStyle = this.lineConfig.font.color; //设置填充颜色为紫色
                this.canvasChart1Ctx.font = '10px "微软雅黑"'; //设置字体
                this.canvasChart1Ctx.textBaseline = 'bottom'; //设置字体底线对齐绘制基线
                this.canvasChart1Ctx.textAlign = 'left'; //设置字体对齐的方式
                this.canvasChart1Ctx.fillText((maxObj.max / 5) * (i + 1), x - 30 , y + (this.lineConfig.font.height) / 2); //填充文字
            }
            // x轴刻度
            this.lineData.xAxis.forEach((data, index)=>{
                let x = left + (index + 1) * averageWidth;
                let y = top + lineHeight
                this.canvasChart1Ctx.beginPath();
                this.canvasChart1Ctx.lineWidth = this.lineConfig.xyLineStyle.width;
                this.canvasChart1Ctx.strokeStyle = this.lineConfig.xyLineStyle.color;
                this.canvasChart1Ctx.moveTo(x, y);
                this.canvasChart1Ctx.lineTo(x, y - this.lineConfig.xyLineStyle.height);
                this.canvasChart1Ctx.stroke();

                this.canvasChart1Ctx.fillStyle = this.lineConfig.font.color; //设置填充颜色为紫色
                this.canvasChart1Ctx.font = '10px "微软雅黑"'; //设置字体
                this.canvasChart1Ctx.textBaseline = 'bottom'; //设置字体底线对齐绘制基线
                this.canvasChart1Ctx.textAlign = 'left'; //设置字体对齐的方式
                this.canvasChart1Ctx.fillText(data, x - this.lineConfig.font.width , y + this.lineConfig.font.height); //填充文字
            })
        },
        /* getScaleX  getScaleY 获取坐标比例尺*/
        // params: left 左距离 averageWidth: 每条数据的宽度 index 数据的顺序 
        getScaleX(left, averageWidth, index){
            return parseInt(left + averageWidth * (index + 1))
        },
        // params: top:上距离 lineHeight 线长度 max线长度对应的最大值 cur 当前转换比例尺的值
        getScaleY(top, lineHeight, max, cur){
            let curHeight = (lineHeight - this.lineConfig.yBlank) / max * cur
            let curY = top + lineHeight - curHeight
            return parseInt(curY)
        },
        getMax(dataArr){
            let max = dataArr[0];
            let maxIndex = 0;
            for(let i=0; i<dataArr.length; i++){
                if(dataArr[i]>max){
                    max = dataArr[i];
                    maxIndex = i;
                }
            }
            return {max,maxIndex}
        },
        // 绘制饼状图
        drawChartPie(){
            let centerX = this.canvasChart2.width / 100 * this.pieConfig.center[0].split("%")[0];
            let centerY = this.canvasChart2.height / 100 * this.pieConfig.center[1].split("%")[0];
            let radius = this.canvasChart2.width > this.canvasChart2.height
                            ? this.canvasChart2.height / 2 / 100 * this.pieConfig.radius.split("%")[0]
                            : this.canvasChart2.width / 2 / 100 * this.pieConfig.radius.split("%")[0]
            let total = 0;
            this.pieData.forEach(data=>{
                total += data.value
            })
            
            let startAngle = 0
           
            for(let i = 0; i < this.pieData.length; i++){
            // this.pieData.forEach((data,i)=>{
                let data = this.pieData[i]
                // if(i>0) return
                // 绘制扇形区域
                console.log(startAngle)
                this.canvasChart2Ctx.beginPath();  
                this.canvasChart2Ctx.lineWidth = 0;             
                this.canvasChart2Ctx.moveTo(centerX,centerY) 
                this.canvasChart2Ctx.arc(centerX, centerY, radius, startAngle * 2 * Math.PI , (data.value / total * 2 * Math.PI) )
                
                this.canvasChart2Ctx.strokeStyle = this.pieConfig.color[i];
                this.canvasChart2Ctx.stroke();
                this.canvasChart2Ctx.closePath();
                this.canvasChart2Ctx.fillStyle = this.pieConfig.color[i];
                this.canvasChart2Ctx.fill()
                console.log(data)
                // // 绘制文字标示
                // let fontX = centerX + Math.sin(startAngle + (data.value / total * 2 * Math.PI) / 2) * (radius + this.pieConfig.font.space)
                // let fontY = centerX + Math.cos(startAngle + (data.value / total * 2 * Math.PI) / 2) * (radius + this.pieConfig.font.space)
                // this.canvasChart2Ctx.fillStyle = this.pieConfig.color[i]; //设置填充颜色为紫色
                // this.canvasChart2Ctx.font = '10px "微软雅黑"'; //设置字体
                // this.canvasChart2Ctx.textBaseline = 'center'; //设置字体底线对齐绘制基线
                // this.canvasChart2Ctx.textAlign = 'left'; //设置字体对齐的方式
                // this.canvasChart2Ctx.fillText(data.name, fontX, fontY); //填充文字

                startAngle += (data.value / total ) 
            }
            console.log(startAngle,'last')
        },
        
        // 运动的小球 --------------------
        updateBall(){
            this.runBallConfig.startX += this.runBallConfig.vx
            this.runBallConfig.startY += this.runBallConfig.vy
            this.runBallConfig.vy += this.runBallConfig.g
            this.drawRunBall(this.runBallConfig.startX, this.runBallConfig.startY);
            // 临界判断
            if(this.runBallConfig.startY >= 400 - this.runBallConfig.ballRadius){
                this.runBallConfig.startY = 400 - this.runBallConfig.ballRadius;
                this.runBallConfig.vy = - (this.runBallConfig.vy) * 0.5;   // 摩擦阻力系数0.5
            }
        },
        drawRunBall(x, y){
            this.ctxBall.clearRect(0, 0, 1200, 400);
            this.ctxBall.beginPath();
            this.ctxBall.lineWidth = 3;
            this.ctxBall.strokeStyle = "red";
            this.ctxBall.arc(x, y, this.runBallConfig.ballRadius, 0, 2*Math.PI);
            this.ctxBall.stroke();
            this.ctxBall.fillStyle = "red";
            this.ctxBall.fill()
        },
        // 绘制形状 -------------
        drawCircle(){
            this.ctxCircle.beginPath();
            this.ctxCircle.lineWidth = 3;
            this.ctxCircle.strokeStyle = "red";
            this.ctxCircle.arc(50, 50, 20, 0, 1.5*Math.PI);
            this.ctxCircle.stroke();

            this.ctxCircle.beginPath();
            this.ctxCircle.arc(90, 50, 20, 0, 1.5*Math.PI, true);
            this.ctxCircle.strokeStyle = "black";
            this.ctxCircle.stroke();

            for(let i = 0; i<10; i++){
                this.ctxCircle.beginPath();
                this.ctxCircle.arc(130 + i * 50 , 50, 20, 0, 2*Math.PI * (i + 1) / 10);
                this.ctxCircle.stroke();
            }

            for(let i = 0; i<10; i++){
                this.ctxCircle.beginPath();
                this.ctxCircle.arc(130 + i * 50 , 100, 20, 0, 2*Math.PI * (i + 1) / 10);
                this.ctxCircle.closePath();
                this.ctxCircle.stroke();
            }
        },
        drawRect(){
            this.ctxCircle.beginPath();
            this.ctxCircle.lineWidth = 5;
            this.ctxCircle.strokeStyle = "orange";
            this.ctxCircle.rect(160, 150, 100, 100);
            this.ctxCircle.closePath();
            this.ctxCircle.stroke();
            this.ctxCircle.fillStyle = "blue";
            this.ctxCircle.fill()
        },
        // 绘制文本 ----------
        drawText(){
            this.ctxCircle.moveTo(300, 300);
            this.ctxCircle.fillStyle = 'purple'; //设置填充颜色为紫色
            this.ctxCircle.font = '40px "微软雅黑"'; //设置字体
            this.ctxCircle.textBaseline = 'bottom'; //设置字体底线对齐绘制基线
            this.ctxCircle.textAlign = 'left'; //设置字体对齐的方式
            this.ctxCircle.strokeText( "hello", 360, 250 );
            this.ctxCircle.fillText('hello world', 660, 250); //填充文字
            let text1 = this.ctxCircle.measureText('hello')
            // console.log(text1)
            let text2 = this.ctxCircle.measureText('hello world')
            // console.log(text2)
        },
        // 绘制七巧板 -------------
        drawTangram(){
            for(let i=0; i<this.tangram.length; i++){
                let piece = this.tangram[i];
                this.ctxLine.beginPath();
                this.ctxLine.moveTo(piece.p[0].x, piece.p[0].y);
                for(let i=1; i<piece.p.length; i++){
                    this.ctxLine.lineTo(piece.p[i].x, piece.p[i].y);
                }
                this.ctxLine.closePath();
                this.ctxLine.fillStyle = piece.color;
                this.ctxLine.stroke();
                this.ctxLine.fill()
            }
        },
        // 绘制线条
        drawDemo(){
            this.ctxLine.beginPath();
            this.ctxLine.moveTo(100, 100);
            this.ctxLine.lineTo(100, 700);
            this.ctxLine.closePath();
            this.ctxLine.lineWidth = 3;
            this.ctxLine.strokeStyle = "red";
            // 开始绘制  stroke 笔画 绘制线条
            this.ctxLine.stroke(); 
            
            this.ctxLine.beginPath();
            this.ctxLine.moveTo(200, 200);
            this.ctxLine.lineTo(700, 700);
            this.ctxLine.lineTo(200, 700);
            this.ctxLine.lineTo(200, 200);
            this.ctxLine.closePath();
            this.ctxLine.lineWidth = 5;
            this.ctxLine.strokeStyle = "rgb(0,0,0)";
            // 开始绘制  stroke 笔画 绘制线条
            this.ctxLine.stroke();
            this.ctxLine.fillStyle = "red";
            this.ctxLine.fill()
        },
        drawLine(x, y, width){
            this.ctxLine.beginPath();
            this.ctxLine.moveTo(x, y);
            this.ctxLine.lineTo(x+width, y)

            this.ctxLine.lineWidth = 5;
            this.ctxLine.strokeStyle = "#c1d9ee";

            this.ctxLine.stroke();
            this.ctxLine.closePath();
            return {
                type: 'line',
                x:x,
                y:y,
                width:width
            };
        },
    }
}
</script>
<style lang="less" scoped>
.canvasBox{
    width: 100%;
    height: 100%;
    .myCanvas{
        border: 1px solid #ccc;
    }
}
</style>