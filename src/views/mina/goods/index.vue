<template>
<div class="app-container calendar-list-container">
  <div class="filter-container">
    <el-input style="width: 200px;" class="filter-item" placeholder="商品名" v-model="listQuery.keyword"></el-input>
    <el-button class="filter-item" type="primary" @click="handleFilter">搜索</el-button>

    
  </div>
  <el-button  type="success" @click="putIn">导入</el-button>
  <el-button  :type="this.listQuery.platformType == null?'info':'primary'" style="margin-bottom:10px;" @click="goodsType('all')">全部</el-button>
  <el-button  :type="this.listQuery.platformType == 1?'info':'primary'" @click="goodsType('tb')">淘宝商品</el-button>
  <el-button  :type="this.listQuery.platformType == 2?'info':'primary'" @click="goodsType('pdd')">拼多多商品</el-button>
  <el-button  type="primary" @click="addGoodsItem">添加商品（点击）</el-button>

  <el-table :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%" >
    <el-table-column  align="center" label="商品"> 
      <template slot-scope="scope">
        <img style="width:80px;" :src="scope.row.image" alt="">
      </template> 
    </el-table-column>
    <el-table-column  align="center" label="标题"> 
      <template slot-scope="scope">
        <span>{{scope.row.title}}</span>
      </template> 
    </el-table-column>
    <el-table-column  align="center" label="销量"> 
      <template slot-scope="scope">
        <span>{{scope.row.sale}}</span>
      </template> 
    </el-table-column>
    <el-table-column  align="center" label="佣金比率"> 
      <template slot-scope="scope">
        <span>{{scope.row.commissionRate}}</span>
      </template> 
    </el-table-column>
    <el-table-column  align="center" label="收入比率"> 
      <template slot-scope="scope">
        <span>{{scope.row.incomeRate}}</span>
      </template> 
    </el-table-column>
    <el-table-column  align="center" label="券额"> 
      <template slot-scope="scope">
        <span>{{scope.row.couponPrice }}</span>
      </template> 
    </el-table-column>
    <el-table-column  align="center" label="单价"> 
      <template slot-scope="scope">
        <span>{{scope.row.costPrice}}</span>
      </template> 
    </el-table-column>
    <el-table-column  align="center" label="是否显示"> 
      <template slot-scope="scope">
        <span>{{scope.row.showStatus==1?'是':'否'}}</span>
      </template> 
    </el-table-column>
    <el-table-column align="center" fixed="right" width="420" label="操作">
      <template slot-scope="scope">

        <el-row :gutter="10">
          <el-col :span="8">
            <el-select placeholder="置顶" @change="topChange(scope.row)" v-model="scope.row.isTop" :disabled="scope.row.showStatus == 1? false:true">
              <el-option v-for="item in topTypes"  :key="item.id" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-col>
          <el-col :span="8">
            <el-button type="primary" @click="addToMyCut(scope.row.numIid)">添加到我的砍价</el-button>
          </el-col>
          <el-col :span="8">
            <el-button type="danger" @click="toDelete(scope.row.id)">删除</el-button>
          </el-col>
        </el-row>

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
      <el-form-item label="推荐信息" prop="itemDescription">
        <el-input type="text" v-model="form.itemDescription" placeholder="例子：只卖正品！赠送手提袋 运费险"></el-input>
      </el-form-item>
      <el-form-item label="佣金比率" prop="commissionRate">
        <el-input type="number" v-model="form.commissionRate"></el-input>
      </el-form-item>
      <el-form-item label="优惠价" prop="couponPrice">
        <el-input type="number" v-model="form.couponPrice"></el-input>
      </el-form-item>
      <el-form-item label="优惠券信息" prop="couponInfo">
        <el-input type="text" v-model="form.couponInfo" placeholder="例子：满148元减100元"></el-input>
      </el-form-item>
      <el-form-item label="优惠券开始日期" prop="couponStartTime">
        <el-date-picker
          v-model="form.couponStartTime"
          type="date"
          placeholder="选择开始日期" 
          format="yyyy 年 MM 月 dd 日"
          value-format="yyyy-MM-dd">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="优惠券结束日期" prop="couponEndTime">
        <el-date-picker
          v-model="form.couponEndTime"
          type="date"
          placeholder="选择结束日期"
          format="yyyy 年 MM 月 dd 日"
          value-format="yyyy-MM-dd">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="优惠券总数" prop="couponTotalCount">
        <el-input type="number" v-model="form.couponTotalCount" placeholder="优惠券总数"
        ></el-input>
      </el-form-item>
      <el-form-item label="优惠券剩余数" prop="couponRemainCount">
        <el-input type="number" v-model="form.couponRemainCount" placeholder="优惠券剩余数"></el-input>
      </el-form-item>
      <el-form-item label="置顶排序" prop="isTop">
        <el-input type="number" v-model="form.isTop"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel('form')">取 消</el-button>
      <el-button type="primary" @click="update('form')">修 改</el-button>
    </div>
  </el-dialog>
  <!-- ***** 添加商品的弹出层 ***** -->
  <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogAddVisible">
    <el-form :model="addform" :rules="addRules" ref="addform" label-width="100px">

      <el-form-item label="商品ID" prop="itemId">
        <el-col :span="8">
          <el-input type="text" v-model="addform.itemId"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="所属平台" prop="platformType">
        <el-select v-model="addform.platformType"  placeholder="选择所属平台">
          <el-option  v-for="item in platform" :key="item.id" :label="item.name" :value="item.id"> </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="是否置顶" prop="isTop">
        <el-select v-model="addform.isTop"  placeholder="是否置顶">
          <el-option v-for="item in topTypes"  :key="item.id" :label="item.label" :value="item.value"> </el-option>
        </el-select>
      </el-form-item>

    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="deleteGoods('addform')">取 消</el-button>
      <el-button type="primary" @click="addGoods('addform')">添  加</el-button>
    </div>
  </el-dialog>
  <!-- ***** 导入excel的弹出层 ***** -->
  <el-dialog title="导入" :visible.sync="dialogPutVisible">
    <el-row>
      <el-col :span="2">选择文件</el-col>
      <el-col :span="4">
            <el-upload ref="upload"
              class="upload-demo"
              :action="upload_url"
              :headers="token"
              :on-success ="fileSuccess"
              :auto-upload="false">
              <el-button  type="default">选择文件</el-button>

              <div slot="tip" class="el-upload__tip">只能上传excel文件</div>
            </el-upload>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="2">选择类型</el-col>
      <el-col :span="4">
        <el-select  placeholder="请选择类型" v-model="platType">
          <el-option v-for="item in platform" :key="item.id" :value='item.id' :label="item.name"></el-option>
        </el-select>
      </el-col>
    </el-row>

    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogPutVisible = false">取 消</el-button>
      <el-button type="primary" @click="putObjIn">导 入</el-button>
    </div>
  </el-dialog>
</div>
</template>

<script>
import {
  page,
  putObj,
  getObj,
  addObj,
  deleteObj,
  topObj
} from "@/api/mina/goods/index";
import {
  insertObj
} from "@/api/cut/goods/index";
import { mapGetters } from "vuex";
import waves from "@/directive/waves/index.js"; // 水波纹指令
import { getToken } from "@/utils/auth";

export default {
  name: "goods",
  directives: {
    waves
  },
  data() {
    return {
      //商品置顶类型
      topTypes: [
        {
          id: 0,
          value: 0,
          label: "未置顶"
        },
        {
          id: 1,
          value: 1,
          label: "类目置顶"
        },
        {
          id: 2,
          value: 2,
          label: "精选置顶"
        }
      ],

      //添加商品的表单
      addform: {
        itemId: "",
        platformType: 1,
        isTop: 0
      },
      addRules: {
        itemId: [
          {
            required: true,
            message: "请输入商品ID",
            trigger: "blur"
          }
        ]
      },
      //导入excel 默认平台是淘宝
      platType: 1,
      platform: [
        {
          id: 1,
          name: "淘宝"
        },
        {
          id: 2,
          name: "拼多多"
        }
      ],
      indexMethod: 1,
      upload_url: process.env.BASE_API + "/api/admin/goods/excel",
      token: {
        token: getToken()
      },
      list: null,
      total: null,
      listLoading: false,
      dialogStatus: "",
      dialogFormVisible: false,
      dialogAddVisible: false,
      dialogPutVisible: false,
      listQuery: {
        page: 1,
        limit: 10,
        keyword: undefined,
        platformType: null
      },
      form: {
        isTop: "",
        itemDescription: "",
        couponInfo: "",
        couponPrice: "",
        couponStartTime: "",
        couponTotalCount: "",
        couponEndTime: "",
        couponRemainCount: "",
        commissionRate: ""
      },
      rules: {
        isTop: [
          {
            required: true,
            message: "请输入置顶顺序",
            trigger: "blur"
          }
        ],
        commissionRate: [
          {
            required: true,
            message: "请输入佣金比例",
            trigger: "blur"
          }
        ]
      },
      textMap: {
        update: "编辑",
        create: "添加",
        put: "导入"
      },
      tableKey: 0
    };
  },
  filters: {},
  created() {
    this.getList();
  },
  computed: {
    ...mapGetters([])
  },
  methods: {
    //添加到我的砍价商品
    addToMyCut(id){
      console.log(id)
      this.$confirm("将该商品添加到我的砍价", "是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(res=>{
        insertObj({goodsNum:id})
        .then(res=>{
            console.log(res)
            if (res.data.errcode == 0) {
              this.okMsg('添加成功')
            } else {
              this.errMsg(res.data.errmsg);
            }
        })
      })
    },
    errMsg(msg){
      this.$notify({
        title: "错误",
        message: msg,
        type: "error",
        duration: 2000
      });
    },
    okMsg(msg){
      this.$notify({
        title: "成功",
        message: msg,
        type: "success",
        duration: 2000
      });
    },
    //JSON格式化
    toJson(item){
      return JSON.stringify(item,null,4);
    },
    //置顶接口
    topChange(e) {
      topObj( e.id,e.isTop)
      .then(response => {
        console.log(response);
        let msg = response.data.errmsg;
        if (response.data.errcode == 0) {
          this.getList();
          this.okMsg('设置成功!');
        } else {
          this.getList();
          this.errMsg(msg);
        }
      })
    },

  //根据商品流水id删除商品
    toDelete(e) {
      this.$confirm("此操作将永久删除该商品, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteObj(e).then(response => {
            if (response.data.errcode == 0) {
              this.getList();
              this.okMsg('删除成功');
            } else {
              this.errMsg(response.data.errmsg);
            }
          });
        })
        .catch(() => {
          this.okMsg('取消删除');
        });
    },
    /**
     * 根据平台类型获取商品数据
     * page: 1,
     * limit: 10,
     * keyword: undefined,
     * platformType :  1 为淘宝  2 为拼多多
     */
    setQuery(keyword = '',platformType = null){
      this.listQuery = {
          page: 1,
          limit: 10,
          keyword: keyword,
          platformType: platformType
      };
    },
    goodsType(e) {
      if (e == "all")  //点击全部
        this.setQuery();
      else if (e == "tb")  //点击淘宝
        this.setQuery('',1);
      else  //点击拼多多
        this.setQuery('',2);

      this.getList();
    },
    /**
     * 添加商品接口
     * 商品ID（必填）
     * 平台 : 1 淘宝 2 拼多多
     * 是否置顶: 0 不置顶 1 置顶
     */
    addGoods(formName) {
      const set = this.$refs;
      set[formName].validate(valid => {
        if (valid) { 
          this.dialogFormVisible = false;
          addObj(this.addform).then(response => {
            let obj = response.data;
            if (obj.errcode == 0) {
              this.dialogAddVisible = false;
              this.getList();
              this.okMsg('添加成功');
            } else {
              this.dialogAddVisible = false;
              this.errMsg(obj.errmsg);
            }
          });
        } else {
          return false;
        }
      });
    },
    //手动导入excel
    putObjIn(e) {
      this.upload_url =
        process.env.BASE_API + `/api/admin/goods/${this.platType}/excel`;

      let timer = setTimeout(() => {
        this.$refs.upload.submit();
      }, 200);
    },
    //上传excel表格成功时
    fileSuccess(e) {
      if (e.errcode != 0) this.errMsg('e.errmsg');
      else {this.okMsg('上传成功'); this.getList();}
      this.$refs.upload.clearFiles();
      this.dialogPutVisible = false;
    },
    //上传失败时
    fileError(e) {
      this.dialogPutVisible = false;
      this.errMsg('上传失败');
      this.$refs.upload.clearFiles();
    },
    putIn() {
      this.dialogPutVisible = true;
      this.dialogStatus = "put";
    },
    addGoodsItem() {
      this.dialogAddVisible = true;
      this.dialogStatus = "create";
    },

    //进入页面获取商品list
    getList() {
      this.listLoading = false;
      console.log(JSON.stringify(this.listQuery, null, 4));
      page(this.listQuery).then(response => {
        if (response.data.errcode == 0) {
          this.list = response.data.data.records;
          this.total = response.data.data.total;
          this.listLoading = false;
        } else {
          this.listLoading = false;
          this.errMsg('obj.errmsg');
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
    cancel(formName) {
      this.dialogFormVisible = false;
      this.$refs[formName].resetFields();
    },
    //取消添加商品时  清空表单
    deleteGoods(formName) {
      this.dialogAddVisible = false;
      this.$refs[formName].resetFields();
    },
    handleUpdate(row) {
      getObj(row.goodsId).then(response => {
        this.form = response.data.data;
        this.dialogFormVisible = true;
        this.dialogStatus = "update";
      });
    },

    update(formName) {
      const set = this.$refs;
      set[formName].validate(valid => {
        if (valid) {
          console.log(JSON.stringify(this.addform));
          return;
          this.dialogFormVisible = false;
          putObj(this.form).then(response => {
            var obj = response.data;
            if (obj.errcode == 0) {
              this.dialogFormVisible = false;
              this.getList();
              this.okMsg('修改成功');
            } else {
              this.dialogFormVisible = false;
              this.errMsg(obj.errmsg);
            }
          });
        } else {
          return false;
        }
      });
    },
    resetTemp() {
      this.form = {
        isTop: "",
        itemDescription: "",
        couponInfo: "",
        couponPrice: "",
        couponStartTime: "",
        couponTotalCount: "",
        couponEndTime: "",
        couponRemainCount: "",
        commissionRate: ""
      };
    }
  }
};
</script>
