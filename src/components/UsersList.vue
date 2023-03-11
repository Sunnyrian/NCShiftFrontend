<template>
  <div>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column type="index" label="序号"></el-table-column>
      <el-table-column prop="stu_id" label="学号"></el-table-column>
      <el-table-column prop="nickname" label="昵称"></el-table-column>
      <el-table-column prop="name" label="姓名"></el-table-column>
      <el-table-column prop="email" label="邮箱"></el-table-column>
      <el-table-column prop="telephone" label="电话"></el-table-column>
      <el-table-column prop="status" label="状态">
        <template #default="{ row }">
          {{ formatStatus(row.status) }}
        </template>
      </el-table-column>
      <el-table-column prop="create_time" label="创建时间">
        <template #default="{ row }">
          {{ formatTime(row.create_time) }}
        </template>
      </el-table-column>
<!--      <el-table-column prop="update_time" label="更新时间">-->
<!--        <template #default="{ row }">-->
<!--          {{ formatTime(row.update_time) }}-->
<!--        </template>-->
<!--      </el-table-column>-->
      <el-table-column prop="occupation_init_status" label="空闲表">
        <template #default="{ row }">
          {{ formatInitializeStatus(row.occupation_init_status) }}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button @click="showDetail(row)" size="mini">详情</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 显示用户详情的浮层 -->
    <el-dialog v-model="detailVisible">
      <p>{{ JSON.stringify(currentRowData) }}</p>
      <div slot="footer">
        <el-button @click="detailVisible = false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import axios from "axios";
import { watch, reactive, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import {
  User_Occupation_Init_Status,
  User_Occupation_Init_Status_Name,
  User_Status,
  User_Status_Name
} from "../const/user";
import dayjs from 'dayjs'
import {UserInfo} from "@/api/user";
let tableData = ref<UserInfo[]>([])
const route = useRoute()


function getUserList(status: string | string[]) {
  var config = {
    method: "get",
    url: "/adminApi/users?status=" + status,
  };

  axios(config)
    .then(function (response) {
       tableData.value = response.data.users;
    })
    .catch(function (error) {
      console.log(error);
    });
}
getUserList(route.params.status);

function getTableData() {
    console.log("now the TableData is:",tableData)
}

watch(() => route.params.status,
  (val, preVal) =>{
    getUserList(route.params.status)
  }
)

// 用 const 字符串替换数字
const formatStatus = (val: User_Status) => User_Status_Name[val]

// 将后端的 UNIX 时间转换为人看的时间
const formatTime = (timestamp: number) => dayjs(timestamp * 1000).format('YYYY-MM-DD')

const formatInitializeStatus = (val: User_Occupation_Init_Status) => User_Occupation_Init_Status_Name[val]

// 定义显示详情浮层的状态
const detailVisible = ref(false)
const currentRowData = ref<UserInfo>()

// 定义点击详情按钮后的方法
const showDetail = (row: UserInfo) => {
  currentRowData.value = row
  detailVisible.value = true
}

</script>
