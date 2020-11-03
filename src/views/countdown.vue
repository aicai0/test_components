<template>
<div class="canvas-count">
    <div class="top-handler" @mouseover="navShow=true"></div>
    <div class="todo-box" :class="navShow?'todo-show':''" @mouseleave="navShow=false">
        <todoList></todoList>
    </div>
    <div class="canvas-box">
        <canvas class="myCanvas"  ref="canvasClock">
            您的浏览器不支持 HTML5 canvas 标签。
       </canvas>
    </div>
</div>
</template>
<script>
import { digitData } from "../assets/js/canvasJs/digit.js"
import todoList from "./totoList.vue"
export default {
    name:'countdown',
    components:{
        todoList
    },
    data(){
        return {
           targetTime: ((new Date()).valueOf()) + (1000*60*60*24*30),
           canvasClock: null,
           config:{
               pointRadius: 5,
               pointSpace: 3,
               numberSpace: 20,
               startX: 50,
               startY: 50,
           },
           canvasWidth: 1600,
           canvasHeight: 600,
           colorBallArr:[],
           colorData: ["#33B5E5","#0099CC","#AA66CC","#9933CC","#99CC00","#669900","#FFBB33","#FF8800","#FF4444","#CC0000"],
           spaceTime: 0,
           days: "",
           hours: "",
           minutes: "",
           seconds: "",
           navShow: false,
        }
    },
    mounted(){
        this.canvasInit(digitData);
    },
    computed: {
        todoList(){
            return JSON.parse(sessionStorage.getItem('todoList')) || []
        }
    },
    methods:{
        dataInit(){
            if(this.todoList.length){
                
            }
        },
        canvasInit(){ 
            this.canvasClock = this.$refs.canvasClock;
            this.canvasClock.width = this.canvasWidth;
            this.canvasClock.height = this.canvasHeight;
            this.canvasClock = this.canvasClock.getContext("2d");
            let timeObj = {
                    spaceTime: 0,
                    days: '00',
                    hours: '00',
                    minutes: '00',
                    seconds: '00'
            }
            this.drawClock(timeObj)
            // setInterval(()=>{
            //     this.updateClock();
            // },50)
        },
        updateClock(){
            let nextTimes = new Date().valueOf();
            let timesObj = this.getSpaceTime(nextTimes);
            let nextSpaceTime = timesObj.spaceTime
            let nextDays = timesObj.days 
            let nextHours = timesObj.hours
            let nextMinutes = timesObj.minutes 
            let nextSeconds = timesObj.seconds
            
            if(nextSpaceTime != this.spaceTime){
                let changeDays = this.compareNumbers(this.days, nextDays)
                if(changeDays.hasChange){
                    this.getBalls(nextDays, changeDays.changeIndex, "day", changeDays.changeIndex=="")
                }
                let changeHours = this.compareNumbers(this.hours, nextHours)
                if(changeHours.hasChange){
                    this.getBalls(nextHours, changeHours.changeIndex, 'hour')
                }
                let changeMinutes = this.compareNumbers(this.minutes, nextMinutes)
                if(changeMinutes.hasChange){
                    this.getBalls(nextMinutes, changeMinutes.changeIndex, 'minute')
                   
                }
                let changeSeconds = this.compareNumbers(this.seconds, nextSeconds)
                if(changeSeconds.hasChange){
                    this.getBalls(nextSeconds, changeSeconds.changeIndex, 'second') 
                }
                this.updateBalls();
                // console.log(changeDays,'changeDays', changeHours, "changeHours", changeMinutes, "changeMinutes", changeSeconds, 'changeSeconds')
                this.drawClock(timesObj)
                
            }
        },
        // nums变化的数字 变化数字变化的位置 变化数字的类型 day hour minute second
        // 注:只有day存在 有变化而无位置的情况  例如 100 变为99 整体发生变化  lengthFlag 变化
        getBalls(nums, changeIndex, type, lengthFlag){
            if(changeIndex){
                let changeArr = changeIndex.split("");
                let numsArr = (nums + "").split("")
                for(let i=0; i<changeArr.length; i++ ){
                    let index = changeArr[i];
                    let num = Number(numsArr[index]);
                    
                    let numX = this.getDrawX(type, index);
                    digitData[num].forEach((numRow, index)=>{
                        let pointY = this.config.startY + index * (2 * this.config.pointRadius + this.config.pointSpace);
                        numRow.forEach((point, index)=>{
                            let pointX = numX + index * (2 * this.config.pointRadius + this.config.pointSpace)
                            if(point == 1){ // 等于1才画点
                                let ball = {
                                    startX: pointX,
                                    startY: pointY,
                                    g: 1 + Math.random(),
                                    vx: Math.pow(-1, Math.ceil( Math.random()*1000)) * 4, // + - 4
                                    vy: -5,
                                    color: this.colorData[Math.floor(Math.random() * this.colorData.length)]
                                }
                                this.colorBallArr.push(ball);
                            }
                        })
                    })
                }
            }else{

            }
            // console.log(nums, changeIndex)
        },
        updateBalls(){
            for(let i=0; i<this.colorBallArr.length; i++){
                let ball = this.colorBallArr[i];
                this.colorBallArr[i].startX += ball.vx
                this.colorBallArr[i].startY += ball.vy
                this.colorBallArr[i].vy += ball.g
                this.drawRunBall(ball.startX, ball.startY, ball.color);
                // 临界判断
                if(this.colorBallArr[i].startY >= this.canvasHeight - this.config.pointRadius){
                    this.colorBallArr[i].startY = this.canvasHeight - this.config.pointRadius;
                    this.colorBallArr[i].vy = - (this.colorBallArr[i].vy) * 0.5;   // 摩擦阻力系数0.5
                }
            }
            // 优化 去除不在画面内的小球
            let cnt = 0
            for(let i=0; i<this.colorBallArr.length; i++){
                let ball = this.colorBallArr[i];
                if(ball.startX - this.config.pointRadius > 0 && ball.startX - this.config.pointRadius < this.canvasWidth){
                    this.colorBallArr[cnt++] = this.colorBallArr[i]
                }
            }
            while(this.colorBallArr.length >  Math.min(500,cnt)){
                this.colorBallArr.pop();
            }
        },
        // 比较时钟变化 currentNum 当前显示数字 nextNum 变化后显示数字 小时 分钟 秒 都是两位数 天数不确定两位或者三位
        compareNumbers(currentNum, nextNum){
            currentNum += ""
            nextNum += ""
            let hasChange = false;
            let changeIndex = ""
            if(currentNum.length != nextNum.length){
                hasChange = true 
            }else {
                let length = currentNum.length;
                let curArr = currentNum.split("");
                let nextArr = nextNum.split("");
                curArr.forEach((num, i)=>{
                    if(nextArr[i] != curArr[i]){
                        changeIndex += i
                    }
                })
                if(changeIndex != ""){
                    hasChange = true;
                }
            }
            return {
                hasChange: hasChange,
                changeIndex: changeIndex,
            }
        },
        // 获取时间间隔 计算 天数 时分秒
        getSpaceTime(targetTime){
            let spaceTime = targetTime - new Date().valueOf();
            let days = parseInt(spaceTime / (1000*60*60*24))
            let surplusHours = spaceTime % (1000*60*60*24)  // 天数余数算小时
            let hours = parseInt(surplusHours / (1000*60*60))
            let surplusMinutes = surplusHours % (1000*60*60) // 小时余数算分钟
            let minutes = parseInt(surplusMinutes / (1000 * 60))
            let surplusSeconds = surplusMinutes % (1000*60)  // 分钟余数算秒数
            let seconds = parseInt(surplusSeconds / (1000))
            // return {days: 1, hours: 23, minutes: 18, seconds: 33}
            return {
                    spaceTime: spaceTime,
                    days: days > 9 ? days : '0' + days,
                    hours: hours > 9 ? hours : '0' + hours,
                    minutes: minutes > 9 ? minutes : '0' + minutes,
                    seconds: seconds > 9 ? seconds : '0' + seconds
                   }
        },  
        // 清除画布
        clearCanvas(){
            this.canvasClock.clearRect(0, 0, this.canvasWidth, this.canvasHeight)
        },
        // 获取绘制数字的起始位置 type:day hour minute second, index:该类型第几个数字 没有则返回0个 即绘制数字起始位置
        getDrawX(type,index = 0){ 
            let letterWidth = 7 * this.config.pointRadius * 2 + 6 * this.config.pointSpace
            let colonWidth = 4 * this.config.pointRadius * 2 + 3 * this.config.pointSpace
            let daysArr = (this.days + "").split("")
            let hoursArr = (this.hours + "").split("")
            let minutesArr = (this.minutes + "").split("")
            if(type == "day"){
                return this.config.startX + Number(index) * (letterWidth  + this.config.numberSpace)
            }else if(type == "hour"){
                return this.config.startX + (daysArr.length + Number(index)) * (letterWidth + this.config.numberSpace) + colonWidth;
            }else if(type == "minute"){
                return this.config.startX + (daysArr.length + hoursArr.length + Number(index)) * (letterWidth + this.config.numberSpace) + colonWidth * 2;
            }else if(type == "second"){
                return this.config.startX + (daysArr.length + hoursArr.length + minutesArr.length +  Number(index)) * (letterWidth + this.config.numberSpace) + colonWidth * 3;
            }
        },
        // 倒计时绘制核心函数 初始化时不传时间对象,默认获取设置时间为30天后
        drawClock(timesObj){
            this.clearCanvas();
            let currentTime = timesObj? timesObj : this.getSpaceTime();
            this.spaceTime = currentTime.spaceTime;
            this.days = currentTime.days;
            this.hours = currentTime.hours;
            this.minutes = currentTime.minutes; 
            this.seconds = currentTime.seconds;

            let letterWidth = 7 * this.config.pointRadius * 2 + 6 * this.config.pointSpace
            let letterHeight = 10 * this.config.pointRadius * 2 + 9 * this.config.pointSpace
            let colonWidth = 4 * this.config.pointRadius * 2 + 3 * this.config.pointSpace

            let daysArr = (this.days + "").split("")
            let dayX = this.config.startX;
            this.drawNumber(daysArr, this.config.startX)
            let dayColonX = dayX + daysArr.length * (letterWidth + this.config.numberSpace);
            this.drawColon(dayColonX)
            
            let hoursArr = (this.hours + "").split("")
            let hourX = dayColonX + colonWidth + this.config.numberSpace
            this.drawNumber(hoursArr, hourX)
            let hourColonX = hourX + hoursArr.length * (letterWidth + this.config.numberSpace);
            this.drawColon(hourColonX)
            
            let minutesArr = (this.minutes + "").split("")
            let minutesX = hourColonX + colonWidth + this.config.numberSpace
            this.drawNumber(minutesArr, minutesX)
            let minuteColonX = minutesX + minutesArr.length * (letterWidth + this.config.numberSpace)
            this.drawColon(minuteColonX)
            
            let secondsArr = (this.seconds + "").split("")
            let secondX = minuteColonX + colonWidth + this.config.numberSpace
            this.drawNumber(secondsArr, secondX)
            // let secondColonX = secondX + secondsArr.length * (letterWidth + this.config.numberSpace)
            // this.drawColon(secondColonX)
            for(let i=0; i<this.colorBallArr.length; i++){
                let ball = this.colorBallArr[i]
                this.drawRunBall(ball.startX, ball.startY, ball.color);
            }

        },
        drawRunBall(x, y, color){
            // console.log(color)
            this.canvasClock.beginPath();
            this.canvasClock.lineWidth = 3;
            this.canvasClock.strokeStyle = color;
            this.canvasClock.arc(x, y, this.config.pointRadius, 0, 2*Math.PI);
            this.canvasClock.stroke();
            this.canvasClock.fillStyle = color;
            this.canvasClock.fill()
        },
        // 冒号
        drawColon(aheadWidth){
            let colonX = aheadWidth;
            digitData[10].forEach((numRow, index)=>{
                let colonY = this.config.startY + index * (2 * this.config.pointRadius + this.config.pointSpace);
                this.drawRow(numRow, colonX, colonY)
            })
        },
        //  数字 [2,3]
        drawNumber(numArr, aheadWidth){
            let letterWidth = 7 * this.config.pointRadius * 2 + 6 * this.config.pointSpace
            numArr.forEach((num, index)=>{
                let numX = aheadWidth + index * (letterWidth + this.config.numberSpace);
                digitData[num].forEach((numRow, index)=>{
                    let numY = this.config.startY + index * (2 * this.config.pointRadius + this.config.pointSpace);
                    this.drawRow(numRow, numX, numY)
                })
            })
        },
        // 数字分行绘制 [0, 0, 1, 0, 0, 0, 0]
        drawRow(arr, x, y){
            arr.forEach((point, index)=>{
                let pointX = x + index * (2 * this.config.pointRadius + this.config.pointSpace)
                if(point == 1){ // 等于1才画点
                    this.drawPoint("red",  pointX, y)
                }
            })
        },
        // 绘制圆点
        drawPoint(color, x, y){
            this.canvasClock.beginPath();
            this.canvasClock.arc(x, y, this.config.pointRadius, 0, 2*Math.PI)
            this.canvasClock.strokeStyle = color;
            this.canvasClock.lineWidth = 0;
            this.canvasClock.closePath();
            this.canvasClock.stroke();
            this.canvasClock.fillStyle = color;
            this.canvasClock.fill()
        },
    }
}
</script>
<style lang="less" scoped>
.canvas-count{
    width: 100%;
    height: 100%;
    background: #000;
    .top-handler{
        position: fixed;
        top: 60px;
        left: 0;
        height: calc(100% - 60px);
        display: flex;
        width: 10px;
        box-sizing: border-box;
        justify-content: center;
        background: transparent;
        cursor: pointer;
    }
    .todo-box{
        position: fixed;
        top: 60px;
        left: -450px;
        width: 450px;
        height: calc(100% - 120px);
        background: #fff;
        border: 1px solid #ccc;
        padding: 20px 10px;
        box-sizing: border-box;
        transition: 1s;
    }
    .todo-show{
        transition: 1s;
        left: 0;
    }
    .canvas-box{
        width: 100%;
        height: calc(100% - 60px);
        .myCanvas{
            margin: 0 auto;
        }
    }
    
}
</style>