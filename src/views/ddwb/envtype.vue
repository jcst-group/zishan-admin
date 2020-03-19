<template>
    <div style="background:white;padding:10px 0 10px 0;">
        <!-- <div style="margin:0 1% 0 0; overflow:hidden">
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
                        <div style="float:left;width:250px;height:50px;margin-bottom:10px;">
                            <a-form-item style="display:inline-block">
                                <a-input
                                    placeholder="请输入任意字符"
                                    addonBefore='计划名'
                                    v-decorator="['planName']">
                                </a-input>
                            </a-form-item>
                        </div>
                        <div style="float:left;width:250px;height:50px;margin-bottom:10px;">
                            <span style="line-height:40px;margin-right:5px">品种：</span>
                            <a-form-item style="display:inline-block">
                                <a-select
                                v-decorator="['cropId']"
                                style="width: 160px">
                                    <a-select-option 
                                        v-for="item in cropDatas"
                                        :key="item.id"
                                        :value='item.id'>
                                        {{item.cropName}}
                                    </a-select-option>
                                </a-select>
                            </a-form-item>
                        </div>
                    </a-form>
                </div>
            </div>
        </div> -->
        <div style="margin: 0 0 16px 0;">
            <a-button
                type="primary"
                icon="plus"
                @click="add"
            >
                添加检测类型
            </a-button>
        </div>
        <div>
            <a-table
            :columns="planColumns"
            :dataSource="dataSource"
            :pagination="pagination"
            :loading="loading"
            rowKey="value"
            bordered
            @change="changeTable"
            >
                <pre slot="remark" slot-scope="text">{{text}}</pre>
                <span slot="action" slot-scope="text, record">
                    <a @click="handleEdit(record)">编辑类型</a>
                    <a-divider type="vertical" />
                    <a-popconfirm title="确定删除吗?" @confirm="handleDelete(record.value)">
                        <a>删除类型</a>
                    </a-popconfirm>
                </span>
            </a-table>
        </div>
        <changeEnvType ref="changeEnvType"></changeEnvType>
    </div>
</template>
<script>
import changeEnvType from '../ddwbmodule/changeEnvType.vue'
import {
    deleteStandardType,
    getStandardType
} from '@/api/permissonApi'
export default {
    name: 'envtype',
    components: {
        changeEnvType
    },
    data () {
        return {
            form: this.$form.createForm(this),
            dataSource: [],
            loading: false,
            pageNo: null,
            pageSize: null,
            planColumns: [
                {
                    title: '检测项目',
                    dataIndex: 'displayName',
                    key: 'displayName'
                },
                {
                    title: '编码',
                    dataIndex: 'code',
                    key: 'code'
                },
                {
                    title: '备注',
                    dataIndex: 'remark',
                    key: 'remark',
                    scopedSlots: {customRender: 'remark'}
                },
                {
                    title: '创建时间',
                    dataIndex: 'createTime',
                    key: 'createTime'
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
        this._loadData()
    },
    methods: {
        _loadData() {
            let params = this.form.getFieldsValue();
            params.pageNo = this.pageNo
            params.pageSize = this.pageSize
            this.loading = true
            getStandardType(params).then(res => {
                if (res.success) {
                    this.dataSource = res.result.records
                    this.$set(this.pagination, 'total', res.result.total)
                    this.$set(this.pagination, 'pageSize', res.result.size)
                    this.$set(this.pagination, 'current', res.result.pages)
                }
                this.loading = false
            })
        },
        handleReset() {
            this.form.resetFields()
            this._loadData()
        },
        handleSearch() {
            this._loadData()
        },
        add() {
            this.$refs.changeEnvType.title = '添加检测类型'
            this.$refs.changeEnvType.open()
        },
        changeTable(page) {
            this.pageNo = page.current
            this.pageSize = page.pageSize
            this._loadData()
        },
        handleEdit(record) {
            this.$refs.changeEnvType.title = '编辑检测类型'
            this.$refs.changeEnvType.open(record)
        },
        handleDelete(id) {
            deleteStandardType({
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