
enum User_Status {
    Default = 0,
    Normal = 1,
    Secretary = 2,
    Minister = 5,
    Admin = 10,
    Retired = 233,
    BAN = 255,
}

const User_Status_Name = {
    [User_Status.Default]: '账号未启用',
    [User_Status.Normal]: '网管',
    [User_Status.Secretary]: '干事',
    [User_Status.Minister]: '部长',
    [User_Status.Admin]: '管理员',
    [User_Status.Retired]: '退休老人',
    [User_Status.BAN]: '被封禁',
} as const;

export {
    User_Status, User_Status_Name
}