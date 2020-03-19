<template>
    <div class="temp">
        <div class="button">
          <a-button class="review-btn btn" type="primary" icon="reload" @click="review">重置</a-button>
          <a-button class="search-btn btn" type="primary" icon="search" @click="search">查询</a-button>
          <a-button class="add-btn btn" type="primary" icon="plus" @click="add_baseuser">新增</a-button>
        </div>
        <div class="input">
            <span class="title">模板名称：</span>
            <a-input v-model="mubanname" class="inp"/>
           <!-- <a-select v-model="baselist" class="inp">
              <a-select-option v-for="(v,k) in Baselist" :value="v.id" :key="k">{{v.baseName}}</a-select-option>
            </a-select> -->
            <!-- <span class="title">对应人员名称：</span>
            <a-input v-model="baseuser" class="inp"/> -->
        </div>
        <div class="btable">
            <a-table :columns="columns"
                :dataSource="dataSource"
                :pagination="ipagination"
                @change="handleTableChange"
                :rowKey="record => record.id"
                :loading="loading"
                bordered
                >
                <span slot="userList" slot-scope="text, record">
                  <a-tag color="blue" v-for="(v,k) in record.userList" :key="k">{{v.realName}}</a-tag>
                  </span>
                <span slot="action" slot-scope="text, record">
                  <a href="javascript:;" @click="copy(record)">复制模板</a>
                  <a-divider type="vertical" />
                  <a href="javascript:;" @click="edit(record)">编辑</a>
                  <a-divider type="vertical" />
                    <a-popconfirm title="是否删除该基地?" @confirm="del(record)" okText="确定" cancelText="取消">
                  <a href="javascript:;">删除</a>
                  </a-popconfirm>  
                </span>
            </a-table>
        </div>
        <addmuban ref="addmuban"/>
        <editmuban ref="editmuban"/>
        <copyTemplate ref="copyTemplate" />
    </div>
</template>
<script>
import {addBaseUser,delBaseUser,getBaseUserList,getALLBaseList,detectionTemplateDel,detectionTemplate} from '@/api/ddwbApi'
import addmuban from '@/views/ddwbmodule/addmuban'
import editmuban from '@/views/ddwbmodule/editmuban'
import copyTemplate from '../ddwbmodule/copyEnvTemplate'

const columns = [{
    title: '模板名称',
    dataIndex: 'templateName',
    key: 'templateName',
    align: 'left',
  },{
    title: '操作',
    dataIndex: 'action',
    key: 'action',
    scopedSlots: { customRender: 'action' },
    align: 'center',
  }];
export default {
  name: 'baseuser',
  components:{
    addmuban,
    editmuban,
    copyTemplate
  },
  data(){
    return{
     mubanname:'',
     baseuser:'',
     Baselist:[],
     columns,
     loading:false,
     dataSource:[],
     ipagination: {
            current: 1,
            pageSize: 10,
            pageSizeOptions: ['10', '20', '50'],
            showTotal: (total, range) => {
             return range[0] + '-' + range[1] + '共' + total + '条';
            },
            showQuickJumper: true,
            showSizeChanger: true,
            total: 0
     },
     par:{},
    }
  },
  created(){
    this.loadData();
    // getALLBaseList().then((res)=>{
    //   if(res.success){
    //     this.Baselist=res.result;
    //   }
    // })
  },
  methods:{
     copy(record) {
       this.$refs.copyTemplate.open(record)
     },
     handleTableChange(pagination) {
        this.ipagination = pagination;
        this.loadData();
      },
      getQueryParams() {
        let param = Object.assign({}, this.par);
        param.pageNo = this.ipagination.current;
        param.pageSize = this.ipagination.pageSize;
        return param;
      },
      loadData() {
        this.loading=true;
        let params = this.getQueryParams();//查询条件
        detectionTemplate(params)
          .then((res) => {
           // console.log(res);
            if (res.success) {
              this.dataSource = res.result.records;
              this.ipagination.total = res.result.total;
              this.loading=false;
            }
          });
      },
      add_baseuser(){
          this.$refs.addmuban.add();
      },
      edit(record){
         this.$refs.editmuban.edit(record);
      },
      del(record){
        detectionTemplateDel({id:record.id}).then((res)=>{
          if (res.success) {
                this.$message.success(res.message);
                this.loadData();
              } else {
                this.$message.warning(res.message);
              }
        })
      },
       review(){
        this.mubanname='';
        this.par={};
        this.loadData();
      },
      search(){
        this.par={};
        if(this.mubanname){
          this.par.templateName=this.mubanname;
        }
       this.loadData();
      },
  },
}
</script>
<style scoped>
    .btn{
        float: right;
        background: #2c909c;
        border-color: #2c909c;
        color: #fff;
        line-height: 18px;
        margin-right: 10px;
    }    
    .title{
        margin-right: 5px;
        line-height: 32px;
    }    
    .inp{
        width: 10%;
        margin-right: 10px;
    }    
    .btable{
        width: 100%;
        margin-top: 10px;
    }    
</style>
