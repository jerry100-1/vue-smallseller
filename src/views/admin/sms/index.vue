<template>
<div class="app-container calendar-list-container">
  <div class="filter-container">
    <el-input style="width: 200px;" class="filter-item" placeholder="短信模板" v-model="listQuery.template"></el-input>
    <el-input style="width: 200px;" class="filter-item" placeholder="手机号码" v-model="listQuery.phone"></el-input>
    <el-button class="filter-item" type="primary" @click="handleFilter">搜索</el-button>
  </div>
  <el-table :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%" >
    <el-table-column label="序号" width="100" align="center"
      type="index"
      :index="indexMethod">
    </el-table-column>
    <el-table-column  align="center" label="手机号码"> 
      <template slot-scope="scope">
        <span>{{scope.row.phone}}</span>
      </template> 
    </el-table-column>
    <el-table-column  align="center" label="短信模板"> 
      <template slot-scope="scope">
        <span>{{scope.row.template}}</span>
      </template> 
    </el-table-column>
    <el-table-column  align="center" label="验证码"> 
      <template slot-scope="scope">
        <span>{{scope.row.code}}</span>
      </template> 
    </el-table-column>
    <el-table-column  align="center" label="发送时间"> 
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
} from '@/api/admin/sms/index';
import { mapGetters } from 'vuex';
import waves from '@/directive/waves/index.js' // 水波纹指令
import { parseTime } from '@/utils/index' // 验权

export default {
  name: 'sms',
  directives: {
    waves,
  },
  data() {
    return {
      indexMethod:1,
      list: null,
      total: null,
      listLoading: false,
      listQuery: {
        page: 1,
        limit: 10,
        template:undefined,
        phone:undefined
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
    },
  }
}
</script>
