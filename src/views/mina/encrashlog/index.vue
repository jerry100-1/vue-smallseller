<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-select v-model="listQuery.status" placeholder="请选择" class="filter-item">
        <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
      <el-date-picker class="filter-item" v-model="timeArr" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
      </el-date-picker>
      <el-button class="filter-item" type="primary" icon="search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" :type="encrashAuto? 'primary':'success'" @click="setEncrash">{{encrashAuto? '当前为自动提现':'当前为人工提现'}}</el-button>
    </div>
    <el-table :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">
      <el-table-column label="序号" width="60" align="center" type="index" :index="indexMethod">
      </el-table-column>
      <el-table-column width="120" align="center" label="支付宝姓名">
        <template slot-scope="scope">
            <span>{{scope.row.createName}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200" align="center" label="支付宝帐号"> 
        <template slot-scope="scope">
          <span>{{scope.row.aliPayAccount}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200" align="center" label="帐号ID"> 
        <template slot-scope="scope">
          <span>{{scope.row.createUser}}</span>
        </template>
      </el-table-column>
      <el-table-column width="60" align="center" label="提现金额"> 
        <template slot-scope="scope">
          <span>{{scope.row.money}}</span>
        </template>
      </el-table-column>
      <el-table-column width="60" align="center" label="手续费"> 
        <template slot-scope="scope">
          <span>{{scope.row.poundage}}</span>
        </template>actual amount
      </el-table-column>
      <el-table-column width="60" align="center" label="实际到帐"> 
        <template slot-scope="scope">
          <span>{{scope.row.actualAmount}}</span>
        </template>
      </el-table-column>

      <el-table-column width="90" align="center" label="转账状态"> 
        <template slot-scope="scope">
          <el-tag size="small" v-if="scope.row.payStatus==0">待转账</el-tag>
          <el-tag size="small" v-else-if="scope.row.payStatus==1" type="info">支付中</el-tag>
          <el-tag size="small" v-else-if="scope.row.payStatus==2" type="success">转账成功</el-tag>
          <el-tag size="small" v-else-if="scope.row.payStatus==3" type="danger">转账失败</el-tag>
        </template>
      </el-table-column>

      <el-table-column width="100" align="center" label="转账反馈"> 
        <template slot-scope="scope">
          <span>{{scope.row.result}}</span>
        </template>
      </el-table-column>

      <el-table-column width="80" align="center" label="提现状态"> 
        <template slot-scope="scope">
          <el-tag size="small" v-if="scope.row.status==1">申请中</el-tag>
          <el-tag size="small" v-else-if="scope.row.status==3" type="success">成功</el-tag>
          <el-tag size="small" v-else-if="scope.row.status==4" type="danger">失败</el-tag>
        </template>
      </el-table-column>

      <el-table-column width="100" align="center" label="失败原因"> 
        <template slot-scope="scope">
          <span v-if="scope.row.status==4">{{scope.row.reason}}</span>
          <span v-else>无</span>
        </template>
      </el-table-column>

    <el-table-column width="100" align="center" label="申请时间"> 
      <template slot-scope="scope">
        <span>{{scope.row.createTime |timeFormat}}</span>
      </template>
    </el-table-column>
    <el-table-column width="100" align="center" label="操作人"> 
      <template slot-scope="scope">
        <span>{{scope.row.updateName}}</span>
      </template>
    </el-table-column>
    <el-table-column width="100" align="center" label="更新时间"> 
      <template slot-scope="scope">
        <span>{{scope.row.updateTime |timeFormat}}</span>
      </template>
    </el-table-column>
    <el-table-column align="center" fixed="right" label="操作" > 

      <template slot-scope="scope">
        <el-button type="warning" @click="showDialog(scope.row)">操作申请</el-button>
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
  <!-- 操作提现的弹框 -->
  <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogShow">
    <el-row>
      <b>提现金额 : {{this.formData.money}}</b> 
    </el-row>
    <el-row>
      <b>手续费 : {{this.formData.poundage}}</b>
    </el-row>
    <el-row>
      <b>实际到帐 : {{this.formData.actualAmount}}</b>
    </el-row>
    <el-row>
      <b>审查状态 : {{this.formData.result || '暂无审查状态'}} </b>
    </el-row>
    <el-row>
      <el-col :span="3"><b>取消提现:</b></el-col>
      <el-col :span="16"><el-input :span="20" placeholder="请输入原因" v-model="reasonWhy"></el-input></el-col>
    </el-row>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click='giveMoney' v-if="formData.payStatus == 0">转账</el-button>
      <el-button type="primary" @click='giveMoney' v-if="formData.payStatus == 3" >重新转账</el-button>
      <el-button type="primary" v-if="formData.payStatus == 3 || formData.payStatus == 1" @click="isOk">打款成功</el-button>
      <el-button type="success" v-if="formData.payStatus == 1" @click="findResult">结果查询</el-button>
      <el-button :type="reasonWhy? 'warning':'info'" @click='refuse'>拒绝</el-button>
    </div>
  </el-dialog>
</div>
</template>

<script>
import { page, putObj, refuseObj,confirmObj,aliPay,aliStatus } from "@/api/mina/encrashlog/index";
import { mapGetters } from "vuex";
import waves from "@/directive/waves/index.js"; // 水波纹指令
import { parseTime } from "@/utils/index"; // 验权
export default {
  name: "encashlog",
  directives: {
    waves
  },
  data() {
    return {
      encrashAuto: false,
      indexMethod: 1,
      timeArr: "",
      form: {
        title: undefined,
        code: undefined,
        param: undefined,
        description: undefined
      },
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        status: undefined,
        startTime: undefined,
        endTime: undefined
      },
      dialogStatus:"",
      textMap:{
        encrash : '提现申请'
      },
      statusOptions: [
        {
          label: "申请提现",
          value: 1
        },
        {
          label: "提现成功",
          value: 3
        },
        {
          label: "提现失败",
          value: 4
        }
      ],
      mina_user_btn_check: true,
      tableKey: 0,
      dialogShow:false,
      reasonWhy:'', //拒绝原因
      logId:'', //当前转账id
      formData:{}, //金额表单
      state:'', //审查状态
    };
  },
  filters: {
    timeFormat: function(value) {
      if (value !== undefined && value !== "" && value !== null) {
        return parseTime(value, "");
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
    //人工打款成功
    isOk(){
      confirmObj(this.logId)
      .then(res=>{
        console.log(res);
      }).catch(err=>console.log(err));
    },
    //结果查询
    findResult(){
      aliStatus({logId:this.logId})
      .then(res=>{
        console.log(res);
      }).catch(err=>{console.log(err)})
    },
    //转账
    giveMoney(){
      console.log(this.logId);
      this.confirm('您确定给该用户转账吗？',()=>{
        aliPay({logId:this.logId})
        .then(res=>{
          console.log(res);
          if(res.data.errcode === 0) this.toast("success",'转账成功');
          this.dialogShow = false;
          this.getList();
        }).catch(err=>{this.dialogShow = false;this.getList()});
      })
    },
    //拒绝提现
    refuse(){
      console.log(this.logId)
      if(!this.reasonWhy) 
      {
        this.notice('请输入','您还未输入原因');
        return
      }
      else
      {
        this.confirm('您确定拒绝提现申请吗？',()=>{
          refuseObj(this.logId,{reason:this.reasonWhy})
          .then(res=>{
            console.log('拒绝提现',res);
            if(res.data.errcode === 0) this.toast("success",'拒绝成功');
            this.dialogShow = false;
            this.getList();
          })
          .catch(err=>{
            console.log('错误',err);
            this.dialogShow = false;
          })
        })

      }
    },
    //提现申请展示框
    showDialog(obj){
      if(obj.payStatus == 2){ 
        this.notice('转账已经成功','该用户已成功转账!') 
        return
      }
      this.dialogStatus = 'encrash';
      this.dialogShow = true;
      this.reasonWhy = '';
      this.logId = obj.id;
      this.formData = obj;
      console.log(JSON.stringify(this.formData,null,4))
    },
    //确定框
    confirm(text,cb){
      this.$confirm(text, '提示', {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(()=>{
        cb(true)
      }).catch(err=>console.log(err))
    },
    //更改提现状态
    setEncrash() {
      if(this.encrashAuto){
        this.confirm('是否改为人工提现？',()=>{
          this.encrashAuto = !this.encrashAuto;
          this.getList();
        })
      }else{
        this.confirm('是否改为自动提现？',()=>{
          this.encrashAuto = !this.encrashAuto;
          this.getList();
        })
      }
    },
    //提示
    toast(type = "success", msg) {
      this.$message({
        type: "success",
        message: msg
      });
    },
    //提醒
    notice(title, msg) {
      this.$notify.error({
        title: title,
        message: msg
      });
    },
    getList() {
      this.listQuery.startTime =
        this.timeArr[0] == undefined ? "" : this.timeArr[0];
      this.listQuery.endTime =
        this.timeArr[1] == undefined ? "" : this.timeArr[1];
      this.listLoading = true;
      console.log(this.listQuery);
      page(this.listQuery).then(response => {
        if (response.data.errcode == 0) {
          this.list = response.data.data.records;
          this.total = response.data.data.total;
          this.listLoading = false;
        } else {
          this.listLoading = false;
          this.notice("错误", obj.errmsg);
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
