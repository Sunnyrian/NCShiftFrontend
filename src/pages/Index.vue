<template>
  <el-dropdown @command="handleCommand" class="header-userInfo">
    <span>{{ user.nickname }}
    <el-icon>
      <arrow-down/>
    </el-icon>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item>
          当前角色: {{ User_Status_Name[user.status] }}
        </el-dropdown-item>
        <el-dropdown-item>
          个人中心
        </el-dropdown-item>
        <el-dropdown-item command="logOut" divided>
          退出登录
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
  <el-container>
    <el-aside width="200px">
      <side-bar></side-bar>
    </el-aside>
    <el-container>
      <el-main>
        <router-view></router-view>
      </el-main>
      <el-footer>
        <IndexFooter></IndexFooter>
      </el-footer>
    </el-container>
  </el-container>
</template>

<script lang="ts" setup>
import { reactive, ref } from "vue";
import { RouterLink, useRouter } from "vue-router";
import {
  ArrowDown
} from "@element-plus/icons-vue";
import axios from "axios";
import cookie from "../api/cookie";
import sidebar from "../components/SideBar.vue"
import IndexFooter from "../components/Footer.vue"
import {API, GetUserInfoResponse, UserInfo} from "../api/user";
import {ElNotification} from "element-plus";
import {User_Status, User_Status_Name} from "../const/user";

const router = useRouter();

let user = reactive<UserInfo>({
  id: 0,
  stu_id: '',
  name: '',
  nickname: '',
  telephone: '',
  email: '',
  status: 0,
})

getUserInformation();

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
      }).catch(function (error) {
    ElNotification({
      title: '出错啦',
      message: error.response.data.err.Message,
      type: 'error',
    })
  });
}

function logOut() {
  cookie.remove("token");
  router.push("/Login");
}

const handleCommand = (command: string) =>{
  if (command === "logOut" ){
    logOut()
  }
}

</script>

<style>

.header{
  width: 100%;
  height: auto;
  background: bisque;
}

.header-userInfo{
  width: 100%;
  background: bisque;
  height: auto;
}

</style>
