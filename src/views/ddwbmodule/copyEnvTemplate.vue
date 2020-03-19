<template>
    <a-modal
        title="复制检测模板"
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
                <a-form-item label='模板名称'>
                    <a-input
                        v-decorator="['templateName',{
                        rules: [{required: true, message: '请输入模板名称'}]
                    }]">
                    </a-input>
                </a-form-item>
            </div>
        </a-form>
    </a-modal>
</template>
<script>
import {copyTemplate} from '@/api/ddwbApi'
export default {
    data() {
        return {
            visible: false,
            form: this.$form.createForm(this),
            record: {}
        }
    },
    methods: {
        open(record) {
            this.visible = true
            this.form.resetFields()
            this.record = record || {}
        },
        handleOk() {
            this.form.validateFieldsAndScroll((err, values) => {
                if (!err) {
                    const params = this.form.getFieldsValue()
                    params.id = this.record.id
                    copyTemplate(params).then(res => {
                        this.$message.info(res.message)
                        if (res.success) {
                            this.visible = false
                            this.$parent.loadData()
                        }
                    })
                }
            })
        },
    },
}
</script>