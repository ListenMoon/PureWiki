const script = document.createElement("script")
script.setAttribute("src", "https://utteranc.es/client.js")
script.setAttribute("repo", "ListenMoon/PureWiki")
script.setAttribute("issue-term", "pathname")
script.setAttribute("label", "收录")
script.setAttribute("theme", "github-light")
script.setAttribute("crossorigin", "anonymous")
script.setAttribute("async", "")

script.onerror = function(){
    if(sc){
        sc.remove()
    }
}

const sc = document.getElementById("utteranc-sc")
let parentNode = sc.parentNode
parentNode.removeChild(sc)
parentNode.appendChild(script)

if(document.currentScript){
    document.currentScript.parentNode.removeChild(document.currentScript)
}