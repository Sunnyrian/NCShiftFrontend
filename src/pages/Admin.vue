<template>
  <div class="common-layout">
    <el-container>
      <el-header>
        <el-button plain @click="logOut">退出登录</el-button>
        <el-button text @click="backToHome">个人中心</el-button>
      </el-header>
      <el-container>
        <el-aside width="200px">
          <el-menu
              default-active="2"
              class="el-menu-vertical-demo"
              router
          >
            <el-sub-menu index="NA">
              <template #title>
                <el-icon><Avatar /></el-icon>
                <span>用户管理</span>
              </template>

              <el-menu-item-group>
                <el-menu-item index="/Admin/Users/1">在职网管</el-menu-item>
                <el-menu-item index="/Admin/Users/*">所有人员</el-menu-item>
                <el-menu-item index="/Admin/Users/2">干事</el-menu-item>
                <el-menu-item index="/Admin/Users/5">部长</el-menu-item>
                <el-menu-item index="/Admin/Users/10">管理员</el-menu-item>
                <el-menu-item index="/Admin/Users/0">预注册账号</el-menu-item>
                <el-menu-item index="/Admin/Users/250">已禁用账号</el-menu-item>
                <el-menu-item index="/Admin/Users/233">退休账号</el-menu-item>
              </el-menu-item-group>
            </el-sub-menu>

            <el-menu-item index="/shift">
              <el-icon><icon-menu /></el-icon>
              <template #title>班次管理</template>
            </el-menu-item>

            <el-menu-item index="/ot">
              <el-icon><List /></el-icon>
              <template #title>空闲系统</template>
            </el-menu-item>
            <el-menu-item index="/Admin/setting">
              <el-icon><Setting /></el-icon>
              <template #title>系统设置</template>
            </el-menu-item>
            <el-menu-item index="/log">
              <el-icon><Document /></el-icon>
              <template #title>日志文件</template>
            </el-menu-item>
          </el-menu>
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
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import {
  Document,
  Menu as IconMenu,
  Location,
  Avatar,
  Setting,
  List,
  Bell,
} from "@element-plus/icons-vue";
import IndexFooter from "../components/Footer.vue"
import cookie from "../api/cookie";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();

function logOut() {
  cookie.remove("token");
  router.push("/Login");
}

function backToHome() {
  router.push("/Home");
}

const isCollapse = ref(true);

</script>

<style>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
</style>
