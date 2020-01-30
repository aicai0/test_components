<template>
    <div class="qn-edit-table">
        <el-row>
            <el-col :span="24" class="edit-table-box">
                <el-table size="mini" :data="tableData.tBody" border style="width: 100%" highlight-current-row>
                    <template v-for="(colum,i) in tableData.tHead">
                        <el-table-column  :prop="colum.id" :label="colum.name" :width="colum.width" :key="i" v-if="colum.show" :column-key='colum.id'>
                            <template slot-scope="scope" >
                                <span v-if="scope.row.isSet">
                                    <template v-if="colum.type == 'input'">
                                        <el-input v-model="tableData.sel[colum.id]"></el-input>
                                    </template>
                                    <template v-if="colum.type == 'select'">
                                        <el-select v-model="tableData.sel['select_' + colum.id]" @change='selectChange($event,colum,scope.$index)'>
                                            <el-option
                                                v-for="item in colum.options"
                                                :key="item.value"
                                                :label="item.label"
                                                :value="item.value">
                                            </el-option>
                                        </el-select>
                                    </template>
                                </span>
                                <span v-else>
                                    <span>{{scope.row[colum.id]}}</span>
                                </span>
                            </template>
                        </el-table-column>
                    </template>
                    <el-table-column label="操作" width="100">
                        <template slot-scope="scope">
                            <span class="el-tag el-tag--info el-tag--mini" style="cursor: pointer;" @click="pwdChange(scope.row,scope.$index,false)">
                                {{scope.row.isSet?'保存':"修改"}}
                            </span>
                            <span v-if="!scope.row.isSet&&tableData.tBody.length>1" class="el-tag el-tag--danger el-tag--mini" style="cursor: pointer;" @click="del(scope.row,scope.$index,true)">
                                删除
                            </span>
                            <span v-else-if="tableData.tBody.length>1" class="el-tag  el-tag--mini" style="cursor: pointer;" @click="pwdChange(scope.row,scope.$index,true)">
                                取消
                            </span>
                        </template>
                    </el-table-column>
                </el-table>
            </el-col>
            <el-col :span="24" class="edit-table-add" v-if="tableData.addShow">
                <div class="el-table-add-row" @click="addRow()"><span>+ 新增行</span></div>
            </el-col>
        </el-row>
    </div>
</template>
<script>
export default {
    name:'qnEditTable',
    props:{
        tableData:{
            type:Object,
            default(){
                return {}
            }
        },
        type:{
            type:String,
            default:'new',
        },
        addMore:{    //是否能无限新增
            type:Boolean,
            default:false,
        },
    },
    data(){
        return{}
    },
    methods: {
        select_sensortype(data){
            if(data.id == "sensorCode"){
                this.sensorType = data.sourceInfo.type;
            }
        },
        //添加行
        addRow() {
            for (let i of this.tableData.tBody) {
                if (i.isSet) return this.$message.warning("请先保存当前编辑项");
            }
            let j = JSON.parse(JSON.stringify(this.tableData.row));
            this.tableData.tBody.push(j);
            this.tableData.sel = JSON.parse(JSON.stringify(j));
        },
        //修改
        pwdChange(row, index, cancelFlag ) {
            for (let i = 0; i < this.tableData.tBody.length; i++) {
                let item = this.tableData.tBody[i];
                if (item.isSet && index !== i) return  this.$message.warning("请先保存当前编辑项");
            }
            // 取消标识
            if(cancelFlag){
                this.tableData.tBody[index].isSet = !row.isSet;
                return;
            }
            if(!row.isSet){ //修改
                console.log('修改')
                this.tableData.sel = JSON.parse(JSON.stringify(row));
                this.tableData.tBody[index].isSet = true;
            }else{ //保存
                this.tableData.tBody.splice(index,1,this.tableData.sel);
                this.tableData.tBody[index].isSet = false;
            }
        },
        //删除//
        del(row,index){
            this.tableData.tBody.splice(index,1);
        },
        selectChange(value,colum,index){
            let option_length = colum.options.length;
            for (let i = 0; i < option_length; i++) {
                if (value === colum.options[i].value) {
                    console.log(i,colum.options[i]);
                    this.tableData.sel[colum.id] = colum.options[i].label;
                    this.tableData.sel['select_' + colum.id] = value;
                    break;
                }
            }
        }
    },
    watch:{
        tableData:{
            handler(){},
            deep:true,
        },
        'tableData.tHead':{
            handler(){},
            deep:true,
        },
        'tableData.tBody':{
            handler(){},
            deep:true,
        },
    }
}
</script>
<style lang="less">
.qn-edit-table{
    width: 100%;
    .edit-table-box{
        .el-table--group::after, .el-table--border::after, .el-table::before{
            background: none;
        }
        .el-table{
            width: 100%;
            background: none;
            color:#000;
            border:none;
            th{
                color:#000;
            }
            tr{
                background: none;
            }
            td{
                border:none;
                background: none;
            }
            .el-table--enable-row-hover .el-table__body tr:hover > td{
                background: none;
            }
            th.is-leaf, .el-table td {
               border:none
            }
            .el-table--enable-row-hover .el-table__body tr:hover > td{
                background: none;
            }
            .el-table-body{
                th{
                    background: none;
                    background:rgba(11,44,100,1);
                }
                tr{
                    background: none;
                    td{
                        border:none;
                        background: none;
                    }
                    .current-row{
                        td{
                            background: none;
                        }
                    }
                }
                tr:hover{
                    background: none;
                    td{
                        background: none;
                    }
                }
                
            }
        }
        .el-table--enable-row-hover .el-table__body tr:hover > td {
            background: none;
        }

    }
    .edit-table-add{
        color: #000;
        text-align: center;
        height: 20px;
        cursor: pointer;
        margin-top: 10px;
    }
}
</style>


