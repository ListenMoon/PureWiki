// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.

/**
 * 说明：
 * 1. 文章内的上一页下一页使用的是所有文章的数据，即你点击的文章的上下页是所有文章中的列表对应的上下页，
 *    而不是具体分类中的上下页
 */

const { MODE } = import.meta.env;
export const isDev = MODE === 'development';
export const isProd = MODE === 'production';

export const SITE_LANG = "zh-cn"
export const SITE_TITLE = "失落之城";
export const SITE_DESCRIPTION = '花径不曾缘客扫，蓬门今始为君开!';
export const SITE_REPO = 'https://github.com/ListenMoon/PureWiki';

export const ShowLeftMenu = true

// 博客模式下，是否展示祖孙节点的文章
export const Show_Sub_Article = false
export const SITE_TYPE: ESITETYPE = ESITETYPE.BLOG
export const enum ESITETYPE {
    WIKI,
    BLOG
}

export const PageSize = 10

/**
 * 左侧文件夹标题
 */
export const TreeTitle = "文章"
export const CollectTitle = "🍬仓库"

export const ShowDraft = false

/**
 * 左侧文件夹打开遵循方式
 * always: 总是打开文件夹
 * dir:    只打开子文件全是文件夹的文件夹
 */
export const expandTreeType: "always" | "dir" | "close" = "dir"

/**
 * true: 如果没有头图且文章中存在图片，则显示第一个图片替代头图
 */
export const showArticleHeroImage = false

// export const AuthorAvater = 'https://xieyaxin.top/me.jpeg';
export const AuthorAvater = '/avatar.jpg';
export const AuthorName = 'NPMRUN';
export const AuthorRepo = 'https://github.com/npmrun';
export const AuthorDesc = '来自南方小城<br>希望结交益友♥!';
export const StartTime = [2023, 0o2, 23, 20, 55, 32];

// 远程地址，可自行修改对应的操作
export const enableRemote = true // 是否显示远程编辑按钮
// const bitbucketNewURL = "https://bitbucket.org/qqvv/pure-wiki/create-file/33bf038960e3e8f3ef4e93c9f0d18906cfcb364e__placeholder__/?at=master"
// const bitbucketEidtURL = "https://bitbucket.org/qqvv/pure-wiki/src/master__placeholder__?mode=edit&at=master"
const githubEditURL = 'https://github.com/ListenMoon/PureWiki/edit/master__placeholder__'
const githubNewURL = 'https://github.com/ListenMoon/PureWiki/new/master__placeholder__'
export function getEditURL(url: string) {
    return githubEditURL.replace("__placeholder__", url)
}
export function getNewURL(url: string) {
    return githubNewURL.replace("__placeholder__", url)
}
