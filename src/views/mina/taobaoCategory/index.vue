<template>
<div class="app-container calendar-list-container">
  <div class="filter-container">
    <el-button class="filter-item" :type="this.listQuery.platformType == 1? 'info' : 'primary'" @click="tbClass()">淘宝类目</el-button>
    <el-button class="filter-item" :type="this.listQuery.platformType == 2? 'info' : 'primary'" @click="pddClass()">拼多多类目</el-button>
  </div>
  <div class="filter-container">
    <el-button class="filter-item" type="primary" @click="handleCreate">添加</el-button>
  </div>
  <el-table  :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%" >
    <el-table-column label="序号" align="center"
      type="index"
      width="100px"
      :index="indexMethod">
    </el-table-column>
    <el-table-column  align="center" label="类目"> 
      <template slot-scope="scope">
         <span>{{scope.row.name}}</span>
      </template> 
    </el-table-column>
    <el-table-column  align="center" label="类目ID（cid）"> 
      <template slot-scope="scope">
        <span>{{scope.row.cid}}</span>
      </template> 
    </el-table-column>
    <el-table-column  align="center" label="平台类目"> 
      <template slot-scope="scope">
         <span>{{scope.row.categoryNames}}</span>
      </template> 
    </el-table-column>

    <el-table-column align="center" fixed="right" width="200px" label="操作">
      <template slot-scope="scope">
        <el-button size="small" type="success" @click="handleUpdate(scope.row)">编辑
        </el-button>
        <el-button size="small" type="danger" @click="handleCancel(scope.row.id)">删除
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
      <el-form-item label="类目名称" prop="name">
        <el-col :span="12">
          <el-input type="text" v-model="form.name" placeholder="如：美食"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="类目ID" prop="cid">
        <el-col :span="12">
          <el-input type="text" v-model="form.cid" placeholder="如：123454"></el-input>
        </el-col>
      </el-form-item>
      
      <el-form-item label="平台类目" prop="sysCategory">
        <el-select v-model="form.categoryMappingDtoList" multiple placeholder="选择平台类目">
          <el-option v-for="item in syslItems" :key="item.id" :label="item.title" :value="item.id"> </el-option>
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
} from "@/api/mina/taobaoCategory/index";
import { search } from "@/api/mina/category/index";
import { mapGetters } from "vuex";
import waves from "@/directive/waves/index.js"; // 水波纹指令

export default {
  name: "goods",
  directives: {
    waves
  },
  data() {
    return {
      syslItems: [],
      indexMethod: 1,
      list: null,
      total: null,
      listLoading: false,
      textMap: {
        update: "编辑",
        create: "淘宝类目添加"
      },
      dialogStatus: "",
      dialogFormVisible: false,
      listQuery: {
        page: 1,
        limit: 10,
        platformType: 1
      },
      form: {
        name: undefined,
        cid: undefined,
        categoryMappingDtoList: []
      },
      //备用数组
      categories: [],
      tableKey: 0,
      rules: {
        name: [
          {
            required: true,
            message: "请输入正确的类目名称",
            trigger: "blur"
          }
        ],
        cid: [
          {
            required: true,
            message: "请输入正确的类目ID",
            trigger: "blur"
          }
        ],
        plat: [
          {
            required: true,
            message: "请输入正确的平台类目",
            trigger: "blur"
          }
        ]
      }
    };
  },
  created() {
    this.getList();
    this.getSysCateAll();
  },
  computed: {
    ...mapGetters([])
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
    // 淘宝类目按钮
    tbClass() {
      this.textMap.create = "淘宝类目添加";
      this.listQuery.platformType = 1;
      this.getList();
    },
    //拼多多类目按钮
    pddClass() {
      this.textMap.create = "拼多多类目添加";
      this.listQuery.platformType = 2;
      this.getList();
    },
    getList() {
      this.listLoading = false;
      console.log(JSON.stringify(this.listQuery));
      page(this.listQuery).then(response => {
        if (response.data.errcode == 0) {
          this.list = response.data.data.records;

          console.log("list ============= ", JSON.stringify(this.list));

          this.total = response.data.data.total;
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
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
    },
    cancel(formName) {
      this.dialogFormVisible = false;
      this.$refs[formName].resetFields();
    },
    handleUpdate(row) {
      getObj(row.id).then(response => {
        console.log(JSON.stringify(response.data.data));

        this.form = response.data.data;
        this.categories = this.form.categoryMappingDtoList;

        this.getCategoryId(this.form.categoryMappingDtoList);

        this.dialogFormVisible = true;
        this.dialogStatus = "update";
      });
    },
    /**
     * 获取categoryMappingDtoList中的categoryId
     * 传入数组
     */
    getCategoryId(arr) {
      let newArr = [];
      for (let i of arr) {
        newArr.push(i.categoryId);
      }
      this.form.categoryMappingDtoList = newArr;
    },
    /**
     * 添加类目
     */
    create(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          console.log("============", JSON.stringify(this.form));

          var newForm = {};
          this.changeJson(this.form.categoryMappingDtoList, res => {
            console.log(JSON.stringify(res));

            newForm.name = this.form.name;
            newForm.cid = this.form.cid;
            newForm.platformType = this.listQuery.platformType;
            newForm.categoryMappingDtoList = res;

            console.log("表单值=============", JSON.stringify(newForm));

            this.dialogFormVisible = false;
            addObj(newForm).then(response => {
              if (response.data.errcode == 0) {
                this.getList();
                this.$notify({
                  title: "成功",
                  message: "创建成功",
                  type: "success",
                  duration: 2000
                });
              } else {
                this.$notify({
                  title: "错误",
                  message: response.data.errmsg,
                  type: "error",
                  duration: 2000
                });
              }
            });
          });
        } else {
          return false;
        }
      });
    },
    /**
     * 添加类目 json 转换函数
     * value : 数组
     * return :  {id="",categoryId="989719964437676033",status="1"}
     */
    changeJson(value, cb) {
      console.log(value);
      value = value || [];
      let newArr = [];
      for (let i of value) {
        let obj = {};

        obj.id = "";
        obj.categoryId = i;
        obj.status = 1;
        newArr.push(obj);
      }
      typeof cb == "function" && cb(newArr);
    },
    /**
     * 删除类目
     */
    handleCancel(id) {
      this.$confirm("此操作将永久删除该类目, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(res=>{
      delObj(id).then(response => {
        var obj = response.data;
        if (obj.errcode == 0) {
          this.getList();
          this.$notify({
            title: "成功",
            message: "删除成功",
            type: "success",
            duration: 2000
          });
        } else {
          this.$notify.error({
            title: "错误",
            message: obj.errmsg
          });
        }
      });
      })

    },
    /**
     * 修改类目 json 转换函数
     */
    updJson(oldArr, newArr) {
      let secArr = [];
      for (let i of oldArr) {
        secArr.push(i.categoryId);
      }

      oldArr.map((item, index) => {
        let Exit = newArr.includes(item.categoryId);
        if (!Exit) {
          item.status = 2;
        }
      });

      newArr.map((item, index) => {
        let Exit = secArr.includes(item);
        if (!Exit) {
          let newObj = {};
          newObj = {
            id: "",
            categoryId: item,
            status: 1,
            platformType: this.listQuery.platformType,
            thirdPartyCategoryCid: this.form.cid
          };
          oldArr.push(newObj);
        }
      });

      console.log("=======", JSON.stringify(oldArr));
      return oldArr;
    },

    update(formName) {
      const set = this.$refs;
      set[formName].validate(valid => {
        if (valid) {
          console.log("旧的数组 === ", JSON.stringify(this.categories));
          console.log(
            "新的数组 === ",
            JSON.stringify(this.form.categoryMappingDtoList)
          );

          //返回旧数组与新数组中categoryId 进行匹配之后的数组
          //新数组中新增 则旧数组中添加一条id = null status = 1 categoryId = 新cid 的对象
          //旧数组中删除一项 则将之status 改为2  不删除该对象
          let newList = this.updJson(
            this.categories,
            this.form.categoryMappingDtoList
          );

          this.form.categoryMappingDtoList = newList;

          console.log("newForm =======", JSON.stringify(this.form));

          this.dialogFormVisible = false;
          putObj(this.form).then(response => {
            var obj = response.data;
            if (obj.errcode == 0) {
              this.dialogFormVisible = false;
              this.getList();
              this.$notify({
                title: "成功",
                message: "修改成功",
                type: "success",
                duration: 2000
              });
            } else {
              this.dialogFormVisible = false;
              this.$notify.error({
                title: "错误",
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
        name: "",
        cid: "",
        categoryMappingDtoList: []
      };
    }
  }
};
</script>
