---
title: CSS到底会不会阻塞页面渲染
pubDate: 2022/11/18 17:05:50
---

可能大家都知道，js执行会阻塞DOM树的解析和渲染，那么css加载会阻塞DOM树的解析和渲染吗？接下来，我们就一起来分析一下。

## 原理解析

那么为什么会出现上面的现象呢？我们从浏览器的渲染过程来解析下。 不同的浏览器使用的内核不同，所以他们的渲染过程也是不一样的。目前主要有两个

-  webkit渲染过程 

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/35be426eb4f94ec0a82e20b34030ecde~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp)

- Gecko渲染过程 

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8c38686625c14bd3b0f54cce817029a3~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp)

从上面两个流程图我们可以看出来，浏览器渲染的流程如下：

- HTML解析文件，生成DOM Tree，解析CSS文件生成CSSOM Tree
- 将Dom Tree和CSSOM Tree结合，生成Render Tree(渲染树)
- 根据Render Tree渲染绘制，将像素渲染到屏幕上。

从流程我们可以看出来

- DOM解析和CSS解析是两个并行的进程，所以这也解释了为什么CSS加载不会阻塞DOM的解析。
- 然而，由于Render Tree是依赖于DOM Tree和CSSOM Tree的，所以他必须等待到CSSOM Tree构建完成，也就是CSS资源加载完成(或者CSS资源加载失败)后，才能开始渲染。因此，CSS加载是会阻塞Dom的渲染的。
- 由于js可能会操作之前的Dom节点和css样式，因此浏览器会维持html中css和js的顺序。因此，样式表会在后面的js执行前先加载执行完毕。所以css会阻塞后面js的执行。

## DOMContentLoaded

对于浏览器来说，页面加载主要有两个事件，一个是DOMContentLoaded，另一个是onLoad。而onLoad没什么好说的，就是等待页面的所有资源都加载完成才会触发，这些资源包括css、js、图片视频等。

而DOMContentLoaded，顾名思义，就是当页面的内容解析完成后，则触发该事件。那么，正如我们上面讨论过的，css会阻塞Dom渲染和js执行，而js会阻塞Dom解析。那么我们可以做出这样的假设

- 当页面只存在css，或者js都在css前面，那么DomContentLoaded不需要等到css加载完毕。
- 当页面里同时存在css和js，并且js在css后面的时候，DomContentLoaded必须等到css和js都加载完毕才触发。

我们先对第一种情况做测试：

```
<!DOCTYPE html>
<html lang="en">
 <head>
 <title>css阻塞</title>
 <meta charset="UTF-8">
 <meta name="viewport" content="width=device-width, initial-scale=1">
 <script>
 document.addEventListener('DOMContentLoaded', function() {
 console.log('DOMContentLoaded');
 })
 </script>
 <link href="https://cdn.bootcss.com/bootstrap/4.0.0-alpha.6/css/bootstrap.css" rel="stylesheet">
 </head>
 <body>
 </body>
</html>
```

实验结果如下图： 

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d30219afd9e84bc99875991b7d284435~tplv-k3u1fbpfcp-zoom-1.image)

从动图我们可以看出来，css还未加载完，就已经触发了DOMContentLoaded事件了。因为css后面没有任何js代码。

接下来我们对第二种情况做测试，很简单，就在css后面加一行代码就行了

```
<!DOCTYPE html>
<html lang="en">
 <head>
 <title>css阻塞</title>
 <meta charset="UTF-8">
 <meta name="viewport" content="width=device-width, initial-scale=1">
 <script>
 document.addEventListener('DOMContentLoaded', function() {
 console.log('DOMContentLoaded');
 })
 </script>
 <link href="https://cdn.bootcss.com/bootstrap/4.0.0-alpha.6/css/bootstrap.css" rel="stylesheet">
 <script>
 console.log('到我了没');
 </script>
 </head>
 <body>
 </body>
</html>
```
![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/87519598e6484ec38db8daed23f586c9~tplv-k3u1fbpfcp-zoom-1.image)

我们可以看到，只有在css加载完成后，才会触发DOMContentLoaded事件。因此，我们可以得出结论：

- 如果页面中同时存在css和js，并且存在js在css后面，则DOMContentLoaded事件会在css加载完后才执行。
- 其他情况下，DOMContentLoaded都不会等待css加载，并且DOMContentLoaded事件也不会等待图片、视频等其他资源加载。

## 总结
由上所述，我们可以得出以下结论:

- css加载不会阻塞DOM树的解析
- css加载会阻塞DOM树的渲染
- css加载会阻塞后面js语句的执行

因此，为了避免让用户看到长时间的白屏时间，我们应该尽可能的提高css加载速度，比如可以使用以下几种方法:

- 使用CDN(因为CDN会根据你的网络状况，替你挑选最近的一个具有缓存内容的节点为你提供资源，因此可以减少加载时间)
- 对css进行压缩(可以用很多打包工具，比如webpack,gulp等，也可以通过开启gzip压缩)
- 合理的使用缓存(设置cache-control,expires,以及E-tag都是不错的，不过要注意一个问题，就是文件更新后，你要避免缓存而带来的影响。其中一个解决防范是在文件名字后面加一个版本号)
- 减少http请求数，将多个css文件合并，或者是干脆直接写成内联样式(内联样式的一个缺点就是不能缓存)

>转载自：
>[https://juejin.cn/user/3051900008147176](https://juejin.cn/post/6859890348089409544)  
>如有侵权，请联系 1549469775@qq.com 删除。
