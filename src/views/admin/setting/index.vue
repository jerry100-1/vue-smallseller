<template>
<div class="app-container calendar-list-container">
  <div class="filter-container">
    <el-input style="width: 200px;" class="filter-item" placeholder="标题或标识" v-model="listQuery.keyword"> </el-input>
    <el-button class="filter-item" type="primary" icon="search" @click="handleFilter">搜索</el-button>
    <el-button class="filter-item"  v-if="settingManager_btn_add"  style="margin-left: 10px;" @click="handleCreate" type="primary" icon="edit">添加</el-button>
  </div>
  <div class="filter-container">
    <el-button class="filter-item"  :type="listQuery.type == 1? 'info':'primary'" @click="changePeizhi(1)">业务配置</el-button>
    <el-button class="filter-item"  :type="listQuery.type == 2? 'info':'primary'" @click="changePeizhi(2)">安卓配置</el-button>
    <el-button class="filter-item"  :type="listQuery.type == 3? 'info':'primary'" @click="changePeizhi(3)">IOS配置</el-button>
    <el-button class="filter-item"  :type="listQuery.type == 4? 'info':'primary'" @click="changePeizhi(4)">后台系统配置</el-button>
    <el-button class="filter-item"  :type="listQuery.type == 5? 'info':'primary'" @click="changePeizhi(5)">小程序配置</el-button>
  </div>
  <el-table :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">
    <el-table-column label="序号" width="100" align="center"
      type="index"
      :index="indexMethod">
    </el-table-column>
    <el-table-column  align="center" label="名称"> 
      <template slot-scope="scope">
        <span>{{scope.row.title}}</span>
      </template> 
    </el-table-column>
    <el-table-column  align="center" label="标识码"> 
      <template slot-scope="scope">
        <span>{{scope.row.code}}</span>
      </template> 
    </el-table-column>
    <el-table-column  align="center" label="参数"> 
      <template slot-scope="scope">
        <span>{{scope.row.param }}</span>
      </template> 
    </el-table-column>
    <el-table-column  align="center" label="备注"> 
      <template slot-scope="scope">
        <span>{{scope.row.sdesc}}</span>
      </template> 
    </el-table-column>
    <el-table-column  align="center" label="最后更新时间"> 
      <template slot-scope="scope">
        <span>{{scope.row.updateTime | timeFormat}}</span>
      </template> 
    </el-table-column>
    <el-table-column  align="center" label="最后更新人"> 
      <template slot-scope="scope">
        <span>{{scope.row.updateName}}</span>
      </template> 
    </el-table-column>
    <el-table-column align="center" fixed="right" label="操作" width="150"> 
      <template slot-scope="scope">
        <el-button v-if="settingManager_btn_edit" size="small" type="success" @click="handleUpdate(scope.row)">编辑
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
      <el-form-item label="名称" prop="title">
        <el-input v-model="form.title" placeholder="请输入标题"></el-input>
      </el-form-item>

      <el-form-item label="类型" prop="type">
        <el-select v-model="form.type" placeholder="选择配置">
          <el-option v-for="item in peizhi" :key="item.id" :label="item.title" :value="item.id"> </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="标识码" prop="code">
        <el-input v-if="dialogStatus == 'create'" v-model="form.code" placeholder="请输入标识码"></el-input>
        <el-input v-else v-model="form.code" placeholder="请输入标识码" readonly></el-input>
      </el-form-item>
      
      <el-form-item  label="参数" prop="param">
        <el-input  v-model="form.param"></el-input>
      </el-form-item>
      <el-form-item label="描述">
        <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 5}" placeholder="请输入内容" v-model="form.sdesc"> </el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel('form')">取 消</el-button>
      <el-button v-if="dialogStatus=='create'" type="primary" @click="create('form')">确 定</el-button>
      <el-button v-else type="primary" @click="update('form')">确 定</el-button>
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
} from '@/api/admin/setting/index';
import { mapGetters } from 'vuex';
import waves from '@/directive/waves/index.js' // 水波纹指令
import { parseTime } from "@/utils/index"; 

export default {
  name: 'setting',
  directives: {
    waves,
  },
  data() {
    return {
      //配置选择
      peizhi:[
        {
          title: "业务配置",
          id:1
        },
        {
          title:"安卓配置",
          id:2
        },
        {
          title:"IOS配置",
          id:3
        },
        {
          title:"后台系统配置",
          id:4
        },
        {
          title:"小程序配置",
          id:5
        },
      ],
      indexMethod:1,
      form: {
        title: undefined,
        code: undefined,
        param: undefined,
        sdesc: undefined,
        type:undefined,
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
            message: '请输入标识码',
            trigger: 'blur'
          },          
        ],
        param: [
          {
            required: true,
            message: '请输入参数',
            trigger: 'blur'
          }
        ]
      },
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        keyword: '',
        type : 1
      },
     
      dialogFormVisible: false,
      dialogStatus: '',
      settingManager_btn_edit: true,
      settingManager_btn_del: true,
      settingManager_btn_add: true,
      textMap: {
        update: '编辑',
        create: '创建'
      },
      tableKey: 0
    }
  },
  created() {
    this.getList();
  },
  computed: {
    ...mapGetters([
    ])
  },
  filters:{
    timeFormat: function(value) {
      if (value !== undefined && value !== "" && value !== null) {
        return parseTime(value, "");
      }
    },
  },
  methods: {
    changePeizhi(e){
      this.listQuery.type = e;
      this.getList();
    },
    getList() {
      this.listLoading = true;
      page(this.listQuery)
        .then(response => {
          if (response.data.errcode==0) {
            this.list = response.data.data.records;
            console.log("+++++",JSON.stringify(this.list))
            this.total = response.data.data.total;
            this.listLoading = false;
          }else{
            this.listLoading = false;
            this.$notify.error({
              title: '错误',
              message: obj.errmsg
            });
          }
        })
    },
    handleFilter() {
      this.getList();
    },
    handleSizeChange(val) {
      this.listQuery.limit = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.listQuery.page = val;
      this.getList();
    },
    handleCreate() {
      this.resetTemp();
      this.dialogStatus = 'create';
      this.dialogFormVisible = true;
    },
    handleUpdate(row) {
      getObj(row.id)
        .then(response => {
          this.form = response.data.data;
          this.dialogFormVisible = true;
          this.dialogStatus = 'update';
        });
    },
    create(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          addObj(this.form)
            .then((response) => {
              var obj = response.data;
              if (obj.errcode==0) {
                this.dialogFormVisible = false;
                this.getList();
                this.$notify({
                  title: '成功',
                  message: '创建成功',
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
            })
        } else {
          return false;
        }
      });
    },
    cancel(formName) {
      this.dialogFormVisible = false;
      this.$refs[formName].resetFields();
    },
    update(formName) {
      const set = this.$refs;
      set[formName].validate(valid => {
        if (valid) {
          this.dialogFormVisible = false;
          this.form.updateTime = undefined;
          this.form.createTime = undefined;
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
        title: undefined,
        code: undefined,
        param: undefined,
        sdesc: undefined
      };
    }
  }
}
</script>
