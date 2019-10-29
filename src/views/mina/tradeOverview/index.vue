<template>
  <div class="app-container calendar-list-container">
    <el-row class="row-container">
      <el-col :span="6" class="row-item">
        <div class="content">
          <span>用户ID:{{obj.id}}</span>
        </div>
      </el-col>
      <el-col :span="6" class="row-item">
        <div class="content">
          <span>微信名称:{{obj.nickname}}</span>
        </div>
      </el-col>
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
    </el-row>
    <el-row class="row-container">
      <el-col :span="3" class="row-item">
        <div class="content">
          <span>支付订单数:{{obj.orderCount}}</span>
        </div>
      </el-col>
      <el-col :span="4" class="row-item">
        <div class="content">
          <span>支付金额:{{obj.costPrice}}元</span>
        </div>
      </el-col>
      <el-col :span="4" class="row-item">
        <div class="content">
          <span>存款金额:{{obj.saveMoney}}元</span>
        </div>
      </el-col>
      <el-col :span="4" class="row-item">
        <div class="content">
          <span>累计生钱收益:{{obj.cumulationMoney}}元</span>
        </div>
      </el-col>
      <el-col :span="4" class="row-item">
        <div class="content">
          <span>佣金池总额度:{{obj.brokerage}}元</span>
        </div>
      </el-col>
      <el-col :span="4" class="row-item">
        <div class="content">
          <span>日常佣金池净额:{{(obj.brokerage-obj.cumulationMoney) | keyThreeNum}}元</span>
        </div>
      </el-col>
      <el-col :span="4" class="row-item">
        <div class="content">
          <span>预留佣金池额度:{{obj.reserveBrokerage}}元</span>
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
          <el-table-column  align="center" label="下单时间"> 
            <template slot-scope="scope">
              <span>{{scope.row.createTime | timeFormat}}</span>
            </template> 
          </el-table-column>
          <el-table-column  align="center" label="商品信息"> 
            <template slot-scope="scope">
              <span>{{scope.row.goodsTitle}}</span>
            </template> 
          </el-table-column>
          <el-table-column  align="center" label="付款金额"> 
            <template slot-scope="scope">
              <span>{{scope.row.price}}</span>
            </template> 
          </el-table-column>
          <el-table-column  align="center" label="订单编号"> 
            <template slot-scope="scope">
              <span>{{scope.row.orderNum}}</span>
            </template> 
          </el-table-column>
          <el-table-column  align="center" label="佣金比例"> 
            <template slot-scope="scope">
              <span>{{scope.row.brokerageRate}}</span>
            </template> 
          </el-table-column>
          <el-table-column  align="center" label="效果预估"> 
            <template slot-scope="scope">
              <span>{{scope.row.effect}}</span>
            </template> 
          </el-table-column>
        </el-table>
        <div class="pagination-container">
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
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import {getObj} from '@/api/mina/user/index'
  import waves from '@/directive/waves/index.js' // 水波纹指令
  import request from '@/utils/request'
  import {parseTime} from '@/utils/index'
  import echarts from 'echarts'

  export default {
    directives: {
      waves
    },
    data() {
      return {
        list: null,
        obj:{
          id:undefined,
        },
        chart: null,
        dateArr:null,
        timeArr: '',
        total: null,
        id: 0,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 10,
        },
        chartQuery:{
          userId:undefined,
          startDate:undefined,
          endDate:undefined,
        },
        getSetOption:{
          backgroundColor: '#344b58',
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              textStyle: {
                color: '#fff'
              }
            }
          },
          grid: {
            borderWidth: 0,
            top: 110,
            bottom: 95,
            textStyle: {
              color: '#fff'
            }
          },
          legend: {
            x: '5%',
            top: '10%',
            textStyle: {
              color: '#90979c'
            },
            data: ['累计生钱收益', '存款金额', '支付金额', '支付订单', '佣金池额度']
          },
          calculable: true,
          xAxis: [{
            type: 'category',
            axisLine: {
              lineStyle: {
                color: '#90979c'
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
          }],
          yAxis: [{
            type: 'value',
            splitLine: {
              show: false
            },
            axisLine: {
              lineStyle: {
                color: '#90979c'
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
          }],
          dataZoom: [{
            show: true,
            height: 30,
            xAxisIndex: [
              0
            ],
            bottom: 30,
            start: 10,
            end: 80,
            handleIcon: 'path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z',
            handleSize: '110%',
            handleStyle: {
              color: '#d3dee5'

            },
            textStyle: {
              color: '#fff' },
            borderColor: '#90979c'

          }, {
            type: 'inside',
            show: true,
            height: 15,
            start: 1,
            end: 35
          }],
          series: [
          {
            name: '累计生钱收益',
            type: 'line',
            stack: 'total',
            symbolSize: 10,
            symbol: 'circle',
            itemStyle: {
              normal: {
                color: 'rgba(178,34,34,1)',
                label: {
                  show: true,
                  position: 'top',
                  formatter(p) {
                    return p.value > 0 ? p.value : ''
                  }
                }
              }
            },
            data:[]
          },{
            name: '存款金额',
            type: 'line',
            stack: 'total',
            symbolSize: 10,
            symbol: 'circle',
            itemStyle: {
              normal: {
                color: 'rgba(0,139,0,1)',
                barBorderRadius: 0,
                label: {
                  show: true,
                  position: 'top',
                  formatter(p) {
                    return p.value > 0 ? p.value : ''
                  }
                }
              }
            },
            data: []
          },{
            name: '支付金额',
            type: 'line',
            stack: 'total',
            symbolSize: 10,
            symbol: 'circle',
            itemStyle: {
              normal: {
                color: 'rgba(106,90,205,1)',
                barBorderRadius: 0,
                label: {
                  show: true,
                  position: 'top',
                  formatter(p) {
                    return p.value > 0 ? p.value : ''
                  }
                }
              }
            },
            data: []
          },{
            name: '支付订单',
            type: 'line',
            stack: 'total',
            symbolSize: 10,
            symbol: 'circle',
            itemStyle: {
              normal: {
                color: 'rgba(142,229,238,1)',
                label: {
                  show: true,
                  position: 'top',
                  formatter(p) {
                    return p.value > 0 ? p.value : ''
                  }
                }
              }
            },
            data:  []
          },{
            name: '佣金池额度',
            type: 'line',
            stack: 'total',
            symbolSize: 10,
            symbol: 'circle',
            itemStyle: {
              normal: {
                color: 'rgba(255,0,0,1)',
                label: {
                  show: true,
                  position: 'top',
                  formatter(p) {
                    return p.value > 0 ? p.value : ''
                  }
                }
              }
            },
            data:  []
          }
          ]
        },
       
        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近15天',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 15);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        tableKey: 0
      }
    },
    mounted() {
      this.initChart()
      this.setBetweenDate(this.chartQuery.startDate,this.chartQuery.endDate)
      this.getCharstData()
      this.getUserMsg()
    },
    beforeDestroy() {
      if (!this.chart) {
        return
      }
      this.chart.dispose()
      this.chart = null
    },
    created() {
      this.id=this.$route.params.id
      this.chartQuery.userId =this.$route.params.id
      let endTime =new Date().getTime();
      let startTime =endTime-(24 * 60 * 60 * 1000*7);
      this.chartQuery.endDate = parseTime(endTime,'{y}-{m}-{d}');
      this.chartQuery.startDate = parseTime(startTime,'{y}-{m}-{d}');
      this.getList()
    },
    filters: {
      keyThreeNum:function(value){
          value = Number(value)
          return value.toFixed(3)
      }
    },
    methods: {
      getList() {
        request({
            url:'/api/admin/order/'+this.id+'/page',
            method: 'get',
            params: this.listQuery
          }).then((response) => {
            if (response.data.errcode==0) {
              this.list = response.data.data.records;
              this.total = response.data.data.total;
            }else{
              this.$notify({
                title: '失败',
                message: response.data.errmsg,
                type: 'error',
                duration: 2000
              })
            }
          }).catch(()=>{
             this.$notify({
                title: '失败',
                message: '获取失败',
                type: 'error',
                duration: 2000
              })
          })
      },
      getUserMsg() {
        getObj(this.id).then(response => {
          this.obj = response.data.data
          console.log(response.data.data)
        });
      },
      getCharstData() {
          request({
            url:'/api/admin/order/totalData',
            method: 'get',
            params: this.chartQuery
          }).then((response) => {
            if (response.data.errcode==0) {
              this.chart.setOption({
                  series: [{
                      // 根据名字对应到相应的系列
                      name: '支付金额',
                      data: response.data.data.orderPriceArr
                  },{
                      // 根据名字对应到相应的系列
                      name: '支付订单',
                      data: response.data.data.orderCountArr
                  }]
              });
            }else{
              this.$notify({
                title: '失败',
                message: response.data.errmsg,
                type: 'error',
                duration: 2000
              })
            }
          }).catch(()=>{
             this.$notify({
                title: '失败',
                message: '获取失败',
                type: 'error',
                duration: 2000
              })
          })
          request({
            url:'/api/admin/profit/totalMoney',
            method: 'get',
            params: this.chartQuery
          }).then((response) => {
            if (response.data.errcode==0) {
              this.chart.setOption({
                  series: [{
                      // 根据名字对应到相应的系列
                      name: '累计生钱收益',
                      data: response.data.data.dataArr
                  }]
              });
            }else{
              this.$notify({
                title: '失败',
                message: response.data.errmsg,
                type: 'error',
                duration: 2000
              })
            }
          }).catch(()=>{
             this.$notify({
                title: '失败',
                message: '获取失败',
                type: 'error',
                duration: 2000
              })
          })
          request({
            url:'/api/admin/commission/totalMoney',
            method: 'get',
            params: this.chartQuery
          }).then((response) => {
            if (response.data.errcode==0) {
              this.chart.setOption({
                  series: [{
                      // 根据名字对应到相应的系列
                      name: '佣金池额度',
                      data: response.data.data.dataArr
                  }]
              });
            }else{
              this.$notify({
                title: '失败',
                message: response.data.errmsg,
                type: 'error',
                duration: 2000
              })
            }
          }).catch(()=>{
             this.$notify({
                title: '失败',
                message: '获取失败',
                type: 'error',
                duration: 2000
              })
          })
          request({
            url:'/api/admin/deposit/totalMoney',
            method: 'get',
            params: this.chartQuery
          }).then((response) => {
            if (response.data.errcode==0) {
              this.chart.setOption({
                  series: [{
                      // 根据名字对应到相应的系列
                      name: '存款金额',
                      data: response.data.data.dataArr
                  }]
              });
            }else{
              this.$notify({
                title: '失败',
                message: response.data.errmsg,
                type: 'error',
                duration: 2000
              })
            }
          }).catch(()=>{
             this.$notify({
                title: '失败',
                message: '获取失败',
                type: 'error',
                duration: 2000
              })
          })
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
        this.chartQuery.startDate = this.timeArr[0]
        this.chartQuery.endDate = this.timeArr[1]
        console.log(this.chartQuery)
        this.setBetweenDate(this.timeArr[0],this.timeArr[1])
        this.getCharstData()
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
        let daterange = new Array() 
        for (let k = unixDb; k <= unixDe;) {  
            daterange.push(parseTime(k,'{y}-{m}-{d}'))
            k = k + 24 * 60 * 60 * 1000;  
        }  
        this.chart.setOption({
          xAxis: {
            data: daterange
          },
        })
      } ,
      initChart() {
      this.chart = echarts.init(document.getElementById("chart"))
      this.chart.setOption(this.getSetOption)
    }
    }
  }
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
    height:40px;
    span {
      display: flex;
      height:100%;
      vertical-align: middle;
      line-height:40px;
    }
  }
</style>