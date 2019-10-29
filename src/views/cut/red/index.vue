<template lang="pug">
div
  div(style="padding:20px 20px 5px")
    el-row(:gutter="20")
      el-col( :span="2")
        el-select(v-model="listQuery.state" placeholder="请选择" clearable)
          el-option(v-for="item in redStatus"  :key="item.id"  :label="item.title"  :value="item.id")

      el-col( :span="4")
        el-input(placeholder="搜索用户名或ID" v-model="listQuery.userName")
      el-col( :span="2")
        el-button(type="primary" @click="searchList") 搜索

  div( style="padding:5px 20px 5px")
      el-table( 
        :key='tableKey' 
        :data="list" 
        v-loading.body="listLoading"  
        border fit highlight-current-row 
        style="width: 100%")
        el-table-column( label="序号" align="center" type="index"  :index="indexMethod")

        el-table-column( align="center" label="时间")
          template(slot-scope="scope")
            span {{scope.row.startTime | timestampToTime}}

        el-table-column( align="center" label="商品图片" width="80")
          template(slot-scope="scope")
            img( style="width:60px;height:60px;" :src="scope.row.goodsImg")

        el-table-column( align="center" label="商品标题" width="200")
          template(slot-scope="scope")
            span {{scope.row.goodsTitle}}
            
        el-table-column( align="center" label="砍价状态")
          template(slot-scope="scope")
            span(v-if="scope.row.state == 0") 砍价中 
            span(v-if="scope.row.state == 1") 限时结束 
            span(v-if="scope.row.state == 2") 红包待使用 
            span(v-if="scope.row.state == 3") 红包发放中
            span(v-if="scope.row.state == 4") 红包已发放 
            span(v-if="scope.row.state == 5") 红包失效 
            span(v-if="scope.row.state == 6") 商品失效 
            span(v-if="scope.row.state == 7") 强制取消 
            span(v-if="scope.row.state == 8") 商品退货 

        el-table-column( align="center" label="用户名称")
          template(slot-scope="scope")
            span {{scope.row.name}}

        el-table-column( align="center" label="用户ID")
          template(slot-scope="scope")
            span {{scope.row.userId }}

        el-table-column( align="center" label="砍价刀数")
          template(slot-scope="scope")
            span {{scope.row.currCutNum}}

        el-table-column( align="center" label="砍价金额")
          template(slot-scope="scope")
            span {{scope.row.currCutPrice }}

        el-table-column( align="center" label="红包金额")
          template(slot-scope="scope")
            span {{scope.row.redPrice }}

        //- el-table-column( align="center" label="红包使用情况")
          template(slot-scope="scope")
            span(v-if="scope.row.useState == 0") 未使用
            span(v-if="scope.row.useState == 1") 待发放
            span(v-if="scope.row.useState == 2") 已到帐

        el-table-column( align="center" label="砍价时长")
          template(slot-scope="scope")
            span {{scope.row.timeToplimit }}
        //- el-table-column( align="center" label="是否已激活返现")
          template(slot-scope="scope")
            span( v-if="scope.row.isActive == 0") 未返现
            span( v-if="scope.row.isActive == 1") 已返现
            span( v-if="scope.row.isActive == 2") 强制取消
            span( v-if="scope.row.isActive == 3") 过期


        el-table-column( align="center" fixed="right" width="100" label="操作")
          template(slot-scope="scope")
            el-button(size="small" type="primary" @click="cutRed(scope.row)") 扣除红包


      div(v-show="!listLoading" class="pagination-container")
        el-pagination( @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :page-sizes="[10, 20, 30, 40]" :page-size="listQuery.size" :total="total")

      el-dialog(title="取消红包"  :visible.sync="dialogVisible" width="40%" )
        
        el-row(:gutter="10")
          el-col(:span="4") 
            div( style="line-height:40px") 红包数量
          el-col(:span="4")
            div( style="line-height:40px") {{form.currCutPrice}}
            
        el-row(:gutter="10")
          el-col(:span="4") 
            div( style="line-height:40px") 扣除原因
          el-col(:span="16")
            el-input(placeholder="请输入原因" v-model="form.reason")

        span(slot="footer" class="dialog-footer")
          el-button(@click="dialogVisible = false") 取 消
          el-button( type="primary" @click="confirm") 确 定




</template>

<script>
import {
  page,
  delObj
} from "@/api/cut/red/index";
import { mapGetters } from "vuex";
import waves from "@/directive/waves/index.js"; // 水波纹指令
import { getToken } from "@/utils/auth"; // 验权

export default {
  name: "banner",
  directives: {
    waves
  },
  data() {
    return {
      form:{
        currCutPrice : undefined,
        reason: undefined,
        id:undefined
      },
      dialogVisible:false,
      indexMethod: 1,
      redStatus:[
        {
          id:0,
          title:'砍价中'
        },
        {
          id:1,
          title:'限时结束'
        },
        {
          id:2,
          title:'红包待使用'
        },
        {
          id:3,
          title:'红包发放中'
        },
        {
          id:4,
          title:'红包已发放'
        }
      ],
      token: {
        token: getToken()
      },

      list: null,
      total: null,

      listLoading: true,
      listQuery: {
        page: 1,
        size: 10,
        userName:undefined,
        userId:undefined,
        state:undefined
      },


      tableKey: 0
    };
  },
  filters: {
    timestampToTime(timestamp){
        const date = new Date(timestamp ),//时间戳为10位需*1000，时间戳为13位的话不需乘1000
            Y = date.getFullYear() + '-',
            M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-',
            D = date.getDate() + ' ',
            h = date.getHours() + ':',
            m = date.getMinutes() + ':',
            s = date.getSeconds();
        return Y+M+D+h+m+s;
    },
    
  },
  created() {
    this.getList();
  },
  computed: {
    ...mapGetters([]),
  },
  methods: {
    confirm(){
      if(!this.form.reason){
        this.$notify({
                title: "错误",
                message: '你还未填写原因',
                type: "error",
                duration: 2000
              });
        return
      }
      delObj({reason:this.form.reason},this.form.id)
      .then(res=>{
        if (res.data.errcode == 0) {
              this.$notify({
                title: "成功",
                message: "删除成功",
                type: "success",
                duration: 2000
              });
              this.dialogVisible = false;
              this.getList();
        }else {
          this.$notify.error({
            title: "错误",
            message: res.data.errmsg
          });
          this.dialogVisible = false;
        }
      })
      .catch(err=>{
        console.log(err)
      })
    },
    //扣除红包
    cutRed(row){
      this.form.reason = '';
      this.dialogVisible = true;
      this.form.currCutPrice = row.currCutPrice;
      this.form.id = row.id;
    },

    //搜索
    searchList(){
      
      const a = this.listQuery.userName;
      if(!isNaN(a)){
        this.listQuery.userId = a;
        this.listQuery.userName = ''
      }else{
        this.listQuery.userId = ""
      }
      this.getList()
    },
 

    toJson(obj) {
      console.log(JSON.stringify(obj, null, 4));
    },

    getList() {
      this.listLoading = true;
    
      page(this.listQuery).then(response => {
        if (response.data.errcode == 0) {
          console.log(JSON.stringify(response,null,4) )
          const list = response.data.data.records;
          for(let i of list){
            i.edit = false
          }
          this.list = list;
          this.total = response.data.data.total;
          this.listLoading = false;
        } else {
          this.listLoading = false;
          this.$notify.error({
            title: "错误",
            message: response.data.errmsg
          });
        }
      });
    },


    handleSizeChange(val) {
      this.listQuery.size = val;
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




  }
};
</script>



