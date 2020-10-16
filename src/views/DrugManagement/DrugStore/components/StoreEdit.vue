<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogFormVisible"
    width="520px"
    @close="close"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="120px">
      <el-form-item label="药品名称" prop="drug_name">
        <el-input v-model.trim="form.drug_name" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="药品类型" prop="drug_type">
        <el-radio-group v-model="form.drug_type">
          <el-radio label="drug_general">一般化学品</el-radio>
          <el-radio label="drug_dangerous">危险化学品</el-radio>
          <el-radio label="drug_standard">标准物质</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="规格" prop="drug_size">
        <el-input-number
          v-model="form.drug_size"
          :min="1"
          controls-position="right"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="单位" prop="drug_unit">
        <el-radio-group v-model="form.drug_unit">
          <el-radio label="g"></el-radio>
          <el-radio label="ml"></el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="生产地址" prop="production_units">
        <el-input
          v-model.trim="form.production_units"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item label="国家标准编号" prop="gb_no">
        <el-input v-model.trim="form.gb_no" autocomplete="off"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import { doAdd, doEdit } from '@/api/Drug_TypeManagement'

  export default {
    name: 'TypesEdit',
    data() {
      return {
        form: {
          drug_name: '',
          drug_size: '',
          drug_type: '',
          drug_unit: '',
          gb_no: '',
          address: '',
          date1: '',
          date2: '',
        },
        rules: {
          drug_name: [
            { required: true, trigger: 'blur', message: '请输入药品名称' },
          ],
          drug_size: [
            { required: true, trigger: 'blur', message: '请输入规格' },
          ],
          drug_unit: [
            { required: true, trigger: 'blur', message: '请输入单位' },
          ],
          drug_type: [
            { required: true, trigger: 'blur', message: '请选择药品类型' },
          ],
          production_units: [
            { required: true, trigger: 'blur', message: '请输入生产地址' },
          ],
        },
        title: '',
        dialogFormVisible: false,
      }
    },
    created() {},
    methods: {
      showEdit(row) {
        if (!row) {
          this.title = '添加'
        } else {
          this.title = '编辑'
          this.form = Object.assign({}, row)
        }
        this.dialogFormVisible = true
      },
      close() {
        this.$refs['form'].resetFields()
        this.form = this.$options.data().form
        this.dialogFormVisible = false
      },
      save() {
        this.$refs['form'].validate(async (valid) => {
          if (valid) {
            if (this.title === '添加') {
              await doAdd(this.form)
            } else {
              await doEdit(this.form)
            }
            this.$baseMessage(this.title + '成功', 'success')
            this.$emit('fetch-data')
            this.close()
          } else {
            return false
          }
        })
      },
    },
  }
</script>
<style lang="scss" scoped>
  .line {
    text-align: center;
  }
</style>
