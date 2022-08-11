// 发送ajax请求
/**
* 1.封装功能的数
        1.功能点明确
        2.函数内部应该保留固定代码（静态的）
        3.将动态的数据抽取成形参，由使用者根据自身的情况动态的传入实参
        4.一个良好的功能函数应该设置形参的默认值(ES6的形参默认值)
*  2.封装功能组件
        1.功能点明确
        2.组件内部保留静态的代码
        3.将动态的数据抽取成props参数，由使用者根据自身的情况以标签属性的形式动态传入props数据
        4.一个良好的组件应该设置组件的必要性及数据类型
        props:
            msg:{
                required:true,
                default:默认值，
                type:String
        }
 *
 */

import config from "./config";

 export default (url:string,data:any={},method:
    | 'OPTIONS'
    | 'GET'
    | 'HEAD'
    | 'POST'
    | 'PUT'
    | 'DELETE'
    | 'TRACE'
    | 'CONNECT' = 'GET') => {
        return new Promise((resolve,reject)=>{
            // new Promise初始化Promise实例的状态为pending

            wx.request({
                url: config.host + url,
                method,
                data,
                header: {
                    cookie: wx.getStorageSync('cookies') ? wx.getStorageSync('cookies').find((item:any) => item.indexOf('MUSIC_U') !== -1):''
                  },
                success: (res)=>{
                    console.log(res);
                    if (res.data && res.statusCode === 200) {
                        if(data.phone ){//登录请求,将用户cookie存入
                            wx.setStorage({
                              key: 'cookies',
                              data: res.cookies,
                            })
                          }
                        resolve(res.data) // resolve修改Promise的状态为成功状态resolved
                    }
                    else{
                        wx.showToast({
                            title: (<any>res.data).message,
                            icon: 'none'
                        })
                    }
                },
                fail: (err)=>{
                     reject(err) // reject修改Promise的状态为失败状态rejected
                }
            })
        })
 }
