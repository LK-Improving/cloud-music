// pages/recommendSong/recommendSong.ts
import request from "../../utils/request";
import PubSub from 'pubsub-js';

Page({

    /**
     * 页面的初始数据
     */
    data: {
        day: new Date().getDate(),
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
        recommendList: [],//推荐列表数据
        index: 0,//音乐下标
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad() {
        //判断用户是否登录
        let userIinfo = wx.getStorageSync('userInfo');
        if (!userIinfo) {
            wx.showToast({
                title: '请先进行登录',
                icon: 'none',
                success: () => {
                    //跳转至登录界面
                    wx.reLaunch({
                        url: '/pages/login/login',
                    })
                }
            })
        }
        // let nowTime = new Date();
        //更新日期
        // this.setData({
        //     day: nowTime.getDate(),
        //     month: nowTime.getMonth() + 1,
        //     year: nowTime.getFullYear()
        // })

        //获取每日推荐的数据
        this.getRecommendList();

        //订阅来自songDetail页面发布的消息
        PubSub.subscribe('switchMusic', (msg, type) => {
            console.log(msg,type);
            
            let { recommendList, index } = this.data as any;
            if (type === 'pre') {//上一首
                (index === 0) && (index = recommendList.length);
                index -= 1;
            } else {//下一首
                (index === recommendList.length - 1) && (index = -1);
                index += 1;
            }

            // //更新下标
            this.setData({
                index
            })

            let musicId = recommendList[index].id;
            //将音乐id回传给songDetail页面
            PubSub.publish('musicId', musicId);
        })
        
    },
    //获取每日推荐数据
    async getRecommendList() {
        
        let recommendListData = await request('/recommend/songs') as any

        this.setData({
            recommendList: recommendListData.data.dailySongs
        })

    },
    //跳转至songDetail页面
    toSongDetail(event:any) {
        let { song, index } = event.currentTarget.dataset;

        this.setData({
            index
        })
        //路由跳转传参：query参数
        wx.navigateTo({
            url: '/pages/songDetail/songDetail?song=' + song.id
        })
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})