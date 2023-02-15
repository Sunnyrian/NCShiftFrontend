<template>
  <el-menu
      default-active="2"
      class="el-menu-vertical-demo"
      router
  >
    <el-menu-item route="/Home/shift">
      <el-icon><icon-menu /></el-icon>
      <template #title>排班表</template>
    </el-menu-item>
    <el-menu-item index="/Home/WeekDaily">
      <el-icon><List /></el-icon>
      <template #title>日程表</template>
    </el-menu-item>
    <el-menu-item index="/Home/XlsUpload">
      <el-icon><DocumentAdd /></el-icon>
      <template #title>课表上传</template>
    </el-menu-item>
    <el-menu-item index="/Home/log">
      <el-icon><Document /></el-icon>
      <template #title>日志</template>
    </el-menu-item>
    <el-menu-item index="/Home/statistics">
      <el-icon><DataAnalysis /></el-icon>
      <template #title>统计信息</template>
    </el-menu-item>
    <el-menu-item index="/Home/Personal">
      <el-icon><HomeFilled /></el-icon>
      <template #title>个人中心</template>
    </el-menu-item>
  </el-menu>
</template>


<script lang="ts" setup>
import { ref } from "vue";
import {
  Document,
  Menu as IconMenu,
  DataAnalysis,
  HomeFilled,
  DocumentAdd,
  List,
} from "@element-plus/icons-vue";
import cookie from "../api/cookie";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();


</script>