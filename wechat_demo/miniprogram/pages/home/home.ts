import request from "../../utils/request"

// pages/home/home.ts
Page({

    /**
     * 页面的初始数据
     */
    data: {
        bannerList: [],
        recommendList: [],
        topList: [],
        navList: [{
            title: '每日推荐',
            url: '/pages/recommendSong/recommendSong',
            iconfont: 'icon-zhuye'
        }, {
            title: 'other',
            url: '/pages/other/other',
            iconfont: 'icon-yinle101'
        }, {
            title: '排行榜',
            url: '',
            iconfont: 'icon-paihangbang_paiming'
        }, {
            title: '电台',
            url: '',
            iconfont: 'icon-diantai'
        }, {
            title: '直播',
            url: '',
            iconfont: 'icon-shipinzhibo'
        }]
    },
    // 获取轮播图列表
    async getBannerList() {
        const res = await request("/banner", { type: 2 }) as { code: number, banners: [] }
        if (res && res.code === 200) {
            this.setData({
                bannerList: res.banners
            })
        }
    },

    // 获取推荐歌单列表
    async getRecommendList() {
        const res = await request("/personalized", { limit: 10 }) as { code: number, result: [] }
        if (res && res.code === 200) {
            this.setData({
                recommendList: res.result
            })
        }
    },
    // 获取排行榜列表
    async getTopList() {
        // 需求分析：
        //     1.需要根据idx的值获取对应的数据
        //     2.idx的取值范围是0-20，我们需要0-4
        //     3.需要发送5次请求

        let index = 0
        let resultArr = []
        while (index < 5) {
            const res = await request("/top/list", { idx: index++ }) as { code: number, playlist: { name: string, tracks: [] } }
            // splice(会修改原数组，可以对指定的数组进行增删改)slice(不会修改原数组)
            if (res && res.code === 200) {
                let toplistItem = {
                    name: res.playlist.name,
                    tracks: res.playlist.tracks.slice(0, 3)
                }
                resultArr.push(toplistItem)
                // 不需要等待五次请求全部结束才更新，用户体验较好，但是渲染次数会多一些
                this.setData({
                    topList: resultArr as []
                })
            }
        }
        // 更新topList的状态值，放在此处更新会导致发送请求的过程中页面长时间白屏，用户体验差
        // this.setData({
        //     topList: resultArr as []
        // })
    },

    //跳转到每日推荐歌曲页面
    toRecommendSong(e:any) {
        const { id:url } = e.currentTarget
        if (url !== '') {
            wx.navigateTo({
                url
            })
        }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad() {
        this.getBannerList()
        this.getRecommendList()
        this.getTopList()
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