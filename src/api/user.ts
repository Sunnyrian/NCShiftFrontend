interface UserInfo {
    stu_id: string;
    name: string;
    nickname: string;
    telephone: string;
    email: string;
}

interface GetUserInfoResponse {
    success: boolean;
    err: string;
    user: UserInfo;
}

export type {
    UserInfo,GetUserInfoResponse
}