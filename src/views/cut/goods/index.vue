<template lang="pug">
div
  div(style="padding:20px 20px 5px")
    el-row(:gutter="20")
      el-col( :span="4")
        el-input(placeholder="搜索" v-model="listQuery.keyword")
      el-col( :span="2")
        el-button(type="primary" @click="searchList") 搜索
  div( style="padding:5px 20px 5px")
      el-button( :type="listQuery.platformType == 1?'info':'primary'" @click="changeTypes(1)") 淘宝商品
      el-button( :type="listQuery.platformType == 2?'info':'primary'" @click="changeTypes(2)") 拼多多商品
      //- el-button( :type="listType == 3?'info':'primary'" @click="changeTypes(3)") 失效商品
  div( style="padding:5px 20px 5px")
      el-table( :key='tableKey' :data="list" v-loading.body="listLoading"  border fit highlight-current-row style="width: 100%")
        el-table-column( label="序号" align="center" type="index"  :index="indexMethod")
 
        el-table-column( align="center" label="商品" width="120")
          template(slot-scope="scope")
            img( style="width:100px;height:100px;" :src="scope.row.pictUrl") 
        el-table-column( align="center" label="标题")
          template(slot-scope="scope")
            span {{scope.row.title}}
        el-table-column( align="center" label="销量" width="60")
          template(slot-scope="scope")
            span {{scope.row.volume}}
        el-table-column( align="center" label="佣金比例")
          template(slot-scope="scope")
            span {{scope.row.commissionRate}}
        el-table-column( align="center" label="券额" width="60")
          template(slot-scope="scope")
            span {{scope.row.couponPrice}}
        el-table-column( align="center" label="单价" width="60")
          template(slot-scope="scope")
            span {{scope.row.finalPrice}}
        el-table-column( align="center" label="优惠券有效期" width="120")
          template(slot-scope="scope")
            div {{scope.row.couponStartTime}}
            div 到
            div {{scope.row.couponEndTime}}
        el-table-column( align="center" label="砍价人数" width="140")
          template(slot-scope="scope")
            span {{scope.row.allJoinUserTotal}}(所有) / {{scope.row.realAllJoinUserTotal}}(真实)
        el-table-column( align="center" label="活动参与")
          template(slot-scope="scope")
            span {{scope.row.state == 0?'下架':'上架'}}
        el-table-column( align="center" label="砍价人数初始值")
          template(slot-scope="scope")
            el-input(v-if="scope.row.edit" placeholder="砍价人数的最低值" v-model="scope.row.allJoinUserTotal")
            span(v-else) {{scope.row.allJoinUserTotal }}
  
        el-table-column( align="center" label="砍价人数上限")
          template(slot-scope="scope")
            el-input(v-if="scope.row.edit" placeholder="砍价人数上限" v-model="scope.row.joinUserToplimit")
            span(v-else) {{scope.row.joinUserToplimit}}
            

        el-table-column( align="center" label="砍价时间上限")
          template(slot-scope="scope")
            el-input(v-if="scope.row.edit" placeholder="最高砍价的时长，以小时为单位" v-model="scope.row.timeToplimit")
            span(v-else) {{scope.row.timeToplimit}}
            
        el-table-column( align="center" fixed="right" width="250" label="操作")
          template(slot-scope="scope")
            el-button(size="small" type="primary" @click="scope.row.edit=true" v-if="!scope.row.edit") 编辑
            el-button(size="small" type="success" @click="finished(scope.row)" v-else) 完成
            el-button(size="small" type="primary" @click="upDown(scope.row)" v-if="scope.row.state == 0") 上架
            el-button(size="small" type="danger" @click="upDown(scope.row)" v-else) 下架
            el-button(size="small" type="danger" @click="deleteRow(scope.row.id)") 删除

      div(v-show="!listLoading" class="pagination-container")
        el-pagination( @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :page-sizes="[10, 20, 30, 40]" :page-size="listQuery.size" :total="total")



</template>

<script>
import {
  page,
  delObj,
  upDownObj,
  upDateObj
} from "@/api/cut/goods/index";
import { mapGetters } from "vuex";
import waves from "@/directive/waves/index.js"; // 水波纹指令
import { getToken } from "@/utils/auth"; // 验权

export default {
  name: "banner",
  directives: {
    waves
  },
  computed:{

  },
  data() {
    return {
      indexMethod: 1,

      token: {
        token: getToken()
      },

      list: null,
      total: null,

      listLoading: true,
      listQuery: {
        page: 1,
        size: 10,
        keyword:'',
        platformType:1
      },


      tableKey: 0
    };
  },
  filters: {

  },
  created() {
    this.getList();
  },
  computed: {
    ...mapGetters([])
  },
  methods: {
    //切换
    changeTypes(e){
      this.listQuery.platformType = e;
      this.getList();
    },
    //搜索
    searchList(){
      if(!this.listQuery.keyword) return
      this.getList();
    },
    //删除
    deleteRow(e){
      this.$confirm("此操作将永久删除该商品, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(res => {

        delObj(e)
          .then(response => {
            console.log(this.toJson(response) );
            if (response.data.errcode == 0) {
              this.getList();
              this.$notify({
                title: "成功",
                message: "删除成功",
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
          })
          .catch(err => {
            console.log(err);
          });
      }).catch(err=>console.error);

    },
    //编辑完成
    finished(e) {
      e.edit = false;
      const obj = {
        id : e.id,
        joinUserToplimit : e.joinUserToplimit,
        timeToplimit : e.timeToplimit,
        allJoinUserTotal : e.allJoinUserTotal
      }
      console.log(obj)

      upDateObj(obj)
        .then(response => {
          console.log( this.toJson(response) );
          if (response.data.errcode == 0) {
            this.$notify({
              title: "成功",
              message: "修改成功",
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
        })
        .catch(err => {
          console.log(err);
        });
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
            message: obj.errmsg
          });
        }
      });
    },
    //上下架
    upDown(e){
      console.log(e.id)
      console.log(e.state)
      upDownObj({id:e.id,state:e.state == 1? 0 : 1})
      .then(res=>{
        const errcode = res.data.errcode;
        if(errcode == 0){
          this.$notify({
            title: "成功",
            message: "修改成功",
            type: "success",
            duration: 2000
          });
          this.getList();
        }else{
          this.$notify.error({
            title: "错误",
            message: obj.errmsg
          });
        }
        
      })
 
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
