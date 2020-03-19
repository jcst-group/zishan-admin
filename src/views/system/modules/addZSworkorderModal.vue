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
                <a-form-item label='基地'>
                    <a-select
                    v-decorator="['baseId',{
                        initialValue:record.baseId,
                        rules: [{required: true, message: '请选择基地'}]
                    }]">
                        <a-select-option 
                            v-for="item in baseData"
                            :key="item.id"
                            :value='item.id'>
                            {{item.baseName}}
                        </a-select-option>
                    </a-select>
                </a-form-item>
            </div>
            <div class="form-wrapper">
                <a-form-item label='工单名称'>
                    <a-input
                        v-decorator="['workOrderName',{
                        initialValue:record.workOrderName,
                        rules: [{required: true, message: '请输入工单名称'}]
                    }]">
                    </a-input>
                </a-form-item>
            </div>
            <div class="form-wrapper">
                <a-form-item label='工单内容'>
                    <a-textarea
                        :autosize="{minRows: 2, maxRows: 4}"
                        v-decorator="['workOrderContent',{
                        initialValue:record.workOrderContent,
                        rules: [{required: true, message: '请输入工单内容'}]
                    }]">
                    </a-textarea>
                </a-form-item>
            </div>
            <div class="form-wrapper">
                <a-form-item label='开始时间'>
                    <a-date-picker 
                        style="width:100%"
                        v-decorator="['startTime', {
                            initialValue: record.startTime ? moment(record.startTime, 'YYYY-MM-DD') : null,
                            rules: [{required: true, message: '请选择开始时间'}]
                        }]"
                    />
                </a-form-item>
            </div>
            <div class="form-wrapper" style="width:100%">
                <a-form-item label='结束时间'>
                    <a-date-picker 
                        style="width:100%"
                        v-decorator="['endTime', {
                            initialValue: record.endTime ? moment(record.endTime, 'YYYY-MM-DD') : null,
                            rules: [{required: true, message: '请选择结束时间'}]
                        }]"
                    />
                </a-form-item>
            </div>
        </a-form>
    </a-modal>
</template>

<script>
import {
    addzsOrder,
    updatezsOrder
} from '@/api/permissonApi'
import moment from 'moment'
export default {
    props: {
        baseData: {
            type: Array,
            default() {
                return []
            }
        }
    },
    data() {
        return {
            visible: false,
            title: '',
            form: this.$form.createForm(this),
            record: {}
        }
    },
    methods: {
        moment,
        open(record) {
            this.visible = true
            this.form.resetFields()
            this.record = record || {}
        },
        handleOk() {
            if (this.title === '添加工单') {
                this.form.validateFieldsAndScroll((err, values) => {
                    if (!err) {
                        const params = this.form.getFieldsValue()
                        addzsOrder(params).then(res => {
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
                        params.startTime = moment(params.startTime).format('YYYY-MM-DD')
                        params.endTime = moment(params.endTime).format('YYYY-MM-DD')
                        updatezsOrder(params).then(res => {
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