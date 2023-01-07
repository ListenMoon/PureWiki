---
title: 有关vite中使用环境变量
description: "有关vite中使用环境变量"
pubDate: 2023/1/6 15:49:55
---

根据官网的描述，如果需要给一个vite修改的配置的话，可以在项目的根目录下新建一个`vite.config.ts`文件，此时其中的修改会被应用到项目之中。
不过，有可能在配置文件中也需要区分开发环境和生产环境进行配置的，因此这里详细介绍以下该配置文件的使用方法。

## ts配置

因为vite.config.ts是node环境中执行，因此可以与项目文件区分开，可以新建一个`tsconfig.node.json`文件代码如下：
```json
{
    "compilerOptions": {
        "target": "es5", // 最低兼容的版本
        "strict": true, // 启用严格模式
        "composite": true,
        "resolveJsonModule": true,
        "esModuleInterop": true,
        "module": "esnext",
        "moduleResolution": "node",
        "allowSyntheticDefaultImports": true
    },
    "include": ["vite.config.ts", "vite.env.d.ts"]
}
```
其中vite.env.d.ts可以声明一些与项目共有的类型，如：
```ts
/// <reference types="vite/client" />
interface ImportMetaEnv {
    readonly VITE_SENTRY_URL: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
```
如此的话，只需要在`tsconfig.json`包含`vite.env.d.ts`即可，而不需包含`vite.config.ts`，做到类型隔离。

## 详细说明

在官网的[配置说明](https://cn.vitejs.dev/config/)中说明过这这里不再说明，这里针对在配置中如何判断不同的环境以及使用不同的环境变量。

根据官方的说明，可以将代码写成如下格式
```ts
import { ConfigEnv, defineConfig, loadEnv, UserConfigExport } from "vite"

export default defineConfig(({ command, mode, ssrBuild }) => {
  const __PROD__ = mode === "production"
  const __DEV__ = mode === "development"
  const __STAGE__ = mode === "staging"
  const config = <ImportMetaEnv>loadEnv(mode, process.cwd())
  return {
    ...
  }
})
```
- `command`参数包含`vite`运行时执行的命令，如执行了`vite serve`,则`command`是`serve`,执行了`vite build`,则`command`是`build`,应该就这两个值常用，一个表示开发环境，一个表示生产环境
- `mode`在执行`vite serve`时是`development`，在执行`vite serve`时是`production`,也可以特别指定`vite build --mode staging`，此时运行的是生产配置，但`mode`是`staging`。同时，会自动加载`.env.`+`mode`值的文件，如mode是`development`，那么就会加载根目录`.env.development`的环境变量文件。`.env`会被所有模式加载
- `config`声明之后就能使用`.env.[mode]`中的环境变量了，记住该文件中的环境变量只能以`VITE_`开头，如果在`.env.[mode]`中声明了变量`VITE_SENTRY_URL=123`,此时`config.VITE_SENTRY_URL`的值将会是123。最好自行在`ImportMetaEnv`添加类型说明，能有更好的智能提示体验。
- `ssrBuild`暂时用不到