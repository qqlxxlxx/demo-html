window.onload = function() {
  let oMain = document.querySelector('.main');
  let urls = [];
  for (let i = 1; i <= 40; i++) {
    let index = i < 10 ? '0' + i : i;
    let src = `img/img${index}.jpg`;
    urls.push(src);
  }
  preloadImgs(urls, function(imgs) {
    let items = initImages(oMain, imgs);
    let cols = resetWidth(oMain, items);
    waterFall(items, cols);

    window.onresize = throttle(function() {
      let cols = resetWidth(oMain, items);
      waterFall(items, cols);
    }, 200);

    // loadImg(oMain, items);
  });
}

// 加载新图
// function loadImg(oMain, items) {
// 	window.onscroll = debounce(function() {
// 		let lastItem = items[items.length - 1];
// 		let lastTop = lastItem.offsetTop;
// 		let lastHeight = lastItem.offsetHeight / 2;
// 		let screenHeight = getScreen().height;
// 		let offsetY = getPageScroll().y;
// 		if ((screenHeight + offsetY) > (lastTop + lastHeight)) {
// 			console.log(lastItem);
// 			items = initImages(oMain, imgs);
// 			let cols = resetWidth(oMain, items);
// 			waterFall(items, cols);
// 		}
// 	}, 500)
// }

// 流式布局实现
function waterFall(items, cols) {
  let rowHeight = [];
  let length = items.length;
  for (let i = 0; i < length; i++) {
    let item = items[i];
    if (i < cols) {
      rowHeight.push(items[i].offsetHeight);
      item.style.position = '';
    } else {
      let minHeight = Math.min.apply(null, rowHeight);
      let minIndex = rowHeight.findIndex(function(value) {
        return value === minHeight;
      });
      let minItem = items[minIndex];
      let minLeft = minItem.offsetLeft;
      item.style.position = 'absolute';
      item.style.left = minLeft + 'px';
      item.style.top = minHeight + 'px';
      rowHeight[minIndex] += item.offsetHeight;
    }
  }
  // console.log(rowHeight);
}

// 计算容器宽度，设置水平居中
function resetWidth(oMain, items) {
  let width = getScreen().width;
  let cols = Math.floor(width / items[0].offsetWidth);
  let mainWidth = cols * items[0].offsetWidth;
  oMain.style.width = mainWidth + 'px';
  oMain.style.margin = '0 auto';
  return cols;
}

// 创建所有图片
function initImages(oMain, imgs) {
  let length = imgs.length;
  for (let i = 0; i < length; i++) {
    // let img = document.createElement('img');
    // let index = i < 10 ? '0' + i : i;
    // img.src = `img/img${index}.jpg`;
    let div = document.createElement('div');
    div.className = 'box';
    div.appendChild(imgs[i]);
    oMain.appendChild(div)
  }
  let items = document.querySelectorAll('.box');
  return items;
}

// 预加载图片
function preloadImg(url, fn) {
  let img = document.createElement('img');
  img.src = url;
  img.onload = function() {
    fn(img);
  }
}

function preloadImgs(urls, fn) {
  let imgs = [];
  let count = 0;
  let totalCount = urls.length;
  for (let i = 0; i < totalCount; i++) {
    preloadImg(urls[i], function(img) {
      imgs.push(img);
      count++;
      if (count === totalCount) {
        fn(imgs);
      }
    })
  }
}
