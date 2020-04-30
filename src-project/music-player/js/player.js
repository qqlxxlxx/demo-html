(function(window) {
  class Player {
    constructor($audio) {
      // jq包装的audio
      this.$audio = $audio;
      // 原生audio
      this.audio = $audio[0];
      // 用来存储歌曲列表
      this.musicList = [];
      // 记录当前歌曲索引，默认值-1，表示没有播放过
      this.currentIndex = -1;
      // 是否删除了当前歌曲并重排了当前歌曲索引
      this.isDelCur = false;
    }
    // 播放音乐的方法
    playMusic(index, music, callBack) {
      // 判断是否当前音乐
      if (this.currentIndex === index) {
        // 判断是否是已删除的音乐，切换音源
        if (this.isDelCur) {
          this.$audio.attr('src', music.link_url);
          this.isDelCur = false;
        }
        // 判断是否正在播放
        if (this.audio.paused) {
          this.audio.play();
        } else {
          this.audio.pause();
        }
        callBack(true);
      } else {
        // 不是当前音乐
        this.$audio.attr('src', music.link_url);
        this.$audio.on('canplay', () => {
          this.audio.play();
        })
        this.currentIndex = index;
        // 播放完成执行回调，参数：是否同一首音乐
        callBack(false);
      }
    }
    // 获取上一首的索引
    preIndex() {
      let index = this.currentIndex - 1 < 0 ? this.musicList.length - 1 : this.currentIndex - 1;
      return index
    }
    // 获取下一首的索引
    nextIndex() {
      let index = this.currentIndex + 1 > this.musicList.length - 1 ? 0 : this.currentIndex + 1;
      return index
    }
    // 删除索引为index的歌曲
    changIndex(index, callBack) {
      this.musicList.splice(index, 1);
      // 如果删除的是当前及其前面的歌曲，调整当前歌曲索引
      if (index < this.currentIndex) {
        this.currentIndex = this.currentIndex - 1;
      } else if (index === this.currentIndex) {
        this.isDelCur = true;
        // callBack();
      }
    }
    // 监听音乐播放的进度：获取当前播放时间、总时长，格式化时间
    musicTimeUpdate(callBack) {
      // 函数节流
      let timerId = null;
      let flag = true;
      timerId && clearTimeout(timerId);
      this.$audio.on('timeupdate', () => {
        if (!flag) return;
        flag = false;
        timerId = setTimeout(() => {
          flag = true;
          let timeStr = this.formatTime(this.audio.currentTime, this.audio.duration)
          // 执行回调函数
          callBack(this.audio.currentTime, this.audio.duration, timeStr);
        }, 350);
      })
    }
    // 格式化时间的方法
    formatTime(currentTime, duration) {
      let endMin = parseInt(duration / 60);
      let endSec = parseInt(duration % 60);
      let startMin = parseInt(currentTime / 60);
      let startSec = parseInt(currentTime % 60);
      endMin = endMin < 10 ? '0' + endMin : endMin;
      endSec = endSec < 10 ? '0' + endSec : endSec;
      startMin = startMin < 10 ? '0' + startMin : startMin;
      startSec = startSec < 10 ? '0' + startSec : startSec;
      return `${startMin}:${startSec} / ${endMin}:${endSec}`;
    }
    // 跳转到指定播放进度
    musicSeekTo(ratio) {
      let value = this.audio.duration * ratio;
      if (isNaN(value)) return;
      if ('fastSeek' in this.audio) {
        this.audio.fastSeek(value);
      } else {
        this.audio.currentTime = value;
      }
    }
    // 是否可以播放
    isCanplay() {
      return !isNaN(this.audio.duration);
    }
  }
  window.Player = Player;
})(window)
