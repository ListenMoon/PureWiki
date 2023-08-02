import View from "viewerjs";
import mermaid from "mermaid"
import "./pjax"

mermaid.init({
    theme: 'neutral',
    // logLevel: 3,
    securityLevel: 'loose',
    flowchart: { curve: 'basis' },
    gantt: { axisFormat: '%m/%d/%Y' },
    sequence: { actorMargin: 50 },
}, `.article .mermaid`);

//===== 顶部进度条 ===== Start
if(location.pathname.startsWith("/post")){
    const topSlider = document.createElement("div")
    topSlider.style.position = "fixed"
    topSlider.style.top = "0"
    topSlider.style.bottom = "0"
    topSlider.style.right = "0"
    topSlider.style.width = "4px"
    topSlider.style.backgroundColor = "#1abc9c"
    document.body.append(topSlider)
    function initW() {
        const scrollHeight = document.body.scrollHeight - document.body.clientHeight
        const rate = document.documentElement.scrollTop/scrollHeight * 100
        topSlider.style.height = rate + "%"
        topSlider.setAttribute('data-rate', ~~rate + '%')
        if(rate >= 10){
            topSlider.classList.add("reading")
        }else{
            topSlider.classList.remove("reading")
        }
    }
    initW()
    window.addEventListener("scroll", initW);
}
//===== 顶部进度条 =====  End

// 图片查看器
const articleEL = document.querySelector(".article")
if(articleEL){
    const gallery = new View(document.querySelector(".article"));
}

// a标签新页面打开
const links = document.links;
for (let i = 0, linksLength = links.length; i < linksLength; i++) {
    const link = links[i];
    if (link.hostname != window.location.hostname) {
        link.target = "_blank";
    }
}

// 文章详情页
const allTitleSelector =
    ".article h1[id],.article h2[id],.article h3[id],.article h4[id],.article h5[id],.article h6[id]";
const allHeadSelector = "a.head";
const offset = 50
let activeIndex = 0;
function initColor() {
    const headElement = document.querySelectorAll(allHeadSelector);
    if(!!headElement.length){
        [...(document.querySelectorAll(allTitleSelector) as unknown as HTMLDivElement[])].forEach((el, i) => {
            if (headElement[i]) {
                const top = el.getBoundingClientRect().top;
                if (top < offset) {
                    activeIndex = i
                    // @ts-ignore
                    headElement[i].style.color = "#1abc9c";
                } else {
                    // @ts-ignore
                    headElement[i].style.color = "";
                }
                if(headElement[i].parentElement.classList.contains("active")){
                    headElement[i].parentElement.classList.remove('active')
                }
            }
        });
        if(activeIndex!=-1){
            // @ts-ignore
            headElement[activeIndex].style.color = "#8e32dc";
            if(!headElement[activeIndex].parentElement.classList.contains("active")){
                headElement[activeIndex].parentElement.classList.add('active')
            }
            // @ts-ignore
            // headElement[activeIndex].parentElement.style.backgroundColor = "#1abc9c48";
            // headElement[activeIndex].parentElement.style.borderLeft = "4px solid #1abc9c";
        }
    }
}
initColor();
window.addEventListener("scroll", function () {
    initColor();
});
// @ts-ignore
window._initColor = ()=>{
    activeIndex = 0
    initColor()
}

function scrollIntoView(traget: string | number) {
  let isNum = false
  if(typeof traget == "number"){
    isNum = true
  }
  let tragetElem: HTMLDivElement | null= null;
  let tragetElemPostition: number = 0;
  if(isNum){
    tragetElemPostition = traget as number
  }else{
    tragetElem = document.querySelector(traget as string)
    tragetElemPostition = tragetElem.offsetTop
  }
  // 判断是否支持新特性
  if (
    typeof window.getComputedStyle(document.body).scrollBehavior ==
    "undefined" || isNum
  ) {
    // 当前滚动高度
    let scrollTop =
      document.documentElement.scrollTop || document.body.scrollTop;
    // 滚动step方法
    const step = function() {
      // 距离目标滚动距离
      let distance = tragetElemPostition - scrollTop;
      
      // 目标需要滚动的距离，也就是只走全部距离的五分之一
      scrollTop = scrollTop + distance / 5;
      if (Math.abs(distance) < 1) {
        window.scrollTo(0, tragetElemPostition);
      } else {
        window.scrollTo(0, scrollTop);
        setTimeout(step, 20);
      }
    };
    step();
  } else if(tragetElem){
    tragetElem.scrollIntoView({
      behavior: "smooth",
      inline: "nearest"
    });
  }
}
const topEl = document.getElementById("toTop")
topEl.addEventListener("click", (e)=>{
  scrollIntoView(0)
})
function init(){
  const top = document.documentElement.scrollTop;
  const maxHeight = document.body.clientHeight + document.body.clientHeight / 2
  
  if(top > maxHeight){
    topEl.style.opacity = '1'
    topEl.style.pointerEvents = "auto"
  }else{
    topEl.style.opacity = '0'
    topEl.style.pointerEvents = "none"
  }
}
init()
window.addEventListener("scroll", init);