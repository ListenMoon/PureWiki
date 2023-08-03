# 失落之城

![](https://img.shields.io/github/stars/ListenMoon/PureWiki.svg?style=flat&label=Star)
![](https://img.shields.io/github/forks/ListenMoon/PureWiki.svg?style=flat&label=Fork)

一个简单展示文章的界面。

## 使用

文章可以直接在`article`目录下写，`article/drafts`目录下的是草稿，不会发布在正式版中，但会显示在开发版中。

收藏界面可以在`collect`目录下写，收藏界面数据不会被 rss 收集

需要使用在 Github 新增或编辑功能的需要在`src/config.ts`自行配置 Github 相关。

文章可用元数据如下：

```
title: Markdown测试       <!-- 必须，文章标题 -->
description: 描述         <!-- 描述，可用作seo，文章中暂未展示 -->
pubDate: 2022/5/12        <!-- 发布日期 -->
updatedDate: 2023/01/01   <!-- 修改日期-->
heroImage: ""             <!-- 文章头图 -->
top: true                 <!-- 展示在右上方 -->
mode: chinese             <!-- 首行缩进 -->
mode: collect             <!-- 文章不被rss收录 -->
```

> 最好不要取有特殊字符的标题

## 开发注意

不要在`.astro`文件中使用 `<style></style>` 这种作用域样式，可以在上面加上`is:global`变成全局样式。否则的话会生成`:where`选择器，导致低版本浏览器不兼容而导致样式错乱（例如微信浏览器）

## 部署

[![](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/ListenMoon/PureWiki)

## Demo

https://blog.xieyaxin.top/

## 致谢开源项目

在项目中使用到的项目作者，在此十分感谢！

> Github Action 发布
> Github Pages 默认是基于 Jekyll 构建，Jekyll 是一个将纯文本转换为静态网站的工具，它构建的网站下各种目录都是特定的以下划线开头命名的文件夹，例如 \_layouts、\_posts ，它会忽略掉其它的以下划线开头的文件夹和文件。
> .nojekyll 就是告诉 Github Pages 当前网站不是基于 Jekyll 构建的，不要忽略掉下划线开头的文件和文件夹。
> 可见 .nojekyll 主要就是用于 Github Pages 这种有默认规则的网站部署平台，如果是部署在自己的服务器上，可以把它删掉。
> 反之，如果你的网站不是 Jekyll 构建的，要部署到 Github Pages ，并且包含下划线开头的文件或文件夹，那么你就需要在根目录添加一个 .nojekyll 空文件。
