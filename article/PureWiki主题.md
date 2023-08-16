---
title: PureWiki主题
description: 一个Astro主题
heroImage: https://w.wallhaven.cc/full/ex/wallhaven-exwgw8.png
heroPosition: top
top: true
pubDate: 2023/08/04 14:40:00
updatedDate: 2023/08/16 10:55:41
---

[TOC]

## 特性

1. 文章可用元输入如下（有一些其他的，可以自己看代码，tpyings 尚不完善，得看布局代码）

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
