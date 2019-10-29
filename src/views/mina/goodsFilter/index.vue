<template>
<div class="app-container calendar-list-container">
  <div class="filter-container">
    <el-button class="filter-item" type="primary" v-if="goodsFilter_btn_add" icon="search" @click="handleCreate">添加</el-button>
  </div>
  <el-table :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%" >
    <el-table-column label="序号" width="100" align="center"
      type="index"
      :index="indexMethod">
    </el-table-column>
    <!-- <el-table-column  align="center" label="类目"> 
      <template slot-scope="scope">
         <span>{{scope.row.category}}</span>
      </template> 
    </el-table-column> -->
    <el-table-column  align="center" label="推荐关键字"> 
      <template slot-scope="scope">
         <span>{{scope.row.keyword}}</span>
      </template> 
    </el-table-column>
    <el-table-column  align="center" label="销量"> 
      <template slot-scope="scope">
        <span>>={{scope.row.sale}}</span>
      </template> 
    </el-table-column>
    <el-table-column  align="center" label="佣金(利率)"> 
      <template slot-scope="scope">
        <span>>{{scope.row.commissionRate}}</span>
      </template> 
    </el-table-column>
    <el-table-column  align="center" label="券额(元)"> 
      <template slot-scope="scope">
        <span>>={{scope.row.couponPrice}}</span>
      </template> 
    </el-table-column>
    <el-table-column  align="center" label="单价(元)"> 
      <template slot-scope="scope">
        <span>{{scope.row.defaultPriceMax}}>=单价>={{scope.row.defaultPriceMin}}</span>
      </template> 
    </el-table-column>
    <el-table-column  align="center" label="券后价(元)"> 
      <template slot-scope="scope">
        <span>{{scope.row.priceMax}}>=单价>={{scope.row.priceMin}}</span>
      </template> 
    </el-table-column>
    <el-table-column  align="center" label="状态"> 
      <template slot-scope="scope">
        <el-tag v-if="scope.row.status==0" type="success">正常</el-tag>
        <el-tag v-else type="danger">禁用</el-tag>
      </template> 
    </el-table-column>
    <el-table-column align="center" fixed="right" width="200px" label="操作">
      <template slot-scope="scope">
        <el-button v-if="goodsFilter_btn_edit" size="small" type="success" @click="handleUpdate(scope.row)">编辑
        </el-button>
         <el-button v-if="goodsFilter_btn_del" size="small" type="danger" @click="handleDel(scope.row.id)">删除
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
    <el-form :inline="true" :model="form" :rules="rules" ref="form" label-width="100px">
      <!-- <el-form-item label="类目" prop="category">
        <el-select v-model="form.category" filterable remote placeholder="请输入类目" :remote-method="remoteKeywordMethod" :loading="loading">
          <el-option v-for="item in lItems" :key="item.id" :label="item.title" :value="item.title"> </el-option>
        </el-select>
      </el-form-item> -->
      <el-form-item label="推荐关键字" prop="keyword">
        <el-input type="text" v-model="form.keyword"></el-input>
      </el-form-item>
      <el-form-item label="销量" prop="sale">
        <el-input type="number" v-model="form.sale"></el-input>
      </el-form-item>
       <el-form-item label="佣金(利率)" prop="commissionRate">
        <el-input type="number" v-model="form.commissionRate"></el-input>
      </el-form-item>
      <el-form-item label="券额(元)" prop="couponPrice">
        <el-input type="number" v-model="form.couponPrice"></el-input>
      </el-form-item>
      <el-form-item label="最大单价(元)" prop="defaultPriceMax">
        <div>
          <el-input type="number"  v-model="form.defaultPriceMax"></el-input>
        </div>
      </el-form-item>
      <el-form-item label="最小单价(元)" prop="defaultPriceMin">
        <div>
          <el-input type="number"  v-model="form.defaultPriceMin"></el-input>
        </div>
      </el-form-item>
      <el-form-item label="最大券后价(元)" prop="priceMax">
        <el-input type="number" v-model="form.priceMax"></el-input>
      </el-form-item>
      <el-form-item label="最小券后价(元)" prop="priceMin">
        <el-input type="number" v-model="form.priceMin"></el-input>
      </el-form-item>
       <el-form-item v-if="dialogStatus == 'update'" label="状态">
        <el-select v-model="form.status" placeholder="请选择">
          <el-option
            v-for="item in statusOptions"
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
import {
  page,
  putObj,
  addObj,
  delObj,
  getObj
} from '@/api/mina/goodsFilter/index';
import {
  search
} from '@/api/mina/category/index';
import { mapGetters } from 'vuex';
import waves from '@/directive/waves/index.js' // 水波纹指令

export default {
  name: 'goodFilter',
  directives: {
    waves,
  },
  data() {
    var validatePrice = (rule, value, callback) => {
      if (value === ''||value === undefined) {
        callback(new Error('请输入券后价'));
      }else{
        if ( this.form.priceMin>value) {
          callback(new Error('最大券后价必须大于最小值'));
        }
      }
      callback();
    };
    var validateDefaultPrice = (rule, value, callback) => {
      if (value === '' ||value === undefined) {
        callback(new Error('请输入单价'));
      }else{
        if (this.form.defaultPriceMin>value) {
          callback(new Error('最大单价必须大于最小值'));
        }
      }
      callback();
    };
    return {
      indexMethod:1,
      // lItems: [],
      list: null,
      total: null,
      listLoading: false,
      // loading: false,
      goodsFilter_btn_del:true,
      goodsFilter_btn_add:true,
      goodsFilter_btn_edit:true,
      listQuery: {
        page: 1,
        limit: 10,
        keyword:undefined,
      },
     
      statusOptions:[
        {
          label:'正常',
          value:0
        },
        {
          label:'禁用',
          value:1
        }
      ],
      dialogStatus: '',
      dialogFormVisible: false,
      textMap: {
          update: '编辑',
          create: '添加'
      },
      form: {
        // category:"",
        keyword:"",
        status: undefined,
        couponPrice: undefined,
        commissionRate:undefined,
        sale:undefined,
        defaultPriceMin:undefined,
        defaultPriceMax:undefined,
        priceMin:undefined,
        priceMax:undefined,
      },
      rules: {
        keyword: [
          {
            required: true,
            message: '请输入关键字',
            trigger: 'blur'
          }
        ],
        couponPrice: [
          {
            required: true,
            message: '请输入券额',
            trigger: 'blur'
          }
        ],
        commissionRate: [
          {
            required: true,
            message: '请输入佣金比率',
            trigger: 'blur'
          }
        ],
        sale: [
          {
            required: true,
            message: '请输入销量',
            trigger: 'blur'
          }
        ],
        defaultPriceMin: [
          {
            required: true,
            message: '请输入单价',
            trigger: 'blur'
          }
        ],
        defaultPriceMax: [
          {required: true, validator: validateDefaultPrice, trigger: 'blur' }
        ],
        priceMax: [
          {required: true, validator: validatePrice, trigger: 'blur' }
        ],
        priceMin: [
          {
            required: true,
            message: '请输入券后价',
            trigger: 'blur'
          }
        ]
      },
      tableKey: 0
    }
  },
  filters: {
    type : function(value){
    
    }
  },
  created() {
    this.getList();
  },
  computed: {
    ...mapGetters([
    ])
  },
  methods: {
    getList() {
      this.listLoading = false;
      console.log(this.listQuery)
      page(this.listQuery)
        .then(response => {
          if (response.data.errcode==0) {
            this.list = response.data.data.records;
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
        this.resetTemp()
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
      },
    handleUpdate(row) {
      getObj(row.id).then(response => {
        this.form = response.data.data;
        // let keyArr = this.form.keyword.split(",")
        // this.keywords = keyArr
        // console.log(keyArr)
        this.dialogFormVisible = true;
        this.dialogStatus = 'update';
      });
    },
    handleAvatarSuccess(res, file) {
      console.log(res)
      this.form.img = res.data;
    },
    beforeAvatarUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!');
      }
      return isLt2M;
    },
    cancel(formName) {
      this.dialogFormVisible = false
      this.$refs[formName].resetFields()
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
      }, update(formName) {
        const set = this.$refs;
        set[formName].validate(valid => {
          if (valid) {
            this.dialogFormVisible = false;
            this.form.createTime=undefined
            this.form.updateTime=undefined
            // let keyStr = ""
            // for(let i = 0 ; i<this.keywords.length;i++){
            //   if(i==this.keywords.length-1){
            //     keyStr=keyStr+this.keywords[i]
            //   }else{
            //     keyStr=keyStr+this.keywords[i]+","
            //   }
            // }
            // console.log(keyStr)
            // this.form.keyword=keyStr;
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
      }, handleDel(id){
        this.$confirm('此操作将永久删除该条件, 是否继续?', '提示', {
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
    resetTemp() {
      this.form = {
        // category:"",
        keyword:"",
        status: undefined,
        couponPrice: undefined,
        commissionRate:undefined,
        sale:undefined,
        defaultPriceMin:undefined,
        defaultPriceMax:undefined,
        priceMin:undefined,
        priceMax:undefined,
      }
    },
    remoteKeywordMethod(query) {
      if (query !== '') {
        this.loading = true;
        this.loading = false;
        search({
          keyword: query
        }).then(response => {
          const obj = response.data;
          if (obj.errcode===0) {
            this.lItems = obj.data;
            this.loading = false;
          }else{
            this.$notify.error({
              title: '错误',
              message: obj.errmsg
            });
         }   
        });
      } else {
        this.lItems = [];
      }
    },
  }
}
</script>
