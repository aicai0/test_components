<template>
    <div class="function">
        <h1>function</h1>
        <el-select v-model="selectvalue" placeholder="请选择">
            <el-option
                v-for="item in list"
                :key="item.id"
                :label="item.name"
                :value="item.id">
            </el-option>
        </el-select>
        <span @click="change">转换</span>
        <el-cascader
            :options="options"
            v-model="selectedOptions"
            :props='casprops'>
        </el-cascader>
        <br>
        {{options}}
    </div>
</template>
<script>
export default {
    name:'function',
    data(){
        return{
            defaultTreeProps : {
                key: 'id',
                parentKey: 'parentId',
                label: 'name',
                children: 'children',
                rootValue: 0,
                stopKey: 'type',// 停止位
                stopValue: 'sdfadfytuya',// 停止值
            },
            selectvalue:'',
            list:[
                {name:"唐山联晟消防安全技术服务有限公司",id:1,parentId:0},
                {name:"likai测试12",id:2,parentId:1},
                {name:"ljy测试123",id:3,parentId:1},
                {name:"研发中心",id:11,parentId:1},
                {name:"iOS开发测试",id:12,parentId:1},
                {name:"美团点评",id:14,parentId:1},
                {name:"华北大区",id:15,parentId:14},
                {name:"华东大区",id:17,parentId:14},
                {name:"无线产品部测试",id:33,parentId:1},
                {name:"华南大区",id:35,parentId:14},
                {name:"中南大区",id:36,parentId:14},
                {name:"北京区域",id:37,parentId:15},
                {name:"辽宁区域",id:38,parentId:15},
                {name:"河南区域",id:39,parentId:15},
                {name:"黑吉区域",id:40,parentId:15},
                {name:"中西区域",id:41,parentId:15},
                {name:"北京配送1组",id:42,parentId:17},
                {name:"北京配送2组",id:43,parentId:17},
                {name:"北京配送3组",id:44,parentId:17},
            ],
            selectedOptions:[],
            options:[],
            casprops:{
                value:'id',
                label:'name',
                children:'children',
            }
        }
    },

    methods:{
        change(){
            this.options = this.buildTree(this.list,this.defaultTreeProps);
        },
        // 根据id及parentId创建树形结构
        buildTree(list, treeProps , root) {
            if (!root) {
                root = {};
                root[treeProps.key] = treeProps.rootValue;
                root[treeProps.children] = [];
            }
            if (list && list.length > 0) {
                let children = root[treeProps.children];
                list.forEach(node => {
                    if (node[treeProps.parentKey] === root[treeProps.key]) {
                        if (!children) {
                            children = [];
                            root[treeProps.children] = children;
                        }
                        let copyNode = {};
                        copyNode[treeProps.key] = node[treeProps.key];
                        copyNode[treeProps.parentKey] = node[treeProps.parentKey];
                        copyNode[treeProps.label] = node[treeProps.label];
                        copyNode[treeProps.children] = node[treeProps.children];
                  
                        copyNode[treeProps.stopKey] = node[treeProps.stopKey];
                        children.push(copyNode);
                    }
                });
                if (children && children.length > 0) {
                    list = list.filter(item1 => !children.some(item2 => item2[treeProps.key] === item1[treeProps.key]));
                    children.forEach(node => {
                        if (root[treeProps.stopKey] !== treeProps.stopValue) {
                            // 递归
                            this.buildTree(list, treeProps, node);
                        }
                    });
                }
                return root.children;
            } else {
                return root.children;
            }
        }
    }
}
</script>
<style lang="less" scoped>
.function{

}
</style>