
export const API = {
    GET_WeekShift: '/userApi/weekShift',
    GET_OccupationTable: '/userApi/occupationTable',
    PUT_User: '/userApi/user',
    POST_XlsUpload: '/userApi/xlsUpload',
    GET_UserInfo: '/userApi/userInfo',
}

interface UserInfo {
    id: number;
    stu_id: string;
    name: string;
    nickname: string;
    telephone: string;
    email: string;
    status: number;
}

interface GetUserInfoResponse {
    success: boolean;
    err: string;
    user: UserInfo;
}

export type {
    UserInfo,GetUserInfoResponse
}