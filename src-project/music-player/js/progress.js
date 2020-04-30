;
(function(window) {
  class Progress {
    constructor(backLine, foreLine) {
      // 背景进度条
      this.bLine = backLine;
      // 前景进度条
      this.fLine = foreLine;
      // 是否正在拖动进度条
      this.isMove = false;
    }
    // 监听背景进度条点击事件
    progressClick(callBack) {
      let _self = this;
      this.bLine.click(function(e) {
        e.stopPropagation();
        // 获取背景进度条宽度
        let width = $(this).width();
        // 获取进度条距离窗口左边偏移位
        let left = $(this).offset().left;
        // 获取点击位置距离窗口偏移位
        let eLeft = e.pageX;
        // 设置前景进度条宽度
        _self.fLine.css('width', eLeft - left);
        // 计算前进比值
        let ratio = _self.fLine.width() / width;
        callBack(ratio);
      });
    }
    // 监听背景进度条移动事件
    progressMove(callBack) {
      let _self = this;
      this.bLine.mousedown(function(e) {
        e.stopPropagation();
        // if (_self.isMove) return;
        let width = _self.bLine.width();
        let left = _self.bLine.offset().left;
        $(document).mousemove(function(e2) {
          e2.stopPropagation();
          _self.isMove = true;
          let eLeft = e2.pageX;
          // 计算鼠标移动距离
          let offsetX = eLeft - left;
          // 设置前景宽度
          if (offsetX >= 0 && offsetX < width) {
            _self.fLine.css('width', offsetX);
          }
        })
      })
      $(document).mouseup(function(e) {
        $(document).off('mousemove');
        if (_self.isMove) {
          _self.isMove = false;
          let ratio = _self.fLine.width() / _self.bLine.width();
          callBack(ratio);
        }
      });
    }
    // 设置进度条前景宽度的方法
    setProgress(ratio) {
      // 如果正在手动拖动进度条，return
      if (this.isMove) return;
      this.fLine.css('width', ratio + '%');
    }
  }
  window.Progress = Progress;
})(window);

// 待解决一个问题，如果音乐还没播放过，不要执行progressClick和progressMove方法中的代码