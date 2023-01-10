---
title: css中line-height属性各个单位详解
description: ""
pubDate: 2023/1/9 17:07:57
---

我们都知道css中line-height属性用于调整行高，它的值有一些不同的单位，本文将详细介绍这些单位的作用和一些区别。

语法规则如下

line-height: normal | `<number>` | `<length>` | `<percentage>`

如果子元素没有指定行高，那么将默认继承父元素的行高，继承的时候父元素行高带单位和不带单位有一些区别。

为了方便，下面效果中我设置了背景颜色，以便观察行高到底是多少

## normal

设置值为normal时 行高根据浏览器默认决定，不同浏览器可能有不同的值。

## 使用单位px

使用px单位表示行高为多少像素
:::demo
```html
<div style="font-size: 20px;
		line-height: 20px;">
			<p style="background: orange;">我是父元素 字体大小20px 行高25px</p>
			<div style="font-size:30px
			">
				<p style="background: green;">我是子元素的内容 字体大小30px 行高继承了父元素行高25px</p>
			</div>
		</div>
```
:::

## 使用百分数或em单位

120%和1.2em效果完全相同。如果某个元素设置行高为1.5em，它的行高就是 1.5乘以 它的字体大小

:::demo
```html
<p style="font-size: 20px; line-height: 1.5em; background: #abcdef;">我字体大小20px,行高1.5em 算出值就是20*1.5为30px</p>
```
:::

如果上面这个例子 行高1.5em 其实它的行高是30px

如果他有子元素，子元素继承的行高是它计算后的行高30px
:::demo
```html
<div style="font-size: 20px; line-height: 150%;">
<p style="background: orange;">我是父元素 字体大小20px 行高150% 计算后30px</p>
<div style="font-size: 30px;">
<p style="background: green;">我是子元素 字体30px 行高继承父元素行高30px</p>
</div>
</div>
```
:::

## 不带单位

不带单位表示行高为元素字体大小乘以该数字。如果子元素继承父元素的该属性，则只继承了该数字，实际行高由该系数乘以各个元素自己的字体大小而定

:::demo
```html
<div style="font-size: 20px; line-height: 1.5;">
<p style="background: orange;">我是父元素 字体大小20px 行高1.5 计算后30px</p>
<div style="font-size: 30px;">
<p style="background: green;">我是子元素 字体30px 行高继承系数1.5 计算后是45px</p>
</div>
</div>
```
:::

## 总结

由于不带单位的时候只继承了系数，推荐使用这种方式。