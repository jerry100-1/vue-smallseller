<template lang="pug">
div
  div(style="padding:20px 20px 5px")
    el-row(:gutter="20")
      el-col( :span="4")
        el-input(placeholder="搜索" v-model="listQuery.keyword")
      el-col( :span="2")
        el-button(type="primary" @click="searchList") 搜索
      el-col( :span="2")
        el-button(type="primary" @click="showDialog" ) 添加
      //- el-col( :span="2")
      //-   el-button(type="primary" @click="listState(1)" v-if="listQuery.state == 0") 开启状态的列表
      //-   el-button(type="primary" @click="listState(0)" v-else) 关闭状态的列表

  div( style="padding:5px 20px 5px")
      el-table( 
        :key='tableKey' 
        :data="list" 
        v-loading.body="listLoading"  
        border fit highlight-current-row 
        style="width: 100%")
        el-table-column( label="序号" align="center" type="index"  :index="indexMethod")

        el-table-column( align="center" label="轻搜类目" width="100")
          template(slot-scope="scope")
            span {{scope.row.catName}}
        el-table-column( align="center" label="类目图标"  width="180")
          template(slot-scope="scope")
            img( :src="scope.row.icon" style="width:80px;")

        el-table-column( align="center" label="券后价区间" )
          template(slot-scope="scope")
            span {{scope.row.startPrice }} - {{scope.row.endPrice }}

            
        el-table-column( align="center" fixed="right" width="250" label="操作")
          template(slot-scope="scope")
            el-button(size="small" type="warning" v-if="scope.row.state == 1" @click="closeOpen(scope.row)") 关闭
            el-button(size="small" type="primary" v-else @click="closeOpen(scope.row)") 开启
            el-button(size="small" type="success" @click="showDialogUp(scope.row)") 修改
            el-button(size="small" type="danger" @click="deleteObj(scope.row.id)") 删除


      div(v-show="!listLoading" class="pagination-container")
        el-pagination(
           @size-change="handleSizeChange" 
           @current-change="handleCurrentChange" 
           :current-page.sync="listQuery.page" 
           :page-sizes="[10, 20, 30, 40]" 
           :page-size="listQuery.limit" 
           :total="total")

      el-dialog( :title="dialogTitle"  :visible.sync="dialogVisible" width="50%" )
        
        el-row(:gutter="10")
          el-col(:span="4") 
            div( style="line-height:40px") 类目名称
          el-col(:span="10")
            el-input(placeholder="请输入类目名称" v-model="form.catName")
        el-row(:gutter="10")
          el-col(:span="4") 
            div( style="line-height:40px") 类目id
          el-col(:span="10")
            el-input(placeholder="请输入类目id" v-model="form.catId")
        el-row(:gutter="10")
          el-col(:span="4") 
            div( style="line-height:40px") 起步价格
          el-col(:span="10")
            el-input(placeholder="请输入起步价格" v-model="form.startPrice")
        el-row(:gutter="10")
          el-col(:span="4") 
            div( style="line-height:40px") 最高价格
          el-col(:span="10")
            el-input(placeholder="请输入最高价格" v-model="form.endPrice")
        el-row(:gutter="10")
          el-col(:span="4") 
            div( style="line-height:40px") 类目图标
          el-col(:span="10")
            el-upload(
              class="avatar-uploader"
              :action="upload_url"
              :headers="token"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              )
              img(v-if="form.icon" style="width:100px;height:100px" :src="form.icon" class="avatar")
              i(v-else class="el-icon-plus avatar-uploader-icon")
  
        el-row(:gutter="10")
          el-col(:span="4") 
            div( style="line-height:40px") 关闭/启用
          el-col(:span="10")
            el-input(placeholder="0：关闭，1：启用" v-model="form.state")

        el-row(:gutter="10")
          el-col(:span="6") 
            div( style="line-height:40px") 是否取今日新品
          el-col(:span="10")
            el-input(placeholder="0：全部，1：今日新品" v-model="form.isNew")

        el-row(:gutter="10")
          el-col(:span="6") 
            div( style="line-height:40px") 是否取聚划算商品
          el-col(:span="10")
            el-input(placeholder="0：全部，1：取聚划算" v-model="form.isJu")

        el-row(:gutter="10")
          el-col(:span="6") 
            div( style="line-height:40px") 是否取淘抢购商品
          el-col(:span="10")
            el-input(placeholder="0：全部，1：取淘抢购商品" v-model="form.isTqg")

        el-row(:gutter="10")
          el-col(:span="4") 
            div( style="line-height:40px") 排序方式
          el-col(:span="14")
            el-select(v-model="form.goodsSortType" )
              el-option(
              v-for="item in SortType"  
              :key="item.id" 
              :label="item.title"  
              :value="item.id")

            

            
        span(slot="footer" class="dialog-footer")
          el-button(@click="dialogVisible = false") 取 消
          el-button( type="primary" v-if="dialogTitle=='添加'" @click="create(form)") 确 定
          el-button( type="primary" v-else @click="update(form)") 修改




</template>

<script>
import {
  page,
  delObj,
  addObj,
  updateObj,
  updateStates
} from "@/api/cut/mini/index";
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
      SortType:[
        { id:1, title:'人气排序从高到低（默认）' },
        { id:2, title:'最新排序从高到低' },
        { id:3, title:'销量排序从高到低' },
        { id:4, title:'价格排序从低到高' },
        { id:5, title:'佣金排序从高到低' },
        { id:7, title:'价格排序从高到低' },
        { id:8, title:'人气排序从低到高' },
        { id:9, title:'最新排序从低到高 ' },
      ],
      upload_url: process.env.BASE_API + "/api/admin/upload/picture",
      form:{
        catName:null,
        catId:null,
        startPrice:null,
        endPrice:null,
        icon:null,
        state:null,
        isNew:null,
        goodsSortType:1,
      },
      dialogVisible:false,
      indexMethod: 1,
      dialogTitle:'',
      token: {
        token: getToken()
      },

      list: null,
      total: null,

      listLoading: true,
      listQuery: {
        page: 1,
        limit:10,
        keyword:null,
        state:1
      },


      tableKey: 0
    };
  },
  created() {
    this.getList();
  },
  computed: {
    ...mapGetters([]),
  },
  methods: {
    formReset(){
      this.form = {
        catName:null,
        catId:null,
        startPrice:null,
        endPrice:null,
        icon:null,
        state:null,
        isNew:null,
        isJu:null,
        isTqg:null,
        goodsSortType:1,
      }
    },
    listState(e){
      this.listQuery.state = e;
      this.getList();
    },
    //删除
    deleteObj(id){
      this.$confirm("此操作将永久删除该ID, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(res=>{
        delObj(id)
        .then(response=>{
          const errcode = response.data.errcode;
          if(errcode == 0){
            this.tip('成功','删除成功',1);
            this.getList();
          }else{
            this.tip('失败','删除失败',0);
          }
        })
      })
    },
    //修改
    update(form){
      updateObj(form)
      .then(response=>{
        const errcode = response.data.errcode;
        if(errcode == 0){
          this.tip('成功','修改成功',1);
          this.formReset();
          this.dialogVisible = false;
          this.getList();
        }else{
          this.tip('失败','修改失败',0);
          this.dialogVisible = false;
        }
        
      })
      .catch(err=>{
        console.log(err)
      })
    },
    //开启关闭
    closeOpen(row){
      let newRow = row;
      newRow.state = newRow.state == 1? 0 :1;
      console.log(row)

      let secRow = {
        state : newRow.state,
        id:newRow.id,
      }
      updateStates(secRow)
      .then(res=>{
        const errcode = response.data.errcode;
        if(errcode == 0){
          this.tip('成功','修改成功',1);
          this.getList();
        }else{
          this.tip('失败','修改失败',0);
        }
      })
      .catch(err=>{
        console.log(err)
      })
    },
    handleAvatarSuccess(e){
      this.form.icon = e.data;
    },
    //添加弹层
    showDialog(){
      this.dialogVisible = true;
      this.dialogTitle = '添加'
      this.formReset();
    },
    //修改弹层
    showDialogUp(row){
      this.dialogVisible = true;
      this.dialogTitle = '修改';
      this.form= row;
    },
    //搜索
    searchList(){
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
    //创建新列表
    create(e){
    
      addObj(this.form)
      .then(response=>{

        const errcode = response.data.errcode;
        if(errcode == 0){
          this.tip('成功','创建成功',1);
          this.dialogVisible = false;
          this.getList();
        }else{
          this.tip('失败','创建失败',0);
        }
      })
      .catch(err=>{
        console.log(err)
      })
    },

    tip(title,msg,type=1){
      this.$notify({
        title: title,
        message: msg,
        type: type=1?"success":"fail",
        duration: 2000
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
 
    handleCreate() {
      this.resetTemp();
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
    },




  }
};
</script>

<style scoped>
.el-row{
  margin-top: 10px;
  align-items: center;
  display: flex;
}
</style>


