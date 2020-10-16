<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogFormVisible"
    width="550px"
    @close="close"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="110px">
      <el-form-item label="药品名称" required>
        <el-col :span="24">
          <el-form-item prop="drug_name">
            <el-autocomplete
              v-model="form.drug_name"
              value-key="drug_name"
              popper-class="my-autocomplete"
              :fetch-suggestions="querySearch"
              placeholder="请输入内容"
              style="width: 100%"
              @select="handleSelect"
            >
              <i
                slot="suffix"
                class="el-icon-edit el-input__icon"
                @click="handleIconClick"
              ></i>
              <template slot-scope="{ item }">
                <div class="name">{{ item.drug_name }}</div>
                <span class="addr">
                  {{ item.drug_size }} {{ item.drug_unit }} / {{ item.gb_no }} /
                  {{ item.production_units }}
                </span>
              </template>
            </el-autocomplete>
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item>
        <span v-if="form.drug_name" class="drug-info">
          {{ form.drugType.drug_size }} {{ form.drugType.drug_unit }} /
          {{ form.drugType.gb_no }} /
          {{ form.drugType.production_units }}
        </span>
      </el-form-item>
      <el-form-item label="规格" prop="drug_size">
        <el-input-number
          v-model="form.drug_size"
          :min="0.01"
          controls-position="right"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="规格单位" prop="drug_unit">
        <el-radio-group v-model="form.drug_unit">
          <el-radio label="g"></el-radio>
          <el-radio label="ml"></el-radio>
          <el-radio label="瓶"></el-radio>
          <el-radio label="支"></el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="生产单位" prop="production_units">
        <el-input
          v-model.trim="form.production_units"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item label="国家标准编号" prop="gb_no">
        <el-input v-model.trim="form.gb_no" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="购买数量" prop="buy_num">
        <el-input-number
          v-model="form.buy_num"
          :min="0.01"
          label="描述文字"
          controls-position="right"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="购买日期" prop="buy_date">
        <el-date-picker
          v-model="form.buy_date"
          type="date"
          placeholder="选择日期"
          value-format="yyyy-MM-dd"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="购买编号" prop="buy_no">
        <el-input v-model.trim="form.buy_no" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input
          v-model.trim="form.remark"
          autocomplete="off"
          placeholder="填写备注信息"
        ></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import { getAll as getDrugTypeAll } from '@/api/Drug_TypeManagement'
  import { doAdd, doEdit } from '@/api/Drug_GeneralBuyManagement'

  export default {
    name: 'DrugManagementGeneralsBuyEdit',
    data() {
      var myvalidator = (rule, value, callback) => {
        setTimeout(() => {
          if (this.form.drug_name != '' && this.form.drug_name != null) {
            callback()
          } else {
            callback(new Error('请输入药品名称'))
          }
        }, 200)
      }
      return {
        restaurants: [],
        form: {
          buy_no: '',
          buy_num: 1,
          drug_name: '',
          drug_size: 1,
          drug_unit: '',
          production_units: '',
          gb_no: '',
          buy_date: '',
          remark: '',
        },
        rules: {
          drug_name: [{ validator: myvalidator, trigger: 'blur' }],
          drug_size: [
            { required: true, trigger: 'blur', message: '请输入药品规格' },
          ],
          drug_unit: [
            { required: true, trigger: 'blur', message: '请输入药品规格单位' },
          ],
          production_units: [
            { required: true, trigger: 'blur', message: '请输入单位地址' },
          ],
          gb_no: [
            { required: true, trigger: 'blur', message: '请输入国家标准编号' },
          ],
          buy_num: [
            { required: true, trigger: 'blur', message: '请输入购买数量' },
          ],
          buy_date: [
            { required: true, trigger: 'blur', message: '请输入购买日期' },
          ],
        },
        title: '',
        dialogFormVisible: false,
      }
    },
    async mounted() {
      this.restaurants = await this.loadAll()
    },
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
      querySearch(queryString, cb) {
        var restaurants = this.restaurants
        var results = queryString
          ? restaurants.filter(this.createFilter(queryString))
          : restaurants
        // 调用 callback 返回建议列表的数据
        cb(results)
      },
      createFilter(queryString) {
        return (restaurant) => {
          return (
            (restaurant.drug_name + ' ' + restaurant.drug_size)
              .toLowerCase()
              .indexOf(queryString.toLowerCase()) != -1
          )
        }
      },
      async loadAll() {
        let rquestData = {
          Conditionals: [
            {
              FieldName: 'drug_type',
              FieldValue: 'drug_general',
            },
          ],
        }
        return (await getDrugTypeAll(rquestData)).Result
        // return [
        //   { drug_name: "磷", drug_size: "60" },
        //   { drug_name: "磷22", drug_size: "60" },
        //   { drug_name: "高锰酸钾", drug_size: "60" },
        //   { drug_name: "钾", drug_size: "60" },
        // ];
      },
      handleSelect(item) {
        var o = Object.assign({}, item)
        this.form.drug_size = o.drug_size
        this.form.drug_unit = o.drug_unit
        this.form.production_units = o.production_units
        this.form.gb_no = o.gb_no
        this.form['drugType'] = o
      },
      handleIconClick(ev) {
        console.log(ev)
      },
    },
  }
</script>

<style lang="scss" scoped>
  .el-form-item--small.el-form-item {
    margin-bottom: 14px;
  }
  .my-autocomplete {
    li {
      line-height: 1;
      padding: 2px;
      .name {
        text-overflow: ellipsis;
        overflow: hidden;
        line-height: 16px;
      }
      .addr {
        font-size: 12px;
        color: #b4b4b4;
        line-height: 14px;
        margin: 2px 0 5px 0px;
        display: block;
      }

      .highlighted .addr {
        color: #ddd;
      }
    }
  }
  .drug-info {
    margin-top: -20px;
    position: absolute;
    left: 0;
    top: -17px;
    color: #b4b4b4;
  }
</style>
