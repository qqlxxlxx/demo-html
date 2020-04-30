$(function() {
  // Player，Lyric，Progress实例
  let player = new Player($('audio')), lyric, progress, voiceProgress;
  
  // 加载歌曲列表
  getMusicList()
    .then(data => {
      // 循环创建歌曲元素并添加到页面
      $.each(data, function(index, music) {
        let $item = createMusicItem(index, music);
        $('.songlist-bd').append($item);
      })
      // 将歌曲列表保存到player
      player.musicList = data;
      // 初始化页面歌曲信息
      initMusicInfo(data[0]);
      // 初始化页面歌词
      initMusicLyric(data[0]);
    })
  
  // 初始化进度条
  initProgress();
  
  // 初始化事件监听
  initEvent();

  // 初始化事件监听的方法
  function initEvent() {
    // 监听歌曲的移入事件
    $('.songlist-bd').delegate('.song-item', 'mouseenter', function() {
      $(this).find('.time span').stop().fadeOut(50);
      $(this).find('.menu').stop().fadeIn(50);
    })
    // 监听歌曲的移出事件
    $('.songlist-bd').delegate('.song-item', 'mouseleave', function() {
      $(this).find('.menu').stop().fadeOut(50);
      $(this).find('.time span').stop().fadeIn(50);
    });
    
    // 子菜单播放按钮点击：当前歌曲文字高亮序号、同步底部播放按钮、播放暂停音乐
    $('.songlist-bd').delegate('.menu-play', 'click', function() {
      // 获取当前播放按钮的父节点
      let $item = $(this).parents('.song-item');
      let music = $item[0].music;
      
      // 当前歌曲图标切换、文字高亮
      $(this).toggleClass('menu-play2');
      $item.find('.number').toggleClass('number2');
      $item.find('.songname, .artist').css({
        color: '#fff'
      });
      // 排它
      $item.siblings().find('.menu-play').removeClass('menu-play2');
      $item.siblings().find('.number').removeClass('number2');
      $item.siblings().find('.songname, .artist').css({
        color: 'rgba(225, 225, 225, .7)'
      });
      
      // 同步底部播放按钮图标
      if ($(this).hasClass('menu-play2')) {
        $('.btn-play').addClass('btn-play-pause');
      } else {
        $('.btn-play').removeClass('btn-play-pause');
      }
      
      // 播放/暂停当前音乐，播放完成回调
      player.playMusic($item.index(), music, flag => {
        if (flag) return
        // 如果不是同一首歌曲：切换歌曲信息、切换页面歌词
        initMusicInfo(music);
        initMusicLyric(music);
      });
    });
    
    // 监听底部播放按钮点击
    $('.btn-play').click(function() {
      toggleMusic('currentIndex');
    })
    
    // 监听下一首按钮点击
    $('.btn-next').click(function() {
      toggleMusic('nextIndex');
    })
    
    // 监听上一首按钮点击
    $('.btn-prev').click(function() {
      toggleMusic('preIndex');
    })
   
    // 监听子菜单删除按钮点击
    $('.songlist-bd').delegate('.menu-del', 'click', function() {
      let $item = $(this).parents('.song-item');
      let isPlay = $item.find('.menu-play').hasClass('menu-play2');
      // 如果歌曲正在播放中，切换播放下一首
      if (isPlay) {
        $('.btn-next').trigger('click');
      }
      // 删除player中这首歌，如果删除了当前音乐，将执行回调
      player.changIndex($item.index(), () => {
        let curMusic = $('.songlist-bd .song-item').eq(player.currentIndex)[0].music;
        initMusicInfo(curMusic);
        initMusicLyric(curMusic);
      });
      // 删除页面这首歌
      $item.remove();
      // 重排页面序号
      $('.songlist-bd .song-item').each((index, ele) => {
        $(ele).find('.number').text(index + 1);
      })
      
      // 
      $('.btn-voice').toggleClass('')
    })
    
    // 监听音乐播放的进度
    player.musicTimeUpdate((currentTime, duration, timeStr) => {
      // console.log(currentTime, duration, timeStr);
      // 更新页面播放时间
      $('.time-show').text(timeStr);
      // 播放完切换下一首
      if (currentTime === duration) {
        $('.btn-next').trigger('click');
      }
      // 更新播放进度条
      progress.setProgress(currentTime / duration * 100);
      // 设置歌词颜色高亮、歌词滚动
      let curSecond = parseInt(currentTime);
      let $item = $('#lyr_' + curSecond);
      if($item.index() === -1) return;
      $item.addClass('on').siblings().removeClass('on');
      $('#lrc_wrap').css({
        transition: 'transform 0.1s ease-out 0s',
        transform: 'translateY(' + -$item.index() * 24 + 'px)'
      })
    })
    
    // 监听音量图标点击
    $('.btn-voice').click(function() {
      $(this).toggleClass('btn-voice2');
    })
  }

  // 定义方法创建音乐
  function createMusicItem(index, music) {
    let $item = $(
      `<li class="song-item">
        <div class="number">${index + 1}</div>
        <div class="songname">${music.name}</div>
        <div class="artist">${music.singer}</div>
        <div class="time">
          <span>${music.time}</span>
        </div>
        <div class="menu">
          <a class="menu-play" href="javascript:;" title="播放"></a>
          <a class="menu-del" href="javascript:;" title="删除"></a>
        </div>
      </li>`
    );
    $item[0].music = music;
    return $item;
  }
  
  // 定义方法初始化歌曲信息
  function initMusicInfo(music) {
    $('.song-info-pic img').attr('src', music.cover);
    $('.song-info-name a').text(music.name);
    $('.song-info-singer a').text(music.singer);
    $('.song-info-album a').text(music.album);
    $('.player-song-info span:nth-child(1)').text(music.name);
    $('.player-song-info span:nth-child(2)').text(music.singer);
    $('.player-song-info span:nth-child(3)').text('00:00 / ' + music.time);
    $('.bg-mask').css({
      backgroundImage: 'url(' + music.cover + ')'
    });
  }
  
  // 定义方法初始化歌词
  function initMusicLyric(music) {
    // 获取歌词容器，并清空旧歌词
    let $lyricsContainer = $('.song-info-lyric ul').empty();
    // 创建Lyric实例
    lyric = new Lyric();
    // 加载歌词到页面
    lyric.loadLyric(music.link_lrc, () => {
      lyric.lyrics.forEach(item => {
        let $li = $(`<li id="lyr_${item[0]}">${item[1]}</li>`);
        $lyricsContainer.append($li)
      })
    })
  }
  
  // 定义方法用于底部按钮切换音乐
  function toggleMusic(position) {
    // 如果是首次加载未播放过歌曲，让其从第一首开始播放
    if (player.currentIndex === -1) {
      $('.songlist-bd .song-item').eq(0).find('.menu-play').trigger('click');
      return
    }
    if (position === 'currentIndex') {
      $('.songlist-bd .song-item').eq(player[position]).find('.menu-play').trigger('click');
    } else {
      $('.songlist-bd .song-item').eq(player[position]()).find('.menu-play').trigger('click');
    }
  }
  
  // 初始化进度条的方法
  function initProgress() {
    progress = new Progress($('.player-progress'), $('.player-progress .progress-line'));
    // 监听播放进度条点击，设置播放条进度，回调函数设置音乐播放进度
    progress.progressClick(ratio => {
      player.musicSeekTo(ratio);
      // 待解决：如果音乐暂停了，这个操作会让音乐播放，这时候页面图标会不同步
    });
    // 监听进度条移动事件
    progress.progressMove(ratio => {
      player.musicSeekTo(ratio);
    });
    
    // 音量进度条
    voiceProgress = new Progress($('.player-voice'), $('.player-voice .progress-line'));
    voiceProgress.progressClick(ratio => {
      $('audio')[0].volume = ratio;
    });
  }
})
