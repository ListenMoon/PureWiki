---
title: PureWiki主题
description: 一个简单的主题
heroImage: https://w.wallhaven.cc/full/ex/wallhaven-exwgw8.png
heroPosition: top
top: true
pubDate: 2022/11/15 16:05:35
updatedDate: 2022/11/15 16:05:56
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

2. 使用如下代码，会被标题替换，支持三级标题
    ```
    [TOC]
    ```
3. 内部已支持了`markdown`命令转化为`html`了
    ```
    :abbr[提示]{title="提示"}
    ```
    效果：:abbr[提示]{title="提示"}
4. 支持面板

    ```
    ::::card
    横排排版演示
    :::card-title
    横排排版演示
    :::
    ::::

    ::::card{#vertical}
    竖排排版演示
    :::card-title
    竖排排版演示
    :::
    ::::

    ::::card{#vertical.center}
    竖排居中排版演示
    :::card-title
    竖排居中排版演示
    :::
    ::::
    ```

    横排已经可以了，竖排感觉也没啥用。

5. 可配置头图为文章中的第一张图片，只需要将配置的`showArticleHeroImage`设置为 true 即可。
6. 文章提供了直接在 github 编辑功能，自行配置即可
7. 增加`mermaid`渲染流程图时序图（暂时提供两个）
    ````
        ```flow
        flowchart TD
            A[/Christmas\]
            A -->|Get money| B[\Go shopping/]
            B --> C{Let me thinksssss<br/>ssssssssssssssssssssss<br/>sssssssssssssssssssssssssss}
            C -->|One| D[/Laptop/]
            C -->|Two| E[\iPhone\]
            C -->|Three| F[Car]
        ```
    ````
    ````
        ```sequence
        ```
    ````
8. 增加`mathjax`渲染公式

    ```
    $\Gamma(n) = (n-1)!\quad\forall n\in\mathbb N$

    $$	x = \dfrac{-b \pm \sqrt{b^2 - 4ac}}{2a} $$
    ```

9. 提供`iframe`命令和`iframec`命令  
   `iframe`为收缩框默认打开  
   `iframec`为收缩框默认关闭

    ```
    ::iframe[流程图Demo]{url=/demo/flowchart.html}
    ::iframec[流程图Demo]{url=/demo/flowchart.html}
    ```

    目前版本能够展示 url 的网页,效果如下：
    ::iframe[流程图 Demo]{url=/demo/flowchart.html}
    ::iframec[时序图]{url=/demo/sequence-diagrams.html}

    <!-- ::iframe[BiliBili]{url="//player.bilibili.com/player.html?aid=690345969&bvid=BV1N24y117QE&cid=895902728&page=1"} -->

10. 提供`demo`命令

    ````
        :::demo
        ```html
        <div>
            <div>before content<div>
            text
            <div>after content<div>
        </div>
        ```
        :::
    ````

    效果：
    :::demo

    ```html
    <div>
        <div>
            before content
            <div>
                text
                <div>
                    after content
                    <div></div>
                </div>
            </div>
        </div>
    </div>
    ```

    :::

    ```
    ::demo{path="/demo/flowchart.html"}
    ```

    效果：
    ::demo{path="/demo/flowchart.html"}
    ::demo{path="/demo/字体/HarmonyOS/index.html"}

## 配置

该配置文件在`src/config.ts`中：

1. `SITE_TYPE`:
   值：`ESITETYPE.BLOG`,`ESITETYPE.WIKI`
   默认值：`ESITETYPE.BLOG`
   说明：博客模式与 wiki 模式，主要区别是左侧菜单是一个完整的文件树还是菜单树
2. `Show_Sub_Article`
   值：true,fasle
   默认值：fasle
   说明：在博客模式下，点击菜单显示的是所有孙子节点文章还是只显示子文章
3. `PageSize`
   值：number
   默认值：10
   说明：分页个数

4. 待续

## 截图欣赏

![图 0](/article/PureWiki主题/2023-08-01_01-14-42-23.png)   

## 开发计划

-   [x] 图片 alt 显示
-   [x] 上一页与下一页
-   [x] 搜索(简陋实现，需改进)
-   [x] `mdx`全局组件实现，无需引入(初步实现)
-   [x] 文章不显示在文件夹下，而是点击文件夹展示文章列表文章不显示在文件夹下