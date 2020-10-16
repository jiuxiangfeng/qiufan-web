<template>
  <div class="-container">
    <vab-query-form>
      <vab-query-form-left-panel :span="12">
        <el-button icon="el-icon-plus" type="primary" @click="HandleExport">
          导出
        </el-button>
      </vab-query-form-left-panel>
      <vab-query-form-right-panel :span="12">
        <el-form :inline="true" :model="queryForm" @submit.native.prevent>
          <el-form-item>
            <el-input
              v-model.trim="queryForm.username"
              placeholder="请输入药品名称"
              clearable
            />
          </el-form-item>
          <el-form-item>
            <el-button icon="el-icon-search" type="primary" @click="queryData">
              查询
            </el-button>
          </el-form-item>
        </el-form>
      </vab-query-form-right-panel>
    </vab-query-form>

    <el-table
      v-loading="listLoading"
      :data="list"
      :element-loading-text="elementLoadingText"
      @selection-change="setSelectRows"
    >
      <el-table-column
        type="index"
        label="序号"
        :index="indexMethod"
      ></el-table-column>

      <el-table-column
        show-overflow-tooltip
        prop="drug_name"
        label="药品名称"
      ></el-table-column>
      <el-table-column prop="drug_type" label="标签" width="150">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.drug_type === 'drug_general'" type="warning">
            一般化学品
          </el-tag>
          <el-tag
            v-else-if="scope.row.drug_type === 'drug_dangerous'"
            type="danger"
          >
            危险化学品
          </el-tag>
          <el-tag
            v-else-if="scope.row.drug_type === 'drug_standard'"
            type="success"
          >
            标准物质
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="store_all"
        label="累计总库存量"
      >
        <template slot-scope="scope">
          {{ scope.row.store_all }}{{ scope.row.drug_unit }}
        </template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="store_use"
        label="累计使用量"
      >
        <template slot-scope="scope">
          {{ scope.row.store_use }}{{ scope.row.drug_unit }}
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip label="剩余库存量" width="80">
        <template slot-scope="scope">
          {{ scope.row.store_all - scope.row.store_use
          }}{{ scope.row.drug_unit }}
        </template>
      </el-table-column>
      <el-table-column></el-table-column>
    </el-table>
    <el-pagination
      background
      :current-page="queryForm.pageNo"
      :page-sizes="[50, 100, 200, 300, 400]"
      :page-size="queryForm.pageSize"
      :layout="layout"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    ></el-pagination>
    <edit ref="edit" @fetchData="fetchData"></edit>
  </div>
</template>

<script>
  import { getList, doDelete } from '@/api/Drug_StoreManagement'
  import Edit from './components/StoreEdit'

  export default {
    name: 'DrugTypeManagement',
    components: { Edit },
    data() {
      return {
        list: null,
        listLoading: true,
        layout: 'total, sizes, prev, pager, next, jumper',
        total: 0,
        background: true,
        height: 0,
        selectRows: '',
        elementLoadingText: '正在加载...',
        queryForm: {
          pageNo: 1,
          pageSize: 50,
          id: '',
        },
      }
    },
    created() {
      this.fetchData()
      this.height = this.$baseTableHeight(1)
    },
    methods: {
      indexMethod(index) {
        return (this.queryForm.pageNo - 1) * this.queryForm.pageSize + 1 + index
      },
      setSelectRows(val) {
        this.selectRows = val
      },
      handleEdit(row) {
        if (row.id) {
          this.$refs['edit'].showEdit(row)
        } else {
          this.$refs['edit'].showEdit()
        }
      },
      handleDelete(row) {
        if (row.id) {
          this.$baseConfirm('你确定要删除当前项吗', null, async () => {
            await doDelete(row.id)
            this.$baseMessage('删除成功', 'success')
            this.fetchData()
          })
        } else {
          if (this.selectRows.length > 0) {
            const ids = this.selectRows.map((item) => item.id).join()
            this.$baseConfirm('你确定要删除选中项吗', null, async () => {
              const { msg } = await doDelete({ ids })
              this.$baseMessage(msg, 'success')
              this.fetchData()
            })
          } else {
            this.$baseMessage('未选中任何行', 'error')
            return false
          }
        }
      },
      handleSizeChange(val) {
        this.queryForm.pageSize = val
        this.fetchData()
      },
      handleCurrentChange(val) {
        this.queryForm.pageNo = val
        this.fetchData()
      },
      queryData() {
        this.queryForm.pageNo = 1
        this.fetchData()
      },
      async fetchData() {
        this.listLoading = true
        const { Result } = await getList(this.queryForm)
        this.list = Result.Data
        this.total = Result.totalCount
        setTimeout(() => {
          this.listLoading = false
        }, 300)
      },
      HandleExport() {
        this.$baseMessage('功能尚未完成，给点时间...', 'error')
      },
    },
  }
</script>
<style lang="scss" scoped></style>
