<template>
    <div class="todo-list">
        <div class="todo-head edit">
            <span class="title">待办事项</span>
            <span class="date">时间</span>
            <div class="operate">
                操作
            </div>
        </div>
        <div class="no-data" v-if="!todoList.length">
            暂无待办事项
        </div>
        <template v-for="(todo,index) in todoList">
            <div class="todo-row" :key="index">
                <div class="show" v-if="todo.editFlag">
                    <el-input class="title" v-model="todo.title" placeholder="请输入待办事项"></el-input>
                    <el-date-picker class="date"  v-model="todo.time"  type="datetime"
                        :picker-options="pickerOptions" 
                        placeholder="选择日期时间"></el-date-picker>
                </div>
                <div class="edit" v-else>
                    <span class="title">{{todo.title}}</span>
                    <span class="date">{{todo.timeShow}}</span>
                </div>
                <div class="operate">
                    <span @click="saveRow(index)" v-if="todo.editFlag"><i class="el-icon-check"></i></span>
                    <span @click="editRow(index)" v-else><i class="el-icon-edit"></i></span>
                    <span @click="deleteRow(index)"><i class="el-icon-delete"></i></span>
                </div>
            </div> 
        </template>
        <div class="add-btn" @click="add">
            <span><i class="el-icon-plus"></i></span>
        </div>
    </div>
</template>
<script>
export default {
    name:'todoList',
    data(){
        return{
            todoList: [],
            baseRowl: {
                title: '',
                time: '',
                editFlag: true
            },
            pickerOptions:{
                disabledDate (time){
                    return time.getTime() < Date.now() - 8.64e7;
                }
            },
            id:0
        }
    },
    computed:{},
    created(){
        this.dataInit()
    },
    methods:{
       dataInit(){
           if(sessionStorage.getItem('todoList')){
               this.todoList = JSON.parse(sessionStorage.getItem('todoList'))
           }
       },
       add(){
           let index = this.todoList.length - 1
           if(index >= 0){
                let flag = this.todoList[index].time && this.todoList[index].title
                if(!flag){
                   this.$message({message: '请填写完成上一项',type: 'warning'});
                   return
                }
                if(this.todoList[index].editFlag){
                    this.saveRow(index)
                }
           }
           let base = JSON.parse(JSON.stringify(this.baseRowl)) 
           base.id = this.id++;
           this.todoList.push(base)
       },
       deleteRow(index){
           this.todoList.splice(index,1)
       },
       saveRow(index){
            let flag = this.todoList[index].time && this.todoList[index].title
            if(!flag){
                this.$message({message: '请填写完成待办事项',type: 'warning'});
                return
            }
            if(this.todoList[index].time <= new Date()){
                this.$message({message: '待办时间需大于当前时间',type: 'warning'});
                return
            }
            this.todoList[index].timeShow = this.changeTimeFormat(this.todoList[index].time)
            this.todoList[index].editFlag = false
            this.sortTable();
            sessionStorage.setItem('todoList', JSON.stringify(this.todoList))
       },
       editRow(index){
           this.todoList[index].editFlag = true
       },
       changeTimeFormat(dateTime){
           let year = dateTime.getFullYear();
           let month = dateTime.getMonth() + 1;
           let day = dateTime.getDate();
           let hour = dateTime.getHours();
           let minute = dateTime.getMinutes();
           let second = dateTime.getSeconds();
           return year + "-" +
                  (month>9?month:"0"+month) + "-" + 
                  (day>9?day:'0'+day) + "-" + 
                  (hour>9?hour:'0'+hour) + "-" + 
                  (minute>9?minute:'0'+minute) + "-" + 
                  (second>9?second:'0'+second)
       },
       sortTable(){
           this.todoList.sort((a,b) => {
               return a.time - b.time
           })
       }
    },
    watch:{
        todoList(newVal){
            
        }
    }
}
</script>
<style lang="less" scoped>
.todo-list{
    width: 400px;
    height: 100%;
    line-height: 30px;
    .title,.date{
        display: inline-block;
        display: flex;
        align-items: center;
        text-align: center;
        justify-content: center;
    }
    .operate{
        width: 65px;
        display: flex;
        align-items: center;
        justify-content: center;
        span{
            display: inline-block;
            margin-right: 10px;
            cursor: pointer;
            display: flex;
            justify-content: center;
        }
    }
    .title{
        width: 135px;
        margin: 0 5px;
    }
    .date{
        width: 200px;
        margin: 0 5px;
    }
    .todo-head{
        width: 100%;
        display: flex;
        margin-bottom: 10px;
        border-bottom: 1px solid #EBEEF5; 
    }
    .no-data{
        color: rgba(149, 145, 163, 0.5);
        font-size: 12px;
    }
    .todo-row{
        width: 100%;
        display: flex;
        margin: 0 auto;
        margin-bottom: 10px;
        /deep/ .el-input__inner{
            height: 30px;
        }
        /deep/ .el-input__icon{
            line-height: 30px;
        }
        .edit , .show{
            display: flex;
            justify-content: space-between;
            .el-input{
               margin: 0 5px;
            }
        }
    }
    .add-btn{
        cursor: pointer;
    }
}
</style>