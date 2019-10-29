<template>
<el-form label-width="80px">
  <el-form-item label="群主|领导">
    <el-select v-model="f" multiple filterable remote placeholder="请输入关键词" :remote-method="remoteLeaderMethod" :loading="loading">
      <el-option v-for="item in lItems" :key="item.id" :label="item.name" :value="item.id"> </el-option>
    </el-select>
  </el-form-item>
  <el-form-item label="组员|下属">
    <el-select v-model="members" multiple filterable remote placeholder="请输入关键词" :remote-method="remoteMemberMethod" :loading="loading">
      <el-option v-for="item in mItems" :key="item.id" :label="item.name" :value="item.id"> </el-option>
    </el-select>
  </el-form-item>
  <el-form-item>
    <el-button type="primary" v-if="groupManager_btn_userManager" @click="onSubmit">保存</el-button>
  </el-form-item>
</el-form>
</template>

<script>
import {
  search
} from '@/api/admin/user/index';
import {
  getUsers,
  modifyUsers
} from '@/api/admin/group/index';
import { mapGetters } from 'vuex';
export default {
  props: {
    groupId: {
      default: '1'
    }
  },
  data() {
    return {
      lItems: [],
      mItems: [],
      leaders: [],
      members: [],
      list: [],
      loading: false,
      groupManager_btn_userManager: true
    }
  },
  created() {
    this.initUsers();
    // this.groupManager_btn_userManager = this.elements['groupManager:btn_userManager'];
  },
  computed: {
    ...mapGetters([
      'elements'
    ])
  },
  methods: {
    remoteMemberMethod(query) {
      if (query !== '') {
        this.loading = true;
        this.loading = false;
        search({
          keyword: query
        }).then(response => {
          const obj = response.data;
          if (obj.errcode===0) {
            this.mItems = obj.data;
            this.loading = false;
          }else{
            this.$notify.error({
              title: '错误',
              message: obj.errmsg
            });
         }   
        });
      } else {
        this.mItems = [];
      }
    },
    remoteLeaderMethod(query) {
      if (query !== '') {
        this.loading = true;
        this.loading = false;
        search({
          keyword: query
        }).then(response => {
          const obj = response.data;
          if (obj.errcode===0) {
            this.lItems = obj.data;
            this.loading = false;
          }else{
            this.$notify.error({
              title: '错误',
              message: obj.errmsg
            });
          }   
        });
      } else {
        this.lItems = [];
      }
    },
    onSubmit() {
      const vals = {};
      if (this.members.length > 0) vals.members = this.members.join();
      if (this.leaders.length > 0) vals.leaders = this.leaders.join();
      modifyUsers(this.groupId, vals).then(() => {
        this.$emit('closeUserDialog');
        this.$notify({
          title: '成功',
          message: '保存成功',
          type: 'success',
          duration: 2000
        });
      });
    },
    initUsers() {
      getUsers(this.groupId).then(response => {
        const obj = response.data;
        if (obj.errcode===0) {
          this.lItems = obj.data.leaders;
          this.mItems = obj.data.members;
          const mems = [], leas = [];
          for (let i = 0; i < obj.data.members.length; i++) {
            mems.push(obj.data.members[i].id);
          }
          for (let i = 0; i < obj.data.leaders.length; i++) {
            leas.push(obj.data.leaders[i].id);
          }
          this.members = mems;
          this.leaders = leas;
        }else{
          this.$notify.error({
            title: '错误',
             message: obj.errmsg
          });
        }    
          
      });
    }
  }
}
</script>
