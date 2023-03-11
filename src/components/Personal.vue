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
      <div>上任时间: {{ formatTime(user.create_time) }}</div>
        <span>职介: {{ User_Status_Name[user.status] }}</span>
      </el-form>
  </el-card>


</template>

<script setup lang="ts">
import {reactive, ref} from "vue";
import axios from "axios";
import {API, GetUserInfoResponse, UserInfo} from "../api/user"
import {ElNotification, ElMessage} from "element-plus";
import {User_Status, User_Status_Name} from "../const/user";
import dayjs from "dayjs";
import Schema from 'async-validator';

let user = ref<UserInfo>({
  id: 0,
  stu_id: '',
  name: '',
  nickname: '',
  telephone: '',
  email: '',
  status: -1,
  create_time: 0,
  update_time: 0,
  occupation_init_status: 0,
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
        user.value = response.data.user
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

getUserInformation();

function editUserInfo() {
  disabledFlag.value = false
}

function saveUserInfo() {
  // 如果没有修改过 user 则不调用接口
  if (user.value.email == email && user.value.nickname == nickname && user.value.telephone == telephone) {
    disabledFlag.value = true
    return
  }
  if (user.value.nickname == '') {
    alert('昵称不能为空！')
  }
  if (!/^1\d{10}$/.test(user.value.telephone)) {
    ElMessage({
      type: 'error',
      message: `请输入11位的大陆电话号码`,
    })
    return
  }
  if (!/^\w+@[a-z0-9]+\.[a-z]{2,4}$/.test(user.value.email)) {
    ElMessage({
      type: 'error',
      message: `请输入正确的邮箱`,
    })
    return
  }
  axios.put("/userApi/user", user.value).then(response => {
    ElNotification({
      title: '修改成功!',
      type: 'success',
    })
    disabledFlag.value = true
  }).catch(error => {
    ElNotification({
      title: '出错啦',
      message: error.response.data.err,
      type: 'error',
    })
    disabledFlag.value = false
    return
  });
}

function cancelEditUserInfo() {
  // 恢复数据
  user.value.email = email
  user.value.telephone = telephone
  user.value.nickname = nickname
  disabledFlag.value = true
}

// 将后端的 UNIX 时间转换为人看的时间
const formatTime = (timestamp: number) => dayjs(timestamp * 1000).format('YYYY-MM-DD')




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