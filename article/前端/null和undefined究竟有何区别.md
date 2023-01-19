---
title: null和undefined究竟有何区别
description: ""
pubDate: 2023/1/19 11:30:43
---

## 简单区分

总的来说 `null` 和 `undefined` 都代表空，主要区别在于 `undefined` 表示尚未初始化的变量的值，而 `null` 表示该变量有意缺少对象指向。

- `undefined`
    这个变量从根本上就没有定义
    隐藏式 空值
- `null`
    这个值虽然定义了，但它并未指向任何内存中的对象
    声明式 空值

## MDN 中给出的定义
- `null`
    值 null 是一个字面量，不像 undefined ，它不是全局对象的一个属性。null 是表示缺少的标识，指示变量未指向任何对象。把 null 作为尚未创建的对象，也许更好理解。在 API 中，null 常在返回类型应是一个对象，但没有关联的值的地方使用。

- `undefined`
    undefined 是 全局对象 的一个属性。也就是说，它是全局作用域的一个变量。 undefined 的最初值就是原始数据类型 undefined 。

## 图片定义
![null和undefined](/article/null和undefined究竟有何区别/2023-01-19_19-11-38-05.png)  

## 表现形式

在更深入理解 null 和 undefined 的区别前，我们首先要知道 null 和 undefined 在 JS 中有什么不同的表现形式，用以方便我们更好的理解 null 和 undefined 的区别。

### typeof

```
typeof null  // 'object'
typeof undefined  // 'undefined'
```

### Object.prototype.toString.call

```
Object.prototype.toString.call(null)       // '[object Null]'
Object.prototype.toString.call(undefined)  // '[object Undefined]'
```

### == 与 ===

```
null == undefined  // true
null === undefined  // false
!!null === !!undefined  // true
```

### Object.getPrototypeOf(Object.prototype)

JavaScript 中第一个对象的原型指向 null 。
```
Object.getPrototypeOf(Object.prototype)  // null
```

### + 运算 与 Number()

```
let a = undefined + 1  // NaN
let b = null + 1  // 1
Number(undefined)  // NaN
Number(null)  // 0
```

### JSON

```
JSON.stringify({a: undefined})  // '{}'
JSON.stringify({b: null})  // '{b: null}'
JSON.stringify({a: undefined, b: null})  // '{b: null}'
```

### let undefiend = 'test'

```
function test(n) {
    let undefined = 'test'
    return n === undefined
}

test()           // false
test(undefined)  // false
test('test')     // ture

let undefined = 'test'  // Uncaught SyntaxError: Identifier 'undefined' has already been declared
```

## 深入探索

### 为什么 typeof null 是 object？

typeof null 输出为 'object' 其实是一个底层的错误，但直到现阶段都无法被修复。

原因是，在 JavaScript 初始版本中，值以 32位 存储。前 3位 表示数据类型的标记，其余位则是值。
对于所有的对象，它的前 3位 都以 000 作为类型标记位。在 JavaScript 早期版本中， null 被认为是一个特殊的值，用来对应 C 中的 空指针 。但 JavaScript 中没有 C 中的指针，所以 null 意味着什么都没有或者 void 并以 全0(32个) 表示。

因此每当 JavaScript 读取 null 时，它前端的 3位 将它视为 对象类型 ，这也是为什么 typeof null 返回 'object' 的原因。

### 为什么 Object.prototype.toString.call(null) 输出 '[object Null]'

toString() 是 Object 的原型方法，调用该方法，默认返回当前对象的 [[Class]] 。这是一个内部属性，其格式为 [object Xxx] ，其中 Xxx 就是对象的类型。

### JavaScript 万物皆对象，为什么 xxx.toString() 不能返回变量类型？

这是因为 各个类中重写了 toString 的方法，因此需要调用 Object 中的 toString 方法，必须使用 toString.call() 的方式调用。

对于 Object 对象，直接调用 toString()  就能返回 '[object Object]' 。而对于其他对象，则需要通过 call / apply 来调用才能返回正确的类型信息。

### 为什么 == 和 === 对比会出现 true 和 false ？

很多文章说： undefined 的布尔值是 false ， null 的布尔值也是 false ，所以它们在比较时都转化为了 false ，所以 undefined == null 。
实际上并不是这样的。
ECMA 在 11.9.3 章节中明确告诉我们：

>1. If x is null and y is undefined, return true.
>2. If x is undefined and y is null, return true.

### 为什么 null + 1 和 undefined + 1 表现不同？

这涉及到 JavaScript 中的隐式类型转换，在执行 加法运算 前，隐士类型转换会尝试将表达式中的变量转换为 number 类型。如： '1' + 1 会得到结果 11。

- null 转化为 number 时，会转换成 0
- undefined 转换为 number 时，会转换为 NaN

至于为什么执行如此的转换方式，我猜测是 JavaScript 早期的一个糟糕设计。

从语言学的角度来看：
null 意味着一个明确的没有指向的空值，而 undefined 则意味着一个未知的值。
在某种程度上， 0 意味着数字空值。
这虽然看起来有些牵强，但是我在这一阶段能所最能想到的可能了。

### 为什么 JSON.stringify 会将值为 undefined 的内容删除？

其实这条没有很好的解释方式， JSON 会将 undefined 对应的 key 删除，这是 JSON 自身的转换原则。

在 undefined 的情况下，有无该条数据是没有区别的，因为他们在表现形式上并无不同：
```
let obj1 = { a: undefined }
let obj2 = {}

console.log(obj1.a)  // undefined
console.log(obj2.a)  // undefined
```
但需要注意的是，你可能在调用接口时，需要对 JSON 格式的数据中的 undefied 进行特殊处理。

### 为什么 let undefiend = 'test' 可以覆盖掉 JavaScript 自身的 undefined？

JavaScript 对于 undefined 的限制方式为全局创建了一个只读的 undefined ，但是并没有彻底禁止局部 undefined 变量的定义。

据说在 JavaScript 高版本禁止了该操作，但我没有准确的依据。

请在任何时候，都不要进行 undefined 变量的覆盖，就算是你的 JSON 转换将 undefined 转换为 '' 。也不要通过该操作进行，这将是及其危险的行为。

## 总结

### 关于使用 undefined 还是 null

这是一条公说公有理婆说婆有理的争议内容。
本人更倾向于使用 null ，因为这是显示定义空值的方式。我并不能给出准确的理由。

但关于使用 undefined 我有一条建议：
如果你需要使用 undefined 定义空值，请不要采取以下两种方式：

- let a;
- let a = undefined;

进而采取下面这种方式显式声明 undefined ：

- let a = void 0;

## 参考链接
> [深入探究：null 和 undefined 究竟有何区别？](https://juejin.cn/post/7051144396615450655#comment)

