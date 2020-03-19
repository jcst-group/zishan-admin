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
                    <a-select 
                        showSearch
                        optionFilterProp="children"
                        :filterOption="filterOption"
                        @change="handleChange"
                        v-decorator="[
                            'templateName',
                            {
                                initialValue:templateId?templateId:'',
                                rules: [{
                                    required: true, message: '请选择模板'
                                }]
                            }
                        ]" 
                        style="width: 100%" 
                    >
                        <a-select-option v-for="(v,k) in alltemp" :key="k" :value="v.id">{{v.templateName}}</a-select-option>
                    </a-select>
                </a-form-item>
        </a-form>
        <a-tabs v-if="show" v-model="nowkey" @change="changekey">
                <a-tab-pane v-for="(v) in alltag" :tab="v.displayName" :key="v.value">
                    <div style="height:500px;">
                        <a-form :form="form1">
                            <div style="width:40%;float:left;margin-right:5%" v-for="(v1,k) in soiltest" :key="k">
                                <a-form-item
                                    v-if="v1.itemName.value==v.value"
                                    :label="getlabel(v1)"
                                    v-bind="formItemLayout1"
                                >
                                    <a-input-number
                                        v-decorator="[
                                            String(v1.id),
                                            {
                                                initialValue:threetest3[v1.id]||threetest3[v1.id]==0?String(threetest3[v1.id]):null,
                                                rules: [{ required: true, message: '不能为空!'}],
                                            }
                                        ]"
                                        style="width: 100%"
                                        >
                                    </a-input-number>
                                </a-form-item>
                            </div>
                        </a-form>
                    </div>
                </a-tab-pane>
            
        </a-tabs>
    </a-modal>
  </div>
</template>
<script>
import { detectionTemplateAll,envStandards,detectionTemplateAdd,selectByTemplateId,addDetection,getTemplateStandardType } from '@/api/ddwbApi'
export default {
    name:'workerModal',
    data() {
        return {
            isedit:true,
            alltest:[],
            soiltest:[],
            nctest:[],
            nowkey:'1',
            visible: false,
            title:"操作",
            par:{},
            ssxarea1:'',
            ssxarea2:'',
            ssxarea3:'',
            ssxarea4:'',
            ssxarea:'',
            model:{},
            parlist:[],
            isshow:true,
            alltemp:[],
            threetest3:[],
            threetest4:[],
            id:'',
            record:{},
            show:false,
            templateId:'',
            needenv:[],
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
            formItemLayout1: {
                labelCol: {
                    xs: { span: 24},
                    sm: { span: 12 },
                },
                wrapperCol: {
                    xs: { span: 24 },
                    sm: { span: 12 },
                },
            },
            alltag:[],
            form:this.$form.createForm(this),
            form1:this.$form.createForm(this),
        }
    },
    created(){
        detectionTemplateAll().then(res=>{
            if(res.success){
                this.alltemp=res.result;
            }
        })
        envStandards().then((res)=>{
            if(res.success){
                this.alltest=res.result;
            }
        })
        
    },
    mounted(){},
    methods: {
        showall(){
            this.soiltest=[];
            for(let i=0;i<this.alltest.length;i++){
                if(this.needenv.indexOf(this.alltest[i].id)>-1){
                    this.soiltest.push(this.alltest[i])
                }
            }
            let aa=this.record.baseTestingVoList;
            for(let i=0;i<aa.length;i++){
                for(let l=0;l<this.soiltest.length;l++){
                    if(aa[i].envStandardsId==this.soiltest[l].id){
                        this.threetest3[aa[i].envStandardsId]=aa[i].value;
                    }
                }
            }
        },
        handleChange(value){
            getTemplateStandardType({templateId:value}).then(res=>{
            if(res.success){
                this.alltag=res.result;
                if(this.alltag.length>0){
                    this.nowkey=this.alltag[0].value;
                }
            }
        })
            selectByTemplateId({templateId:value}).then(res=>{
                if(res.success){
                    this.needenv=[];
                    for(let i=0;i<res.result.length;i++){
                        this.needenv.push(res.result[i].id);
                    }
                    this.showall();
                    this.show=true;
                }
            })
        },
        filterOption(input, option) {
            return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
        },
        onChange(checked,id){
            if(checked){
                this.parlist.push(id);
            }else{
                let a=this.parlist.indexOf(id);
                this.parlist.splice(a,1);
            } 
        },
        deltd(k){
            this.sugarContents.splice(k,1);
        },
        savetd(){
            let par={};
            if(this.sugarContent&&this.detectionTime){
                par.sugarContent=this.sugarContent;
                par.detectionTime=this.detectionTime;
                this.sugarContents.push(par);
                this.sugarContent='';
                this.detectionTime=null;
                this.deldta=null;
            }
        },
        getlabel(v){
            return v.item+'('+v.unit.displayName+')';
        },
        changekey(activeKey){
            this.nowkey=activeKey;
        },
        add(record){
            this.record=record;
            this.templateId='';
            this.show=false;
            if(record.basetemplateRel){
                this.templateId=record.basetemplateRel.templateId;
                this.handleChange(this.templateId);
                this.show=true;
            }           
            this.id=record.id;
            this.form.resetFields();
            this.form1.resetFields();
            this.parlist=[];
            this.visible=true;
            this.soiltest=[];
            this.title='编辑';
        },
        handleOk(){
            // 触发表单验证
            this.form.validateFields((err, values) => {
                var baseTestingVoList=[];
                var booll=true;
                this.form1.validateFields((err, values) => {
                    if(!err){
                        Object.keys(values).forEach(function(key){
                            let a={};
                            a.envStandardsId=Number(key);
                            a.value=values[key];
                            if(a.value||a.value==0){
                                baseTestingVoList.push(a);
                            }
                        });
                    }else{
                        booll=false;
                    }
                })
                if (!err&&booll) {
                    let par = {};
                    par.id = this.id;
                    par.basetemplateRel={};
                    par.basetemplateRel.templateId=values.templateName;
                    par.baseTestingVoList=baseTestingVoList;
                    addDetection(par).then(res=>{
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

</style>
