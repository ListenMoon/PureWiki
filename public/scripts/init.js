
//===== 收缩框 ===== Start
// document.querySelector(`.layout .left .wrapper .tree`).style.opacity = 0
let temp = localStorage.getItem("openFolder")
    let openFolder = []
    if(temp){
        openFolder = JSON.parse(temp)
        openFolder.forEach(v=>{
            const el = document.querySelector(`.layout .left .wrapper details[data-path="${v}"]`)
            if(el){
                el.setAttribute("open", "true")
            }
        })
    }
    // setTimeout(() => {
    //     document.querySelector(`.layout .left .wrapper .tree`).style.transition = "opacity .5s linear"
    //     document.querySelector(`.layout .left .wrapper .tree`).style.opacity = 1
    // }, 20);
    const folderArray = [...document.querySelectorAll(".layout .left .wrapper details[data-path]")]
    folderArray.forEach(el=>{
        el.addEventListener('toggle',(ev)=>{
            const isOpen = ev.target.hasAttribute('open')
            if(isOpen && !openFolder.includes(ev.target.dataset.path)){
                openFolder.push(ev.target.dataset.path)
                localStorage.setItem("openFolder", JSON.stringify(openFolder))
            }else if(!isOpen){
                let delIndex = openFolder.indexOf(ev.target.dataset.path)
                if(delIndex!=-1) openFolder.splice(delIndex,1)
                localStorage.setItem("openFolder", JSON.stringify(openFolder))
            }
        })
    })
//===== 收缩框 =====  End