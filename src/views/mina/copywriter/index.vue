<template>
  <div class="app-container calendar-list-container">
  <div class="filter-container">
    <el-input style="width: 200px;" class="filter-item" placeholder="标题或模块" v-model="listQuery.keyword"> </el-input>
    <el-button class="filter-item" type="primary" icon="search" @click="handleFilter">搜索</el-button>
    <el-button class="filter-item"  v-if="copywriter_btn_add"  style="margin-left: 10px;" @click="handleCreate" type="primary" icon="edit">添加</el-button>
  </div>
    <el-table :data="list" :key='tableKey' v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="标题">
        <template slot-scope="scope">
        <span>
          {{scope.row.title}}
        </span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="模块">
        <template slot-scope="scope">
        <span>
          {{scope.row.code}}
        </span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <router-link :to="{name:'copywriterModule',params:{id:scope.row.id,title:scope.row.title}}">
            <el-button size="mini" type="primary" v-if="copywriter_btn_check">
              查看
            </el-button>
          </router-link>
          <el-button v-if="copywriter_btn_edit" size="small" type="success" @click="handleUpdate(scope.row)">编辑
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="listQuery.page"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="listQuery.limit"
        layout="total,sizes, prev, pager, next,jumper"
        :total="total">
      </el-pagination>
    </div>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form :model="form" :rules="rules" ref="form" label-width="100px">
        <el-form-item label="标题" prop="title">
          <el-input type="text" v-model="form.title"></el-input>
        </el-form-item>
        <el-form-item label="模块" prop="code">
          <el-input v-if="dialogStatus == 'create'" v-model="form.code" placeholder="请输入模块"></el-input>
          <el-input v-else v-model="form.code" placeholder="请输入模块" readonly></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('form')">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="create('form')">确 定</el-button>
        <el-button v-else type="primary" @click="update('form')">修 改</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  page,
  addObj,
  getObj,
  delObj,
  putObj
} from '@/api/mina/copyWriter/index'
  import waves from '@/directive/waves/index.js' // 水波纹指令

  export default {
    name: 'copyWriter',
    directives: {
      waves
    },
    data() {
      return {
        list: null,
        total: null,
        copywriter_btn_add: true,
        copywriter_btn_check: true,
        copywriter_btn_edit:true,
        copywriter_btn_del:true,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 10,
          keyword:""
        },
        rules: {
          title: [
            {
              required: true,
              message: '请输入标题',
              trigger: 'blur'
            }
          ],
          code: [
            {
              required: true,
              message: '请输入模块 ',
              trigger: 'blur'
            }
          ]
        },
        dialogStatus: '',
        dialogFormVisible: false,
        textMap: {
          update: '编辑',
          create: '添加'
        },
        form: {
          title: undefined,
          code: undefined
        },
        tableKey: 0
      }
    },
    created() {
      this.getList()
    },
    methods: {
      getList() {
        this.listLoading = true;
        page(this.listQuery).then(response => {
          this.list = response.data.data.records
          this.total = response.data.data.total;
          this.listLoading = false;
        })
      },
      handleFilter() {
        this.getList();
      },
      handleCreate() {
        this.resetTemp()
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
      },
      handleUpdate(row) {
        getObj(row.id).then(response => {
          this.form = response.data.data;
          console.log(this.form)
          this.dialogFormVisible = true;
          this.dialogStatus = 'update';
        });
      },
      handleSizeChange(val) {
        this.listQuery.limit = val;
        this.getList();
      },
      handleCurrentChange(val) {
        this.listQuery.page = val;
        this.getList();
      },
      create(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            addObj(this.form)
              .then(response => {
                this.dialogFormVisible = false
                if (response.data.errcode==0) {
                  this.getList()
                  this.$notify({
                    title: '成功',
                    message: '创建成功',
                    type: 'success',
                    duration: 2000
                  })
                }else{
                  this.$notify({
                    title: '错误',
                    message: response.data.errmsg,
                    type: 'error',
                    duration: 2000
                  })
                }
              })
          } else {
            return false
          }
        })
      },
      cancel(formName) {
        this.dialogFormVisible = false
        this.$refs[formName].resetFields()
      },
      update(formName) {
        const set = this.$refs;
        set[formName].validate(valid => {
          if (valid) {
            this.dialogFormVisible = false;
            putObj(this.form).then((response) => {
              var obj = response.data;
              if (obj.errcode==0) {
                this.dialogFormVisible = false;
                this.getList();
                this.$notify({
                  title: '成功',
                  message: '修改成功',
                  type: 'success',
                  duration: 2000
                });
              }else{
                this.dialogFormVisible = false;
                this.$notify.error({
                  title: '错误',
                  message: obj.errmsg
                });
              }
            });
          } else {
            return false;
          }
        });
      },
      resetTemp() {
        this.form = {
          title: '',
          code: ''
        }
      }
    }
  }
</script>

