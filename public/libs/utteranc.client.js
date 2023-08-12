var script = document.createElement("script");
script.setAttribute("src", "https://utteranc.es/client.js");
script.setAttribute("repo", "ListenMoon/PureWiki");
script.setAttribute("issue-term", "pathname");
script.setAttribute("label", "收录");
script.setAttribute("theme", "github-light");
script.setAttribute("crossorigin", "anonymous");
script.setAttribute("async", "");

script.onerror = function () {
    if (sc) {
        sc.remove();
    }
};
script.onload = function () {
    if (sc) {
        parentNode.removeChild(sc);
    }
};
var sc = document.getElementById("utteranc-sc");
var parentNode = sc.parentNode;
parentNode.appendChild(script);

if (document.currentScript && document.currentScript.parentNode) {
    document.currentScript.parentNode.removeChild(document.currentScript);
}
