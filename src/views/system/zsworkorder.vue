<template>
    <div style="background:white;padding:10px 0 10px 0;">
        <div style="margin:0 1% 0 0; overflow:hidden">
            <div>
                <div class="button">
                    <i-button class="review-btn btn" @click="handleReset">
                        <Icon type="md-sync" class="icon"/>
                        重置
                    </i-button>
                    <i-button class="search-btn btn" style="margin-right:10px"  @click="handleSearch">
                        <Icon type="md-search" class="icon"/>
                        查询
                    </i-button>
                </div>
                <div class="select">
                    <a-form
                        :form="form"
                        @submit="handleSearch" >
                        <div class="search-wrapper">
                        <span style="line-height:40px;margin-right:5px">基地名称：</span>
                        <a-form-item style="display:inline-block">
                            <a-select
                                v-decorator="['baseId']"
                                style="width: 230px">
                                <a-select-option 
                                    v-for="item in baseDatas"
                                    :key="item.id"
                                    :value='item.id'>
                                    {{item.baseName}}
                                </a-select-option>
                            </a-select>
                        </a-form-item>
                    </div>
                    <div class="search-wrapper">
                        <span style="line-height:40px;margin-right:5px">执行日期：</span>
                        <a-form-item style="display:inline-block">
                            <a-range-picker 
                                @change='dataPick'
                                v-decorator="[
                                    'monitorTime'
                                ]"
                            />
                        </a-form-item>
                    </div>
                    </a-form>
                </div>
            </div>
        </div>
        <div style="margin: 0 0 16px 0;">
            <a-button
                type="primary"
                icon="plus"
                @click="add"
            >
                添加计划
            </a-button>
        </div>
        <div>
            <a-table
            :columns="planColumns"
            :dataSource="dataSource"
            :pagination="pagination"
            :loading="loading"
            rowKey="id"
            bordered
            @change="changeTable"
            >
                <pre slot="workOrderContent" slot-scope="text">{{text}}</pre>
                <span slot="action" slot-scope="text, record">
                    <a @click="handleEdit(record)">编辑工单</a>
                    <a-divider type="vertical" />
                    <a-popconfirm title="确定删除吗?" @confirm="handleDelete(record.id)">
                        <a>删除工单</a>
                    </a-popconfirm>
                </span>
            </a-table>
        </div>
        <changeOrder :baseData='baseDatas.slice(1)' ref="changeOrder"></changeOrder>
    </div>
</template>
<script>
import {
    addzsOrder,
    updatezsOrder,
    getzsOrder,
    deletezsOrder,
    getAllBaseZS
} from '@/api/permissonApi'
import changeOrder from './modules/addZSworkorderModal'
export default {
    name: 'zsWorkOrder',
    components: {
        changeOrder
    },
    data () {
        return {
            baseDatas: [{
                id: 0,
                baseName: '全部'
            }],
            form: this.$form.createForm(this),
            dataSource: [],
            loading: false,
            pageNo: null,
            pageSize: null,
            startTime: null,
            endTime: null,
            planColumns: [
                {
                    title: '工单名称 ',
                    dataIndex: 'workOrderName',
                    key: 'workOrderName'
                },
                {
                    title: '工单内容',
                    dataIndex: 'workOrderContent',
                    key: 'workOrderContent',
                    scopedSlots: { customRender: "workOrderContent" }
                },
                {
                    title: '基地名称',
                    dataIndex: 'baseName',
                    key: 'baseName'
                },
                {
                    title: '工单起始时间',
                    dataIndex: 'startTime',
                    key: 'startTime'
                },
                {
                    title: '工单结束时间',
                    dataIndex: 'endTime',
                    key: 'endTime'
                },
                {
                    title: '操作',
                    dataIndex: "action",
                    key: "action",
                    scopedSlots: { customRender: "action" },
                    align: "center"
                }
            ],
            pagination: {
                pageSizeOptions: ["10", "20", "50"],
                showTotal: (total, range) => {
                    return range[0] + "-" + range[1] + " 共" + total + "条";
                },
                showQuickJumper: true,
                showSizeChanger: true,
            },
        }
    },
    created() {
        getAllBaseZS().then(res => {
            if (res.success) {
                this.baseDatas = this.baseDatas.concat(res.result)
            }
        })
        this._loadData()
    },
    methods: {
        _loadData() {
            let params = this.form.getFieldsValue();
            params.pageNo = this.pageNo
            params.pageSize = this.pageSize
            params.startTime = this.startTime
            params.endTime = this.endTime
            this.loading = true
            if (params.baseId === 0) {
                delete params.baseId
            }
            if (params.monitorTime) {
                delete params.monitorTime
            }
            getzsOrder(params).then(res => {
                if (res.success) {
                    this.dataSource = res.result.list
                    this.$set(this.pagination, 'total', res.result.total)
                    this.$set(this.pagination, 'pageSize', res.result.pageSize)
                    this.$set(this.pagination, 'current', res.result.pageNum)
                }
                this.loading = false
            })
        },
        dataPick(date, dateString) {
            if (date.length > 1) {
                this.startTime = dateString[0]
                this.endTime = dateString[1]
                console.log(this.startTime, this.endTime)
            } else {
                this.startTime = null
                this.endTime = null
            }
        },
        handleReset() {
            this.form.resetFields()
            this.startTime = null
            this.endTime = null
            this._loadData()
        },
        handleSearch() {
            this._loadData()
        },
        add() {
            this.$refs.changeOrder.title = '添加工单'
            this.$refs.changeOrder.open()
        },
        changeTable(page) {
            this.pageNo = page.current
            this.pageSize = page.pageSize
            this._loadData()
        },
        handleEdit(record) {
            this.$refs.changeOrder.title = '修改工单'
            this.$refs.changeOrder.open(record)
        },
        handleDelete(id) {
            deletezsOrder({
                id:id
            }).then(res => {
                this.$message.info(res.message)
                if (res.success) {
                    this._loadData()
                }
            })
        }
    }
}
</script>
<style lang="stylus" scoped>
    .btn
        float right
        background #2c909c
        border-color #2c909c
        color #fff
        line-height 18px
        margin-top 6px
        .icon
            font-size 18px
            vertical-align middle
</style>
