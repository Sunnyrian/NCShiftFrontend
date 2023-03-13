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
      <el-table-column prop="occupation_init_status" label="空闲表">
        <template #default="{ row }">
          {{ formatInitializeStatus(row.occupation_init_status) }}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button @click="showDetail(row)" size="small">详情</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 显示用户详情的浮层 -->
    <el-dialog v-model="detailVisible">
      <h2> {{ currentRowData.name }}的用户信息</h2>
      <el-button class="button" type="primary" @click="editUserInfo" v-show="disabledFlag">修改个人资料</el-button>
      <el-button class="button" type="primary" @click="saveUserInfo(ruleFormRef, currentRowData)" v-show="!disabledFlag">确认保存</el-button>
      <el-button class="button" type="info" @click="cancelEditUserInfo(ruleFormRef)" v-show="!disabledFlag">取消</el-button>
      <el-form :model="currentRowData" :rules="rules" ref="ruleFormRef" :status-icon=!disabledFlag>

        <el-form-item label="姓名" prop="name">
          <el-input v-model="currentRowData.name" :disabled=disabledFlag></el-input>
        </el-form-item>
        <el-form-item label="学号" prop="stu_id">
          <el-input v-model="currentRowData.stu_id" :disabled=disabledFlag></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="telephone">
          <el-input v-model="currentRowData.telephone" :disabled=disabledFlag ></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="currentRowData.email" :disabled=disabledFlag></el-input>
        </el-form-item>
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="currentRowData.nickname" :disabled=disabledFlag></el-input>
        </el-form-item>
        <el-form-item label="账号角色" prop="status">
          <el-select v-model="currentRowData.status" placeholder="Select" :disabled=disabledFlag>
            <el-option
                v-for="item in statusOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            />
          </el-select>
        </el-form-item>
        <div>账号创建时间: {{ formatTime(currentRowData.create_time) }}</div>
        <div>更新时间: {{ formatTimeToMinute(currentRowData.update_time) }}</div>
        <span>职介: {{ User_Status_Name[currentRowData.status] }}</span>
      </el-form>
<!--      <p>{{ JSON.stringify(currentRowData) }}</p>-->
      <div>
        <!-- TODO 需要同步将 editable 修改为 false -->
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
import {ElNotification, FormInstance, FormRules } from "element-plus";

let tableData = ref<UserInfo[]>([])
const route = useRoute()
let exist : boolean
const disabledFlag = ref(true)
const ruleFormRef = ref<FormInstance>()
// 定义显示详情浮层的状态
const detailVisible = ref(false)
const currentRowData = ref<UserInfo>()
let userTemp: UserInfo = {
  id: 0,
  stu_id: '',
  name: '',
  nickname: '',
  telephone: '',
  email: '',
  status: 0,
  create_time: 0,
  update_time: 0,
  occupation_init_status: 0,
};
const statusOptions = [
  {
    value: User_Status.Default,
    label: User_Status_Name[User_Status.Default],
  },
  {
    value: User_Status.Normal,
    label: User_Status_Name[User_Status.Normal],
  },
  {
    value: User_Status.Secretary,
    label: User_Status_Name[User_Status.Secretary],
  },
  {
    value: User_Status.Minister,
    label: User_Status_Name[User_Status.Minister],
  },
  {
    value: User_Status.Admin,
    label: User_Status_Name[User_Status.Admin],
  },
  {
    value: User_Status.Retired,
    label: User_Status_Name[User_Status.Retired],
  },
  {
    value: User_Status.BAN,
    label: User_Status_Name[User_Status.BAN],
  },
]


function getUserList(status: string | string[]) {
  const config = {
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

watch(() => route.params.status,
  (val, preVal) =>{
    getUserList(route.params.status)
  }
)


// 用 const 字符串替换数字
const formatStatus = (val: User_Status) => User_Status_Name[val]

// 将后端的 UNIX 时间转换为人看的时间
const formatTime = (timestamp: number) => dayjs(timestamp * 1000).format('YYYY-MM-DD')
const formatTimeToMinute = (timestamp: number) => dayjs(timestamp * 1000).format('YYYY-MM-DD HH:MM')

const formatInitializeStatus = (val: User_Occupation_Init_Status) => User_Occupation_Init_Status_Name[val]



// 定义点击详情按钮后的方法
const showDetail = (row: UserInfo) => {
  currentRowData.value = row
  userTemp.id = row.id;
  userTemp.stu_id = row.stu_id;
  userTemp.name = row.name;
  userTemp.nickname = row.nickname;
  userTemp.telephone = row.telephone;
  userTemp.email = row.email;
  userTemp.status = row.status;
  userTemp.create_time = row.create_time;
  userTemp.update_time = row.update_time;
  userTemp.occupation_init_status = row.occupation_init_status;
  detailVisible.value = true
}


function editUserInfo() {
  disabledFlag.value = false
}

const saveUserInfo = async(formEl: FormInstance | undefined, user: UserInfo) => {
  if (!formEl) return
  await formEl.validate((valid) => {
    if (valid) {
      // 如果没有修改过 user 则不调用接口
      if (user == userTemp) {
        disabledFlag.value = true
        return
      }

      axios.put("/adminApi/user", user).then(response => {
        ElNotification({
          title: '修改成功!',
          type: 'success',
        })
        // 更新临时数据
        userTemp.stu_id = user.stu_id
        userTemp.email = user.email
        userTemp.telephone = user.telephone
        userTemp.name = user.name
        userTemp.nickname = user.nickname
        userTemp.status = user.status
        disabledFlag.value = true
        getUserList(route.params.status);
      }).catch(error => {
        ElNotification({
          title: '出错啦',
          message: error.response.data.err,
          type: 'error',
        })
        disabledFlag.value = false
        return
      });
    } else {
      console.log('error submit!')
    }
  })
}

const cancelEditUserInfo =  (formEl: FormInstance | undefined) => {
  // 恢复数据
  disabledFlag.value = true;
  if (!formEl) return
  formEl.resetFields()
}


const validateNickname = (rule: any, value: string, callback: any) => {
  if (value === '') {
    callback(new Error('请输入昵称'))
  } else if ((/[\'\";]/.test(value))) {
    callback(new Error('昵称不能包含单引号、双引号或分号'))
  } else if (value.length > 30) {
    callback(new Error('昵称长度不能大于30'))
  } else if (userTemp?.nickname != value) {
    checkExist("nickname", value)
        .then(() => {
          if (exist) {
            callback(new Error('该昵称已被注册'))
          } else {
            callback()
          }
        })
        .catch((error) => {
          console.error(error)
          callback(new Error('验证失败，请稍后再试'))
        })
  } else {
    callback()
  }
}

const validateName = (rule: any, value: string, callback: any) => {
  if (value === '') {
    callback(new Error('请输入您的名字'))
  } else  if (!/^[\u4e00-\u9fa5·]{2,20}$/.test(value)) {
    callback(new Error('姓名必须是2-20个中文汉字或·'))
  } else {
    callback()
  }
}

const validateStuID = (rule: any, value: string, callback: any) => {
  if (value === '') {
    callback(new Error('请输入您的学号'))
  } else if (!/^\d{11,12}$/.test(value)) {
    callback(new Error('学号必须是11位或12位数字'))
  } else if (userTemp?.stu_id != value) {
    checkExist("stu_id", value)
        .then(() => {
          if (exist) {
            callback(new Error('该学号已注册'))
          } else {
            callback()
          }
        })
        .catch((error) => {
          console.error(error)
          callback(new Error('验证失败，请稍后再试'))
        })
  } else {
    callback()
  }
}


const validateTel = (rule: any, value: string, callback: any) => {
  if (value === '') {
    callback(new Error('请输入您的电话'))
  } else if ((!/^1[3456789]\d{9}$/.test(value))){
    callback(new Error('请输入正确的大陆号码'))
  } else if (userTemp?.telephone != value) {
    checkExist("telephone", value)
        .then(() => {
          if (exist) {
            callback(new Error('该电话已被注册'))
          } else {
            callback()
          }
        })
        .catch((error) => {
          console.error(error)
          callback(new Error('验证失败，请稍后再试'))
        })
  } else {
    callback()
  }
}

const validateEmail = (rule: any, value: string, callback: any) => {
  if (value === '') {
    callback(new Error('请输入您的邮箱'))
  } else if (!/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(value)) {
    callback(new Error('请输入正确格式的邮箱'))
  } else if (userTemp?.email != value) {
    checkExist("email", value)
        .then(() => {
          if (exist) {
            callback(new Error('该邮箱已被注册'))
          } else {
            callback()
          }
        })
        .catch((error) => {
          console.error(error)
          callback(new Error('验证失败，请稍后再试'))
        })
  } else {
    callback()
  }
}


const rules = reactive<FormRules>({
  nickname: [{ validator: validateNickname, trigger: 'change'}],
  name: [{ validator: validateName, trigger: 'change'}],
  stu_id: [{ validator: validateStuID, trigger: 'change'}],
  telephone: [{ validator: validateTel, trigger: 'change'}],
  email: [{ validator: validateEmail, trigger: 'change'}],
})

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

</script>
