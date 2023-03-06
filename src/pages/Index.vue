<template>
  <el-container>
      <el-header>
        <div class="header">
          <el-dropdown @command="handleCommand">
        <span>{{ user.name }}
        <el-icon>
          <arrow-down/>
        </el-icon>
        </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>
                  当前角色: 管理员
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
        </div>
      </el-header>
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

const router = useRouter();

const user = reactive({
  stuID: "",
  name: "",
  nickname: "",
  telephone: "",
  email: "",
});

getUserInformation();

function getUserInformation() {
  var config = {
    method: "get",
    url: "http://localhost:3500/userApi/userInfo",
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
  width: 200px;
  height: auto;
  right: 0;
}

</style>
