<template>
  <div class="app-container calendar-list-container">
    <!-- ***** 平台总览/淘宝交易/拼多多交易的弹出层 ***** -->
    <!-- <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogPlatVisible" width="80%">
      <el-container>
        <el-header>
          <el-col :span="6">
            <div class="grid-content bg-purple">佣金总额度（元）:</div>
            <span class="grid-content bg-purple" style="font-size:10px;color:#999">用户购买商品的佣金所得</span>
          </el-col>
          <el-col :span="6"><div class="grid-content bg-purple-light">淘宝订单支付数量：</div></el-col>
          <el-col :span="6"><div class="grid-content bg-purple"></div>淘宝订单有效数量：</el-col>
          <el-col :span="6"><div class="grid-content bg-purple-light">淘宝订单支付金额：</div></el-col>
        </el-header>
      </el-container>
      <el-table
        :data="tableData"
        border
        style="width: 100%">
        <el-table-column
          prop="date"
          label="下单时间">
        </el-table-column>
        <el-table-column
          prop="name"
          label="订单支付数量">
        </el-table-column>
        <el-table-column
          prop="valid"
          label="淘宝有效订单数量">
        </el-table-column>
        <el-table-column
          prop="paymoney"
          label="订单支付金额（元）">
        </el-table-column>
        <el-table-column
          prop="allmoney"
          label="佣金总额度（元）">
        </el-table-column>
      </el-table>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogPlatVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogPlatVisible = false">确 定</el-button>
      </span>
    </el-dialog> -->
    
    <el-row class="row-container">

      <!-- 选择时间日期 -->
      <el-col :span="12" class="row-item">
        <div class="content">
          <el-date-picker
            v-model="timeArr"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions"
            value-format="yyyy-MM-dd"
            @change="handleDateChange">
          </el-date-picker>
        </div>
      </el-col>
      
      <!-- 平台按钮 -->
      <el-button  :type="this.chartQuery.platformType == ''?'info':'primary'" @click="showPlat('')">平台总览</el-button>
      <el-button  :type="this.chartQuery.platformType == 1?'info':'primary'" @click="showPlat(1)">淘宝交易</el-button>
      <el-button  :type="this.chartQuery.platformType == 2?'info':'primary'" @click="showPlat(2)">拼多多交易</el-button>
      
    </el-row>

    <el-row class="row-container">
      <el-col :span="4" class="row-item">
        <div class="content">
          <span>平台预估收益:{{obj.platformProfit}}</span>
        </div>
      </el-col>
      <el-col :span="3" class="row-item">
        <div class="content">
          <span>成交金额:{{obj.finishPrice}}</span>
        </div>
      </el-col>
      <el-col :span="3" class="row-item">
        <div class="content">
          <span>付款笔数:{{obj.orderCount}}</span>
        </div>
      </el-col>
      <el-col :span="3" class="row-item">
        <div class="content">
          <span>效果预估:{{obj.effect}}</span>
        </div>
      </el-col>
      <el-col :span="3" class="row-item">
        <div class="content">
          <span>提现金额:{{obj.withdrawMoney}}</span>
        </div>
      </el-col>
      <el-col :span="3" class="row-item">
        <div class="content">
          <span>支出金额:{{obj.userPayPrice}}</span>
        </div>
      </el-col>
      <el-col :span="4" class="row-item">
        <div class="content">
          <span>用户佣金池额度:{{obj.userBrokerage}}</span>
        </div>
      </el-col>
    </el-row>
    <el-row class="row-container">
      <el-col :span="24" class="row-item">
        <div class="chart" id="chart" style="height:600px;"></div>
      </el-col>
    </el-row>
    <el-row class="row-container">
      <el-col :span="24" class="row-item">
        <el-table :key='tableKey' :data="list" border fit highlight-current-row style="width: 100%" >
          <el-table-column  align="center" label="时间"> 
            <template slot-scope="scope">
              <span>{{scope.row.tarDate}}</span>
            </template> 
          </el-table-column>
          <el-table-column  align="center" label="渠道"> 
            <template slot-scope="scope">
              <span>{{scope.row.inChannel}}</span>
            </template> 
          </el-table-column>
          <el-table-column  align="center" label="成交价"> 
            <template slot-scope="scope">
              <span>{{scope.row.orderPrice}}</span>
            </template> 
          </el-table-column>
          <el-table-column  align="center" label="付款笔数"> 
            <template slot-scope="scope">
              <span>{{scope.row.orderCount}}</span>
            </template> 
          </el-table-column>
          <el-table-column  align="center" label="效果预估"> 
            <template slot-scope="scope">
              <span>{{scope.row.effect}}</span>
            </template> 
          </el-table-column>
          <el-table-column  align="center" label="预估收入"> 
            <template slot-scope="scope">
              <span>{{scope.row.incomeMoney}}</span>
            </template> 
          </el-table-column>
          <el-table-column  align="center" label="支出金额"> 
            <template slot-scope="scope">
              <span>{{scope.row.payMoney}}</span>
            </template> 
          </el-table-column>
          <el-table-column  align="center" label="用户佣金池净额"> 
            <template slot-scope="scope">
              <span>{{scope.row.commissionMoney}}</span>
            </template> 
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>

  </div>
</template>

<script>
import { getPlatformObj } from "@/api/mina/user/index";
import waves from "@/directive/waves/index.js"; // 水波纹指令
import request from "@/utils/request";
import { parseTime } from "@/utils/index";
import echarts from "echarts";

export default {
  directives: {
    waves
  },
  data() {
    return {
      //表格数据
      tableData: [
        {
          date: "2016-05-02",
          name: 10,
          valid: 10,
          paymoney: 20,
          allmoney: 100
        },
        {
          date: "2016-05-04",
          name: 10,
          valid: 10,
          paymoney: 20,
          allmoney: 100
        },
        {
          date: "2016-05-01",
          name: 10,
          valid: 12,
          paymoney: 20,
          allmoney: 100
        },
        {
          date: "2016-05-03",
          name: 10,
          valid: 10,
          paymoney: 20,
          allmoney: 100
        }
      ],
      //弹出层标题
      textMap: {
        tb: "淘宝交易",
        pdd: "拼多多交易",
        zl: "平台总览"
      },
      //弹出层显示
      dialogPlatVisible: false,
      //弹出层的标题
      dialogStatus: "",

      list: null,
      obj: {
        id: undefined
      },
      chart: null,
      dateArr: null,
      timeArr: "",
      total: null,
      id: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10
      },
      chartQuery: {
        startDate: undefined,
        endDate: undefined,
        platformType:"",
      },
      getSetOption: {
        backgroundColor: "#344b58",
        tooltip: {
          trigger: "axis",
          axisPointer: {
            textStyle: {
              color: "#fff"
            }
          }
        },
        grid: {
          borderWidth: 0,
          top: 110,
          bottom: 95,
          textStyle: {
            color: "#fff"
          }
        },
        legend: {
          x: "5%",
          top: "10%",
          textStyle: {
            color: "#90979c"
          },
          data: [
            "成交金额",
            "付款笔数",
            "效果预估",
            "支出金额",
            "预估收入",
            "提现金额",
            "用户佣金池总额"
          ]
        },
        calculable: true,
        xAxis: [
          {
            type: "category",
            axisLine: {
              lineStyle: {
                color: "#90979c"
              }
            },
            splitLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            splitArea: {
              show: false
            },
            axisLabel: {
              interval: 0
            },
            data: []
          }
        ],
        yAxis: [
          {
            type: "value",
            splitLine: {
              show: false
            },
            axisLine: {
              lineStyle: {
                color: "#90979c"
              }
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              interval: 0
            },
            splitArea: {
              show: false
            }
          }
        ],
        dataZoom: [
          {
            show: true,
            height: 30,
            xAxisIndex: [0],
            bottom: 30,
            start: 10,
            end: 80,
            handleIcon:
              "path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z",
            handleSize: "110%",
            handleStyle: {
              color: "#d3dee5"
            },
            textStyle: {
              color: "#fff"
            },
            borderColor: "#90979c"
          },
          {
            type: "inside",
            show: true,
            height: 15,
            start: 1,
            end: 35
          }
        ],
        series: [
          {
            name: "成交金额",
            type: "line",
            stack: "total",
            symbolSize: 10,
            symbol: "circle",
            itemStyle: {
              normal: {
                color: "rgba(178,34,34,1)",
                label: {
                  show: true,
                  position: "top",
                  formatter(p) {
                    return p.value > 0 ? p.value : "";
                  }
                }
              }
            },
            data: []
          },
          {
            name: "付款笔数",
            type: "line",
            stack: "total",
            symbolSize: 10,
            symbol: "circle",
            itemStyle: {
              normal: {
                color: "rgba(0,139,0,1)",
                barBorderRadius: 0,
                label: {
                  show: true,
                  position: "top",
                  formatter(p) {
                    return p.value > 0 ? p.value : "";
                  }
                }
              }
            },
            data: []
          },
          {
            name: "效果预估",
            type: "line",
            stack: "total",
            symbolSize: 10,
            symbol: "circle",
            itemStyle: {
              normal: {
                color: "rgba(106,90,205,1)",
                barBorderRadius: 0,
                label: {
                  show: true,
                  position: "top",
                  formatter(p) {
                    return p.value > 0 ? p.value : "";
                  }
                }
              }
            },
            data: []
          },
          {
            name: "支出金额",
            type: "line",
            stack: "total",
            symbolSize: 10,
            symbol: "circle",
            itemStyle: {
              normal: {
                color: "rgba(142,229,238,1)",
                label: {
                  show: true,
                  position: "top",
                  formatter(p) {
                    return p.value > 0 ? p.value : "";
                  }
                }
              }
            },
            data: []
          },
          {
            name: "预估收入",
            type: "line",
            stack: "total",
            symbolSize: 10,
            symbol: "circle",
            itemStyle: {
              normal: {
                color: "rgba(255,0,0,1)",
                label: {
                  show: true,
                  position: "top",
                  formatter(p) {
                    return p.value > 0 ? p.value : "";
                  }
                }
              }
            },
            data: []
          },
          {
            name: "提现金额",
            type: "line",
            stack: "total",
            symbolSize: 10,
            symbol: "circle",
            itemStyle: {
              normal: {
                color: "rgba(199,21,133,1)",
                label: {
                  show: true,
                  position: "top",
                  formatter(p) {
                    return p.value > 0 ? p.value : "";
                  }
                }
              }
            },
            data: []
          },
          {
            name: "用户佣金池总额",
            type: "line",
            stack: "total",
            symbolSize: 10,
            symbol: "circle",
            itemStyle: {
              normal: {
                color: "rgba(218,165,32,1)",
                label: {
                  show: true,
                  position: "top",
                  formatter(p) {
                    return p.value > 0 ? p.value : "";
                  }
                }
              }
            },
            data: []
          }
        ]
      },

      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近15天",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 15);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      tableKey: 0
    };
  },
  mounted() {
    this.initChart();
    this.setBetweenDate(this.chartQuery.startDate, this.chartQuery.endDate);
    this.getCharstData();
    this.getPlatformPriceMsg();
  },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    this.chart.dispose();
    this.chart = null;
  },
  created() {
    // this.id=this.$route.params.id
    // this.chartQuery.userId =this.$route.params.id
    let endTime = new Date().getTime();
    let startTime = endTime;
    this.chartQuery.endDate = parseTime(endTime, "{y}-{m}-{d}");
    this.chartQuery.startDate = parseTime(startTime, "{y}-{m}-{d}");
    this.getList();
  },
  filters: {
    keyThreeNum: function(value) {
      value = Number(value);
      return value.toFixed(3);
    }
  },
  methods: {
    showPlat(e) {

      this.chartQuery.platformType = e;
      this.getList();
    },
    getList() {
      request({
        url: "/api/admin/minaUser/platformAccountTableData",
        method: "get",
        params: this.chartQuery
      })
        .then(response => {
          if (response.data.errcode == 0) {
            this.list = response.data.data;
            console.log(JSON.stringify(this.list) )
            this.total = response.data.data.total;
          } else {
            this.$notify({
              title: "失败",
              message: response.data.errmsg,
              type: "error",
              duration: 2000
            });
          }
        })
        .catch(() => {
          this.$notify({
            title: "失败",
            message: "获取失败",
            type: "error",
            duration: 2000
          });
        });
    },
    getPlatformPriceMsg() {
      console.log(this.chartQuery.startDate, this.chartQuery.endDate)
      getPlatformObj(this.chartQuery.startDate, this.chartQuery.endDate,1).then(
        response => {
          this.obj = response.data.data;
          console.log("========",JSON.stringify(response.data.data) );
        }
      );
    },
    getCharstData() {
      request({
        url: "/api/admin/order/platformData",
        method: "get",
        params: this.chartQuery
      })
        .then(response => {
          if (response.data.errcode == 0) {
            this.chart.setOption({
              series: [
                {
                  // 根据名字对应到相应的系列
                  name: "成交金额",
                  data: response.data.data.orderPriceArr
                },
                {
                  // 根据名字对应到相应的系列
                  name: "付款笔数",
                  data: response.data.data.orderCountArr
                },
                {
                  // 根据名字对应到相应的系列
                  name: "效果预估",
                  data: response.data.data.orderEffectArr
                },
                {
                  // 根据名字对应到相应的系列
                  name: "预估收入",
                  data: response.data.data.incomeArr
                }
              ]
            });
          } else {
            this.$notify({
              title: "失败",
              message: response.data.errmsg,
              type: "error",
              duration: 2000
            });
          }
        })
        .catch(() => {
          this.$notify({
            title: "失败",
            message: "获取失败",
            type: "error",
            duration: 2000
          });
        });
      request({
        url: "/api/admin/encrash/platformData",
        method: "get",
        params: this.chartQuery
      })
        .then(response => {
          if (response.data.errcode == 0) {
            this.chart.setOption({
              series: [
                {
                  // 根据名字对应到相应的系列
                  name: "提现金额",
                  data: response.data.data.withDrawArr
                }
              ]
            });
          } else {
            this.$notify({
              title: "失败",
              message: response.data.errmsg,
              type: "error",
              duration: 2000
            });
          }
        })
        .catch(() => {
          this.$notify({
            title: "失败",
            message: "获取失败",
            type: "error",
            duration: 2000
          });
        });
      request({
        url: "/api/admin/commission/platformData",
        method: "get",
        params: this.chartQuery
      })
        .then(response => {
          if (response.data.errcode == 0) {
            this.chart.setOption({
              series: [
                {
                  // 根据名字对应到相应的系列
                  name: "用户佣金池总额",
                  data: response.data.data.commissionArr
                },
                {
                  // 根据名字对应到相应的系列
                  name: "支出金额",
                  data: response.data.data.payArr
                }
              ]
            });
          } else {
            this.$notify({
              title: "失败",
              message: response.data.errmsg,
              type: "error",
              duration: 2000
            });
          }
        })
        .catch(() => {
          this.$notify({
            title: "失败",
            message: "获取失败",
            type: "error",
            duration: 2000
          });
        });
    },
    handleSizeChange(val) {
      this.listQuery.limit = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.listQuery.page = val;
      this.getList();
    },
    handleDateChange() {
      this.chartQuery.startDate = this.timeArr[0];
      this.chartQuery.endDate = this.timeArr[1];
      console.log(this.chartQuery);
      this.setBetweenDate(this.timeArr[0], this.timeArr[1]);
      this.getCharstData();
      this.getPlatformPriceMsg();
      this.getList();
    },
    setBetweenDate(begin, end) {
      let ab = begin.split("-");
      let ae = end.split("-");
      let db = new Date();
      db.setUTCFullYear(ab[0], ab[1] - 1, ab[2]);
      let de = new Date();
      de.setUTCFullYear(ae[0], ae[1] - 1, ae[2]);
      let unixDb = db.getTime();
      let unixDe = de.getTime();
      let daterange = new Array();
      for (let k = unixDb; k <= unixDe; ) {
        daterange.push(parseTime(k, "{y}-{m}-{d}"));
        k = k + 24 * 60 * 60 * 1000;
      }
      this.chart.setOption({
        xAxis: {
          data: daterange
        }
      });
    },
    initChart() {
      this.chart = echarts.init(document.getElementById("chart"));
      this.chart.setOption(this.getSetOption);
    }
  }
};
</script>

<style scope  lang="scss">
.row-container {
  padding-bottom: 10px;
  .row-item {
    display: inline-block;
    vertical-align: middle;
    margin-bottom: 10px;
  }
}
div.content {
  height: 40px;
  span {
    display: flex;
    height: 100%;
    vertical-align: middle;
    line-height: 40px;
  }
}
</style>