<template>
  <el-descriptions title="User Info"
                   border
  >
    <el-descriptions-item label="姓名">{{ user.name }}</el-descriptions-item>
    <el-descriptions-item label="电话">{{ user.telephone }}</el-descriptions-item>
    <el-descriptions-item label="邮箱">{{ user.email }}</el-descriptions-item>
    <el-descriptions-item label="用户角色">
      placeholder
    </el-descriptions-item>
    <el-descriptions-item label="昵称"
    >{{ user.nickname }}
    </el-descriptions-item
    >
  </el-descriptions>
  <div class="information-option">
    <el-button type="primary">
      修改个人资料
    </el-button>
  </div>

</template>

<script setup lang="ts">
import {reactive} from "vue";
import axios from "axios";
import {GetUserInfoResponse} from "../api/user"

let user = reactive({
  stu_id: "",
  name: "",
  nickname: "",
  telephone: "",
  email: "",
});


function getUserInformation() {
  axios.get<GetUserInfoResponse>("/userApi/userInfo")
      .then(function (response){
        user.stu_id = response.data.user.stu_id;
        user.name = response.data.user.name;
        user.nickname = response.data.user.nickname;
        user.telephone = response.data.user.telephone;
        user.email = response.data.user.email;
        console.log(response)
      })
        .catch(function (error) {
        console.log(error);
      });
}

getUserInformation();

</script>

<style scoped>
  .information-option{
    
  }
</style>