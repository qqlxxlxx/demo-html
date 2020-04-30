;
class Lyric {
  constructor() {
    // 用于保存歌词列表
    this.lyrics = [];
  }
  // 加载歌词
  loadLyric(path, callBack) {
    getMusicInfo(path)
      .then(data => {
        this.parseLyric(data)
        callBack()
      })
  }
  // 解析歌词：保存歌词时间和对应的歌词
  parseLyric(data) {
    // 以换行符切割成数组
    let lycs = data.split('\n');
    // 正则匹配规则
    let reg = /\[(\d*):(\d*)(\.\d*)\](.*)/;
    lycs.forEach((value, index) => {
      if (reg.exec(value) === null) return;
      // 正则匹配结果
      let res = reg.exec(value);
      // let time = parseInt(res[1] * 60) + parseInt(res[2]) + parseFloat(res[3]);
      let time = parseInt(res[1] * 60) + parseInt(res[2]);
      let lrcStr = res[4]
      this.lyrics.push([time, lrcStr]);
    })
  }
}
