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
    <el-form :model="user" v-loading="loading" :rules="rules" ref="ruleFormRef">
      <el-form-item label="姓名">
        <el-input v-model="user.name" disabled></el-input>
      </el-form-item>
      <el-form-item label="学号">
        <el-input v-model="user.stu_id" disabled></el-input>
      </el-form-item>
      <el-form-item label="电话" prop="telephone">
        <el-input v-model="user.telephone" :disabled=disabledFlag></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="user.email" :disabled=disabledFlag></el-input>
      </el-form-item>
      <el-form-item label="昵称" prop="nickname">
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
import {ElNotification, ElMessage, FormInstance} from "element-plus";
import {User_Status, User_Status_Name} from "../const/user";
import dayjs from "dayjs";
import Base64 from "crypto-js/enc-base64";
import sha256 from "crypto-js/sha256";

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

const ruleFormRef = ref<FormInstance>()

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

const  saveUserInfo = () => {
  // 如果没有修改过 user 则不调用接口
  if (user.value.email == email && user.value.nickname == nickname && user.value.telephone == telephone) {
    disabledFlag.value = true
    return
  }

  axios.put("/userApi/user", user.value).then(response => {
    ElNotification({
      title: '修改成功!',
      type: 'success',
    })
    // 更新临时数据
    email=user.value.email
    telephone=user.value.telephone
    nickname=user.value.nickname
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

let exist : boolean
async function checkExist(key : string, val : string){
  //查询有没有人注册过这个昵称
  try {
    const response = await axios.get('/portalApi/checkExist',{
      params: {
        value: val,
        key: key,
      }
    })
    exist = <boolean>response.data.exist
  } catch (error) {
    console.error(error);
  }
}

const validateNickname = (rule: any, value: string, callback: any) => {
  if (value === '') {
    callback(new Error('请输入昵称'))
  } else if ((/[\'\";]/.test(value))) {
    callback(new Error('昵称不能包含单引号、双引号或分号'))
  } else if (value.length > 30) {
    callback(new Error('昵称长度不能大于30'))
  } else if (nickname != value){
    checkExist("nickname", value).then( () => {
      if (exist) {
        callback(new Error('该用户名已被注册'))
      }
      callback()
    })
  }
}

const validateTel = (rule: any, value: string, callback: any) => {
  if (value === '') {
    callback(new Error('请输入您的电话'))
  } else if ((!/^1[3456789]\d{9}$/.test(value))){
    callback(new Error('请输入正确的大陆号码'))
  } else if (telephone != value){
    checkExist("telephone", value).then( () => {
      if (exist) {
        callback(new Error('该电话已被注册'))
      }
      callback()
    })
  }
}

const validateEmail = (rule: any, value: string, callback: any) => {
  if (value === '') {
    callback(new Error('请输入您的邮箱'))
  } else if (!/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(value)) {
    callback(new Error('请输入正确格式的邮箱'))
  } else if (email != value){
    checkExist("email", value).then( () => {
      if (exist) {
        callback(new Error('该邮箱已被注册'))
      }
      callback()
    })
  }
}

const rules = reactive({
  nickname: [{ validator: validateNickname, trigger: 'blur'}],
  telephone: [{ validator: validateTel, trigger: 'blur'}],
  email: [{ validator: validateEmail, trigger: 'blur'}],
})


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