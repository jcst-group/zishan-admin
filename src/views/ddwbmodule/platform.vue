<template>
    <div class="platform-table" style="margin-bottom: 50px">
        <div style="margin:20px 0 10px 0;">
            <a-button  class="btn" type="primary" icon="plus" @click="add">新增平台信息</a-button>
        </div>
        <a-table
            bordered
            :pagination='false'
            :loading='loading'
            :dataSource='dataSource'
            rowKey='id'
            @change="changeTable"
            :columns='columns'>
            <span slot="action" slot-scope="text, record">
                <a @click="handleEdit(record)">编辑</a>
                <!-- <a-divider type="vertical" />
                <a @click="handleAdd(record)">icon</a> -->
            </span>
        </a-table>
        <changePlat ref='changePlat'></changePlat>
        
    </div>
</template>
<script>
import changePlat from './changePlat'

import {
    getPlatform
} from '@/api/permissonApi'
export default {
    components: {
        changePlat,
        
    },
    data() {
        return {
            columns: [
                {
                    title: '平台名称 ',
                    dataIndex: 'name',
                    key: 'name'
                },
                {
                    title: '登录界面名称 ',
                    dataIndex: 'loginName',
                    key: 'loginName'
                },
                {
                    title: '网页标题 ',
                    dataIndex: 'title',
                    key: 'title'
                },
                {
                    title: '底注 ',
                    dataIndex: 'copyright',
                    key: 'copyright'
                },
                {
                    title: '备案号 ',
                    dataIndex: 'icp',
                    key: 'icp'
                },
                {
                    title: '平台类型 ',
                    dataIndex: 'platformName',
                    key: 'platformName'
                },
                {
                    title: '操作',
                    dataIndex: "action",
                    key: "action",
                    scopedSlots: { customRender: "action" },
                    align: "center"
                }
            ],
            dataSource: [],
            loading: false,
            pageNo: null,
            pageSize: null,
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
            let params = {}
            params.pageNo = this.pageNo
            params.pageSize = this.pageSize
            this.loading = true
            getPlatform(params).then(res => {
                if (res.success) {
                    this.dataSource = res.result.list
                    this.$set(this.pagination, 'total', res.result.total)
                    this.$set(this.pagination, 'pageSize', res.result.pageSize)
                    this.$set(this.pagination, 'current', res.result.pageNum)
                }
                this.loading = false
            })
        },
        add() {
            this.$refs.changePlat.title = '添加平台信息'
            this.$refs.changePlat.open()
        },
        handleEdit(record) {
            this.$refs.changePlat.title = '修改平台信息'
            this.$refs.changePlat.open(record)
        },
        changeTable(page) {
            this.pageNo = page.current
            this.pageSize = page.pageSize
            this._loadData()
        },
    },
}
</script>
<style lang="stylus" scoped>

</style>