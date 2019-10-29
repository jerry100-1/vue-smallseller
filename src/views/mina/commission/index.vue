<template>
<div class="app-container calendar-list-container">
  <div class="filter-container">
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
    <el-table-column  align="center" label="比例"> 
      <template slot-scope="scope">
        <span>{{scope.row.rate}}</span>
      </template> 
    </el-table-column>
    <el-table-column  align="center" label="增加/减去"> 
      <template slot-scope="scope">
        <el-tag v-if="scope.row.type==0">增加</el-tag>
        <el-tag v-else-if="scope.row.type==1" type="warning">减去</el-tag>
      </template> 
    </el-table-column>
    <el-table-column  align="center" label="类型"> 
      <template slot-scope="scope">
        <span v-if="scope.row.brokerageType==0">日常佣金</span>
        <span v-else-if="scope.row.brokerageType==1">预留佣金</span>
        <span v-else-if="scope.row.brokerageType==2">小特卖佣金</span>
        
      </template> 
    </el-table-column>
    <el-table-column  align="center" label="佣金金额"> 
      <template slot-scope="scope">
        <span>{{scope.row.money }}</span>
      </template> 
    </el-table-column>
    <el-table-column  align="center" label="存入时间"> 
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
} from '@/api/mina/commission/index';
import { mapGetters } from 'vuex';
import waves from '@/directive/waves/index.js' // 水波纹指令
import { parseTime } from '@/utils/index' // 验权

export default {
  name: 'profit',
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
        startTime: undefined,
        endTime: undefined,
      },
      tableKey: 0
    }
  },
  filters: {
    timeFormat : function(value){
      if (value!==undefined&&value!==""&&value!==null) {
       return parseTime(value,"")
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
