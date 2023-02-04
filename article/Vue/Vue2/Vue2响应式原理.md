---
title: Vue2响应式原理
description: ""
pubDate: 2023/2/4 10:57:48
---

## 观察器

```js
class Observer {
    constructor(data) {
        // 如果传入的值不是对象或者不存在，就直接退出
        if (!data || typeof data != "object") {
            return;
        }
        // 绑定单一的值
        this.data = data;
        // 遍历所有可遍历属性
        this.walk();
    }

    walk() {
        for (const key in this.data) {
            // 对每一个元素进行可监测处理
            this.defineReactive(this.data, key, this.data[key]);
        }
    }
    defineReactive(obj, key, val) {
        // 如果传入的又是一个对象，那么需要对其子元素继续进行监测处理
        new Observer(val);
        // 定义可监测代码的主要函数
        Object.defineProperty(obj, key, {
            get() {
                // 针对值获取的拦截处理，如console.log(obj.a)
                console.log("1");
                return val;
            },
            set(newVaule) {
                // 针对赋值的拦截处理，如obj.a = 100
                if (val === newVaule) {
                    return;
                }
                console.log("2");
                val = newVaule;
                // 对新改变的值继续进行可监测处理
                new Observer(newVaule);
            },
        });
    }
}
```

使用方法：

```
let data = {
    name: " cjg",
    obj: {
        name: "zht"
    }
}

let ob = new Observer(data);
ob.defineReactive(data,'aa',5)
data.aa=4
data.aa
//--->
//2 // 先是赋值
//1 // 然后值获取
```

## 依赖收集

```js
// 观察器
***
  defineReactive(obj, key, val) {
    const dep = new Dep(); // 每一个值定义一个依赖管理
    new Observer(val);
    Object.defineProperty(obj, key, {
      get() {
        console.log('1');
        if (Dep.target) { // 如果管理器绑定了一个监听器，那么就将可监测值推入管理队列中
          dep.addSub(Dep.target); // 推入操作
        }
        return val;
      },
      set(newVaule) {
        if (val === newVaule) {
          return;
        }
        val = newVaule;
        new Observer(newVaule);
        dep.notify(); // 依赖刷新
      }
    })
  }
***
```

```js
// 依赖管理器
class Dep {
    constructor() {
        this.subs = [];
    }
    addSub(sub) {
        if (this.subs.indexOf(sub) < 0) {
            this.subs.push(sub);
        }
    }
    notify() {
        this.subs.forEach((sub) => {
            sub.update();
        });
    }
}
// 用户绑定Watcher
Dep.target = null;
```

## 监听器

```js
class Watcher {
    // vm: 响应式对象
    // keys: 响应式对象的属性
    // updateCb: 数值更新时的回调
    constructor(vm, keys, updateCb) {
        this.vm = vm;
        this.keys = keys;
        this.updateCb = updateCb;
        this.value = null;
        this.get();
    }
    // 监听器绑定
    get() {
        // 依赖管理器设置该监听器
        Dep.target = this;
        // 对属性的拆分，例如obj.a.a
        const keys = this.keys.split(".");
        // 获取响应式对象
        let value = this.vm;
        // 对属性进行值的获取，直到最终值
        keys.forEach((_key) => {
            // 这里由于value[_key]获取了值，会执行上面监听器中defineProperty的get属性函数,这样get函数中的依赖收集变会启动并收集该属性.
            value = value[_key];
        });
        // 旧值的临时存储
        this.value = value;
        // 因为上边依赖已经收集完毕,所有可以去掉了,方便下一个响应式对象的设置
        Dep.target = null;
        return this.value;
    }
    update() {
        // 依赖更新,值在被更新的时候执行的函数
        const oldValue = this.value;
        const newValue = this.get(); //获取最新值
        if (oldValue != newValue) {
            this.updateCb(oldValue, newValue);
        }
    }
}
```

[示例](https://flems.io/#0=N4IgtglgJlA2CmIBcBWFA6A7ATgDQgGMB7AOwGciFlDLYBDABzPihHwDMIEzkBtUEnTCIkIdAAsALmFhsaJSfAXUQAX1wChIsQCse+YgqWTqBemTIACAPIAjZgCcAbvAeXgAHRKWflw2UkHAFcCSSIHAAooOkk6AEp3L19kywB6VMtAIM1AHPNAAnlAU0VAELdAHgVAWDlAejNAT+1AQxjANCNAUADSwA1tQAp1QBh-wEYdQBe3QFLjQAAEwC-FJJSfCHZLCIBCaNjLAB85y0kATwZ4InGZuktJgF5LDxAiWx14UMOEz28RlId4SSCHEgBuYZHVN5T0y0BFv0As7UAqsqAADkSp9kpJxBAyOgtpZ9ltXtcRt9ALIJgDDlQACRoBIc0A98rowB6OoByAzBvghUPQAHc6LAANYROKI5IfEifKm0+mJJEpdjhCb+SSWGnwZaWCDeMnQraXEnIjKVQDz1kDAFRygGFFQAEvoBt+MAMhE4wCLboBpW0AIJqAMBcZSkJTD4JwSPAAErwOihCAuCIWra4QXCj1umJ0XhC5YAXQZZuZTM+UCtYrtDqdLuOOg9AY9Tmp0q5yX5lkjDDhlhtFMsABF4Ax6c80hlFUrin9AJJyysAufKANVjAIXepozvgLNnsrhckVTsBDnZ8dlOoUt1vgAAUHEQ1g4VhEE0mvZybr4AOb3DlXDfJMYTEsMdCxBzbySXStZbLtwAWav9AGFyyt1gBoVO9tQDFCYAJOQ6gDAdPV9WKQAK43ydtAHw0wB0JUAWjkzRGHN0DoGAAGUglsCJj1POhz3uBlr1AwBZk0AHXk4N8MN9x8O4HieSxB0Zfd1FI5hJAiAsADU6CCBB0wo0ZxgiQc4V2fZ2M47j114yj7keF5SJ8ciKMEkT4ApDiuPgeiKO7OxHH7ViVLU7jNP3BCSCISQxmWctrxbQB2JUABtNSIUlJVDiT5mWZLxvhbe8vDMOgLGLUsJJ8flglCcJdzNC0yDQqx9l4QNjOcpCoFQ9DYtsHibkPV1IWhTLoTFSMAA9rHYCJMoSAAeSwAAZsoomK4vQBggjIcRKrQ4cN2c5yzIs9grMa818vQQr0B5BwAFFHU6rqsrhAA+EL90y9AggYGZ4HLUMerIrxmW+QAKV0AdiN-gAdRiAhxFcLxMLPC88xILjYERPzzCsK7JBu1xVu+JwwCQSxAFmVQAUvUAeH0ak+b4AzIYHwah6pCiJGGMk27aAGFbGBwAHU2KQAXs3swA300KQA9tUAYBjPjCkIwgHMBV2WMgPQxmJ4GxkbwTGwG80B4yufJOG8zh-nSTG1nFGxvMJfZ2xRZ8C1ByCeBnte+WljGi9dq5ZzvjfB8-k+LXOd8by22NO9AD7owA7f0AU+j9bNB7sKe-YJXV75KiJQpADGjQAwJTaQBo+UyBNEMQs0syF12xrh8aGFgCAWMOdALndjJAHbgwA15UR6GR0sBABSVlWo-JPmzQ9oltWKQpM7aLpAAYlQAAc0ACb9ijNGOptmm6IgiAB9AMEl2Fa91475AE34wAZxMARldADi5QveD74VA0zx9ijaQAseUAcyMtUAKDlACN0-XoMjKdZ3nVwVkKC8iUAX8VcdwUfAHYLC8b+gwoW0ANlNADG0wAN5TXwB6FUACqVABuep-W2RJk652SIXXm1JlbzwDElPaqdLCAHPTKugAWOWJk0QAFQrRW5jAoutF8FIMAAdqgAuOW3oATviWyACfdQA836f0ADHagBV61wNiHEgBTuUAN3KgBI40fLgQAnaaAH75QA0HLKmzsjG2jtSxYRwgKESaszRURkhrEuRD3KfBllFXOZsia4GKC0QA1RFE0KMTQAmApb0KDfcOpAAiWEoFADisBlZ5kVmo3OWZRJOIIRaY2FZ0iZwbvZVuudcr2Mcc4vY+YDL4JNiMC0MtsbLlgA4-BHpPHK32u8dRJBPIkHztmX0eZh4+EEMIYGhw-A6E3IcXAnwEzA2KSkUp8BykgAAF5SEONk3J+TjjPRUj2XSrgoi+mHFsdAzTdiHACtELpJBuzfV+pEY4HpDjjOaTUyw7AggkCdKQJJKSvFpOiV4uIw9-CUHgOgWARBNwHPCfAY5qkYmHTcvMgZizbrLNsKskA6ytCbO2bsiy+ywmpKic8055ybGXOubc+54L0nwDea5Lw-zhBTJADMgAjLiw4chmAID2eQaguKAAsSBsUAA4AC02K6oADYkB1TUBoEAzTqDoAIBYOQhhFDKFEGoQMqggA)
