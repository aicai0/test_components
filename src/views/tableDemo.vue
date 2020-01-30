<template>
    <div class="table-demo">
        <editTabe :tableData="tableData"></editTabe>
    </div>
</template>
<script>
import editTabe from './editTable.vue'
export default {
    name:'tableDemo',
    components:{
        editTabe,
    },
    data(){
        return {
            tableData:{
                sel: null,//选中行   
                row:{"user": "", "pwd": "", "degree": "", "select_degree": "", "info": "", "isSet": true, "role": "",select_role: "" }, //新增行数据
                tHead: [
                    { id: "user", name: "登录用户",show:true, type:'input',placeholder: "登录用户", },
                    { id: "pwd", name: "登录密码",show:true, type:'input',placeholder: "登录密码", },
                    { id: "degree", name: "学历",show:true, type:'select',placeholder: "学历", options:[{label:'本科',value:'1'},{label:'大专',value:'2'},{label:'高中',value:'3'},] },
                    { id: "select_degree", name: "学历",show:false, type:'select',placeholder: "学历",},
                    { id: "info", name: "其他信息",show:true,type:'input',placeholder: "其他信息", },
                    { id: "role", name: "角色",show:true,type:'select',placeholder: "角色",options:[{label:'职员',value:'1'},{label:'经理',value:'2'}] },
                    { id: "select_role", name: "角色",show:false,type:'select',placeholder: "角色",},
                ],
                tBody: [
                    {user:'登录用户0',pwd:'登录密码0',degree:'本科',select_degree:'1',info:'其他信息0', isSet:false,role:'经理',select_role:'2'},
                    {user:'登录用户1',pwd:'登录密码1',degree:'大专',select_degree:'2',info:'其他信息1',isSet:false,role:'经理',select_role:'2'},
                    {user:'登录用户2',pwd:'登录密码2',degree:'本科',select_degree:'1',info:'其他信息2',isSet:false,role:'经理',select_role:'2'},
                ],
                addShow:true,
            }
        }
    },
    methods:{

    }
}
</script>
<style lang="less" scoped>
.table-demo{

}
</style>