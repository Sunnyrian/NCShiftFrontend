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

const user = reactive({
  stuID: "",
  name: "",
  nickname: "",
  telephone: "",
  email: "",
});


function getUserInformation() {
  var config = {
    method: "get",
    url: "http://localhost:3500/userApi/getUserInfo",
  };
  axios(config)
      .then(function (response) {
        user.stuID = response.data.stuID;
        user.name = response.data.name;
        user.nickname = response.data.nickname;
        user.telephone = response.data.telephone;
        user.email = response.data.email;
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