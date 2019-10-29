<template>
<div class="app-container calendar-list-container">

  <div class="filter-container">
    <el-input style="width: 200px;" class="filter-item" placeholder="关键字" v-model="listQuery.keyword"> </el-input>
    <el-input style="width: 200px;" class="filter-item" placeholder="用户ID" v-model="listQuery.userId"> </el-input>
    <el-input style="width: 200px;" class="filter-item" placeholder="邀请用户ID" v-model="listQuery.invitedUserId"> </el-input>
    <el-button class="filter-item" type="primary" icon="search" @click="handleFilter">搜索</el-button>
  </div>
  <el-table :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">
     <el-table-column type="expand">
      <template slot-scope="scope">
        <el-form label-position="left" inline class="demo-table-expand">
          <el-form-item label="订单数">
            <span>{{ scope.row.orderCount }}</span>
          </el-form-item>
          <el-form-item label="微信号">
            <span>{{ scope.row.openId }}</span>
          </el-form-item>
          <el-form-item label="黄金好友数">
            <span>{{ scope.row.goldFriendCount }}</span>
          </el-form-item>
          <el-form-item label="铂金好友数">
            <span>{{ scope.row.platinumFriendCount }}</span>
          </el-form-item>
          <el-form-item label="铂金好友消费">
            <span>{{ scope.row.platinumFriendCost }}</span>
          </el-form-item>
          <el-form-item label="黄金好友消费">
            <span>{{ scope.row.goldFriendCost }}</span>
          </el-form-item>
          <el-form-item label="存入金额">
            <span>{{ scope.row.saveMoney }}</span>
          </el-form-item>
           <el-form-item label="提现金额">
            <span>{{ scope.row.money }}</span>
          </el-form-item>
          <el-form-item label="收益金额">
            <span>{{ scope.row.cumulationMoney }}</span>
          </el-form-item>
        </el-form>
      </template>
    </el-table-column>   
    <el-table-column label="序号" width="100" align="center"
      type="index"
      :index="indexMethod">
    </el-table-column>
    <el-table-column lign="center" label="用户ID"> 
      <template slot-scope="scope">
        <span>{{scope.row.id}}</span>
      </template> 
    </el-table-column>
    <el-table-column  align="center" label="微信名称"> 
      <template slot-scope="scope">
        <span>{{scope.row.nickname}}</span>
      </template> 
    </el-table-column>
    <el-table-column align="center" label="邀请人ID"> 
      <template slot-scope="scope">
        <span>{{scope.row.twoInviter}}</span>
      </template> 
    </el-table-column>

    <el-table-column  align="center" label="手机号"> 
      <template slot-scope="scope">
        <span>{{scope.row.phone}}</span>
      </template> 
    </el-table-column>
    <!-- 新增 支付宝 -->
    <!-- <el-table-column align="center" label="支付宝"> 
      <template slot-scope="scope">

        <span>占位符...</span>
      </template> 
    </el-table-column> -->

    <el-table-column align="center" label="消费金额"> 
      <template slot-scope="scope">
        <span>{{scope.row.costPrice }}</span>
      </template> 
    </el-table-column>
    <el-table-column align="center" label="邀请人数"> 
      <template slot-scope="scope">
        <span>{{scope.row.inviterCount}}</span>
      </template> 
    </el-table-column>
    <el-table-column align="center" label="操作" width="150"> 
      <template slot-scope="scope">
        <router-link :to="{name:'tradeOverview',params:{id:scope.row.id}}">
            <el-button size="mini" type="primary" v-if="mina_user_btn_check">
              交易总览
            </el-button>
        </router-link>
        <!-- <el-button size="mini" type="primary" v-if="mina_user_btn_check" @click="showWhole(scope.row)">
              交易总览
        </el-button> -->
      </template> 
    </el-table-column>
  </el-table>
  <!-- ***** 交易总览 ***** -->
  <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogUserVisible" width="80%">
    <el-row>
      <el-col :span="6"><div class="grid-content bg-purple">累计生钱收益(元)：55</div></el-col>
      <el-col :span="6"><div class="grid-content bg-purple-light">淘宝订单支付数量：10</div></el-col>
      <el-col :span="6"><div class="grid-content bg-purple">淘宝订单有效数量：8</div></el-col>
      <el-col :span="6"><div class="grid-content bg-purple-light">淘宝订单支付金额：212</div></el-col>
    </el-row>
    <el-row>
      <el-col :span="6"><div class="grid-content bg-purple">拼多多订单支付数量：10</div></el-col>
      <el-col :span="6"><div class="grid-content bg-purple-light">拼多多订单有效数量：6</div></el-col>
      <el-col :span="6"><div class="grid-content bg-purple">拼多多订单支付金额(元)：454</div></el-col>
    </el-row>
    <el-row>
      <el-col :span="6">
        <div class="grid-content bg-purple">佣金池总额度(元)：154</div>
        <span style="font-size:10px;color:#999">购买商品的佣金所得+平台赠送的20元</span>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple-light">日常佣金池净额(元)：154</div>
        <span style="font-size:10px;color:#999">用户所得佣金 - 生钱总和 -用户预留佣金池</span>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple">用户预留佣金池(元)：0</div>
        <span style="font-size:10px;color:#999">订单佣金确认收货之前超出佣金</span>
      </el-col>
    </el-row>

    <!-- 弹窗表格 -->
    <el-table :data="tableData" border style="width: 100%;margin-top:2vw;">
      <el-table-column prop="plat" label="所属平台">

      </el-table-column>

      <el-table-column prop="time" label="下单时间">

      </el-table-column>

      <el-table-column prop="goodsid" label="商品ID">

      </el-table-column>

      <el-table-column prop="goodstitle" label="商品标题">

      </el-table-column>

      <el-table-column prop="paymoney" label="付款金额（元）">

      </el-table-column>

      <el-table-column prop="ordercode" label="订单编号">

      </el-table-column>

      <el-table-column prop="rate" label="佣金比率（%）">

      </el-table-column>

      <el-table-column prop="preview" label="效果预估（元）">

      </el-table-column>

      <el-table-column prop="status" label="订单状态">

      </el-table-column>
    </el-table>
    <!-- 弹窗底部 -->
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogUserVisible = false">取 消</el-button>
      <el-button type="primary" @click="dialogUserVisible = false">确 定</el-button>
    </span>
  </el-dialog>
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
</div>
</template>

<script>
import { page, getObj } from "@/api/mina/user/index";
import { mapGetters } from "vuex";
import request from "@/utils/request";
import waves from "@/directive/waves/index.js"; // 水波纹指令

export default {
  name: "minauser",
  directives: {
    waves
  },
  data() {
    return {
      indexMethod: 1,
      //dialog 数据展示
      details: {},
      // 表格数据
      tableData: [
        {
          plat: "淘宝",
          time: "2018.9.6 18:00:00",
          goodsid: "00045633337",
          goodstitle: "商品标题",
          paymoney: "15.36",
          ordercode: "45243453",
          rate: 20,
          preview: 10,
          status: "已存入"
        }
      ],
      textMap: {
        zonglan: "交易总览"
      },
      dialogStatus: "",
      dialogUserVisible: false,
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        keyword: undefined,
        userId: undefined,
        invitedUserId: undefined
      },
      mina_user_btn_check: true,
      tableKey: 0
    };
  },
  created() {
    this.getList();
  },
  computed: {
    ...mapGetters([])
  },
  methods: {
    showWhole(e) {
      console.log(e.id);

      // request({
      //     url:'/api/admin/order/'+e.id+'/page',
      //     method: 'get',
      //     params: { page: 1, limit: 10}
      //   }).then((response) => {
      //     if (response.data.errcode==0) {
      //       this.list = response.data.data.records;
      //       console.log("========== ========",JSON.stringify(this.list))
      //       this.total = response.data.data.total;
      //     }else{
      //       this.$notify({
      //         title: '失败',
      //         message: response.data.errmsg,
      //         type: 'error',
      //         duration: 2000
      //       })
      //     }
      //   }).catch(()=>{
      //      this.$notify({
      //         title: '失败',
      //         message: '获取失败',
      //         type: 'error',
      //         duration: 2000
      //       })
      //   })

      getObj(e.id).then(response => {
        this.obj = response.data.data;
        console.log("==============", JSON.stringify(this.obj));
      });
      this.dialogUserVisible = true;
    },
    getList() {
      this.listLoading = true;
      page(this.listQuery).then(response => {
        if (response.data.errcode == 0) {
          this.list = response.data.data.records;

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
    }
  }
};
</script>
