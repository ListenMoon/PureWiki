---
title: 有关vscode中markdown-image粘贴图片的问题
description: ""
pubDate: 2023/2/4 00:39:49
---

:collect[markdown-image||一个vscode中方便的粘贴插件]{url="https://github.com/imlinhanchao/vsc-markdown-image/blob/master/asserts/linux.sh||网址"}是一个比较方便的粘贴插件，主要是符合我的需求。但是在linux上使用后发现总是粘贴中，就是不成功，研究了一下，过程如下：

安装`xclip`,它主要是通过这个命令实现的。

`markdown-image`是通过一个`linux.sh`插件运行的，如果你是用`manjaro`安装的`virual-studio-code-bin`,那么路径就类似于`/home/youname/.vscode/extensions/hancel.markdown-image-1.1.26/asserts/`下，试试先复制文字，然后`sh ./linux.sh`运行一下，复制图片，再运行一下，如果出现报错的话呢，我的是出现了未预期的符号，百度了一下可以通过[这个教程](https://blog.csdn.net/weixin_45785469/article/details/111647735)解决，就是`dos2unix linux.sh`一下，再试试复制文字或者图片运行，我这里发现仍旧报了一个模糊的重定向的错误，但是没关系，我试了试已经可以粘贴图片了。