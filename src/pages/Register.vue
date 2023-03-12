<template>
    <el-form
    label-position="Right"
    label-width="100px"
    ref="ruleFormRef"
    status-icon
    :model="user"
    :rules="rules"
    style="max-width: 300px"
  >
    <el-form-item label="昵称" prop="nickname">
      <el-input 
      v-model="user.nickname" 
      placeholder="请输入您的昵称" 
      auto-complete="off"
      />
    </el-form-item>
    <el-form-item label="密码" prop="password" style="padding-bottom: 20px">
      <el-input
      v-model="user.password"
      type="password"
      autocomplete="off"
      placeholder="请输入密码"
      @input="checkPasswordStrength"
      />
      <div class="password-strength" v-if="passwordStrength">
        <span :class="`strength-${passwordStrength}`"></span>
        <span>{{ passwordStrengthText() }}</span>
      </div>
    </el-form-item>
    <el-form-item label="确认密码" prop="checkPass">
      <el-input
        v-model="user.checkPass"
        type="password"
        autocomplete="off"
        placeholder="请再次输入密码"
      />
    </el-form-item>
    <el-form-item label="姓名" prop="name" >
      <el-input 
      v-model="user.name" 
      placeholder="请输入姓名" />
    </el-form-item>
    <el-form-item label="学号" prop="stuID">
      <el-input 
      v-model="user.stuID" 
      placeholder="请输入学号" />
    </el-form-item>
    <el-form-item label="电话" prop="telephone">
      <el-input 
      v-model="user.telephone" 
      type="tel"
      placeholder="请输入电话" />
    </el-form-item>
    <el-form-item label="邮箱" prop="email">
      <el-input 
      v-model="user.email" 
      type="email"
      placeholder="请输入邮箱" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="register(ruleFormRef)">注册</el-button>
      <el-button @click="login">返回登录</el-button>
    </el-form-item>
  </el-form>

</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { ElMessage, FormInstance, timelineItemProps } from 'element-plus'
import { useRouter } from 'vue-router'
import sha256 from 'crypto-js/sha256'
import Base64 from 'crypto-js/enc-base64'
import axios from 'axios'

const user = reactive({
    stuID: '',
    password: '',
    checkPass: '',
    name: '',
    nickname: '',
    telephone: '',
    email: '',
})

let exist : boolean

const ruleFormRef = ref<FormInstance>()

const validatePass = (rule: any, value: string, callback: any) => {
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,24}$/.test(value)) {
        callback(new Error('密码必须包含至少一个小写字母、一个大写字母和一个数字，长度至少为8个字符'))
    } else {
        if (user.checkPass != '') {
            if (!ruleFormRef.value) return
            ruleFormRef.value.validateField('checkPass', () => null)
        }
        callback()
    }
}

const validatePass2 = (rule: any, value: string, callback: any) => {
    if (value === '') {
        callback(new Error('请再次输入密码')) 
    } else if (value !== user.password) {
        callback(new Error("两次输入密码不匹配!"))
    } else {
        callback()
    }
}

const validateNickname = (rule: any, value: string, callback: any) => {
    if (value === '') {
        callback(new Error('请输入昵称')) 
    } else if ((/[\'\";]/.test(value))) {
        callback(new Error('昵称不能包含单引号、双引号或分号'))
    } else if (value.length > 30) {
      callback(new Error('昵称长度不能大于30'))
    } else {
        checkExist("nickname", value).then( () => {
            if (exist == true) {
            callback(new Error('该用户名已被注册'))
        }
        callback()
        })
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
    } else if(!/^\d{11,12}$/.test(value)) {
      callback(new Error('学号必须是11位或12位数字'))
    } else {
        checkExist("stuID", value).then( () => {
            if (exist == true) {
            callback(new Error('该学号已注册'))
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
    } else {
        checkExist("telephone", value).then( () => {
            if (exist == true) {
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
    } else {
        checkExist("email", value).then( () => {
            if (exist == true) {
            callback(new Error('该邮箱已被注册'))
        }
        callback()
        })
    }
}

const passwordStrength = ref<number>(0);

const checkPasswordStrength = () => {
  const password = user.password;
  let strength = 0;
  if (password.length >= 6) {
    if (/\d/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\W/.test(password)) strength++;
  }
  passwordStrength.value = strength;
};

const passwordStrengthText = () => {
  switch (passwordStrength.value) {
    case 0:
      return "密码不能为空";
    case 1:
      return "密码强度较弱";
    case 2:
      return "密码强度一般";
    case 3:
      return "密码强度较强";
    case 4:
      return "密码强度很强";
    default:
      return "";
  }
};


const rules = reactive({
    nickname: [{ validator: validateNickname, trigger: 'blur'}],
    password: [{ validator: validatePass, trigger: 'blur'}],
    checkPass: [{ validator: validatePass2, trigger: 'blur'}],
    name: [{ validator: validateName, trigger: 'blur'}],
    stuID: [{ validator: validateStuID, trigger: 'blur'}],
    telephone: [{ validator: validateTel, trigger: 'blur'}],
    email: [{ validator: validateEmail, trigger: 'blur'}],
})

const router = useRouter()

const login = () => {
    router.push('/Login')
}


const register = (form: FormInstance | undefined) => {

  if (!form) return
  form.validate((valid) => {
      if (valid) {
        var data = JSON.stringify({
            "nickname": user.nickname,
            "name": user.name,
            "password": Base64.stringify(sha256(user.stuID+user.password+user.stuID)),
            "stuID": user.stuID,
            "telephone": user.telephone,
            "email": user.email,
            });

        var config = {
        method: 'post',
        url: '/portalApi/register',
        headers: { 
            'Content-Type': 'application/json'
        },
        data : data
        };

        axios(config)
        .then(function (response) {
        // console.log(JSON.stringify(response.data));
            if (response.data.success == true) {
                ElMessage({
                    message: "注册成功!",
                    type: 'success',
                })
                router.push('/Login')
            } else {
                ElMessage({
                    message: "注册失败!",
                    type: 'error',
                })
            }
        })
        .catch(function (error) {
        console.log(error);
        });


      } else {
          console.log('error submit!')
          return false
      }
  })
}


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

<style scoped>
.password-strength {
  display: flex;
  align-items: center;
  margin-top: 10px;
}
.password-strength span:first-child {
  display: inline-block;
  width: 10px;
  height: 10px;
  margin-right: 5px;
  border-radius: 50%;
}
.strength-0 {
  background-color: #ccc;
}
.strength-1 {
  background-color: #f56c6c;
}
.strength-2 {
  background-color: #e6a23c;
}
.strength-3 {
  background-color: #409eff;
}
.strength-4 {
  background-color: #67c23a;
}
</style>