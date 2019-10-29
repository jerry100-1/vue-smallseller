<template>
<div class="app-container calendar-list-container">
  <div class="filter-container">
    <el-input style="width: 200px;" class="filter-item" placeholder="订单编号" v-model="listQuery.orderNum"> </el-input>
    <el-select v-model="listQuery.status" placeholder="请选择" class="filter-item">
      <el-option
        v-for="item in statusOptions"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>
    <el-select v-model="listQuery.storeType" placeholder="请选择" class="filter-item">
      <el-option
        v-for="item in typeOptions"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>
    <el-select v-model="listQuery.payStatus" placeholder="请选择" class="filter-item">
      <el-option
        v-for="item in payStatusOptions"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>
    <el-date-picker class="filter-item"
      v-model="timeArr"
      type="datetimerange"
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期">
    </el-date-picker>
    <el-button class="filter-item" type="primary" @click="handleFilter">搜索</el-button>
  
  </div>
  <div class="filter-container">
    <el-button  type="success" @click="showPutObj">导入</el-button>
    <el-button  :type="this.listQuery.platformType == 1?'info':'primary'" @click="orderType(1)">淘宝订单</el-button>
    <el-button  :type="this.listQuery.platformType == 2?'info':'primary'" @click="orderType(2)">拼多多订单</el-button>
  </div>
    
  <!-- ***** 导入excel的弹出层 ***** -->
  <el-dialog title="导入" :visible.sync="dialogPutVisible">
    <el-row>
      <el-col :span="2">选择文件</el-col>
      <el-col :span="4">
            <el-upload ref="upload"
              class="upload-demo"
              :action="upload_url"
              :on-success="fileSuccess"
              :on-error="fileError"
              :headers="token"
              :auto-upload="false">
              <el-button  type="default">选择文件</el-button>

              <div slot="tip" class="el-upload__tip">只能上传excel文件</div>
            </el-upload>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="2">选择类型</el-col>
      <el-col :span="4">
        <el-select  placeholder="请选择类型" v-model="this.listQuery.platformType">
          <el-option v-for="item in platform" :key="item.id" :value='item.id' :label="item.name"></el-option>
        </el-select>
      </el-col>
    </el-row>

    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogPutVisible =false">取 消</el-button>
      <el-button type="primary" @click="putObjIn">导 入</el-button>
    </div>
  </el-dialog>

  <!-- 页面表单 -->
  <el-table :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%" >
    <el-table-column label="序号" width="100" align="center"
      type="index"
      :index="indexMethod">
    </el-table-column>
    <el-table-column  align="center" label="订单编号"> 
      <template slot-scope="scope">
        <span>{{scope.row.orderNum}}</span>
      </template> 
    </el-table-column>
    <el-table-column  align="center" label="标题"> 
      <template slot-scope="scope">
        <span>{{scope.row.goodsTitle}}</span>
      </template> 
    </el-table-column>
    <el-table-column  align="center" label="状态"> 
      <template slot-scope="scope">
        <el-tag v-if="scope.row.status==0">待存入</el-tag>
        <el-tag v-else-if="scope.row.status==1" type="success">已存入</el-tag>
        <el-tag v-else-if="scope.row.status==2" type="warning">失效</el-tag>
        <el-tag v-else-if="scope.row.status==4" type="danger">未认领</el-tag>
      </template> 
    </el-table-column>
    <el-table-column  align="center" label="订单类型"> 
      <template slot-scope="scope">
        <span>{{scope.row.childPlatformTxt }}</span>
      </template> 
    </el-table-column>
    <el-table-column  align="center" label="佣金比率"> 
      <template slot-scope="scope">
        <span>{{scope.row.brokerageRate}}</span>
      </template> 
    </el-table-column>
    <el-table-column  align="center" label="订单状态"> 
      <template slot-scope="scope">
        <el-tag v-if="scope.row.payStatus==1" type="warning">已付款</el-tag>
        <el-tag v-else-if="scope.row.payStatus==2" type="danger">已退款</el-tag>
        <el-tag v-else-if="scope.row.payStatus==3" type="success">已结算</el-tag>
        <el-tag v-else-if="scope.row.payStatus==0" type="default">未付款</el-tag>
      </template> 
    </el-table-column>
    <el-table-column  align="center" label="效果预估"> 
      <template slot-scope="scope">
        <span>{{scope.row.effect}}</span>
      </template> 
    </el-table-column>
    <el-table-column  align="center" label="付款金额"> 
      <template slot-scope="scope">
        <span>{{scope.row.price}}</span>
      </template> 
    </el-table-column>
    <el-table-column  align="center" label="下单时间"> 
      <template slot-scope="scope">
        <span>{{scope.row.orderTime ? scope.row.orderTime:scope.row.crtTime | timeFormat}}</span>
      </template> 
    </el-table-column>
    <el-table-column align="center" fixed="right" label="操作" width="150"> 
      <template slot-scope="scope">
        <el-button v-if="order_btn_check" size="small" type="success" @click="handleCheck(scope.row)">订单详情
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

  <!-- 订单信息的dialog -->
  <el-dialog title="订单信息"  :visible.sync="dialogFormVisible">
    <el-collapse v-model="activeNames"> 
      <el-collapse-item title="商品信息" name="1">
        <el-row :gutter="20">
          <el-col :span="12">
            <div>
              <label>商品ID:</label><span>{{form.goodsId}}</span>
            </div>
          </el-col>
          <el-col :span="12"><div>
              <label>订单确认签收时间:</label><span>{{form.receiverTime | timeFormat}}</span>
          </div></el-col>
        </el-row>
      </el-collapse-item>
      <el-collapse-item title="订单信息" name="2">
        <el-row :gutter="20">
          <el-col :span="8">
            <div>
              <label>订单编号:</label><span>{{form.orderNum}}</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div>
              <label>类型:</label><span>{{form.platformType == 1? '淘宝':'拼多多'}}</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div>
              <label>订单状态:</label><span>{{form.status | orderStatus}}</span>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <div>
              <label>实际支付金额:</label><span>{{form.price}}</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div>
              <label>订单来源:</label><span>{{form.childPlatformTxt}}</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div>
              <label>最后更新时间:</label><span>{{form.updTime | timeFormat}}</span>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <div>
              <label>自定义参数:</label>
              <!-- <span>{{form.status|orderStatus}}</span> -->
            </div>
          </el-col>
          <el-col :span="8">
            <div>
              <label>佣金金额:</label><span>{{form.brokerage}}</span>元
            </div>
          </el-col>
          <el-col :span="8">
            <div>
              <!-- <label>佣金比例:</label><span>{{form.createTime | timeFormat}}</span> -->
              <label>佣金比例:</label><span>{{form.brokerageRate}}</span>
            </div>
          </el-col>
        </el-row>

      </el-collapse-item>
      <el-collapse-item title="商品信息" name="3">
        <el-table :key='tableKey' :data="goodslist" fit highlight-current-row style="width: 100%" >
          <el-table-column  align="center" label="商品标题"> 
            <template slot-scope="scope">
              <div>
                <span>{{scope.row.goodsTitle}}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column  align="center" label="数量"> 
            <template slot-scope="scope">
               <span>{{scope.row.count}}</span>
            </template>
          </el-table-column>
          <el-table-column  align="center" label="单价"> 
            <template slot-scope="scope">
               <span>{{scope.row.goodsPrice}}</span>
            </template> 
          </el-table-column>
          <el-table-column  align="center" label="商品ID"> 
            <template slot-scope="scope">
               <span>{{scope.row.goodsId}}</span>
            </template> 
          </el-table-column>
          <el-table-column  align="center" label="商品缩略图"> 
            <template slot-scope="scope">
               <!-- <span>{{scope.row.goodsPrice}}</span> -->
            </template> 
          </el-table-column>
        </el-table>
      </el-collapse-item>
    </el-collapse>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel('form')">取 消</el-button>
      <el-button v-if="dialogStatus=='create'" type="primary" @click="create('form')">确 定</el-button>
      <el-button v-else type="primary" @click="update('form')">确 定</el-button>
    </div>
  </el-dialog>
</div>
</template>

<script>
import { page, getObj } from "@/api/mina/order/index";
import { mapGetters } from "vuex";
import waves from "@/directive/waves/index.js"; // 水波纹指令
import { getToken } from "@/utils/auth"; // 验权
import { parseTime } from "@/utils/index"; //

export default {
  name: "order",
  directives: {
    waves
  },
  data() {
    return {
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
      dialogPutVisible: false,
      indexMethod: 1,
      upload_url: process.env.BASE_API + "/api/admin/order/excel",
      token: {
        token: getToken()
      },
      timeArr: "",
      activeNames: ["1", "2", "3"],
      list: null,
      goodslist: null,
      total: null,
      listLoading: false,
      order_btn_check: true,
      listQuery: {
        page: 1,
        limit: 10,
        storeType: undefined,
        orderNum: undefined,
        status: undefined,
        payStatus: undefined,
        startTime: undefined,
        endTime: undefined,
        platformType: 1
      },
      form: {
        storeName: undefined,
        seller: "",
        orderNum: undefined,
        storeType: undefined,
        paystatus: undefined,
        status: undefined,
        price: undefined,
        goodsImg: undefined,
        brokerageRate: undefined,
        effect: undefined,
        category: undefined,
        count: undefined,
        goodsPrice: undefined
      },
      statusOptions: [
        {
          label: "待存入",
          value: 0
        },
        {
          label: "已存入",
          value: 1
        },
        {
          label: "失效",
          value: 2
        },
        {
          label: "未认领",
          value: 4
        }
      ],
      typeOptions: [
        {
          label: "淘宝",
          value: "淘宝"
        },
        {
          label: "天猫",
          value: "天猫"
        },
        {
          label: "天猫国际",
          value: "天猫国际"
        },
        {
          label: "聚划算",
          value: "聚划算"
        }
      ],
      payStatusOptions: [
        {
          label: "已结算",
          value: 3
        },
        {
          label: "已退款",
          value: 2
        },
        {
          label: "已付款",
          value: 1
        }
      ],
      dialogFormVisible: false,
      dialogStatus: "",
      textMap: {
        detail: "订单详细"
      },
      tableKey: 0
    };
  },
  filters: {
    timeFormat: function(value) {
      if (value !== undefined && value !== "" && value !== null) {
        return parseTime(value, "");
      }
    },
    paystatusFilter: function(value) {
      if (value == 2) {
        return "已退款";
      } else if (value == 1) {
        return "已付款";
      }
    },

    orderStatus: function(value) {
      if (value == 0) {
        return "待存入";
      } else if (value == 1) {
        return "已存入";
      } else if (value == 2) {
        return "失效";
      } else if (value == 4) {
        return "待认领";
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
    getList() {
      this.listQuery.startTime = this.timeArr[0];
      this.listQuery.endTime = this.timeArr[1];
      this.listLoading = false;

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
    /**
     * 淘宝、拼多多订单按钮点击
     */
    orderType(e){
      this.listQuery.platformType = e;
      this.getList();
    },

    /**
     * 导入excel表格
     * platformType : 平台类型 1淘宝 2拼多多
     */
    putObjIn() {
      this.upload_url =process.env.BASE_API + `/api/admin/order/excel?platformType=${this.listQuery.platformType}`
      let timer = setTimeout(res=>{
        this.$refs.upload.submit();
        clearTimeout(timer)
      },200)
        
      
    },
    //上传excel表格成功时
    fileSuccess(e) {
      console.log(e)
      
      if(e.errcode != 0)
      {
        this.$notify({
          title: "失败",
          message: e.errmsg,
          type: "fail",
          duration: 2000
        });
      }
      else
      {
        this.$notify({
          title: "成功",
          message: "上传成功",
          type: "success",
          duration: 2000
        });
        this.getList();
      }
      this.$refs.upload.clearFiles();
      this.dialogPutVisible = false;

    },
    //上传失败时
    fileError(e){
      this.dialogPutVisible = false;
      this.$notify({
        title: "失败",
        message: "上传失败",
        type: "fail",
        duration: 2000
      });
      this.$refs.upload.clearFiles();
    },

    showPutObj() {
      this.dialogPutVisible = true;
    },
    handleFilter() {
      this.getList();
    },
    cancel(formName) {
      this.dialogFormVisible = false;
    },
    handleSizeChange(val) {
      this.listQuery.limit = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.listQuery.page = val;
      this.getList();
    },
    handleCheck(row) {
      getObj(row.id).then(response => {
        this.form = response.data.data;
        let result = [];
        result.push(response.data.data);
        this.goodslist = result;
        this.dialogFormVisible = true;
      });
    }
  }
};
</script>
