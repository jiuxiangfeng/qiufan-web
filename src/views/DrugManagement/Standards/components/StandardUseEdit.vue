<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogFormVisible"
    width="620px"
    :close-on-click-modal="false"
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
              :disabled="noEditFiled"
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
                  可用库存:{{ item.store_all - item.store_use }}
                  {{ item.drug_unit }}
                  <br />
                  国家标准编号:{{ item.gb_no }} / 生产单位:{{
                    item.production_units
                  }}
                </span>
              </template>
            </el-autocomplete>
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item>
        <span v-if="form.drug_name" class="drug-info">
          可用库存:{{ form.store_info.store_canUse }}
          {{ form.store_info.drug_unit }}
          <br />
          国家标准编号:{{ form.store_info.gb_no }} / 生产单位:{{
            form.store_info.production_units
          }}
        </span>
      </el-form-item>
      <el-form-item label="使用量" required>
        <el-col :span="8">
          <el-form-item label="" prop="use_size">
            <el-input-number
              v-model="form.use_size"
              :min="0.01"
              :max="form.store_canUse"
              label="描述文字"
              controls-position="right"
            ></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="16">
          <el-form-item label="" prop="drug_unit">
            <el-radio-group v-model="form.drug_unit">
              <el-radio label="g"></el-radio>
              <el-radio label="ml"></el-radio>
              <el-radio label="瓶"></el-radio>
              <el-radio label="支"></el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item label="使用日期" prop="use_date">
        <el-date-picker
          v-model="form.use_date"
          type="date"
          placeholder="选择日期"
          value-format="yyyy-MM-dd"
          :disabled="noEditFiled"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="国家标准编号" prop="gb_no">
        <el-input v-model.trim="form.gb_no" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="生产单位" prop="production_units">
        <el-input
          v-model.trim="form.production_units"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item label="有效期" required>
        <el-col :span="11">
          <el-form-item prop="expiry_date_start">
            <el-date-picker
              v-model="form.expiry_date_start"
              type="month"
              placeholder="开始月份"
              style="width: 100%"
              value-format="yyyy-MM"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col class="line" :span="2">-</el-col>
        <el-col :span="11">
          <el-form-item prop="expiry_date_end">
            <el-date-picker
              v-model="form.expiry_date_end"
              type="month"
              placeholder="结束月份"
              style="width: 100%"
              value-format="yyyy-MM"
            ></el-date-picker>
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item label="购买日期" prop="buy_date">
        <el-date-picker
          v-model="form.buy_date"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择日期"
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
  import { getAll as getDrugDangerousBuyNoUseAll } from '@/api/Drug_StoreManagement'
  import { doAdd, doEdit } from '@/api/Drug_StandardUseManagement'

  export default {
    name: 'DrugManagementGeneralUseEdit',
    data() {
      var myvalidator = (rule, value, callback) => {
        setTimeout(() => {
          if (this.form.store_canUse <= 0) {
            callback(new Error('----------------------------------库存不足'))
          } else if (this.form.drug_name != '' && this.form.drug_name != null) {
            callback()
          } else {
            callback(new Error('请输入药品名称'))
          }
        }, 200)
      }
      var buyDateValidator = (rule, value, callback) => {
        if (
          new Date(value + ' 00:00:00').getTime() <=
          new Date(this.form.use_date + ' 00:00:00').getTime()
        ) {
          callback()
        } else {
          callback(new Error('购买日期不能大于使用日期'))
        }
      }
      return {
        restaurants: [],
        noEditFiled: false,
        form: {
          buy_no: '',
          drug_name: '',
          use_size: 0,
          use_date: '',
          drug_unit: '',
          production_units: '',
          gb_no: '',
          buy_date: '',
          remark: '',
          store_info: {},
        },
        rules: {
          drug_name: [{ validator: myvalidator, trigger: 'blur' }],
          use_size: [
            { required: true, trigger: 'blur', message: '请输入使用量' },
          ],
          use_date: [
            { required: true, trigger: 'blur', message: '请输入使用日期' },
          ],
          gb_no: [
            { required: true, trigger: 'blur', message: '请输入国家标准编号' },
          ],
          production_units: [
            { required: true, trigger: 'blur', message: '请输入生产单位' },
          ],
          drug_unit: [
            { required: true, trigger: 'blur', message: '请输入药品规格单位' },
          ],
          buy_num: [
            { required: true, trigger: 'blur', message: '请输入购买数量' },
          ],
          buy_date: [
            {
              required: true,
              trigger: 'blur',
              message: '请输入购买日期',
            },
            { validator: buyDateValidator, trigger: 'blur' },
          ],
          expiry_date_start: [
            {
              required: true,
              trigger: 'blur',
              message: '请输入有效期起始日期',
            },
          ],
          expiry_date_end: [
            {
              required: true,
              trigger: 'blur',
              message: '请输入有效期结束日期',
            },
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
          this.noEditFiled = false
        } else {
          this.noEditFiled = true
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
            this.form.store_remain = this.form.store_canUse - this.form.use_size //可用库存 - 当前使用库存
            if (this.title === '添加') {
              await doAdd(this.form)
            } else {
              await doEdit(this.form)
            }
            this.$baseMessage(this.title + '成功', 'success')
            this.restaurants = await this.loadAll() //重置下拉框数据
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
              FieldValue: 'drug_Standard',
            },
          ],
        }
        return (await getDrugDangerousBuyNoUseAll(rquestData)).Result
        // return [
        //   { drug_name: "磷", drug_size: "60" },
        //   { drug_name: "磷22", drug_size: "60" },
        //   { drug_name: "高锰酸钾", drug_size: "60" },
        //   { drug_name: "钾", drug_size: "60" },
        // ];
      },
      handleSelect(item) {
        var o = Object.assign({}, item)
        this.form.buy_date = o.buy_date
        this.form.buy_no = o.buy_no
        this.form.drug_flag = o.drug_flag
        this.form.drug_name = o.drug_name
        this.form.drug_unit = o.drug_unit
        this.form.gb_no = o.gb_no
        this.form.production_units = o.production_units
        this.form.store_canUse = o.store_all - o.store_use
        if (this.form.use_size > this.form.store_canUse) {
          this.form.use_size = this.form.store_canUse
        }

        this.form.store_info.drug_name = o.drug_name
        this.form.store_info.store_canUse = o.store_all - o.store_use
        this.form.store_info.store_use = o.store_use
        this.form.store_info.drug_unit = o.drug_unit
        this.form.store_info.production_units = o.production_units
        this.form.store_info.gb_no = o.gb_no
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
    line-height: 20px;
  }
</style>
