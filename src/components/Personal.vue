<template>
  <el-card class="box-card">
    <template #header>
      <div class="card-header">
        <span>用户信息</span>
        <el-button class="button" type="primary" @click="editUserInfo" v-show="disabledFlag">修改个人资料</el-button>
        <el-button class="button" type="primary" @click="saveUserInfo" v-show="!disabledFlag">确认保存</el-button>
        <el-button class="button" type="text" @click="cancelEditUserInfo" v-show="!disabledFlag">取消</el-button>
      </div>
    </template>
    <el-form :model="user" v-loading="loading">
      <el-form-item label="姓名">
        <el-input v-model="user.name" disabled></el-input>
      </el-form-item>
      <el-form-item label="学号">
        <el-input v-model="user.stu_id" disabled></el-input>
      </el-form-item>
      <el-form-item label="电话">
        <el-input v-model="user.telephone" :disabled=disabledFlag></el-input>
      </el-form-item>
      <el-form-item label="邮箱">
        <el-input v-model="user.email" :disabled=disabledFlag></el-input>
      </el-form-item>
      <el-form-item label="昵称">
        <el-input v-model="user.nickname" :disabled=disabledFlag></el-input>
      </el-form-item>
        <span>职介: {{ User_Status_Name[user.status] }}</span>
      </el-form>
  </el-card>


</template>

<script setup lang="ts">
import {reactive, ref} from "vue";
import axios from "axios";
import {API, GetUserInfoResponse, UserInfo} from "../api/user"
import {ElNotification} from "element-plus";
import {User_Status, User_Status_Name} from "../const/user";

let user = reactive<UserInfo>({
  id: 0,
  stu_id: '',
  name: '',
  nickname: '',
  telephone: '',
  email: '',
  status: 0,
})

// 用于暂存能被修改的字段
let nickname = '';
let telephone = '';
let email = '';

const disabledFlag = ref(true)
const loading = ref(true)

function getUserInformation() {
  axios.get<GetUserInfoResponse>(API.GET_UserInfo)
      .then(function (response){
        user.id = response.data.user.id;
        user.stu_id = response.data.user.stu_id;
        user.name = response.data.user.name;
        user.nickname = response.data.user.nickname;
        user.telephone = response.data.user.telephone;
        user.email = response.data.user.email;
        user.status = response.data.user.status;
        nickname = response.data.user.nickname;
        telephone = response.data.user.telephone;
        email = response.data.user.email;
        loading.value = false
      }).catch(function (error) {
        ElNotification({
          title: '出错啦',
          message: error.response.data.err.Message,
          type: 'error',
        })
      });
}

// 问：上面的axios代码中为什么不直接 user = response.data，而是要给每一个字段赋值呢？
// 答：如果直接将 `user` 赋值为 `response.data`，那么 `user` 就会变成一个普通的 JavaScript 对象，而不是 `reactive` 对象，它的属性将不会被视图跟踪更新。此时如果我们修改 `user` 对象的属性，视图不会响应更新。
//
// 为了让 `user` 对象的属性能够被视图跟踪更新，我们需要使用 `reactive` 函数将其转化成响应式对象。在 Vue.js 中，当获取到响应式对象的属性时，会触发 getter 函数，而当我们修改响应式对象的属性时，会触发 setter 函数，从而通知 Vue.js 更新视图。
//
// 所以，对响应式对象的修改需要使用属性赋值的方式来更新。即使你要更新的属性只有一个或者几个，也都需要一个一个地赋值，否则这些属性的值不会被视图和响应式系统所跟踪和更新。

getUserInformation();

function editUserInfo() {
  disabledFlag.value = false
}

function saveUserInfo() {
  disabledFlag.value = true
  // 如果没有修改过 user 则不调用接口
  if (user.email == email && user.nickname == nickname && user.telephone == telephone) {
    disabledFlag.value = true
    return
  }
  axios.put("/userApi/user", user).then(response => {
    console.log(response.data);
    ElNotification({
      title: '修改成功!',
      type: 'success',
    })
  }).catch(error => {
    ElNotification({
      title: '出错啦',
      message: error.response.data.err.Message,
      type: 'error',
    })
    disabledFlag.value = false
    return
  });
}

function cancelEditUserInfo() {
  // 恢复数据
  user.email = email
  user.telephone = telephone
  user.nickname = nickname
  disabledFlag.value = true
}

</script>

<style scoped>
  .information-option{
    
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .box-card {
    width: 480px;
  }
</style>