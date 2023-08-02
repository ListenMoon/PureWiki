// @ts-nocheck

// https://liuyib.github.io/2019/09/24/use-pjax-to-your-site/
// https://github.com/next-theme/hexo-theme-next
// https://github.com/MoOx/pjax

import Pjax from "pjax";

var pjax = new Pjax({
    selectors: [
      "title",
      "meta[name=description]",
      "#pjax-container",
      ".layout .left .wrapper",
      ".layout .side",
    //   ".layout .side ._headtree",
    ],
    "history": true,
    "scrollTo": false,
    // https://www.zhangxinxu.com/wordpress/2022/05/history-scrollrestoration/
    "scrollRestoration": false,
    "cacheBust": false,
    "debug": false,
    "currentUrlFullReload": false,
    "timeout": 0
})

var loadingBar = document.querySelector(".loading-bar");
var progress = document.querySelector(".loading-bar .progress");
var timer = null;

// Pjax 开始时执行的函数
document.addEventListener("pjax:send", function () {
  // 进度条默认已经加载 20%
  var loadingBarWidth = 20;
  // 进度条的最大增加宽度
  var MAX_LOADING_WIDTH = 95;

  // 显示进度条
  loadingBar.classList.add("loading");
  // 初始化进度条的宽度
  progress.style.width = loadingBarWidth + "%";

  clearInterval(timer);
  timer = setInterval(function () {
    // 进度条的增加速度（可以改为一个随机值，显得更加真实）
    loadingBarWidth += 3;

    // 当进度条到达 95% 后停止增加
    if (loadingBarWidth > MAX_LOADING_WIDTH) {
      loadingBarWidth = MAX_LOADING_WIDTH;
    }

    progress.style.width = loadingBarWidth + "%";
  }, 500);
});

// Pjax 完成之后执行的函数
document.addEventListener("pjax:complete", function () {
  clearInterval(timer);
  progress.style.width = "100%";
  loadingBar.classList.remove("loading");

  setTimeout(function () {
    progress.style.width = 0;
  }, 400);

  _initColor()
});
