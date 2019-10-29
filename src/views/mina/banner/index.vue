<template>
<div class="app-container calendar-list-container">
  <div class="filter-container">
    <el-select v-model="listQuery.typeValue" clearable placeholder="请选择" class="filter-item" @change="searchOver">
      <el-option
        v-for="item in bannerList"
        :key="item.id"
        :label='item.title + "("+item.typeCode+")"'
        :value="item.typeCode"
        >
      </el-option>
    </el-select>
    <el-button class="filter-item" type="primary" @click="handleCreate">添加广告banner</el-button>
    <el-button class="filter-item" :type="listType == 1? 'info' : 'primary'" @click="showList(1)">广告列表</el-button>
    <el-button class="filter-item" :type="listType == 2? 'info' : 'primary'"  @click="showList(2)">广告位管理</el-button>
  </div>
  <div class="filter-container" v-if="listType == 2">
    <el-button class="filter-item" type="primary" @click="createAd">创建广告位</el-button>
  </div>
  <!-- 创建广告位 -->
  <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogCreateVisible">
    <el-form :model="creation" ref="creation" label-width="100px">
      <el-form-item label="广告位名称" prop="secname">
        <el-input type="text" v-model="creation.title"></el-input>
      </el-form-item>
      <el-form-item label="code参数" prop="codenum">
        <el-input type="text" v-model="creation.typeCode" ></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel('creation')">取 消</el-button>
      <el-button type="primary" @click="createType('creation')">确 定</el-button>
    </div>
  </el-dialog>
  <!-- 广告位列表 -->
    <el-table v-if="listType == 2"  :key='tableKey' :data="bannerList" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%" >
    <el-table-column label="序号" align="center"
      type="index"
      :index="indexMethod">
    </el-table-column>

    <el-table-column  align="center" label="广告位名称"> 
      <template slot-scope="scope">
        <el-input v-show="scope.row.edit" size="small" v-model="scope.row.title"></el-input>
        <span v-show="!scope.row.edit">{{scope.row.title}}</span>
      </template> 
    </el-table-column>
 
    <el-table-column  align="center" label="code参数"> 
      <template slot-scope="scope">
        <el-input v-show="scope.row.edit" size="small" v-model="scope.row.typeCode"></el-input>
        <span v-show="!scope.row.edit">{{scope.row.typeCode}}</span>
      </template> 
    </el-table-column>

    <el-table-column align="center" fixed="right" label="操作">
        <template slot-scope="scope">
          <el-button v-show='!scope.row.edit' type="primary" @click='scope.row.edit=true' size="small" >编辑</el-button>
          <el-button v-show='scope.row.edit' type="success" @click='finished(scope.row)' size="small" >完成</el-button>

          <el-button size="small" type="danger" @click="deleteRow(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
  </el-table>
  <!-- 广告列表 -->
  <el-table v-else  :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%" >
    <el-table-column label="序号" align="center"
      type="index"
      :index="indexMethod">
    </el-table-column>
    <el-table-column  align="center" label="标题"> 
      <template slot-scope="scope">
        <span>{{scope.row.title}}</span>
      </template> 
    </el-table-column>
    <el-table-column  align="center" label="广告图"> 
      <template slot-scope="scope">
        <img :src="scope.row.img" style="width:80px" alt="">
      </template> 
    </el-table-column>
    <el-table-column  align="center" label="调用页面"> 
      <template slot-scope="scope">
        <span>{{scope.row.type}}</span>
      </template> 
    </el-table-column>
    <el-table-column  align="center" label="跳转方式"> 
      <template slot-scope="scope">
        <span>{{scope.row.jumpType | jumpType}}</span>
      </template> 
    </el-table-column>
    <el-table-column  align="center" label="url"> 
      <template slot-scope="scope">
        <span>{{scope.row.url}}</span>
      </template> 
    </el-table-column>
    <el-table-column  align="center" label="参数"> 
      <template slot-scope="scope">
        <span>{{scope.row.params}}</span>
      </template> 
    </el-table-column>
    <el-table-column  align="center" label="状态"> 
      <template slot-scope="scope">
        <el-tag v-if="scope.row.status===0">
          正常
        </el-tag>
        <el-tag v-else>
          禁用
        </el-tag>
      </template> 
    </el-table-column>
    <el-table-column  align="center" label="添加人"> 
      <template slot-scope="scope">
        <span>{{scope.row.createName }}</span>
      </template> 
    </el-table-column>
    <el-table-column align="center" fixed="right" width="200px" label="操作">
        <template slot-scope="scope">
          <el-button  type="success" @click="handleUpdate(scope.row)">编辑
          </el-button>
           <el-button  type="danger" @click="handleDel(scope.row.id)">删除
          </el-button>
        </template>
      </el-table-column>
  </el-table>

  <div v-if="listType == 1" v-show="!listLoading" class="pagination-container">
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
      <el-form-item label="所属广告位" prop="type">
        <el-select v-model="form.type" placeholder="请选择">
          <el-option
            v-for="item in bannerList"
            :key="item.value"
            :label="item.label"
            :value="item.typeCode">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="标题" prop="title">
        <el-input type="text" v-model="form.title"></el-input>
      </el-form-item>
      <el-form-item label="url" prop="url">
        <el-input type="text" v-model="form.url" ></el-input>
      </el-form-item>
        <el-form-item label="app协议" prop="appUrl">
            <el-input type="text" v-model="form.appUrl" ></el-input>
        </el-form-item>
      <el-form-item label="参数" prop="params">
        <el-input type="text" v-model="form.params" ></el-input>
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
      <el-form-item label="跳转方式">
        <el-select v-model="form.jumpType" placeholder="请选择">
          <el-option
            v-for="item in jumpTypeOptions"
            :key="item.id"
            :label="item.title"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="排序" prop="type">
        <el-input type="number" v-model="form.orderNum" ></el-input>
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
  getObj,
  bannerPage,
  bannerAdd,
  bannerPut,
  bannerDel
} from "@/api/mina/banner/index";
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
      creation: {
        title: "",
        typeCode: ""
      },
      adver: [],
      listType: 1, //广告列表和广告位管理的列表切换
      upload_url: process.env.BASE_API + "/api/admin/upload/picture",
      token: {
        token: getToken()
      },
      indexMethod: 1,
      list: null,
      total: null,
      bannerTotal:null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        typeValue:"active"
      },
      bannerQuery: {
        page: 1,
        limit: 50
      },
      bannerList:null,
      statusOptions: [
        {
          label: "正常",
          value: 0
        },
        {
          label: "禁用",
          value: 1
        }
      ],
      jumpTypeOptions: [
        {
          label: "小程序",
          value: 0
        },
        {
          label: "APP",
          value: 1
        },
        {
          label: "H5页面",
          value: 2
        },
        {
          label: "客服按钮",
          value: 3
        },
        {
          label: "外部小程序",
          value: 4
        }
      ],
      rules: {
        title: [
          {
            required: true,
            message: "请输入标题",
            trigger: "blur"
          }
        ],
        url: [
          {
            required: true,
            message: "请输入url",
            trigger: "blur"
          }
        ],
        img: [
          {
            required: true,
            message: "请上传图片",
            trigger: "blur"
          }
        ],
        type: [
          {
            required: true,
            message: "请输入类型",
            trigger: "blur"
          }
        ],
        orderNum: [
          {
            required: true,
            message: "请输入排序",
            trigger: "blur"
          }
        ],
        jumpType: [
          {
            required: true,
            message: "请选择跳转方式",
            trigger: "blur"
          }
        ]
      },
      dialogStatus: "",
      dialogFormVisible: false,
      dialogCreateVisible: false,
      textMap: {
        update: "编辑",
        create: "添加",
        addAd: "创建广告位"
      },
      form: {
        title: "",
        url: "",
        img: undefined,
        params: "",
        jumpType: "",
        orderNum: "",
        status: "",
        type: ""
      },
      tableKey: 0
    };
  },
  filters: {
    jumpType: function(value) {
      if (value == -1) {
        return "未定义跳转方式";
      } else if (value == 0) {
        return "小程序";
      } else if (value == 1) {
        return "APP";
      } else if (value == 2) {
        return "H5页面";
      } else if (value == 3) {
        return "客服按钮";
      } else if (value == 4) {
        return "外部小程序";
      }
    }
  },
  created() {
    this.getList();
    this.getBannerList();
  },
  computed: {
    ...mapGetters([])
  },
  methods: {
    //删除
    deleteRow(e){
      this.$confirm("此操作将永久删除该区域ID, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(res => {
        bannerDel(e)
          .then(response => {
            console.log(this.toJson(response) );
            if (response.data.errcode == 0) {
              this.getBannerList();
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
    //广告位编辑完成
    finished(e) {
      e.edit = false;
      console.log(JSON.stringify(e,null,4));
      let type = {
        id: e.id,
        typeCode: e.typeCode,
        title: e.title
      };
      bannerPut(type)
        .then(response => {
          console.log( this.toJson(response) );
          if (response.data.errcode == 0) {
            this.$notify({
              title: "成功",
              message: "修改成功",
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
    resetCreation(){
      this.creation = {
        title: "",
        typeCode: ""
      }
    },
    createType() {
      const form = this.creation;
      bannerAdd(form)
        .then(res => {
          // console.log(this.toJson(res));
          if (res.data.errcode == 0) 
          {
            this.getBannerList();
            this.$notify({
              title: "成功",
              message: "创建成功",
              type: "success",
              duration: 2000
            });
          }
          else
          {
            this.$notify.error({
              title: "错误",
              message: res.data.errmsg
            });
          }
          this.dialogCreateVisible = false;
        })
        .catch(err => {
          console.log(err);
        });
    },
    createAd() {
      this.resetCreation();
      this.dialogStatus = "addAd";
      this.dialogCreateVisible = true;
    },
    toJson(obj) {
      console.log(JSON.stringify(obj, null, 4));
    },
    searchOver(e) {
      this.handleFilter();
    },
    getBannerList() {
      let query = this.bannerQuery;
      bannerPage(query)
        .then(res => {
          console.log(this.toJson(res));
          const bannerList = res.data.data.records;
          for(let i of bannerList){
            i.edit = false;
          }
          if(res.data.errcode == 0)
          {
            this.bannerList = res.data.data.records;
            this.bannerTotal = response.data.data.total;
          }
          else 
            this.$notify.error({
              title: "错误",
              message: res.data.errmsg
            });
            
        })
        .catch(err => {
          console.log(err);
        });
    },
    getList() {
      this.listLoading = true;
      console.log(this.listQuery);
      page(this.listQuery).then(response => {
        if (response.data.errcode == 0) {
          this.list = response.data.data.records;
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
    //切换列表
    showList(e) {
      this.listType = e;
    
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
    handleUpdate(row) {
      getObj(row.id).then(response => {
        this.form = response.data.data;
        console.log(this.form);
        this.dialogFormVisible = true;
        this.dialogStatus = "update";
      });
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
    create(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          addObj(this.form).then(response => {
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
    update(formName) {
      const set = this.$refs;
      set[formName].validate(valid => {
        if (valid) {
          this.dialogFormVisible = false;
          this.form.createTime = undefined;
          this.form.updateTime = undefined;
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
    handleDel(id) {
      this.$confirm("此操作将永久删除该广告, 是否继续?", "提示", {
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
        title: "",
        url: "",
        img: "",
        params: "",
        jumpType: "",
        orderNum: "",
        status: "",
        type: ""
      };
    }
  }
};
</script>
