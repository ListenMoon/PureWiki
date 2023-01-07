---
mode: collect
title: Vite
description: ""
pubDate: 2023/1/6 15:43:36
---
考虑使用以下方式解析
```
var YAML = require("yamljs")

const nativeObject = YAML.parse(`
title: 标题
describe: 描述
url: 网址链接（请http/https开头）
tag: 
    - Tag1名字 跳转的网址（请http/https开头）
    - Tag2名字 跳转的网址（请http/https开头）
`);
console.log(nativeObject)
```

## 测试

::collect[百度]{url="//baidu.com" desc="搞啥啊"}
::collect[百度]{url="//baidu.com" demo="/post/记事/大实话" desc="搞啥啊"}
::collect[百度]{url="//baidu.com" demo="/post/记事/大实话" desc="搞啥啊"}
::collect[百度]{url="//baidu.com" demo="/post/记事/大实话" desc="搞啥啊"}
::collect[百度]{url="//baidu.com" demo="/post/记事/大实话" desc="搞啥啊"}
::collect[百度]{url="//baidu.com" demo="/post/记事/大实话" desc="搞啥啊"}
::collect[百度]{url="//baidu.com" demo="/post/记事/大实话" desc="搞啥啊"}
::collect[百度]{url="//baidu.com" demo="/post/记事/大实话" desc="搞啥啊"}
::collect[百度]{url="//baidu.com" demo="/post/记事/大实话" desc="搞啥啊"}
::collect[百度]{url="//baidu.com" demo="/post/记事/大实话" desc="搞啥啊"}

## 测试

::collect[百度]{url="//baidu.com" demo="/post/记事/大实话" desc="搞啥啊"}
::collect[百度]{url="//baidu.com" demo="/post/记事/大实话" desc="搞啥啊"}
::collect[百度]{url="//baidu.com" demo="/post/记事/大实话" desc="搞啥啊"}
::collect[百度]{url="//baidu.com" demo="/post/记事/大实话" desc="搞啥啊"}
::collect[百度]{url="//baidu.com" demo="/post/记事/大实话" desc="搞啥啊"}
::collect[百度]{url="//baidu.com" demo="/post/记事/大实话" desc="搞啥啊"}
::collect[百度]{url="//baidu.com" demo="/post/记事/大实话" desc="搞啥啊"}
::collect[百度]{url="//baidu.com" demo="/post/记事/大实话" desc="搞啥啊"}
::collect[百度]{url="//baidu.com" demo="/post/记事/大实话" desc="搞啥啊"}
::collect[百度]{url="//baidu.com" demo="/post/记事/大实话" desc="搞啥啊"}
