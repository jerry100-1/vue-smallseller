<template>
<div class="app-container calendar-list-container">
  <div class="filter-container">
    <el-input style="width: 200px;" class="filter-item" placeholder="类目" v-model="listQuery.keyword"></el-input>
    <el-button class="filter-item" type="primary" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" type="primary" v-if="category_btn_add" icon="search" @click="handleCreate">添加</el-button>
  </div>

  <!-- 列表 -->
  <el-table :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%" >
    <el-table-column label="序号" width="100" align="center"
      type="index"
      :index="indexMethod">
    </el-table-column>
    
    <el-table-column  align="center" label="类目名称"> 
      <template slot-scope="scope">
        <span>{{scope.row.title}}</span>
      </template> 
    </el-table-column>
     
    <el-table-column  align="center" label="类目排序"> 
      <template slot-scope="scope">
        <span>{{scope.row.orderNum}}</span>
      </template> 
    </el-table-column>
    
    <el-table-column  align="center" label="展现模块"> 
      <template slot-scope="scope">
        <span>{{scope.row.platformTypeNames}}</span>
      </template> 
    </el-table-column>

    <el-table-column  align="center" label="第三方类目"> 
      <template slot-scope="scope">
        <span>{{scope.row.thirdPartyCatNames}}</span>
      </template> 
    </el-table-column>

    <el-table-column align="center" fixed="right" label="操作">
      <template slot-scope="scope">
        <!-- <el-button v-if="category_btn_edit" size="small" type="primary" @click="handleGoodsCreate(scope.row)">添加商品
        </el-button> -->
        <el-button v-if="category_btn_edit" size="small" type="primary" @click="checkDetails(scope.row)">查看详情
        </el-button>
        <el-button v-if="category_btn_edit" size="small" type="success" @click="handleUpdate(scope.row)">编辑
        </el-button>
         <el-button v-if="category_btn_del" size="small" type="danger" @click="handleDel(scope.row.id)">删除
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
  <!--************** 查看详情 ************* -->
  <el-dialog :title="textMap[dialogStatus]" :visible.sync="detailsDialog" :data="detail">

      <el-row>
        <el-col :span="12">平台类目:{{detail.title}}</el-col>
        <el-col :span="12">类目排序:{{detail.orderNum}}</el-col>
       
      </el-row>
      <el-row>
        <el-col :span="24">展现模块:{{detail.platformTypeNames}}</el-col>
      </el-row>
      <el-row>
        <el-col :span="24">第三方类目:{{detail.thirdPartyCatNames}} </el-col>
      </el-row>
      <el-row v-for="item in detail.aliAccountDtoList" key="details">
         <el-col :span="8">PID名称:{{item.pidName}}</el-col>
         <el-col :span="8">PID授权账号:{{item.account}}</el-col>
         <el-col :span="8">{{item.platformType == 1? '淘宝':'拼多多'}}跳转PID：{{item.pid}}</el-col>
      </el-row>

  </el-dialog>

  <!-- ******************* 添加 / 编辑弹出框 ****************** -->
  <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
    <el-form :model="form" :rules="rules" ref="form" label-width="100px">
      <el-form-item label="名称" prop="title">
        <el-input type="text" v-model="form.title"></el-input>
      </el-form-item>

      <el-form-item label="排序" prop="orderNum">
        <el-input type="number" v-model="form.orderNum"></el-input>
      </el-form-item>
      <!--************** 新增 ************* -->
      <el-form-item label="跳转PID" prop="plat_pid">
        <el-button type="default" @click="addPidList">添加平台跳转PID</el-button>
      </el-form-item>
      
      <div v-for="(item,index) in aliAccountDtoList" key="index">
        <el-form-item label="平台跳转PID" prop="skip_pid" label-width="100px">
          <el-row>
            <el-col :span="6">
                <el-select  placeholder="请选择类型" v-model="item.platformType">
                  <el-option v-for="item in platform" :key="item.id" :value='item.id' :label="item.name"></el-option>
                </el-select>
            </el-col>
            <el-col :span="16">
                <el-input type="text" v-model="item.pid" placeholder="填写跳转PID"></el-input>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="授权账号" prop="account">
          <el-input type="text" v-model="item.account" placeholder="PID账号来源"></el-input>
        </el-form-item>
      </div>
      


    
      <!-- 推荐模块 -->
      <el-form-item label="推荐模块" v-if="this.dialogStatus =='update'">
        <el-tabs type="border-card" @tab-click="clickTab">
           <el-tab-pane label="综合">
            <el-form :model="synthesizeFilter" :rules="synthesizeRules" ref="synthesizeFilter" label-width="100px">
            <el-form-item label="推荐关键词" >
              <el-input type="text" v-model="synthesizeFilter.keyword"></el-input>
            </el-form-item>
            <el-form-item label="销量" >
              <el-input type="number" v-model="synthesizeFilter.sale"></el-input>
            </el-form-item>
            <el-form-item label="佣金(利率)">
              <el-input type="number" v-model="synthesizeFilter.commissionRate"></el-input>
            </el-form-item>
            <el-form-item label="券额(元)">
              <el-input type="number" v-model="synthesizeFilter.couponPrice"></el-input>
            </el-form-item>
            <el-form-item label="最大单价(元)">
              <div>
                <el-input type="number"  v-model="synthesizeFilter.defaultPriceMax"></el-input>
              </div>
            </el-form-item>
            <el-form-item label="最小单价(元)">
              <div>
                <el-input type="number"  v-model="synthesizeFilter.defaultPriceMin"></el-input>
              </div>
            </el-form-item>
            <el-form-item label="最大券后价(元)" >
              <el-input type="number" v-model="synthesizeFilter.priceMax"></el-input>
            </el-form-item>
            <el-form-item label="最小券后价(元)" >
              <el-input type="number" v-model="synthesizeFilter.priceMin"></el-input>
            </el-form-item>
            <el-form-item label="排序参数" >
              <el-select v-model="synthesizeFilter.orderParam1" placeholder="请选择" class="filter-item">
                <el-option label="销量" value="sale"></el-option>
                <el-option label="价格" value="price"></el-option>
                <el-option label="券额" value="ticket"></el-option>
              </el-select>
              X
              <el-select v-model="synthesizeFilter.orderParam2" placeholder="请选择" class="filter-item">
                <el-option label="销量" value="sale"></el-option>
                <el-option label="价格" value="price"></el-option>
                <el-option label="券额" value="ticket"></el-option>
              </el-select>
            </el-form-item>
            </el-form>
            <div style="margin-top:30px">
             <el-button style="float:right" v-if="synthesizeFilter.id==''||synthesizeFilter.id==null||synthesizeFilter.id==undefined" type="primary" @click="filterCreate('synthesizeFilter',synthesizeFilter)">添 加</el-button>
              <el-button style="float:right" v-else type="primary" @click="filterUpdate('synthesizeFilter',synthesizeFilter)">修 改</el-button>            </div>
          </el-tab-pane>
         <el-tab-pane label="销量">
            <el-form :model="saleFilter" :rules="saleRules" ref="saleFilter" label-width="100px">
            <el-form-item label="推荐关键词" >
              <el-input type="text" v-model="saleFilter.keyword"></el-input>
            </el-form-item>
            <el-form-item label="销量">
              <el-input type="number" v-model="saleFilter.sale"></el-input>
            </el-form-item>
            <el-form-item label="佣金(利率)" >
              <el-input type="number" v-model="saleFilter.commissionRate"></el-input>
            </el-form-item>
            <el-form-item label="券额(元)">
              <el-input type="number" v-model="saleFilter.couponPrice"></el-input>
            </el-form-item>
            <el-form-item label="最大单价(元)">
              <div>
                <el-input type="number"  v-model="saleFilter.defaultPriceMax"></el-input>
              </div>
            </el-form-item>
            <el-form-item label="最小单价(元)">
              <div>
                <el-input type="number"  v-model="saleFilter.defaultPriceMin"></el-input>
              </div>
            </el-form-item>
            <el-form-item label="最大券后价(元)">
              <el-input type="number" v-model="saleFilter.priceMax"></el-input>
            </el-form-item>
            <el-form-item label="最小券后价(元)">
              <el-input type="number" v-model="saleFilter.priceMin"></el-input>
            </el-form-item>
            </el-form>
            <div style="margin-top:30px">
              <el-button style="float:right" v-if="saleFilter.id==''||saleFilter.id==null||saleFilter.id==undefined" type="primary" @click="filterCreate('saleFilter',saleFilter)">添 加</el-button>
              <el-button style="float:right" v-else type="primary" @click="filterUpdate('saleFilter',saleFilter)">修 改</el-button>
            </div>
          </el-tab-pane>
          <el-tab-pane label="价格">
            <el-form :model="priceFilter" :rules="priceRules" ref="priceFilter" label-width="100px">
            <el-form-item label="推荐关键词">
              <el-input type="text" v-model="priceFilter.keyword"></el-input>
            </el-form-item>
            <el-form-item label="销量" prop="sale">
              <el-input type="number" v-model="priceFilter.sale"></el-input>
            </el-form-item>
            <el-form-item label="佣金(利率)">
              <el-input type="number" v-model="priceFilter.commissionRate"></el-input>
            </el-form-item>
            <el-form-item label="券额(元)">
              <el-input type="number" v-model="priceFilter.couponPrice"></el-input>
            </el-form-item>
            <el-form-item label="最大单价(元)">
              <div>
                <el-input type="number"  v-model="priceFilter.defaultPriceMax"></el-input>
              </div>
            </el-form-item>
            <el-form-item label="最小单价(元)">
              <div>
                <el-input type="number"  v-model="priceFilter.defaultPriceMin"></el-input>
              </div>
            </el-form-item>
            <el-form-item label="最大券后价(元)">
              <el-input type="number" v-model="priceFilter.priceMax"></el-input>
            </el-form-item>
            <el-form-item label="最小券后价(元)">
              <el-input type="number" v-model="priceFilter.priceMin"></el-input>
            </el-form-item>
            </el-form>
            <div style="margin-top:30px">
              <el-button style="float:right" v-if="priceFilter.id==''||priceFilter.id==null||priceFilter.id==undefined" type="primary" @click="filterCreate('priceFilter',priceFilter)">添 加</el-button>
              <el-button style="float:right" v-else type="primary" @click="filterUpdate('priceFilter',priceFilter)">修 改</el-button>
            </div>
          </el-tab-pane>
          <el-tab-pane label="券额">
            <el-form :model="ticketFilter" :rules="ticketRules" ref="ticketFilter" label-width="100px">
            <el-form-item label="推荐关键词">
              <el-input type="text" v-model="ticketFilter.keyword"></el-input>
            </el-form-item>
            <el-form-item label="销量" prop="sale">
              <el-input type="number" v-model="ticketFilter.sale"></el-input>
            </el-form-item>
            <el-form-item label="佣金(利率)">
              <el-input type="number" v-model="ticketFilter.commissionRate"></el-input>
            </el-form-item>
            <el-form-item label="券额(元)">
              <el-input type="number" v-model="ticketFilter.couponPrice"></el-input>
            </el-form-item>
            <el-form-item label="最大单价(元)">
              <div>
                <el-input type="number"  v-model="ticketFilter.defaultPriceMax"></el-input>
              </div>
            </el-form-item>
            <el-form-item label="最小单价(元)">
              <div>
                <el-input type="number"  v-model="ticketFilter.defaultPriceMin"></el-input>
              </div>
            </el-form-item>
            <el-form-item label="最大券后价(元)">
              <el-input type="number" v-model="ticketFilter.priceMax"></el-input>
            </el-form-item>
            <el-form-item label="最小券后价(元)" >
              <el-input type="number" v-model="ticketFilter.priceMin"></el-input>
            </el-form-item>
            </el-form>
            <div style="margin-top:30px">
              <el-button style="float:right" v-if="ticketFilter.id==''||ticketFilter.id==null||ticketFilter.id==undefined" type="primary" @click="filterCreate('ticketFilter',ticketFilter)">添 加</el-button>
              <el-button style="float:right" v-else type="primary" @click="filterUpdate('ticketFilter',ticketFilter)">修 改</el-button>
            </div>
          </el-tab-pane>
        </el-tabs>
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
} from "@/api/mina/category/index";
import { search } from "@/api/mina/taobaoCategory/index";
import {
  putObj as filtetPutObj,
  addObj as filtetAddObj,
  getObj as filtetGetObj,
  getTypeObj
} from "@/api/mina/goodsFilter/index";
import { addObj as goodsAdd } from "@/api/mina/goods/index";
import { mapGetters } from "vuex";
import waves from "@/directive/waves/index.js"; // 水波纹指令
import { getToken } from "@/utils/auth"; // 验权

export default {
  name: "category",
  directives: {
    waves
  },
  data() {
    var validatePrice = (rule, value, callback) => {
      if (value === "" || value === undefined) {
        callback(new Error("请输入券后价"));
      } else {
        if (this.form.priceMin > value) {
          callback(new Error("最大券后价必须大于最小值"));
        }
      }
      callback();
    };
    var validateDefaultPrice = (rule, value, callback) => {
      if (value === "" || value === undefined) {
        callback(new Error("请输入单价"));
      } else {
        if (this.form.defaultPriceMin > value) {
          callback(new Error("最大单价必须大于最小值"));
        }
      }
      callback();
    };
    return {
      detail: {},
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
      upload_url: process.env.BASE_API + "/api/admin/upload/picture",
      token: {
        token: getToken()
      },
      indexMethod: 1,
      list: null,
      total: null,
      cids: [],
      listLoading: false,
      loading: false,
      category_btn_del: true,
      category_btn_add: true,
      category_btn_edit: true,
      listQuery: {
        page: 1,
        limit: 10,
        keyword: undefined
      },
      lItems: [],
      rules: {
        title: [
          {
            required: true,
            message: "请输入标题",
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
        cids: [
          {
            required: true,
            message: "请选择类目",
            trigger: "onchange"
          }
        ],
        orderNum: [
          {
            required: true,
            message: "请输入排序",
            trigger: "blur"
          }
        ]
      },
      synthesizeRules: {
        keyword: [
          {
            required: true,
            message: "请输入关键字",
            trigger: "blur"
          }
        ],
        couponPrice: [
          {
            required: true,
            message: "请输入券额",
            trigger: "blur"
          }
        ],
        commissionRate: [
          {
            required: true,
            message: "请输入佣金比率",
            trigger: "blur"
          }
        ],
        sale: [
          {
            required: true,
            message: "请输入销量",
            trigger: "blur"
          }
        ],
        defaultPriceMin: [
          {
            required: true,
            message: "请输入单价",
            trigger: "blur"
          }
        ],
        defaultPriceMax: [
          { required: true, validator: validateDefaultPrice, trigger: "blur" }
        ],
        priceMax: [
          { required: true, validator: validatePrice, trigger: "blur" }
        ],
        priceMin: [
          {
            required: true,
            message: "请输入券后价",
            trigger: "blur"
          }
        ]
      },
      saleRules: {
        keyword: [
          {
            required: true,
            message: "请输入关键字",
            trigger: "blur"
          }
        ],
        couponPrice: [
          {
            required: true,
            message: "请输入券额",
            trigger: "blur"
          }
        ],
        commissionRate: [
          {
            required: true,
            message: "请输入佣金比率",
            trigger: "blur"
          }
        ],
        sale: [
          {
            required: true,
            message: "请输入销量",
            trigger: "blur"
          }
        ],
        defaultPriceMin: [
          {
            required: true,
            message: "请输入单价",
            trigger: "blur"
          }
        ],
        defaultPriceMax: [
          { required: true, validator: validateDefaultPrice, trigger: "blur" }
        ],
        priceMax: [
          { required: true, validator: validatePrice, trigger: "blur" }
        ],
        priceMin: [
          {
            required: true,
            message: "请输入券后价",
            trigger: "blur"
          }
        ]
      },
      priceRules: {
        keyword: [
          {
            required: true,
            message: "请输入关键字",
            trigger: "blur"
          }
        ],
        couponPrice: [
          {
            required: true,
            message: "请输入券额",
            trigger: "blur"
          }
        ],
        commissionRate: [
          {
            required: true,
            message: "请输入佣金比率",
            trigger: "blur"
          }
        ],
        sale: [
          {
            required: true,
            message: "请输入销量",
            trigger: "blur"
          }
        ],
        defaultPriceMin: [
          {
            required: true,
            message: "请输入单价",
            trigger: "blur"
          }
        ],
        defaultPriceMax: [
          { required: true, validator: validateDefaultPrice, trigger: "blur" }
        ],
        priceMax: [
          { required: true, validator: validatePrice, trigger: "blur" }
        ],
        priceMin: [
          {
            required: true,
            message: "请输入券后价",
            trigger: "blur"
          }
        ]
      },
      ticketRules: {
        keyword: [
          {
            required: true,
            message: "请输入关键字",
            trigger: "blur"
          }
        ],
        couponPrice: [
          {
            required: true,
            message: "请输入券额",
            trigger: "blur"
          }
        ],
        commissionRate: [
          {
            required: true,
            message: "请输入佣金比率",
            trigger: "blur"
          }
        ],
        sale: [
          {
            required: true,
            message: "请输入销量",
            trigger: "blur"
          }
        ],
        defaultPriceMin: [
          {
            required: true,
            message: "请输入单价",
            trigger: "blur"
          }
        ],
        defaultPriceMax: [
          { required: true, validator: validateDefaultPrice, trigger: "blur" }
        ],
        priceMax: [
          { required: true, validator: validatePrice, trigger: "blur" }
        ],
        priceMin: [
          {
            required: true,
            message: "请输入券后价",
            trigger: "blur"
          }
        ]
      },
      goodsRules: {
        itemId: [
          {
            required: true,
            message: "请输入淘宝商品ID",
            trigger: "blur"
          }
        ],
        isTop: [
          {
            required: true,
            message: "请输入置顶排序",
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
      dialogStatus: "",
      dialogFormVisible: false,
      goodsDialogFormVisible: false,
      detailsDialog: false,
      textMap: {
        update: "编辑",
        create: "添加",
        details: "类目详情"
      },
      /**
       *
       * 推荐模块初始值
       *
       */

      synthesizeFilter: {
        cateId: "",
        keyword: "",
        status: undefined,
        couponPrice: undefined,
        commissionRate: undefined,
        type: 1,
        sale: undefined,
        defaultPriceMin: undefined,
        defaultPriceMax: undefined,
        priceMin: undefined,
        priceMax: undefined
      },
      saleFilter: {
        cateId: "",
        keyword: "",
        status: undefined,
        couponPrice: undefined,
        commissionRate: undefined,
        type: 2,
        sale: undefined,
        defaultPriceMin: undefined,
        defaultPriceMax: undefined,
        priceMin: undefined,
        priceMax: undefined
      },
      priceFilter: {
        cateId: "",
        keyword: "",
        status: undefined,
        couponPrice: undefined,
        commissionRate: undefined,
        sale: undefined,
        type: 3,
        defaultPriceMin: undefined,
        defaultPriceMax: undefined,
        priceMin: undefined,
        priceMax: undefined
      },
      ticketFilter: {
        cateId: "",
        keyword: "",
        status: undefined,
        couponPrice: undefined,
        commissionRate: undefined,
        sale: undefined,
        type: 4,
        defaultPriceMin: undefined,
        defaultPriceMax: undefined,
        priceMin: undefined,
        priceMax: undefined
      },
      /**
       *
       * form表单开头初始值
       *
       */
      aliAccountDtoList: [
        {
          id: null,
          platformType: 1,
          account: "",
          pid: "",
          status: 1,
          traceObjId: null
        },
      ],
      form: {
        title: "",
        orderNum: undefined,
        id: 0,
        aliAccountDtoList : []
      },

      /**
       *
       * 添加商品表单初始值(暂时注释)
       *
       */
      goodsForm: {
        itemId: "",
        itemDescription: "",
        couponInfo: "",
        couponPrice: "",
        couponStartTime: "",
        couponTotalCount: "",
        couponEndTime: "",
        couponRemainCount: "",
        commissionRate: "",
        sysCategory: ""
      },
      categoryId: "",
      tableKey: 0
    };
  },
  filters: {
    catchType: function(value) {
      if (value === 0) {
        return "是";
      } else {
        return "否";
      }
    }
  },
  created() {
    this.getList();
  },
  computed: {
    ...mapGetters([])
  },
  methods: {
    /**
     * 添加PID 按钮
     */
    addPidList() {
      let obj = {
          id: null,
          platformType: 1,
          account: "",
          pid: "",
          status: 1,
          traceObjId: null
        };
      this.aliAccountDtoList.push(obj);
    },

    /**
     *
     * 查看详情
     *
     */
    checkDetails(row) {

      getObj(row.id).then(res => {
        if (res.data.errcode == 0) {
          this.detail = res.data.data;
          console.log("详情 === ",JSON.stringify(this.detail))
        } else {
          this.$notify.error({
            title: "错误",
            message: obj.errmsg
          });
        }
        this.dialogStatus = "details";
        this.detailsDialog = true;
      });
    },
    getList() {
      this.listLoading = false;
      console.log(this.listQuery);
      page(this.listQuery).then(response => {
        if (response.data.errcode == 0) {
          this.list = response.data.data.records;
          console.log('列表 === ',JSON.stringify(this.list) )
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
    /**
     * 添加按钮
     */
    handleCreate() {
      this.resetAli();
      this.resetTemp();
      this.resetRecommend();
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
    },

    handleGoodsCreate(row) {
      this.goodsResetTemp();
      this.goodsDialogFormVisible = true;
      this.goodsForm.sysCategory = row.id;
    },

    handleUpdate(row) {
      this.resetTemp();
      this.categoryId = row.id;
      getObj(row.id).then(response => {
        this.form = response.data.data;
        console.log(this.form);

        //  let cidArr = this.form.cids.split(",")
        //  this.cids = cidArr
        this.aliAccountDtoList = this.form.aliAccountDtoList;
        this.dialogFormVisible = true;
        this.dialogStatus = "update";
      });
      let obj = {
        categoryId: row.id,
        type: 0
      };
      getTypeObj(obj).then(response => {
        this.synthesizeFilter = response.data.data;
      });
    },
    goodsCancel(formName) {
      this.goodsDialogFormVisible = false;
      this.$refs[formName].resetFields();
    },
    /**
     * 添加商品初始化（暂时注释）
     */
    goodsResetTemp() {
      this.goodsForm = {
        itemId: "",
        isTop: "",
        itemDescription: "",
        couponInfo: "",
        couponPrice: "",
        couponStartTime: "",
        couponTotalCount: "",
        couponEndTime: "",
        couponRemainCount: "",
        commissionRate: "",
        sysCategory: ""
      };
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
      this.$refs[formName].resetFields();
    },
    /**
     *
     * 添加类目
     *
     */
    create(formName) {

      this.$refs[formName].validate(valid => {
        if (valid) {

          this.form.aliAccountDtoList = this.aliAccountDtoList;

          console.log("form ==============",JSON.stringify(this.form))
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
          }).catch((res)=>{
            console.log(res);
          })
        } else {
          return false;
        }
      });
    },
    goodsCreate(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          goodsAdd(this.goodsForm).then(response => {
            this.goodsDialogFormVisible = false;
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
     * 更新类目
     */
    update(formName) {
      const set = this.$refs;
      // console.log(this.modules);
      set[formName].validate(valid => {
        if (valid) {
          console.log("===========", JSON.stringify(this.form));

          // this.dialogFormVisible = false;
          // this.form.createTime = undefined;
          // this.form.updateTime = undefined;
          // let cids = "";
          // if (this.cids.length > 0){
          //     for(let i = 0;i<this.cids.length;i++){
          //       if(i==this.cids.length-1){
          //         cids+=this.cids[i]
          //       }else{
          //         cids+=this.cids[i]+","
          //       }
          //     }
          // }
          // this.form.cids=cids
          this.form.aliAccountDtoList = this.aliAccountDtoList;

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
    /**
     *
     * 删除类目
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
    /**
     *
     * 初始化表单的值
     *
     */
    resetTemp() {
      this.form={
        title: "",
        orderNum: undefined,
        id: 0,
      }
    },
    resetAli(){
      this.aliAccountDtoList = [
        {
          id: null,
          platformType: 1,
          account: "",
          pid: "",
          status: 1,
          traceObjId: null
        },
      ]
    },
    /**
     *
     * 初始化推荐模块的值
     *
     */
    resetRecommend() {
      this.synthesizeFilter = {
        cateId: "",
        keyword: "",
        status: undefined,
        couponPrice: undefined,
        commissionRate: undefined,
        type: 1,
        sale: undefined,
        defaultPriceMin: undefined,
        defaultPriceMax: undefined,
        priceMin: undefined,
        priceMax: undefined
      };
      this.saleFilter = {
        cateId: "",
        keyword: "",
        status: undefined,
        couponPrice: undefined,
        commissionRate: undefined,
        type: 2,
        sale: undefined,
        defaultPriceMin: undefined,
        defaultPriceMax: undefined,
        priceMin: undefined,
        priceMax: undefined
      };
      this.priceFilter = {
        cateId: "",
        keyword: "",
        status: undefined,
        couponPrice: undefined,
        commissionRate: undefined,
        sale: undefined,
        type: 3,
        defaultPriceMin: undefined,
        defaultPriceMax: undefined,
        priceMin: undefined,
        priceMax: undefined
      };
      this.ticketFilter = {
        cateId: "",
        keyword: "",
        status: undefined,
        couponPrice: undefined,
        commissionRate: undefined,
        sale: undefined,
        type: 4,
        defaultPriceMin: undefined,
        defaultPriceMax: undefined,
        priceMin: undefined,
        priceMax: undefined
      };
    },
    /**
     *
     * 推荐模块tab栏点击事件
     *
     */
    clickTab(targetName) {
      console.log(targetName.index);
      let obj = {
        categoryId: this.categoryId,
        type: targetName.index
      };
      if (this.dialogStatus == "create") return;
      else
        getTypeObj(obj).then(response => {
          console.log(response.data.data);
          if (targetName.index == 0) {
            this.synthesizeFilter = response.data.data;
          } else if (targetName.index == 1) {
            this.saleFilter = response.data.data;
          } else if (targetName.index == 2) {
            this.priceFilter = response.data.data;
          } else if (targetName.index == 3) {
            this.ticketFilter = response.data.data;
          }
        });
    },
    filterCreate(formName, data) {
      if (formName == "synthesizeFilter") {
        data.type = 1;
      } else if (formName == "saleFilter") {
        data.type = 2;
      }
      if (formName == "priceFilter") {
        data.type = 3;
      }
      if (formName == "ticketFilter") {
        data.type = 4;
      }
      data.cateId = this.categoryId;
      this.$refs[formName].validate(valid => {
        if (valid) {
          delete data.crtTime;
          delete data.updTime;
          console.log("data===",JSON.stringify(data) )

          filtetAddObj(data).then(response => {
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
    filterUpdate(formName, data) {
      const set = this.$refs;
      set[formName].validate(valid => {
        if (valid) {
          delete data.crtTime;
          delete data.updTime;
          console.log("data===",JSON.stringify(data) )
          
          this.dialogFormVisible = false;
          filtetPutObj(data).then(response => {
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
    remoteCategoryMethod(query) {
      if (query !== "") {
        this.loading = true;
        this.loading = false;
        search({
          keyword: query
        }).then(response => {
          const obj = response.data;
          if (obj.errcode === 0) {
            this.lItems = obj.data;
            this.loading = false;
          } else {
            this.$notify.error({
              title: "错误",
              message: obj.errmsg
            });
          }
        });
      } else {
        this.lItems = [];
      }
    }
  }
};
</script>
