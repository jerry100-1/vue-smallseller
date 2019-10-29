<template>
<div class="app-container calendar-list-container">
  <div class="filter-container">
    <el-row>
      <el-col :span="2">
        <el-button :type="this.listQuery.platformType == 1?'info':'primary'" @click="tbClass">淘宝</el-button>
      </el-col>
      <el-col :span="2">
        <el-button :type="this.listQuery.platformType == 2?'info':'primary'" @click="pddClass">拼多多</el-button>
      </el-col>
    </el-row>
    <el-row style="margin-top:10px">
      <el-col>
        <el-button type="danger" v-if="this.platCollect.isCollect == 1" @click="closeAllCollect(0)">关闭采集</el-button>
        <el-button type="primary" v-else @click="closeAllCollect(1)">开启采集</el-button>
      </el-col>
    </el-row>
  </div>
  <div class="filter-container">
    <el-input style="width: 200px;" class="filter-item" placeholder="类目" v-model="listQuery.keyword"></el-input>
    <el-button class="filter-item" type="primary" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" type="primary" v-if="categoryFilter_btn_add" icon="search" @click="handleCreate">添加</el-button>
  </div>
  <el-table :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%" >
    <el-table-column label="序号" align="center"
      type="index"
      :index="indexMethod">
    </el-table-column>
    <el-table-column  align="center" :label="this.listQuery.platformType == 1?'淘宝类目':'拼多多类目'"> 
      <template slot-scope="scope">

        <span>{{scope.row.thirdPartyCategoryName}}</span>
      </template> 
    </el-table-column>

    <el-table-column  align="center" label="平台类目"> 
      <template slot-scope="scope">
 
        <span>{{scope.row.sysCategoryNames}}</span>
      </template> 
    </el-table-column>

    <el-table-column  align="center" label="采集关键词"> 
      <template slot-scope="scope">
        <span>{{scope.row.keyword}}</span>
      </template> 
    </el-table-column>


    <el-table-column  align="center" label="采集维度"> 
      <template slot-scope="scope">
        <el-button type="default" @click="seeDetails(scope.row)">查看详情</el-button>
      </template> 
    </el-table-column>


    <el-table-column align="center" fixed="right" label="操作">
      <template slot-scope="scope">
        <el-button v-if="categoryFilter_btn_edit&&scope.row.status==0" size="small" type="warning" @click="handleClose(scope.row,1)">关闭
        </el-button>
        <el-button v-if="categoryFilter_btn_edit&&scope.row.status==1" size="small" type="primary" @click="handleClose(scope.row,0)">打开
        </el-button>
        <el-button v-if="categoryFilter_btn_edit" size="small" type="success" @click="handleUpdate(scope.row)">编辑
        </el-button>
        <el-button v-if="categoryFilter_btn_del" size="small" type="danger" @click="handleDel(scope.row.id)">删除
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
  <!-- 查看详情 / 编辑的弹出框 -->
  <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" @close="whenDialogClose">
    <el-form :model="form" :rules="rules" ref="form" label-width="260px" >
      <el-form-item label="类目名称" prop="thirdPartyCategoryCid">
        <el-select v-model="form.thirdPartyCategoryCid"  placeholder="请选择类目" :disabled='disable'>
          <el-option v-for="item in lItems" :key="item.id" :label="item.name" :value="item.cid"> </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="推荐关键词" prop="item">
        <el-input type="text" v-model="form.keyword" :disabled='disable'></el-input>
      </el-form-item>

      <el-form-item label="0-商品拼团价格区间（元）" prop="item" v-if="this.listQuery.platformType == 2" >
        <el-row  :gutter="20">
          <el-col :span="6">
            <el-input type="text" v-model="form.beginSalesPrice" placeholder="最低值" :disabled='disable'></el-input>
          </el-col>
          <el-col :span="6">
            <el-input type="text" v-model="form.endSalesPrice" placeholder="最高值" :disabled='disable'></el-input>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="1-商品券后价价格区间(元)" prop="item" v-if="this.listQuery.platformType == 2">
        <el-row  :gutter="20">
          <el-col :span="6">
            <el-input type="text" v-model="form.beginItemPrice" placeholder="最低值" :disabled='disable'></el-input>
          </el-col>
          <el-col :span="6">
            <el-input type="text" v-model="form.endItemPrice" placeholder="最高值" :disabled='disable'></el-input>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="2-佣金比例区间（元）" prop="item" >
        <el-row  :gutter="20">
          <el-col :span="6">
            <el-input type="text" v-model="form.beginBrokerageRate" placeholder="最低值"  :disabled='disable'></el-input>
          </el-col>
          <el-col :span="6">
            <el-input type="text" v-model="form.endBrokerageRate" placeholder="最高值" v-if="this.listQuery.platformType == 2" :disabled='disable'></el-input>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="3-优惠券金额区间（元）" prop="item" v-if="this.listQuery.platformType == 2">
        <el-row  :gutter="20">
          <el-col :span="6">
            <el-input type="text" v-model="form.beginCouponMoney" placeholder="最低值" :disabled='disable'></el-input>
          </el-col>
          <el-col :span="6">
            <el-input type="text" v-model="form.endCouponMoney" placeholder="最高值" :disabled='disable'></el-input>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="4-销量区间（元）" prop="item">
        <el-row  :gutter="20">
          <el-col :span="6">
            <el-input type="text" v-model="form.beginSalesCount" placeholder="最低值" :disabled='disable'></el-input>
          </el-col>
          <el-col :span="6">
            <el-input type="text" v-model="form.endSalesCount" v-if="this.listQuery.platformType == 2" placeholder="最高值" :disabled='disable'></el-input>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="5-佣金金额区间（元）" prop="item"  v-if="this.listQuery.platformType == 2">
        <el-row  :gutter="20">
          <el-col :span="6">
            <el-input type="text" v-model="form.beginBrokerageMoney" placeholder="最低值" :disabled='disable'></el-input>
          </el-col>
          <el-col :span="6">
            <el-input type="text" v-model="form.endBrokerageMoney" placeholder="最高值" :disabled='disable'></el-input>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="6-店铺描述评分区间（元）" prop="item" v-if="this.listQuery.platformType == 2">
        <el-row  :gutter="20">
          <el-col :span="6">
            <el-input type="text" v-model="form.beginShopDscrGrade" placeholder="最低值" :disabled='disable'></el-input>
          </el-col>
          <el-col :span="6">
            <el-input type="text" v-model="form.endShopDscrGrade" placeholder="最高值" :disabled='disable'></el-input>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="采集商品页（数量）" prop="item" v-if="this.listQuery.platformType == 2">
        <el-col :span="6">
          <el-input type="text" v-model="form.collectPageNo" :disabled='disable'></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="每页商品数量（0-100）" prop="item" v-if="this.listQuery.platformType == 2">
        <el-col :span="6">
          <el-input type="text" v-model="form.collectPageSize" :disabled='disable'></el-input>
        </el-col>
      </el-form-item>
      <!-- <el-form-item label="采集排序" prop="keyword" v-if="this.listQuery.platformType == 2">
        <el-col :span="6">
          <el-input type="number" v-model="form.collectSort" :disabled='disable'></el-input>
        </el-col>
      </el-form-item> -->
      <!-- <el-form-item label="店铺类型" prop="item" v-if="this.listQuery.platformType == 2">
        <el-col :span="6">
          <el-input type="text" v-model="form.shopType" :disabled='disable'></el-input>
        </el-col>
      </el-form-item> -->

      <el-form-item label="是否只采集优惠券商品" prop="isOnlyCollectCouponItem" v-if="this.listQuery.platformType == 2">
        <el-select v-model="form.isOnlyCollectCouponItem" placeholder="请选择" :disabled='disable'>
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>

    </el-form>
    <div slot="footer" class="dialog-footer" v-if="this.dialogStatus != 'details'">
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
  closeObj
} from "@/api/mina/categoryFilter/index";
import { platCollectCtrl , checkStatus} from "@/api/mina/platformCtrl/index"
import { filter as cAll } from "@/api/mina/taobaoCategory/index";
import { search } from "@/api/mina/category/index";
import { all } from "@/api/mina/aliAccount/index";
import { mapGetters } from "vuex";
import waves from "@/directive/waves/index.js"; // 水波纹指令

export default {
  name: "categoryFilter",
  directives: {
    waves
  },
  data() {
    return {
      //查看详情时关闭input  还有select
      disable:false,
      //平台采集开关
      platCollect:{},
      options: [
        {
          value: 1,
          label: "是"
        },
        {
          value: 0,
          label: "否"
        },
        
      ],
      indexMethod: 1,
      lItems: [],
      // syslItems: [],
      sysCateModel: [],
      aliAccounts: "",
      list: null,
      loading: false,
      total: null,
      listLoading: false,
      categoryFilter_btn_del: true,
      categoryFilter_btn_add: true,
      categoryFilter_btn_edit: true,
      //页面加载list对象
      listQuery: {
        page: 1,
        limit: 10,
        keyword: undefined,
        platformType: 1
      },
      
      rules: {
        item:[
          {required: false,}
        ],
        thirdPartyCategoryCid: [
          {
            required: true,
            message: "请选择",
            trigger: "change"
          }
        ],
        isOnlyCollectCouponItem: [
          {
            required: true,
            message: "请选择",
            trigger: "change"
          }
        ],

      },
      dialogStatus: "",

      dialogFormVisible: false,
      textMap: {
        update: "编辑",
        create: "添加",
        details: "查看详情"
      },
      form: {
        thirdPartyCategoryCid:'',
        keyword: "",
        //商品拼团价格区间
        beginSalesPrice : null,
        endSalesPrice:null,
        //商品券后价价格区间
        beginItemPrice :null,
        endItemPrice:null,
        //佣金比例区间
        beginBrokerageRate:null,
        endBrokerageRate:null,
        //优惠券金额区间
        beginCouponMoney:null,
        endCouponMoney:null,
        //销量区间
        beginSalesCount:null,
        endSalesCount:null,
        //佣金金额区间
        beginBrokerageMoney:null,
        endBrokerageMoney:null,
        //店铺描述评分区间
        beginShopDscrGrade:null,
        endShopDscrGrade:null,
        //采集商品页数量
        collectPageNo:null,
        //每页商品数量
        collectPageSize:null,
        //是否只采集优惠券商品
        isOnlyCollectCouponItem:1,
        //平台类目采集开关
        status:0,
        //平台类型
        platformType :null

      },
      tableKey: 0
    };
  },
  filters: {},
  created() {
    this.getList();
    this.getAccountAll();
    this.getCateAll();
    this.platCollectStatus();
    // this.getSysCateAll();
  },
  computed: {
    ...mapGetters([])
  },
  methods: {

    /**
     * 关闭dialog 弹出框触发
     */
    whenDialogClose(){
      console.log('haha ')
      this.disable = false
    },
    /**
     * 查看详情列表
     */
    seeDetails(row) {
      this.dialogStatus = "details";
      this.dialogFormVisible = true;
      this.disable = true;
      getObj(row.id).then(response => {
        this.form = response.data.data;
      });
    },
    /**
     *
     * 点击淘宝
     *
     */
    tbClass() {
      this.listQuery.platformType = 1;
      this.getList();
      this.platCollectStatus();
      this.getCateAll();
    },
    /**
     *
     * 点击拼多多
     *
     */
    pddClass() {
      this.listQuery.platformType = 2;
      this.getList();
       this.platCollectStatus();
       this.getCateAll();
    },
    /**
     * 获取页面信息
     */
    getList() {
      this.listLoading = false;

      page(this.listQuery).then(response => {
        if (response.data.errcode == 0) {
          this.list = response.data.data.records;
          // console.log("list ===",JSON.stringify(this.list) )
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

    getAccountAll() {
      this.listLoading = false;
      all().then(response => {
        if (response.data.errcode == 0) {
          this.aliAccounts = response.data.data;
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
     * 获取第三方所有类目
     * 需要传值platformType
     */
    getCateAll() {
      this.listLoading = false;
      let query = {};
      query.platformType = this.listQuery.platformType;
      console.log("当前选择 === ",query);
      cAll(query).then(response => {
        if (response.data.errcode == 0) {
          this.lItems = response.data.data;
          console.log("++++++++++++++++",JSON.stringify(this.lItems))
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
    handleUpdate(row) {


      getObj(row.id).then(response => {
        this.form = response.data.data;
        delete this.form.thirdPartyCategoryName
        this.dialogFormVisible = true;
        this.dialogStatus = "update";
      });
    },
    cancel(formName) {
      this.dialogFormVisible = false;
      this.$refs[formName].resetFields();
    },
    /**
     * 添加
     */
    create(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          
          this.form.platformType = this.listQuery.platformType;


          console.log(JSON.stringify(this.form) )

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

          this.form.platformType = this.listQuery.platformType;

          console.log(JSON.stringify(this.form))

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
    handleOpen(row) {
      let updateObj = {
        id: row.id,
        status: 0
      };
      putObj(updateObj).then(response => {
        let obj = response.data;
        if (obj.errcode == 0) {
          this.dialogFormVisible = false;
          this.getList();
          this.$notify({
            title: "成功",
            message: "开启成功",
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
    },
    /**
     * 获取平台信息（控制关闭采集开关）
     */
    platCollectStatus(){

      checkStatus(this.listQuery.platformType)
      .then((res)=>{
        this.platCollect = res.data.data;
      })
    },
    /**
     * 关闭 / 开启 平台采集
     */
    closeAllCollect(e){
      let obj = {
        type : this.listQuery.platformType,
        isCollect : e
      }
      // console.log("=================",JSON.stringify(obj))

      platCollectCtrl(obj).then((res)=>{
        console.log(res);
        if(res.data.errcode == 0){
          this.getList()
          this.platCollectStatus();
          this.$notify({
            title: "成功",
            message: "设置成功",
            type: "success",
            duration: 2000
          });
        }else{
          this.$notify.error({
            title: "错误",
            message: obj.errmsg
          });
        }
      })

    },
    /**
     *
     * 关闭 / 打开采集
     *
     */
    handleClose(row,status) {
      let updateObj = {
        id: row.id,
        status: status
      };
      console.log(JSON.stringify(updateObj))

      closeObj(updateObj).then(response => {
        let obj = response.data;
        console.log(obj);
        if (obj.errcode == 0) {
          this.dialogFormVisible = false;
          this.getList();
          this.$notify({
            title: "成功",
            message: "操作成功",
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
    },
    /**
     *
     * 删除
     *
     */
    handleDel(id) {
      this.$confirm("此操作将永久删除该类目, 是否继续?", "提示", {
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

      this.form={
        thirdPartyCategoryCid:'',
        keyword: "",
        //商品拼团价格区间
        beginSalesPrice : null,
        endSalesPrice:null,
        //商品券后价价格区间
        beginItemPrice :null,
        endItemPrice:null,
        //佣金比例区间
        beginBrokerageRate:null,
        endBrokerageRate:null,
        //优惠券金额区间
        beginCouponMoney:null,
        endCouponMoney:null,
        //销量区间
        beginSalesCount:null,
        endSalesCount:null,
        //佣金金额区间
        beginBrokerageMoney:null,
        endBrokerageMoney:null,
        //店铺描述评分区间
        beginShopDscrGrade:null,
        endShopDscrGrade:null,
        //采集商品页数量
        collectPageNo:null,
        //每页商品数量
        collectPageSize:null,
        //是否只采集优惠券商品
        isOnlyCollectCouponItem:1,
        //平台类目采集开关
        status:0,

        //平台类型
        platformType :null
      }
    }
  }
};
</script>
