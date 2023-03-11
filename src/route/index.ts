import { createRouter, createWebHashHistory, createWebHistory, RouteRecordRaw} from 'vue-router'

import Login from '../pages/Login.vue'
import Register from '../pages/Register.vue'
import Home from '../pages/Index.vue'
import Admin from '../pages/Admin.vue';
import UserList from '../components/UsersList.vue';
import NotFound from '../pages/NotFound.vue'
import NotAdmin from '../pages/NotAdmin.vue'
import Setting from '../components/Setting.vue'
import Shift from '../components/Shift.vue'
import WeekDaily from '../components/WeekDaily.vue'
import XlsUpload from '../components/XlsUpload.vue'
import Personal from '../components/Personal.vue'
import { tr } from 'element-plus/lib/locale'
import axios from 'axios'
import cookie from '../api/cookie.js'
import {User_Status} from "../const/user";



const routes: Array<RouteRecordRaw> = [
    {   
        path: '/',
        name: '/',
        redirect: '/Login',
    },
    { 
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: NotFound,
    },
    {
        path: '/Login',
        name: 'Login',
        component: Login,
    },
    { 
        path: '/Register',
        name: 'Register',
        component: Register,
    },
    { 
        path: '/Home',
        name: 'Home',
        component: Home,
        children: [
            {
                path: 'Shift',
                name: 'Shift',
                component: Shift,
            },
            {
                path: 'WeekDaily',
                name: 'WeekDaily',
                component: WeekDaily,
            },
            {
                path: 'XlsUpload',
                name: 'XlsUpload',
                component: XlsUpload,
            },
            {
                path: 'Personal',
                name: 'Personal',
                component: Personal,
            },
        ]
    },
    {
        path: '/NotAdmin',
        name: 'NotAdmin',
        component: NotAdmin,
    },
    {
        path: '/Admin',
        name: 'Admin',
        component: Admin,
        children: [
            {
                path: 'Users/:status',
                name: 'Users',
                component: UserList,
            },
            {
                path: 'Setting',
                name: 'Setting',
                component: Setting,
            },
            {
                path: 'Shift',
                name: 'ShiftManage',
                component: Shift,
            },
        ],
        beforeEnter: (to, from) => {
            if(from.name != 'Admin') {
                checkLogin().then(() => {
                    changeRouteToAdmin(adminStatus)
                })
            }
            
        },
    },
]

const router = createRouter({
    history: createWebHashHistory(),
    routes: routes,
})


let loginStatus:boolean
let adminStatus:boolean

router.beforeEach((to, from) => {

    const token = cookie.get("token")
    console.log("beforeEach~")
    if ( to.name != 'Login' && to.name != 'Register'){
        if (token === null) {
            return { name: 'Login'}
        } else {
            checkLogin().then( () => {
            changeRouteToLogin(loginStatus)
            })
        }
    } else {
        checkLogin().then( () => {
            changeRouteToHome(loginStatus)
        })
    }
    
})

function changeRouteToLogin (loginStatus: boolean) {
    // 如果没登录
    if(!loginStatus) {
        router.push('/Login')
    }
}

function changeRouteToHome (loginStatus: boolean) {
    // 如果登录了
    if(loginStatus) {
        router.push('/Home')
    }
}

function changeRouteToAdmin (adminStatus: boolean) {
    if(adminStatus){
        router.push('/Admin')
    } else {
        router.push('/NotAdmin')
    }
}

async function checkLogin() {

    const config = {
        method: 'get',
        url: 'portalApi/checkLogin',
    };

    await axios(config)
    .then(function (response:any) {
        loginStatus = response.data.success
        if (response.data.status == User_Status.Admin) {
            adminStatus = true
        } else {
            adminStatus = false
        }
        return adminStatus
    })
    .catch(function (error:any) {
    console.log(error);
    });
}



export default router