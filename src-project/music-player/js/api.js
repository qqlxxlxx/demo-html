;

function request(url, callBack) {
  $.ajax({
    url: url,
    success: function(data) {
      callBack(data);
    },
    error: function(e) {
      console.log(e);
    }
  })
}

// 获取歌曲列表
function getMusicList() {
  return new Promise(function(resolve, reject) {
    request('./source/musiclist.json', function(data) {
      resolve(data);
    });
  });
}

// 获取歌词
function getMusicInfo(path) {
  return new Promise(function(resolve, reject) {
    request(path, function(data) {
      resolve(data);
    });
  })
}
