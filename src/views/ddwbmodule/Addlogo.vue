<template>
    <a-modal
        :title="title"
        v-model="visible"
        @ok="handleOk"
        style="top:10%;height: 90%"
        cancelText="取消"
        okText="确定"
        :maskClosable="false"
        class="change-temporary">
        <div style="height:150px;">
            <a-upload
            name="file"
            action="/api2/platform-info/addPlatformIco"
            listType="picture-card"
            :fileList="mpfileList"
            @preview="mphandlePreview"
            :headers="headers"
            :beforeUpload="beforeUpload"
            @change="mphandleChange"
            :remove="mpremovepic"
            >
            <div v-if="mpfileList.length < 1">
                <a-icon type="plus" />
                <div class="ant-upload-text">Upload</div>
            </div>
            </a-upload>
            <a-modal :visible="mppreviewVisible" :footer="null" @cancel="mphandleCancel">
                <img alt="example" style="width: 100%" :src="mppreviewImage" />
            </a-modal>
        </div>
    </a-modal>
</template>

<script>
import Vue from 'vue'
import { ACCESS_TOKEN } from "@/store/mutation-types"
import { delPic,getLogoPic } from '@/api/ddwbApi'
export default {
    data() {
        return {
            visible: false,
            title: '',
            record: {},
            mpfileList:[],
            headers:'',
            mppreviewVisible:false,
            mppreviewImage:'',
        }
    },
    created() {
        const token = Vue.ls.get(ACCESS_TOKEN);
        this.headers = {"X-Access-Token":token};
        this.reload();
    },
    methods: {
        reload(){
            getLogoPic().then(res=>{
                if(res.success){
                    this.mpfileList=[];
                    if(res.result){                    
                        let pic=res.result;
                        let url='/api2/pictureInfo/show/'+pic.pictureUrl;
                        let a={
                            uid: pic.id,
                            name: pic.pictureUrl,
                            status: 'done',
                            url: url,
                        };
                        this.mpfileList.push(a);
                    }else{
                        this.mpfileList=[];
                    }
                }
            })
        },
        mphandleCancel () {
            this.mppreviewVisible = false;
        },
        mpremovepic(file){
            let id='';
            if(file.hasOwnProperty('response')){
                id=file.response.result.id;
            }else{
                id=file.uid;
            }
            delPic({id:id}).then(res=>{
                if(res.success){
                this.$message.success(res.message);
                this.mpfileList=[];
                this.reload();
                }
            })
            return true;
        },
        mphandleChange (info) {
             if(info.file.status === 'uploading'){
                this.mpfileList=info.fileList;
                return
            }
            if (info.file.status === 'done') {           
                this.reload();
            }
        },
        beforeUpload (file) {
            const isLt10M = file.size / 1024 / 1024 < 10
            if (!isLt10M) {
            this.$message.error('图片大小不能大于10M')
            }
            return isLt10M
        },
        mphandlePreview (file) {
            this.mppreviewImage = file.url || file.thumbUrl
            this.mppreviewVisible = true
        },
        open(record) {
            this.visible = true
            
        },
        handleOk() {
            this.visible = false
            this.$parent._loadData()
        },
    },
}
</script>