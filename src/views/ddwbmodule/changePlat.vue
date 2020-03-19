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
        <a-form
            :form="form">
            <div class="form-wrapper">
                <a-form-item label='类型'>
                    <a-select
                    v-decorator="['type',{
                        initialValue:record.type,
                        rules: [{required: true, message: '请选择类型'}]
                    }]">
                        <a-select-option 
                            v-for="item in typeData"
                            :key="item.type"
                            :value='item.type'>
                            {{item.name}}
                        </a-select-option>
                    </a-select>
                </a-form-item>
            </div>
            <div class="form-wrapper">
                <a-form-item label='平台名称'>
                    <a-input
                        v-decorator="['name',{
                        initialValue:record.name,
                        rules: [{required: true, message: '请输入平台名称'}]
                    }]">
                    </a-input>
                </a-form-item>
            </div>
            <div class="form-wrapper">
                <a-form-item label='网页标题'>
                    <a-input
                        v-decorator="['title',{
                        initialValue:record.title,
                        rules: [{required: true, message: '请输入网页标题'}]
                    }]" />
                </a-form-item>
            </div>
            <div class="form-wrapper">
                <a-form-item label='登陆界面名称'>
                    <a-input
                        v-decorator="['loginName',{
                        initialValue:record.loginName,
                        rules: [{required: true, message: '请输入登陆界面名称'}]
                    }]" />
                </a-form-item>
            </div>
            <div class="form-wrapper">
                <a-form-item label='底注'>
                    <a-input
                        v-decorator="['copyright',{
                        initialValue:record.copyright,
                        rules: [{required: true, message: '请输入底注'}]
                    }]" />
                </a-form-item>
            </div>
            <div class="form-wrapper">
                <a-form-item label='备案号'>
                    <a-input
                        v-decorator="['icp',{
                        initialValue:record.icp
                    }]" />
                </a-form-item>
            </div>
        </a-form>
    </a-modal>
</template>

<script>
import {
    platformType,
    addPlatform,
    updatePlatform
} from '@/api/permissonApi'
export default {
    data() {
        return {
            visible: false,
            title: '',
            form: this.$form.createForm(this),
            record: {},
            typeData: []
        }
    },
    created() {
        platformType().then(res => {
            if (res.success) {
                this.typeData = res.result
            }
        })
    },
    methods: {
        open(record) {
            this.visible = true
            this.form.resetFields()
            this.record = record || {}
        },
        handleOk() {
            if (this.title === '添加平台信息') {
                this.form.validateFieldsAndScroll((err, values) => {
                    if (!err) {
                        const params = this.form.getFieldsValue()
                        addPlatform(params).then(res => {
                            this.$message.info(res.message)
                            if (res.success) {
                                this.visible = false
                                this.$parent._loadData()
                            }
                        })
                    }
                })
            } else {
                this.form.validateFieldsAndScroll((err, values) => {
                    if (!err) {
                        const params = this.form.getFieldsValue()
                        params.id = this.record.id
                        updatePlatform(params).then(res => {
                            this.$message.info(res.message)
                            if (res.success) {
                                this.visible = false
                                this.$parent._loadData()
                            }
                        })
                    }
                })
            }
        },
    },
}
</script>