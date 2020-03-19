<template>
    <a-modal
        :title="title"
        v-model="visible"
        @ok="handleOk"
        style="top:10%;height: 90%"
        cancelText="取消"
        okText="确定"
        :maskClosable="false"
        class="change-env">
        <a-form
            :form="form">
            <div class="form-wrapper">
                <a-form-item label='检测项目'>
                    <a-input
                        @blur="checkNameType"
                        v-decorator="['displayName', {
                        initialValue: record.displayName,
                        rules: [{required: true, message: '请输入检测项目'}]
                    }]">
                    </a-input>
                </a-form-item>
            </div>
            <div class="form-wrapper">
                <a-form-item label='编码'>
                    <a-input
                        @blur="checkCodeType"
                        v-decorator="['code', {
                        initialValue: record.code,
                        rules: [{required: true, message: '请输入编码'}]
                    }]">
                    </a-input>
                </a-form-item>
            </div>
            <div class="form-wrapper">
                <a-form-item label='备注'>
                    <a-textarea
                        :autosize="{ minRows: 2, maxRows: 4}"
                        v-decorator="['remark', {
                            initialValue: record.remark
                        }]">
                    </a-textarea>
                </a-form-item>
            </div>
        </a-form>
    </a-modal>
</template>
<script>
import {
    addStandardType,
    updateStandardType,
    checkStandardType
} from '@/api/permissonApi'
export default {
    props: {
        cropDatas: {
            default() {
                return []
            }
        }
    },
    data() {
        return {
            title: '',
            visible: false,
            form: this.$form.createForm(this),
            record: {}
        }
    },
    methods: {
        open(record) {
            this.form.resetFields()
            this.visible = true
            this.record = record || {}
        },
        checkNameType(e) {
            console.log(this.record)
            checkStandardType({
                id: this.record.value ? this.record.value : null,
                displayName: e.target.value
            }).then(res => {
                if (!res) {
                    this.$message.warn('该名称已存在')
                    this.form.resetFields(['displayName'])
                }
            })
        },
        checkCodeType(e) {
            checkStandardType({
                id: this.record.value ? this.record.value : null,
                code: e.target.value
            }).then(res => {
                if (!res) {
                    this.$message.warn('该编码已存在')
                    this.form.resetFields(['code'])
                }
            })
        },
        handleOk() {
            this.form.validateFieldsAndScroll((err, values) => {
                if (!err) {
                    const params = this.form.getFieldsValue()
                    if (this.title.includes('编辑')) {
                        params.value = this.record.value
                        updateStandardType(params).then(res => {
                            this.$message.info(res.message)
                            if (res.success) {
                                this.visible = false
                                this.$parent._loadData()
                            }
                        })
                    } else {
                        addStandardType(params).then(res => {
                            this.$message.info(res.message)
                            if (res.success) {
                                this.visible = false
                                this.$parent._loadData()
                            }
                        })
                    }
                }
            })
        },
    }
}
</script>
<style lang="stylus">
    .change-env
        .form-wrapper
            width 100%
            .ant-form-item-control-wrapper
                width 60%
                display inline-block
            .ant-form-item-label
                width 130px
                vertical-align top
</style>