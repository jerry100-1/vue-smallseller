<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
        <el-input style="width: 200px;" class="filter-item" placeholder="属性名或属性名" v-model="listQuery.keyword"></el-input>
        <el-button class="filter-item" type="primary" icon="search" @click="handleFilter">搜索</el-button>
        <el-button class="filter-item"  v-if="copywriter_map_btn_add"  style="margin-left: 10px;" @click="handleCreate" type="primary" icon="edit">添加</el-button>
    </div>
    <el-table :data="list" :key='tableKey' v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">
      
      <el-table-column align="center" label="标题">
        <template slot-scope="scope">
        <span>
          {{title}}
        </span>
        </template>
      </el-table-column>
      
      <el-table-column align="center" label="类型">
        <template slot-scope="scope">
        <span>
          {{scope.row.type | statusFilter}}
        </span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="属性名">
        <template slot-scope="scope">
        <span>
          {{scope.row.key}}
        </span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="属性值">
        <template slot-scope="scope">
        <span>
          {{scope.row.value}}
        </span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button v-if="copywriter_map_btn_edit" size="small" type="success" @click="handleUpdate(scope.row)">编辑
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
        <el-input type="text" v-model="form.copyWriterId" style="display:none">{{id}}</el-input>
        <el-form-item label="属性名" prop="key">
          <el-input type="text" v-model="form.key"></el-input>
        </el-form-item>
        <el-form-item label="属性值" v-if="form.type==0" prop="code">
          <el-input type="text" v-model="form.value" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="属性值" v-else-if="form.type==1" prop="value">
         <el-upload
          class="avatar-uploader"
          :action="upload_url"
          :headers="token"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload">
          <img v-if="form.value" style="width:160px" :src="form.value" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        </el-form-item>
        <el-form-item label="属性类型">
          <el-select v-model="form.type" placeholder="请选择">
            <el-option
              v-for="item in typeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
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
  import {addObj,getObj,putObj,delObj} from '@/api/mina/copyWriterMap/index'
  import waves from '@/directive/waves/index.js' // 水波纹指令
  import request from '@/utils/request'
  import ElOption from "element-ui/packages/select/src/option"
  import { getToken } from '@/utils/auth' // 验权

  export default {
    components: {
      ElOption},
    name: 'copyWriter',
    directives: {
      waves
    },
    data() {
      return {
        title:"",
        upload_url: process.env.BASE_API+'/api/admin/upload/picture',
        token: {
          token:getToken()
        },
        list: null,
        total: null,
        id: 0,
        copywriter_map_btn_add: true,
        copywriter_map_btn_edit:true,
        copywriter_map_btn_del:true,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 10,
          keyword:''
        },
        typeOptions: [
          {
            label:'图片',
            value:1
          },
          {
            label:'文字',
            value:0
          }
        ],
        rules: {
          key: [
            {
              required: true,
              message: '请输入属性名',
              trigger: 'blur'
            }
          ],
          value: [
            {
              required: true,
              message: '请输入属性值',
              trigger: 'blur'
            }
          ],
          type: [
            {
              required: true,
              message: '请选择类型',
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
          copyWriterId:"",
          key: '',
          value: '',
          type: ''
        },
        tableKey: 0
      }
    },
    created() {
      this.id=this.$route.params.id;
      this.title = this.$route.params.title;
      this.getList()
    },
    filters: {
      statusFilter(status) {
        const statusMap = {
          0: '文字',
          1: '图片'
        }
        return statusMap[status]
      }
    },
    methods: {
      getList() {
        this.listLoading = true;
        request({
          url:'/api/admin/copyWriterMap/'+this.id+'/page',
          method: 'get',
          params: this.listQuery
        }).then((response) => {
          if (response.data.errcode==0) {
            this.list = response.data.data.records
            console.log(JSON.stringify(this.list))
            this.total = response.data.data.total;
            this.listLoading = false;
          }else{
            this.listLoading = false;
            this.$notify({
              title: '失败',
              message: response.data.errmsg,
              type: 'error',
              duration: 2000
            })
          }
        }).catch(()=>{
           this.$notify({
              title: '失败',
              message: '获取失败',
              type: 'error',
              duration: 2000
            })
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
      create(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            this.form.copyWriterId=this.id
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
       handleSizeChange(val) {
        this.listQuery.limit = val;
        this.getList();
      },
      handleCurrentChange(val) {
        this.listQuery.page = val;
        this.getList();
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
      handleAvatarSuccess(res, file) {
        console.log(res)
        this.form.value = res.data;
      },
      beforeAvatarUpload(file) {
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
          this.$message.error('上传图片大小不能超过 2MB!');
        }
        return isLt2M;
      },
      resetTemp() {
        this.form = {
          key: '',
          value: '',
          type: ''
        }
      }
    }
  }
</script>

<style scope>
  uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
</style>