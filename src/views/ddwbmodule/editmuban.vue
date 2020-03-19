<template>
  <div>
    <a-modal
        v-model="visible"
        :title="title"
        @ok="handleOk"
        okText="保存"
        ref="modal"
        cancelText="取消"
        :maskClosable="false"
        style="min-width:700px;"
    >
        <a-form :form="form">
                <a-form-item
                    v-bind="formItemLayout"
                    label="模板名称"
                >
                    <a-input
                        v-decorator="[
                            'templateName',
                            {
                                initialValue:record.templateName,
                                rules: [{
                                required: true, message: '请输入模板名称'
                                }]
                            }
                        ]"
                    />
                </a-form-item>
        </a-form>      
        <a-tabs v-model="nowkey" @change="changekey">
            <a-tab-pane v-for="(v) in alltag" :tab="v.displayName" :key="v.value">
                <div style="height:500px;">
                    <div class="center">
                        <a-row :gutter="16" style="width:90%">
                            <a-col :span="24">
                                <div>
                                    <a-row :gutter="16">
                                        <a-col :span="6">
                                            <span class="title1">选择的检测项：</span>
                                        </a-col>
                                        <a-col :span="18" style="padding-top:15px;">
                                            <a-tag v-for="(v,k) in paruser" color="blue" :key="k" >{{v.item}}</a-tag>
                                        </a-col>
                                    </a-row>
                                </div>
                            </a-col>
                        </a-row>
                    </div>
                    <div class="select">
                        <div class="button">
                            <!-- <a-button class="search-btn btn" type="primary" @click="search2">查询</a-button> -->
                            <!-- <a-button class="review-btn btn" type="primary" @click="quanxuan">全选</a-button> -->
                        </div>
                        <div class="input">
                            <span class="title">项目名称：</span>
                            <a-select 
                                class="inp"
                                v-model="trvalue"
                                showSearch
                                @change="onChange11"
                                optionFilterProp="children"
                                :filterOption="filterOption"
                            >
                                <a-select-option v-for="(v,k) in soiltest3" :key="k" :value="v.id">{{v.item}}</a-select-option>
                            </a-select>
                            <a-radio-group @change="onChange22" v-model="qb">
                                <a-radio-button value="0">未选</a-radio-button>
                                <a-radio-button value="1">已选</a-radio-button>
                                <a-radio-button value="2">全部</a-radio-button>
                            </a-radio-group>
                        </div>
                    </div>
                    <a-table :columns="nccolumns" :dataSource="soiltest2" :pagination="ipagination2" @change="handleTableChange2" :rowKey="record => record.id" size="small" >
                         <span slot="status" slot-scope="text, record">
                           <a-switch v-if="isshow" :defaultChecked="record.status==1" @change="(checked)=>{onChange(checked,record.id)}" /> 
                        </span>
                    </a-table>
                </div>
            </a-tab-pane>
        </a-tabs>
    </a-modal>
  </div>
</template>
<script>
import {envStandards,detectionTemplateAdd,getEnvStandards} from '@/api/ddwbApi'
const nccolumns = [{
    title: '检测项',
    dataIndex: 'item',
    key: 'item',
    align: 'center',
  },{
    title: '单位',
    dataIndex: 'unit.displayName',
    key: 'unit.displayName',
    align: 'center',
  },{
    title: '选中状态',
    dataIndex: 'status',
    scopedSlots: { customRender: 'status' },
    key: 'status',
    align: 'center',
  }
  ]
export default {
    name:'workerModal',
    data() {
        return {
            nccolumns,
            trvalue:'',
           ipagination2: {
                current: 1,
                pageSize: 5,
                pageSizeOptions: ['5', '10'],
                showTotal: (total, range) => {
                    return range[0] + '-' + range[1] + '共' + total + '条';
                },
                showQuickJumper: true,
                showSizeChanger: true,
                total: 0
           },
           formItemLayout: {
                labelCol: {
                    xs: { span: 24},
                    sm: { span: 3 },
                },
                wrapperCol: {
                    xs: { span: 24 },
                    sm: { span: 21 },
                },
            },
            alltest:[],
            soiltest:[],
            soiltest2:[],
            soiltest3:[],
            nowkey:'1',
            visible: false,
            title:"操作",
            paruser:[],
            record:{},
            isshow:true,
            alltag:[],
            qb:'2',
            form:this.$form.createForm(this),
        }
    },
    created(){
        getEnvStandards().then(res=>{
            if(res.success){
                this.alltag=res.result;
                if(this.alltag.length>0){
                    this.nowkey=this.alltag[0].value;
                }
                envStandards().then((res)=>{
                    if(res.success){
                        this.alltest=res.result;
                        this.soiltest=[];
                        this.soiltest3=[{id:-1,item:'全部'}];
                        for(let i=0;i<this.alltest.length;i++){
                            this.alltest[i].status=0;
                            if(this.alltag.length>0&&this.alltest[i].itemName.code==this.alltag[0].code){
                                this.soiltest.push(this.alltest[i])
                                this.soiltest2.push(this.alltest[i])
                                this.soiltest3.push(this.alltest[i])
                            }
                        }
                        this.ipagination2.total=this.soiltest.length;
                    }
                })
            }
        })
    },
    methods: {
        quanxuan(){
            this.paruser=[];
            for(let i=0;i<this.soiltest.length;i++){
                this.soiltest[i].status=1;
                this.paruser.push(this.soiltest[i]);
            }
            this.isshow = false;//销毁组件
            this.$nextTick(() => {
                this.isshow = true;//重建组件
            });
        },
        onChange11(value){
            this.soiltest2=[];
            if(value>-1){
                if(this.qb<2){
                    for(let i=0;i<this.soiltest.length;i++){
                        if(this.soiltest[i].id==value&&this.soiltest[i].status==this.qb){
                            this.soiltest2.push(this.soiltest[i]);
                        }
                    }
                    this.ipagination2.total=this.soiltest2.length;
                }else{
                    for(let i=0;i<this.soiltest.length;i++){
                        if(this.soiltest[i].id==value){
                            this.soiltest2.push(this.soiltest[i]);
                        }
                    }
                    this.ipagination2.total=this.soiltest2.length;
                }
            }else{
                if(this.qb<2){
                    for(let i=0;i<this.soiltest.length;i++){
                        if(this.soiltest[i].status==this.qb){
                            this.soiltest2.push(this.soiltest[i]);
                        }
                    }
                    this.ipagination2.total=this.soiltest2.length;
                }else{
                    for(let i=0;i<this.soiltest.length;i++){
                        this.soiltest2.push(this.soiltest[i]);
                    }
                    this.ipagination2.total=this.soiltest2.length;
                }
            }
        },
        onChange22(e){
            this.qb=e.target.value;
            this.soiltest2=[];
            if(this.qb!='2'){
                if(!this.trvalue){
                    for(let i=0;i<this.soiltest.length;i++){
                        if(this.soiltest[i].status==this.qb){
                            this.soiltest2.push(this.soiltest[i]);
                        }
                    }
                    this.ipagination2.total=this.soiltest2.length;
                }else if(this.trvalue>-1){
                    for(let i=0;i<this.soiltest.length;i++){
                        if(this.soiltest[i].id==this.trvalue&&this.soiltest[i].status==this.qb){
                            this.soiltest2.push(this.soiltest[i]);
                        }
                    }
                    this.ipagination2.total=this.soiltest2.length;
                }else{
                    for(let i=0;i<this.soiltest.length;i++){
                        if(this.soiltest[i].status==this.qb){
                            this.soiltest2.push(this.soiltest[i]);
                        }
                    }
                    this.ipagination2.total=this.soiltest2.length;
                }
            }else{
                this.review2();
            }
        },
        search2(){
            if(this.trvalue){
                this.soiltest2=[];
                for(let i=0;i<this.soiltest.length;i++){
                    if(this.soiltest[i].id==this.trvalue){
                        this.soiltest2.push(this.soiltest[i]);
                        break;
                    }
                }
                this.ipagination2.total=1;
            }
        },
        review2(){
            this.trvalue='';
            this.soiltest2=[];
            for(let i=0;i<this.soiltest.length;i++){
                this.soiltest2.push(this.soiltest[i]);
            }
            this.ipagination2.total=this.soiltest2.length;
        },
        filterOption(input, option) {
            return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
        },
        handleTableChange2(pagination) {
            this.ipagination2 = pagination;
        },
        onChange(checked,id){
            if(checked){
               for(let i =0;i<this.alltest.length;i++){
                   if(this.alltest[i].id==id){
                       this.alltest[i].status=1;
                       this.paruser.push(this.alltest[i]);
                   }
               }
            }else{
                for(let i =0;i<this.alltest.length;i++){
                   if(this.alltest[i].id==id){
                       this.alltest[i].status=0;
                       let a='';
                       for(let i=0;i<this.paruser.length;i++){
                           if(this.paruser[i].id==id){
                               a=i;
                           }
                       }
                       this.paruser.splice(a,1);
                   }
               }
            } 
            this.soiltest2=[];
            if(this.qb!='2'){
                if(!this.trvalue){
                    for(let i=0;i<this.soiltest.length;i++){
                        if(this.soiltest[i].status==this.qb){
                            this.soiltest2.push(this.soiltest[i]);
                        }
                    }
                    this.ipagination2.total=this.soiltest2.length;
                }else{
                    for(let i=0;i<this.soiltest.length;i++){
                        if(this.soiltest[i].id==this.trvalue&&this.soiltest[i].status==this.qb){
                            this.soiltest2.push(this.soiltest[i]);
                        }
                    }
                    this.ipagination2.total=this.soiltest2.length;
                }
            }else{
                this.review2();
            }
        },
        changekey(activeKey){
            this.nowkey=activeKey;
            this.soiltest=[];
            this.soiltest2=[];
            this.soiltest3=[{id:-1,item:'全部'}];
            this.paruser=[];
            this.trvalue='';
            this.qb='2';
            for(let i=0;i<this.alltest.length;i++){
                if(this.alltest[i].itemName.value==activeKey){
                    this.soiltest.push(this.alltest[i])
                    this.soiltest2.push(this.alltest[i])
                    this.soiltest3.push(this.alltest[i])
                    if(this.alltest[i].status==1){
                        this.paruser.push(this.alltest[i])
                    }
                }
            }
            this.ipagination2.total=this.soiltest.length;
        },
        edit(record){
            this.record=record;
            this.nowkey=this.alltag[0].value;
            this.changekey(this.nowkey);
            this.form.resetFields();
            this.parlist=[];
            for(let i=0;i<record.detempRel.length;i++){
                this.parlist.push(record.detempRel[i].envStandardsId);
            }
            this.paruser=[];
            this.qb='2';
            this.visible=true;
            for(let i=0;i<this.alltest.length;i++){
                this.alltest[i].status=0;
            }
            for(let i =0;i<this.alltest.length;i++){
                if(this.parlist.indexOf(this.alltest[i].id)>-1){
                    this.alltest[i].status=1;
                    if(this.alltest[i].itemName.value==this.alltag[0].value){
                        this.paruser.push(this.alltest[i])
                    }    
                }
            }
            this.isshow = false;//销毁组件
            this.$nextTick(() => {
                this.isshow = true;//重建组件
            });
            this.title='编辑';
        },
        handleOk(){
            this.form.validateFields((err, values) => {
                if (!err) {
                    let par = values
                    par.id=this.record.id;
                    par.detempRel=[];
                    for(let i=0;i<this.alltest.length;i++){
                        let p={};
                        if(this.alltest[i].status==1){
                            p.envStandardsId=this.alltest[i].id;
                            par.detempRel.push(p);
                        }
                    }
                    detectionTemplateAdd(par).then(res=>{
                        if(res.success){
                            this.$message.success(res.message);
                            this.$parent.loadData();
                            this.hideModal();
                        }else{
                            this.$message.warning(res.message);
                        }
                    })
                }
            })
        },
        showModal() {
            this.visible = true
        },
        hideModal() {
            this.visible = false
        },
    }
}
</script>
<style scoped>
.inp{
  width:20%;
  margin-right:10px;
}
.select{
  margin-bottom:5px;
}
.button{
  float: right;
}
.btn{
  width:60px;
  height:30px;
}
.search-btn{
  margin-right:5px;
}
.center{
  width:100%;
  height:70px;
  overflow-y: auto;
  background-color: rgba(240,255,255,1);
  margin:10px 0 20px 0;
}
.title1{
  line-height: 50px;
  font-size: 16px;
  font-weight: bold;
}
</style>
