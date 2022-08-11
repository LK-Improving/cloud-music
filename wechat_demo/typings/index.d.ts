/// <reference path="./types/index.d.ts" />

interface IAppOption {
  globalData: {
    userInfo?: WechatMiniprogram.UserInfo,
    isMusicPlay?:boolean,
    musicId: ''

  }
  userInfoReadyCallback?: WechatMiniprogram.GetUserInfoSuccessCallback,
}