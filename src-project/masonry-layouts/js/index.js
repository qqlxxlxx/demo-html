window.onload = function() {
  let imgUrls = getImgUrls();
  let oMain = document.querySelector('.main');
  let colums, oImgBoxs;

  // 创建所有图片，拿到所有创建的图片
  // let oImgBoxs = createImages(oMain, imgUrls);
  // 计算列数和容器宽度，设置容器水平居中，拿到列数
  // let colums = resetWidth(oMain, oImgBoxs);

  // 图片预加载：因为图片资源加载慢，图片的高度获取不到，所以排版前先等到图片加载完成
  preLoadImgs(oMain, imgUrls, oImgs => {
    // 创建并获取所有图片
    oImgBoxs = createImages(oMain, oImgs)
    // 计算列数和容器宽度，设置容器水平居中，拿到列数
    colums = resetWidth(oMain, oImgBoxs);
    // 实现流式布局
    waterFall(oImgBoxs, colums);
  });

  // 监听浏览器页面大小变化：重新计算列数，重新流式布局
  window.onresize = throttle(function() {
    colums = resetWidth(oMain, oImgBoxs);
    waterFall(oImgBoxs, colums);
  }, 500);

  // 监听是否滚动到底部，加载新图
  window.onscroll = throttle(function() {
    let oLastImg = oImgBoxs[oImgBoxs.length - 1];
    let lastImgTop = oLastImg.offsetTop;
    let scrollTop = getPageScroll().y;
    let wiewHeight = getScreen().height;
    if (scrollTop + wiewHeight > lastImgTop) {
      let imgUrls = getImgUrls();
      preLoadImgs(oMain, imgUrls, oImgs => {
        oImgBoxs = createImages(oMain, oImgs)
        waterFall(oImgBoxs, colums);
      }); 
    }
  }, 500);
}

function getImgUrls() {
  let arr = [];
  for (let i = 1; i <= 40; i++) {
    let index = i < 10 ? '0' + i : i;
    let src = `img/img${index}.jpg`;
    arr.push(src);
  }
  return arr;
}

/**
 * 创建所有图片的方法
 */
/* function createImages(oMain, imgUrls) {
  imgUrls.forEach(url => {
    let oDiv = document.createElement('div');
    let oImg = document.createElement('img');
    oDiv.className = 'box';
    oImg.src = url;
    oDiv.appendChild(oImg);
    oMain.appendChild(oDiv);
  })
  return document.querySelectorAll('.box');
} */
function createImages(oMain, oImgs) {
  oImgs.forEach(oImg => {
    let oDiv = document.createElement('div');
    oDiv.className = 'box';
    oDiv.appendChild(oImg);
    oMain.appendChild(oDiv);
  })
  return document.querySelectorAll('.box');
}

/**
 * 计算列数的方法
 */
function resetWidth(oMain, oImgBoxs) {
  let width = getScreen().width;
  let imgWidth = oImgBoxs[0].offsetWidth;
  let colums = ~~(width / imgWidth);
  oMain.style.width = colums * imgWidth + 'px';
  oMain.style.margin = '0 auto';
  return colums;
}

/**
 * 流式布局实现的方法
 */
function waterFall(oImgBoxs, colums) {
  // 用来存储每一列的高度
  let columsHeight = [];
  let length = oImgBoxs.length;
  for (let i = 0; i < length; i++) {
    let oItem = oImgBoxs[i];
    // 如果是第一行图片，将每个元素高度存起来
    if (i < colums) {
      columsHeight.push(oItem.offsetHeight);
      oItem.style.position = '';
    } else {
      // 获取每列最小高度
      // let minHeight = Math.min.apply(null, rowHeight);
      let minHeight = Math.min(...columsHeight);
      // 获取最小高度下标
      let minIndex = columsHeight.findIndex(value => {
        return value === minHeight;
      })
      // 获取最小高度那个元素距离窗口左边的位置
      let left = oImgBoxs[minIndex].offsetLeft;
      oItem.style.position = 'absolute';
      oItem.style.left = left + 'px';
      oItem.style.top = minHeight + 'px';
      // 更新列高度
      columsHeight[minIndex] += oItem.offsetHeight;
    }
  }
}

/**
 * 预加载图片
 */
function preLoadImgs(oMain, imgUrls, callBack) {
  let oImgs = [];
  let lastIndex = imgUrls.length - 1;
  imgUrls.forEach((url, i) => {
    // 创建img元素并设置src属性，浏览器就会去请求资源
    let oImg = document.createElement('img');
    oImg.src = url;
    // 等加载到图片，执行回调函数
    oImg.onload = function() {
      oImgs.push(oImg);
      if (lastIndex === i) {
        callBack(oImgs);
      }
    }
  })
}
