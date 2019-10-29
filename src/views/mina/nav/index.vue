<template>
<div class="app-container calendar-list-container">
  <div class="filter-container">
    <el-select v-model="listQuery.code" clearable placeholder="请选择" class="filter-item" @change="searchOver">
      <el-option
        v-for="item in sections"
        :key="item.id"
        :label="item.title"
        :value="item.code"
        >
      </el-option>
    </el-select>

    <el-button class="filter-item" type="primary" @click="handleCreate">添加活动列表</el-button>
    <el-button class="filter-item" :type="this.tableShow == 1? 'info':'warning'" @click="tableShows(1)">活动列表</el-button>

    <el-button class="filter-item" :type="this.tableShow == 2? 'info':'warning'" @click="tableShows(2)">区域管理</el-button>
    
  </div>
  <!-- 区域管理列表 -->
  <div class="filter-container" v-if="this.tableShow == 2">
    <el-button class="filter-item" type="primary" @click="createSection">创建区域</el-button>
  </div>
  <el-table v-if="this.tableShow == 2"  :key='tableKey' :data="sections" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%" >
    <el-table-column label="序号" align="center"
      type="index"
      :index="indexMethod">
    </el-table-column>
    <el-table-column  align="center" label="展现区域名称"> 
      <template slot-scope="scope">
        <el-input v-show="scope.row.edit" size="small" v-model="scope.row.title"></el-input>
        <span v-show="!scope.row.edit">{{scope.row.title}}</span>
      </template> 
    </el-table-column>
    <el-table-column  align="center" label="code参数"> 
      <template slot-scope="scope">
        <el-input v-show="scope.row.edit" size="small" v-model="scope.row.code"></el-input>
        <span v-show="!scope.row.edit">{{scope.row.code}}</span>
      </template> 
    </el-table-column>
    <el-table-column align="center" fixed="right"  label="操作">
        <template slot-scope="scope">
          <!-- 编辑 -->
          <el-button v-show='!scope.row.edit' type="primary" @click='scope.row.edit=true' size="small" icon="edit">编辑</el-button>
          <el-button v-show='scope.row.edit' type="success" @click='finished(scope.row)' size="small" icon="check">完成</el-button>
          <!-- 删除 -->
          <el-button size="small" type="danger" @click="deletType(scope.row.id)">删除
          </el-button>
        </template>
      </el-table-column>
  </el-table>
  <!-- 列表显示列表 -->
  <el-table v-if="this.tableShow == 1"  :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%" >
    <el-table-column label="序号" align="center"
      type="index"
      :index="indexMethod">
    </el-table-column>
    <el-table-column  align="center" label="活动图片"> 
      <template slot-scope="scope">
        <img v-if="scope.row.imgUrl" :src="scope.row.imgUrl" style="width:80px" alt="">
        <span v-else>暂无图片</span>
      </template> 
    </el-table-column>
    <el-table-column  align="center" label="code参数"> 
      <template slot-scope="scope">
        <span>{{scope.row.code}}</span>
      </template> 
    </el-table-column>
    <el-table-column  align="center" label="活动名称"> 
      <template slot-scope="scope">
        <span>{{scope.row.title}}</span>
      </template> 
    </el-table-column>
    <el-table-column  align="center" label="类目排序"> 
      <template slot-scope="scope">
        <span>{{scope.row.sortNum}}</span>
      </template> 
    </el-table-column>
    <el-table-column  align="center" label="跳转协议"> 
      <template slot-scope="scope">
        <span>{{scope.row.scheme}}</span>
      </template> 
    </el-table-column>

    <el-table-column  align="center" label="展现区域"> 
      <template slot-scope="scope">
        <span>{{scope.row.typeName }}</span>
      </template> 
    </el-table-column>
    <el-table-column align="center" fixed="right" width="200px" label="操作">
        <template slot-scope="scope">
          <el-button size="small" type="success" @click="handleUpdate(scope.row)">修改
          </el-button>
           <el-button size="small" type="danger" @click="handleDel(scope.row.id)">删除
          </el-button>
        </template>
      </el-table-column>
  </el-table>

  <div v-show="!listLoading" class="pagination-container">
    <!-- <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="listQuery.page"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="listQuery.limit"
      layout="total,sizes, prev, pager, next,jumper"
      :total="total">
    </el-pagination> -->
  </div>
  <!-- 添加按钮弹窗 -->
  <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
    <el-form :model="form" :rules="rules" ref="form" label-width="100px">
      <el-form-item label="展现区域">
        <el-select v-model="form.code" placeholder="请选择">
          <el-option
            v-for="item in sections"
            :key="item.id"
            :label="item.title"
            :value="item.code">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="图片" prop="img">
        <el-upload
          class="avatar-uploader"
          :action="upload_url"
          :headers="token"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload">
          <img v-if="form.img" style="width:160px" :src="form.img" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      
      <el-form-item label="活动名称" prop="title" >
        <el-input type="text" v-model="form.title"  placeholder="请输入前端展现名称"></el-input>
      </el-form-item>
      <el-form-item label="跳转协议" prop="scheme">
        <el-input type="text" v-model="form.scheme" placeholder="H5、小程序等"></el-input>
      </el-form-item>
      <el-form-item label="活动排序" prop="sort">
        <el-input type="number" v-model="form.sortNum" placeholder="数字越小排名越靠前"></el-input>
      </el-form-item>

    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel('form')">取 消</el-button>
      <el-button v-if="dialogStatus=='create'" type="primary" @click="create('form')">确 定</el-button>
      <el-button v-else type="primary" @click="update('form')">修 改</el-button>
    </div>
  </el-dialog >
  <!-- 创建区域弹窗 -->
  <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogCreateVisible">
    <el-form :model="creation" ref="creation" label-width="100px">
      <el-form-item label="展现区域名称" prop="secname">
        <el-input type="text" v-model="creation.title"></el-input>
      </el-form-item>
      <el-form-item label="code参数" prop="codenum">
        <el-input type="text" v-model="creation.code" ></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel('creation')">取 消</el-button>
      <el-button type="primary" @click="createType('creation')">确 定</el-button>
    </div>
  </el-dialog>
</div>
</template>

<script>
import {
  page,
  addType,
  getTypeList,
  addObj,
  delObj,
  putObj,
  putType,
  delType
} from "@/api/mina/nav/index";
import { mapGetters } from "vuex";
import waves from "@/directive/waves/index.js"; // 水波纹指令
import { getToken } from "@/utils/auth"; // 验权

export default {
  name: "banner",
  directives: {
    waves
  },
  data() {
    return {
      //显示的表单 1 活动列表 2区域列表
      tableShow: 1,
      creation: {
        title: "",
        code: ""
      },
      upload_url: process.env.BASE_API + "/api/admin/upload/picture",
      token: {
        token: getToken()
      },
      indexMethod: 1,
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        code: "taobao_index"
      },
      sections: [
        {
          title: "测试",
          code: "test",
          id: 1
        }
      ],

      rules: {
        // type: [
        //   {
        //     required: true,
        //     message: '请输入类型',
        //     trigger: 'blur'
        //   }
        // ],
      },
      dialogStatus: "",
      dialogFormVisible: false,
      dialogCreateVisible: false,
      textMap: {
        update: "编辑",
        create: "添加",
        section: "创建区域"
      },
      form: {
        img: "",
        code: "",
        scheme: "",
        sortNum: null,
        title: ""
      },
      tableKey: 0
    };
  },

  created() {
    this.getList();
    this.typeList();
  },
  computed: {
    ...mapGetters([])
  },
  methods: {
    //区域编辑完成
    finished(e) {
      e.edit = false;
      console.log(JSON.stringify(e));
      let type = {
        id: e.id,
        code: e.code,
        title: e.title
      };
      putType(type)
        .then(response => {
          console.log(response);
          if (response.data.errcode == 0) {
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
        })
        .catch(err => {
          console.log(err);
        });
    },
    //删除区域ID
    deletType(e) {
      this.$confirm("此操作将永久删除该区域ID, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(res => {
        delType(e)
          .then(response => {
            console.log(response);
            if (response.data.errcode == 0) {
              this.typeList();
              this.$notify({
                title: "成功",
                message: "删除成功",
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
          })
          .catch(err => {
            console.log(err);
          });
      });
    },
    searchOver(e) {
      console.log(e);
      this.handleFilter();
    },
    tableShows(e) {
      console.log(e);
      this.tableShow = e;
    },
    typeList() {
      getTypeList().then(response => {
        let sections = response.data.data;
        for (let i of sections) {
          i.edit = false;
        }
        this.sections = sections;
      });
    },
    getList() {
      this.listLoading = true;
      console.log(this.listQuery);
      page(this.listQuery).then(response => {
        if (response.data.errcode == 0) {
          this.list = response.data.data;
          console.log(JSON.stringify(this.list));
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
    /**
     * 搜索
     */
    handleFilter() {
      this.getList();
    },
    // handleSizeChange(val) {
    //   this.listQuery.limit = val;
    //   this.getList();
    // },
    // handleCurrentChange(val) {
    //   this.listQuery.page = val;
    //   this.getList();
    // },
    /**
     * 添加按钮
     */
    handleCreate() {
      this.resetTemp();
      this.typeList();
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
    },
    /**
     * 创建区域按钮
     */
    createSection() {
      this.resetTemp();
      this.dialogStatus = "section";
      this.dialogCreateVisible = true;
    },
    /**
     * 点击修改按钮
     */
    handleUpdate(row) {
      console.log(JSON.stringify(row));
      this.dialogFormVisible = true;
      this.form.code = row.code;
      this.form.img = row.imgUrl;
      this.form.sortNum = row.sortNum;
      this.form.scheme = row.scheme;
      this.form.title = row.title;
      this.form.id = row.id;
    },
    handleAvatarSuccess(res, file) {
      console.log(res);
      this.form.img = res.data;
    },
    beforeAvatarUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$message.error("上传图片大小不能超过 2MB!");
      }
      return isLt2M;
    },
    cancel(formName) {
      this.dialogFormVisible = false;
      this.dialogCreateVisible = false;
      this.$refs[formName].resetFields();
    },
    /**
     * 创建区域
     */
    createType(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          console.log(this.creation);
          addType(this.creation).then(response => {
            this.dialogCreateVisible = false;
            if (response.data.errcode == 0) {
              this.typeList();
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
        } else {
          return false;
        }
      });
    },
    /**
     * 字段转换函数 将form中img转换成imgUrl
     * @params Object
     */
    changeStr(obj) {
      let newForm = {};
      newForm.imgUrl = obj.img;
      newForm.code = obj.code;
      newForm.scheme = obj.scheme;
      newForm.sortNum = obj.sortNum;
      newForm.title = obj.title;

      return newForm;
    },
    /**
     * 创建导航
     */
    create(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          console.log(JSON.stringify(this.form));

          let newForm = this.changeStr(this.form);
          addObj(newForm).then(response => {
            this.dialogFormVisible = false;
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
        } else {
          return false;
        }
      });
    },
    /**
     * 修改导航
     */
    update(formName) {
      const set = this.$refs;
      set[formName].validate(valid => {
        if (valid) {
          this.dialogFormVisible = false;
          let newForm = this.changeStr(this.form);
          newForm.id = this.form.id;
          putObj(newForm).then(response => {
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
    handleDel(id) {
      this.$confirm("此操作将永久删除该导航, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          delObj(id).then(response => {
            this.dialogFormVisible = false;
            if (response.data.errcode == 0) {
              this.getList();
              this.$message({
                type: "success",
                message: "删除成功!"
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
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },

    resetTemp() {
      this.form = {
        img: undefined,
        code: "",
        scheme: "",
        sortNum: "",
        title: "",
        id: ""
      };
      this.creation = {
        title: undefined,
        code: undefined
      };
    }
  }
};
</script>
