// pages/songDetail/songDetail.ts
import request from "../../utils/request";
import PubSub from "pubsub-js";
import moment from "moment";

//获取全局实例
const appInstance = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        isPlay: false,//标识播放状态
        song: {},//歌曲详情对象
        musicId: '',//歌曲Id
        currentTime: '00:00',//当前时长
        durationTime: '00:00',//总时长
        currentWidth: 0,//实时进度条宽度
    },
    //点击暂停/播放的回调
    handleMusicPlay() {
        //修改是否播放的状态
        let isPlay = !this.data.isPlay;
        // this.setData({
        //     isPlay
        // })
        let { musicId } = this.data;
        this.musicControl(isPlay, musicId);
    },
    //歌曲播放控制功能
    async musicControl(isPlay: boolean, musicId: string) {
        let that: any = this
        if (isPlay) {//音乐播放
            //获取音频资源
            let musicLinkData = await request('/song/url', { id: musicId }) as {
                data: Array<{
                    url: string
                }>
            }
            let musicLink = musicLinkData.data[0].url;
            if (musicLink === null) {
                wx.showToast({
                    title: '由于版权或会员问题暂获取不到此资源',
                    icon: 'none'
                })
                return;
            }
            //歌曲播放
            that.backgroundAudioManager.src = musicLink;
            that.backgroundAudioManager.title = that.data.song.name;
        } else {//音乐暂停
            that.backgroundAudioManager.pause();
        }
    },
    //请求歌曲信息
    async getMusicInfo(musicId: string) {
        let taht: any = this
        let songData = await request('/song/detail', { ids: musicId }) as {
            songs: Array<{ dt: number }>
        }
        let durationTime = moment(songData.songs[0].dt).format('mm:ss');
        taht.setData({
            song: songData.songs[0],
            durationTime: durationTime
        })
        //动态修改窗口标题
        wx.setNavigationBarTitle({
            title: taht.data.song.name
        })
    },
    //修改播放状态
    changePlayState(isPlay: boolean) {
        this.setData({
            isPlay
        })
        //修改全局播放状态
        appInstance.globalData.isMusicPlay = isPlay;
    },

    //歌曲切换
    handleSwitch(event: any) {
        let that: any = this
        //切换类型
        let type = event.currentTarget.id;

        //关闭当前播放音乐
        that.backgroundAudioManager.stop();
        //订阅来自recommendSong页面
        PubSub.subscribeOnce('musicId', (msg, musicId) => {
            //获取歌曲
            that.getMusicInfo(musicId);
            //自动播放当前音乐
            that.musicControl(true, musicId);
            //取消订阅
            // PubSub.unsubscribe('musicId');
        })

        //发布消息数据给recommendSong页面
        PubSub.publish('switchMusic', type);
    },

    //观察音乐播放进度
    musicPlayTime() {
        let that:any = this
        let currentTime = moment(that.backgroundAudioManager.currentTime * 1000).format('mm:ss');
        let currentWidth = (that.backgroundAudioManager.currentTime / that.backgroundAudioManager.duration) * 450;

        that.setData({
            currentTime,
            currentWidth
        })

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(option) {
        let musicId = option.song;
        this.setData({
            musicId: musicId
        })
        this.getMusicInfo(musicId!);
        // options:用于接收路由跳转的query参数
        // 原生小程序中路由传参，对参数的长度有限制，如果参数长度过长会自动截取
        //判断当前页面音乐是否在播放
        if (appInstance.globalData.isMusicPlay && appInstance.globalData.musicId === musicId) {
            //修改当前页面音乐播放状态
            this.setData({
                isPlay: true
            })
        }

        // //创建控制音乐播放实例对象
        let that: any = this
        that.backgroundAudioManager = wx.getBackgroundAudioManager();
        // //监视音乐播放与暂停
        that.backgroundAudioManager.onPlay(() => {
            //修改音乐播放状态
            that.changePlayState(true);

            appInstance.globalData.musicId = musicId;
        });
        that.backgroundAudioManager.onPause(() => {
            that.changePlayState(false);
        });
        that.backgroundAudioManager.onStop(() => {
            this.changePlayState(false);
        });
        //音乐播放自然结束
        that.backgroundAudioManager.onEnded(() => {

            //切歌
            PubSub.publish('switchMusic', 'next');

            //重置所有数据
            this.setData({
                currentWidth: 0,
                currentTime: '00:00',
                isPlay: false,
            })
            //获取歌曲
            this.getMusicInfo(musicId!);
            //自动播放当前音乐
            this.musicControl(true, musicId!);
        })
        //监听音乐实时播放的进度
        that.backgroundAudioManager.onTimeUpdate(() => {
            this.musicPlayTime()
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