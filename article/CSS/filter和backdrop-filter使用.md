---
title: filter和backdrop-filter使用
description: ""
pubDate: 2023/2/3 23:13:29
---

## filter兼容性

![filter兼容性](/article/filter和backdrop-filter使用/2023-02-04_04-00-49-25.png)  

## backdrop-filter兼容性

![backdrop-filter兼容性](/article/filter和backdrop-filter使用/2023-02-04_04-00-50-29.png)  

## 是否使用说明

可以看到两个特性的兼容性不太一样，`backdrop-filter`明显更新一些，可以想象微信浏览器可能都不支持，该属性可用于现代浏览器，主要是用于PC端，手机端兼容性不好可以换一种效果。

## 区别

backdrop-filterCSS 属性可以让你为一个元素后面区域添加图形效果（如模糊或颜色偏移）。 因为它适用于元素背后的所有元素，为了看到效果，必须使元素或其背景至少部分透明。