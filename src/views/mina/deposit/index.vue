<template>
<div class="app-container calendar-list-container">
  <div class="filter-container">
    <el-select v-model="listQuery.type" placeholder="请选择" class="filter-item">
      <el-option
        v-for="item in typeOptions"
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
    <el-button class="filter-item" type="primary" icon="search" @click="handleFilter">搜索</el-button>
  </div>
  <el-table :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%" >
    <el-table-column label="序号" width="100" align="center"
      type="index"
      :index="indexMethod">
    </el-table-column>
    <el-table-column  align="center" label="用户名称"> 
      <template slot-scope="scope">
        <span>{{scope.row.nickname}}</span>
      </template> 
    </el-table-column>
    <el-table-column  align="center" label="标题"> 
      <template slot-scope="scope">
        <span>{{scope.row.title}}</span>
      </template> 
    </el-table-column>
    <el-table-column  align="center" label="存钱类型"> 
      <template slot-scope="scope">
        <span>{{scope.row.type | type }}</span>
      </template> 
    </el-table-column>
    <el-table-column  align="center" label="存钱金额"> 
      <template slot-scope="scope">
        <span>{{scope.row.money }}</span>
      </template> 
    </el-table-column>
    <el-table-column  align="center" label="存钱时间"> 
      <template slot-scope="scope">
        <span>{{scope.row.createTime | timeFormat}}</span>
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
</div>
</template>

<script>
import {
  page,
  putObj
} from '@/api/mina/deposit/index';
import { mapGetters } from 'vuex';
import waves from '@/directive/waves/index.js' // 水波纹指令
import { parseTime } from '@/utils/index' // 验权

export default {
  name: 'deposit',
  directives: {
    waves,
  },
  data() {
    return {
      indexMethod:1,
      timeArr: '',
      list: null,
      total: null,
      listLoading: false,
      listQuery: {
        page: 1,
        limit: 10,
        type:undefined,
        startTime: undefined,
        endTime: undefined,
      },
      typeOptions: [
        {
          label:'订单存钱',
          value:1
        },
        {
          label:'订单失效',
          value:2
        },
        {
          label:'铂金好友为我存钱',
          value:3
        },
        {
          label:'铂金好友订单退款',
          value:4
        },
        {
          label:'黄金好友为我存钱',
          value:5
        },
        {
          label:'黄金好友订单退款',
          value:6
        },
        {
          label:'分享群存钱',
          value:7
        },
        {
          label:'分享群过期',
          value:8
        },
        {
          label:'新人礼包',
          value:9
        }
      ],
      tableKey: 0
    }
  },
  filters: {
    timeFormat : function(value){
      if (value!==undefined&&value!==""&&value!==null) {
       return parseTime(value,"")
      }
    },
    type : function (value){
      if (value==1) {
       return "订单存钱"
      }else if (value==2) {
       return "订单失效"
      }
      else if (value==3) {
       return "铂金好友为我存钱"
      }
      else if (value==4) {
       return "铂金好友订单退款"
      }
      else if (value==5) {
       return "黄金好友为我存钱"
      }
      else if (value==6) {
       return "黄金好友订单退款"
      }
      else if (value==7) {
       return "分享群存钱"
      }
      else if (value==8) {
       return "分享群过期"
     } else if (value==9) {
       return "新人礼包"
      }
    }
  },
  created() {
    this.getList();
  },
  computed: {
    ...mapGetters([
    ])
  },
  methods: {
    getList() {
      this.listQuery.startTime = this.timeArr[0]
      this.listQuery.endTime = this.timeArr[1]
      this.listLoading = false;
      console.log(this.listQuery)
      page(this.listQuery)
        .then(response => {
          if (response.data.errcode==0) {
            this.list = response.data.data.records;
            this.total = response.data.data.total;
            this.listLoading = false;
          }else{
            this.listLoading = false;
            this.$notify.error({
              title: '错误',
              message: obj.errmsg
            });
          }
        })
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
}
</script>
