<template>
<div class="app-container calendar-list-container">
  <div class="filter-container">
    <el-button class="filter-item" type="primary" @click="handleCreate" icon="el-icon-plus">添加自定义回复</el-button>
    <el-select class="filter-item" v-model="isAuto"  @visible-change="changeReply">
          <el-option
            v-for="item in autoAndMan"
            :key="item.id"
            :label="item.title"
            :value="item.code">
          </el-option>
    </el-select>

        <div style="color:#666;margin-left:20px" class="filter-item" type="default" disabled="">自定义回复刷新时间点 :</div>

        <el-select class="filter-item" multiple v-model="time_choose" placeholder="默认" @change="timeChange">
              <el-option
                v-for="item in timing"
                :key="item.id"
                :label="item.label"
                :value="item.value">
              </el-option>
        </el-select>
  </div>

  <!-- 列表 -->
  <el-table  :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%" >
    <el-table-column label="序号" align="center"
      type="index"
      :index="indexMethod">
    </el-table-column>

    <el-table-column  align="center" label="关键词"> 
      <template slot-scope="scope">
        <span>{{scope.row.actKeyword}}</span>
      </template> 
    </el-table-column>

    <el-table-column  align="center" label="标题"> 
      <template slot-scope="scope">
        <span>{{scope.row.title}}</span>
      </template> 
    </el-table-column>

    <el-table-column  align="center" label="描述/消息内容"> 
      <template slot-scope="scope">
        <span>{{scope.row.description || scope.row.msgTxt || '暂无描述或内容'}}</span>
      </template> 
    </el-table-column>

    <el-table-column  align="center" label="链接"> 
      <template slot-scope="scope">
        <span v-if="scope.row.mediaType == 1">【mediaId】 {{scope.row.mediaId}}</span>
        <span v-if="scope.row.mediaType == 3">【mediaId】 {{scope.row.mediaId}}</span>
        <span v-else>{{scope.row.url ||'暂无链接'}}</span>
      </template> 
    </el-table-column>

    <el-table-column  align="center" label="活动图片"> 
      <template slot-scope="scope">
        <img v-if="scope.row.url" :src="scope.row.url" style="width:80px" alt="">
        <img v-if="scope.row.thumbUrl" :src="scope.row.thumbUrl" style="width:80px" alt="">
      </template> 
    </el-table-column>

    <el-table-column  align="center" label="回复类型"> 
      <template slot-scope="scope">
        <span v-if="scope.row.replyType == 0">未指定</span>
        <span v-if="scope.row.replyType == 1">默认回复</span>
        <span v-if="scope.row.replyType == 2">随机回复</span>
        <span v-if="scope.row.replyType == 3">关键词回复</span>
      </template> 
    </el-table-column>

    <el-table-column  align="center" label="状态"> 
      <template slot-scope="scope">
        <span>{{scope.row.status == 0? '未启用' : '已启用'}}</span>
      </template> 
    </el-table-column>
    
    <el-table-column align="center" fixed="right" width="250" label="操作">
        <template slot-scope="scope">
          <el-button size="small" type="warning" @click="openOrClose(scope.row.status,scope.row.id)">{{scope.row.status == 1?'关闭':'开启'}}
          </el-button>
           <el-button size="small" type="success" @click="handleUpdate(scope.row)">修改
          </el-button>
           <el-button size="small" type="danger" @click="handleDel(scope.row.id)">删除
          </el-button>
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
  
  <!-- 添加按钮弹窗 -->
  <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">

    <el-form :model="form" ref="form" label-width="100px">
      <el-form-item label="类型">
        <el-select v-model="form.mediaType"  placeholder="请选择" @change="typeChange">
          <el-option
            v-for="item in sections"
            :key="item.id"
            :label="item.title"
            :value="item.code">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="标题" prop="title">
        <el-input type="text" v-model="form.title"  placeholder="请输入标题"></el-input>
      </el-form-item>
      <el-form-item label="描述" prop="description" v-if="this.TYPE == 'imgTxt'">
        <el-input type="text" v-model="form.description"  placeholder="请输入描述"></el-input>
      </el-form-item>
      <el-form-item label="跳转URL" prop="url"  v-if="this.TYPE == 'imgTxt' || this.TYPE == 'mini'">
        <el-input type="text" v-model="form.url"  placeholder="请输入跳转URL"></el-input>
      </el-form-item>

      <el-form-item label="图片" prop="img" v-if="this.TYPE == 'image' || this.TYPE == 'imgTxt' || this.TYPE == 'mini'">
        <el-upload
          class="avatar-uploader"
          :action="upload_url + '/' + this.form.mediaType"
          :headers="token"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload">
          <img v-if="form.img" style="width:160px" :src="form.img.url" class="avatar" />
          <i v-if="!form.img && this.TYPE == 'image'" class="el-icon-plus avatar-uploader-icon"></i>
          <i v-if="!form.img && this.TYPE == 'imgTxt'" class="el-icon-plus avatar-uploader-icon"></i>
          <i v-if="!form.img && this.TYPE == 'mini'" class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        <div v-if="!form.img && this.TYPE == 'imgTxt'">【支持 JPG、PNG 格式，大图 640 X 320，小图 80 X 80】</div>
        <div v-if="!form.img && this.TYPE == 'mini'">【小程序消息卡片的封面,建议大小为 520*416】</div>
      </el-form-item>
      
      <el-form-item label="文本内容" prop="content" v-if="this.TYPE == 'text' || this.TYPE == 'imgTxt' || this.TYPE == 'mini'">
        <el-input type="text" v-model="form.msgTxt"  placeholder="请输入文本内容"></el-input>
      </el-form-item>

      <el-form-item label="回复类型" prop="content" >
        <el-select v-model="form.replyType"  placeholder="请选择">
          <el-option
            v-for="item in replyTypes"
            :key="item.id"
            :label="item.title"
            :value="item.code">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="回复关键词" prop="content" >
        <el-input type="text" v-model="form.actKeyword"  placeholder="请输入关键词内容"></el-input>
      </el-form-item>

    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel('form')">取 消</el-button>
      <el-button v-if="dialogStatus=='create'" type="primary" @click="create('form')">保 存</el-button>
      <el-button v-else type="primary" @click="update('form')">修 改</el-button>
    </div>
  </el-dialog >
</div>
</template>

<script>
import {
  page,
  insertObj,
  setAuto,
  setTime,
  getMsg,
  getTimeSet,
  delObj,
  changeObj,
  openObj
} from "@/api/mina/customer/index";
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
      TYPE:'',
      isAuto:0,
      time_choose:[],
      replyTypes:[
        {
          id:0,
          title:"未指定",
          code:0,
        },
        {
          id:1,
          title:"默认回复",
          code:1,
        },
        {
          id:2,
          title:"随机回复",
          code:2,
        },
        {
          id:3,
          title:"关键词回复",
          code:3,
        },
      ],
      autoAndMan:[
        {
          id:0,
          title:"人工回复",
          code:0,
        },
        {
          id:1,
          title:"自动回复",
          code:1,
        },
      ],
      timing:[
        {id:0,label:0,value:'0'},
        {id:1,label:2,value:'2'},
        {id:2,label:4,value:'4'},
        {id:3,label:6,value:'6'},
        {id:4,label:8,value:'8'},
        {id:5,label:10,value:'10'},
        {id:6,label:12,value:'12'},
        {id:7,label:14,value:'14'},
        {id:8,label:16,value:'16'},
        {id:9,label:18,value:'18'},
        {id:10,label:20,value:'20'},
        {id:11,label:22,value:'22'},
        {id:12,label:24,value:'24'},
      ],

      upload_url: process.env.BASE_API + "/api/admin/cusServMsg/uploadWxImage",
      token: {
        token: getToken()
      },
      indexMethod: 1,
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        page:1,
        limit:10,
      },
      sections: [
        {
          title: "图片消息",
          code: 1,
          id: 1
        },
        {
          title: "图文链接",
          code: 2,
          id: 2
        },
        {
          title: "文字消息",
          code: 0,
          id: 3
        },
        {
          title: "小程序消息",
          code: 3,
          id: 4
        },
      ],

      dialogStatus: "",
      dialogFormVisible: false,
      dialogCreateVisible: false,
      textMap: {
        update: "编辑",
        create: "添加",
        section: "创建区域"
      },
      form: {
        img: "",
        mediaType: "",
        replyType: "",
        title: "",
        description:"",
        url:"",
        msgTxt:"",
        actKeyword:"",
      },
      tableKey: 0
    };
  },
  
  created() {
    this.getList();
    this.getAuto();
    this.getTimeInfo();
  },
  computed: {
    
    ...mapGetters([])
  },
  methods: {
    //关闭或者开启
    openOrClose(status,id){
      console.log(status,id)
      const openStatus = status == 1? '关闭':'开启'
      this.$confirm("是否"+ openStatus +"该消息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(()=>{
        openObj({isOpen: status ==1 ? 0:1,id:id})
        .then(response=>{
          if (response.data.errcode == 0) {
              this.getList();
              this.$notify({
                title: "成功",
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
        }).catch(err=>console.log(err))
      }).catch(err=>console.log(err))
    },
    typeChange(){
      this.changeTpye();
    },
    //更换添加类型
    changeTpye(){
      if(this.form.mediaType == 0) {this.TYPE = 'text';return}
      else if(this.form.mediaType == 1) {this.TYPE = 'image';return }
      else if(this.form.mediaType == 2) {this.TYPE = 'imgTxt';return }
      else if(this.form.mediaType == 3) {this.TYPE = 'mini';return }
    },
    //获取人工回复自动回复信息
    getAuto(){
      getMsg()
      .then(res=>{
        this.isAuto = parseInt(res.data.data);
      })
      .catch(err=>console.log(err))
    },
    //服务端获取列表
    getList() {
      this.listLoading = true;
      console.log(this.listQuery);
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
    //回复选择
    changeReply(e){
      if(!e){
        setAuto({type:this.isAuto})
        .then(res=>{
          if(res.data.errcode == 0){
            this.getAuto();
            this.$notify({
                title: "成功",
                message: "切换成功",
                type: "success",
                duration: 2000
              });
          }
        })
        .catch(err=>{console.log(err)})
      }
    },
    //获取时间设置配置信息
    getTimeInfo(){
      getTimeSet()
      .then(res=>{
        let arr = res.data.data.split(',') || [];
        this.time_choose = arr;
      }).catch(err=>console.log(err))
    },
    //时间点选择
    timeChange(e){
      setTime({times:this.time_choose.join(',')})
      .then(res=>{
        this.getTimeInfo();
      }).catch(err=>{
        console.log(err)
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
    //添加按钮
    handleCreate() {
      this.resetTemp();
      this.TYPE = '';
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
    },

    /**
     * 点击修改按钮
     */
    handleUpdate(row) {
      this.resetTemp();
      this.dialogFormVisible = true;
      this.dialogStatus = "update";
      this.form.mediaType = row.mediaType;
      this.changeTpye();
      this.formShow(row);
      console.log(JSON.stringify(row,null,4))
    },
    //修改的form表单值
    formShow(row){
      if(this.TYPE == 'text'){
        this.form = {
          id:row.id,
          title:row.title,
          mediaType : 0,
          msgTxt :row.msgTxt,
          replyType :row.replyType,
          actKeyword : row.actKeyword
        }
      }else if(this.TYPE == 'image'){
        this.form = {
          id:row.id,
          title:row.title,
          mediaType : 1,
          img:{mediaId:row.mediaId,url:row.url},
          replyType :row.replyType,
          actKeyword : row.actKeyword
        }
      }else if(this.TYPE == 'imgTxt'){
        this.form = {
          id:row.id,
          mediaType : 2,
          title : row.title,
          description : row.description,
          url : row.url,
          img : {url:row.thumbUrl},
          replyType :row.replyType,
          actKeyword : row.actKeyword,
          msgTxt : row.msgTxt
        }
      }else if(this.TYPE == 'mini'){
        this.form = {
          id:row.id,
          mediaType : 3,
          title : row.title,
          url: row.pagepath,
          img:{mediaId:row.mediaId,url:row.url},
          replyType :row.replyType,
          actKeyword : row.actKeyword,
          msgTxt : row.msgTxt
        }
      }
    },
    //上传成功之后
    handleAvatarSuccess(res, file) {
      console.log(res);
      this.form.img = res.data;
    },
    //上传图片之前
    beforeAvatarUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$message.error("上传图片大小不能超过 2MB!");
        return false
      }
      if(this.form.mediaType == ""){
        this.$message.error("请先选择类型");
        return false
      }
      
      console.log(this.upload_url);

    },

    //添加消息处理
    dealMsg(obj){
      if(this.TYPE == 'text'){
        return {
          id: this.dialogStatus == 'update'? obj.id : '',
          title:obj.title,
          mediaType : 0,
          msgTxt :obj.msgTxt,
          replyType :obj.replyType,
          actKeyword : obj.actKeyword
        }
      }else if(this.TYPE == 'image'){
        return {
          id: this.dialogStatus == 'update'? obj.id : '',
          title:obj.title,
          mediaType : 1,
          mediaId :obj.img.mediaId, //图片上传服务器之后的media_id
          url:obj.img.url,
          replyType :obj.replyType,
          actKeyword : obj.actKeyword
        }
      }else if(this.TYPE == 'imgTxt'){
        return {
          id: this.dialogStatus == 'update'? obj.id : '',
          mediaType : 2,
          title : obj.title,
          description : obj.description,
          url : obj.url,
          thumbUrl : obj.img.url, //图片上传服务器的thumbUrl
          replyType :obj.replyType,
          actKeyword : obj.actKeyword,
          msgTxt : obj.msgTxt
        }
      }else if(this.TYPE == 'mini'){
        return {
          id: this.dialogStatus == 'update'? obj.id : '',
          mediaType : 3,
          title : obj.title,
          pagepath : obj.url,
          mediaId : obj.img.mediaId,//图片服务器传来的thumb_media_id 
          url:obj.img.url,
          replyType :obj.replyType,
          actKeyword : obj.actKeyword,
          msgTxt : obj.msgTxt
        }
      }
    },
    /**
     * 创建自定义回复
     */
    create(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const formData = this.dealMsg(this.form);
          console.log(JSON.stringify(formData,null,4));
          // return
          insertObj(formData).then(response => {
            this.dialogFormVisible = false;
            if (response.data.errcode == 0) {
              this.getList();
              this.$notify({
                title: "成功",
                message: "创建成功",
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
          });
        } else {
          return false;
        }
      });
    },
    /**
     * 修改
     */
    update(formName) {
      const set = this.$refs;
      set[formName].validate(valid => {
        if (valid) {
          this.dialogFormVisible = false;
          const formData = this.dealMsg(this.form);
          console.log(JSON.stringify(formData,null,4));
          changeObj(formData).then(response => {
            var obj = response.data;
            if (obj.errcode == 0) {
              this.dialogFormVisible = false;
              this.getList();
              this.$notify({
                title: "成功",
                message: "修改成功",
                type: "success",
                duration: 2000
              });
            } else {
              this.dialogFormVisible = false;
              this.$notify.error({
                title: "错误",
                message: obj.errmsg
              });
            }
          });
        } else {
          return false;
        }
      });
    },
    //删除消息
    handleDel(id) {
      this.$confirm("此操作将永久删除该消息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          delObj(id).then(response => {
            this.dialogFormVisible = false;
            if (response.data.errcode == 0) {
              this.getList();
              this.$message({
                type: "success",
                message: "删除成功!"
              });
            } else {
              this.$notify({
                title: "错误",
                message: response.data.errmsg,
                type: "error",
                duration: 2000
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },

    resetTemp() {
      this.form = {
        img: "",
        mediaType: "",
        replyType: "",
        title: "",
        description:"",
        msgTxt:"",
        actKeyword:"",
        url:'',
      };
    }
  }
};
</script>
