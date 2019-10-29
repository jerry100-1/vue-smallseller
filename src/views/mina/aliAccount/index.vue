<template>
  <div class="app-container calendar-list-container">
  <div class="filter-container">
    <el-button class="filter-item"  v-if="aliAccount_btn_add"  style="margin-left: 10px;" @click="handleCreate" type="primary" icon="edit">+ 添加账号PID</el-button>
    <el-button class="filter-item" style="margin-left: 10px;" :type="this.listQuery.platformType == 1? 'info':'primary'" @click="tbAccount">淘宝</el-button>
    <el-button class="filter-item" style="margin-left: 10px;" :type="this.listQuery.platformType == 2? 'info':'primary'" @click="pddAccount">拼多多</el-button>
  </div>
    <el-table :data="list" :key='tableKey' v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">
      <el-table-column label="序号" width="100" align="center"
        type="index"
        :index="indexMethod">
      </el-table-column>
      <el-table-column align="center" label="PID名称">
        <template slot-scope="scope">
        <span>
          {{scope.row.pidName}}
        </span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="PID用途">
        <template slot-scope="scope">
        <span v-if="scope.row.useType == 0">
          跳转
        </span>
        <span v-else-if="scope.row.useType == 1">
          采集
        </span>
        <span v-else>
          暂无用途
        </span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="PID">
        <template slot-scope="scope">
        <span>
          {{scope.row.pid}}
        </span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="授权账号">
        <template slot-scope="scope">
          <span>
          {{scope.row.account}}
          </span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="提交时间">
        <template slot-scope="scope">
        <span>
          {{scope.row.subTime |timeFormat}}
        </span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button v-if="aliAccount_btn_edit" size="small" type="success" @click="handleUpdate(scope.row)">编辑
          </el-button>
          <el-button v-if="aliAccount_btn_del" size="small" type="danger" @click="handleDel(scope.row.id)">删除
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

        <el-form-item label="pid名称" prop="pidName">
          <el-input  v-model="form.pidName" placeholder="请输入PID名称"></el-input>
        </el-form-item>

        <el-form-item label="平台类目" prop="name">
          <el-select v-model="form.traceObjId"  placeholder="请选择类目">
            <el-option v-for="item in syslItems" :key="item.id" :label="item.title" :value="item.id"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="PID用途" prop="name">
          <el-select v-model="form.useType"  placeholder="请选择用途">
            <el-option v-for="item in pid_usage" :key="item.id" :label="item.name" :value="item.id"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="PID" prop="pid">
          <el-input  v-model="form.pid" placeholder="请输入PID"></el-input>
        </el-form-item>
        <el-form-item label="授权账号" prop="account">
          <el-input type="text" v-model="form.account"></el-input>
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
} from '@/api/mina/aliAccount/index';
// import { all as cAll } from "@/api/mina/taobaoCategory/index";
import { search } from "@/api/mina/category/index";
import waves from '@/directive/waves/index.js' // 水波纹指令
import { parseTime } from '@/utils/index' // 验权

  export default {
    name: 'aliAccount',
    directives: {
      waves
    },
    data() {
      return {
        //pid用途
        pid_usage:[
          {
            id:0,
            name:"跳转"
          },
          {
            id:1,
            name:"采集"
          }
        ],
        syslItems: [],
        indexMethod:1,
        list: null,
        total: null,
        aliAccount_btn_add: true,
        aliAccount_btn_check: true,
        aliAccount_btn_edit:true,
        aliAccount_btn_del:true,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 10,
          platformType:1,
        },
        rules: {
          account: [
            {
              required: true,
              message: '请输入账户',
              trigger: 'blur'
            }
          ],
          pid: [
            {
              required: true,
              message: '请输入pid ',
              trigger: 'blur'
            }
          ],
          pidName: [
            {
              required: true,
              message: '请输入pid名称 ',
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
          account: undefined,
          pid: undefined,
          pidName:undefined,
          traceObjId:'',
          useType:null,
        },
        tableKey: 0
      }
    },
    created() {
      this.getList();
      // this.getCateAll();
      this.getSysCateAll();
    },
    filters: {
      timeFormat : function(value){
        if (value!==undefined&&value!==""&&value!==null) {
         return parseTime(value,"")
        }
      },
    },
    methods: {

    /**
     * 获取所有的平台类目
     */
    getSysCateAll() {
      this.listLoading = false;
      search().then(response => {
        if (response.data.errcode == 0) {
          this.syslItems = response.data.data;
          console.log("all === ", JSON.stringify(this.syslItems));
          this.listLoading = false;
        } else {
          this.listLoading = false;
          this.$notify.error({
            title: "错误",
            message: obj.errmsg
          });
        }
      });
    },
      /**
       * 淘宝按钮
       */
      tbAccount(){
        this.listQuery.platformType = 1;
        this.getList();
      },
      /**
       * 拼多多按钮
       */
      pddAccount(){
        this.listQuery.platformType = 2;
        this.getList();
      },
      getList() {
        this.listLoading = true;
        console.log("========================",JSON.stringify(this.listQuery) )
        page(this.listQuery).then(response => {
          this.list = response.data.data.records;
          console.log("list ========== " ,JSON.stringify(this.list) )
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
          console.log("===================编辑",JSON.stringify(this.form) )
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
      handleDel(id){
        this.$confirm('此操作将永久删除该账号, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delObj(id)
              .then(response => {
                this.dialogFormVisible = false
                if (response.data.errcode==0) {
                  this.getList()
                  this.$message({
                    type: 'success',
                    message: '删除成功!'
                  });
                }else{
                  this.$notify({
                    title: '错误',
                    message: response.data.errmsg,
                    type: 'error',
                    duration: 2000
                  })
                }
              })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
      },
      create(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            this.form.platformType = this.listQuery.platformType;
            console.log("+++++++++++++++",JSON.stringify(this.form))

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
            this.form.createTime=undefined
            this.form.subTime=undefined
            this.form.updateTime=undefined

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
          account: '',
          pid: '',
          pidName:undefined
        }
      }
    }
  }
</script>

