<template>
  <el-form
    label-position="right"
    label-width="100px"
    :model="user"
    style="max-width: 320px"
    :rules="rules"
    ref="ruleFormRef"
  >
    登录方式
    <el-select v-model="loginMethod" placeholder="使用学号登录">
      <el-option-group
        v-for="group in loginOptions"
        :key="group.label"
        :label="group.label"
      >
        <el-option
          v-for="item in group.options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-option-group>
    </el-select>
    <br />
    <br />
    <el-form-item label="账号" prop="account">
      <el-input
        v-model="user.account"
        placeholder="请输入账号"
        :prefix-icon="User"
      />
    </el-form-item>
    <el-form-item label="密码" prop="password">
      <el-input
        v-model="user.password"
        type="password"
        ref="password"
        placeholder="请输入密码"
        show-password
        :prefix-icon="Lock"
        @keyup.enter="login(ruleFormRef)"
      />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="login(ruleFormRef)">登录</el-button>
      <el-button @click="register">注册</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import { reactive, ref } from "vue";
import { RouterLink, useRouter } from "vue-router";
import axios from "axios";
import { ElMessage, FormInstance, timelineItemProps } from "element-plus";
import { Lock, User } from "@element-plus/icons-vue";
import sha256 from "crypto-js/sha256";
import Base64 from "crypto-js/enc-base64";

const loginMethod = ref("");

loginMethod.value = "stu_id";

const loginOptions = [
  {
    label: "用户登录",
    options: [
      {
        value: "stu_id",
        label: "学号",
      },
      {
        value: "telephone",
        label: "电话号码",
      },
      {
        value: "nickname",
        label: "用户名",
      },
      {
        value: "email",
        label: "邮箱",
      },
    ],
  },
];

const handleSelect = (account: string | number | object) => {
  ElMessage(`click on item ${account}`);
};
const labelPosition = ref("right");
const user = reactive({
  nickname: "",
  account: "",
  stu_id: "",
  password: "",
});

let userToken: "";

let exist: boolean;

const ruleFormRef = ref<FormInstance>();

const validateAccount = (rule: any, value: any, callback: any) => {
  if (value === "") {
    callback(new Error("请输入账号"));
  } else if (loginMethod.value != "admin") {
    checkExist(loginMethod.value, value).then(() => {
      if (exist != true) {
        callback(new Error("请输入正确的账号"));
      }
      callback();
    });
  } else {
    callback();
  }
};

const validatePass = (rule: any, value: any, callback: any) => {
  if (value === "") {
    callback(new Error("请输入密码"));
  } else {
    callback();
  }
};

const rules = reactive({
  account: [{ validator: validateAccount, trigger: "blur" }],
  password: [{ validator: validatePass, trigger: "blur" }],
});

const router = useRouter();

const register = () => {
  router.push("/Register");
};

const login = (form: FormInstance | undefined) => {
  console.log("登录方式：", loginMethod.value);
  getStuID(loginMethod.value, user.account).then(() => {
    if (!form) return;
    form.validate((valid) => {
      if (valid && user.stu_id != "") {
        var data = JSON.stringify({
          stu_id: user.stu_id,
          password: Base64.stringify(
            sha256(user.stu_id + user.password + user.stu_id)
          ),
        });

        var config = {
          method: "post",
          url: "/portalApi/login",
          headers: {
            "Content-Type": "application/json",
          },
          data: data,
        };

        axios(config)
          .then(function (response: any) {
            if (response.data.success == true) {
              ElMessage({
                message: "登录成功!",
                type: "success",
              });
              router.push("/Home");
            } else {
              ElMessage({
                showClose: true,
                message: "密码错误！",
                type: "error",
              });
            }
          })
          .catch(function (error: any) {
            console.log(error);
          });
      } else {
        console.log("error submit!");
        return false;
      }
    });
  });
};

async function getStuID(key: string, val: string) {
  if (key != "stu_id") {
    var config = {
      method: "get",
      url: "portalApi/getStuID?key=" + key + "&value=" + val,
    };

    await axios(config)
      .then(function (response) {
        console.log("inapi:", response.data.stu_id);
        user.stu_id = response.data.stu_id;
      })
      .catch(function (error) {
        console.log(error);
      });
  } else {
    user.stu_id = user.account;
  }
}

async function checkExist(key: string, val: string) {
  //查询有没有这个
  try {
    const response = await axios.get("/portalApi/checkExist", {
      params: {
        value: val,
        key: key,
      },
    });
    exist = <boolean>response.data.exist;
  } catch (error) {
    console.error(error);
  }
}
</script>
