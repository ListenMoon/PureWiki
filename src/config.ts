// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.

const { MODE } = import.meta.env;
export const isDev = MODE === 'development';
export const isProd = MODE === 'production';

export const SITE_LANG = "zh-cn"
export const SITE_TITLE = '编程百科';
export const SITE_DESCRIPTION = '花径不曾缘客扫，蓬门今始为君开!';

/**
 * 左侧文件夹标题
 */
export const TreeTitle = "文章"

/**
 * 左侧文件夹打开遵循方式
 * always: 总是打开文件夹
 * dir:    只打开子文件全是文件夹的文件夹
 */
export const expandTreeType: "always" | "dir" = "dir"

/**
 * true: 如果没有头图且文章中存在图片，则显示第一个图片替代头图
 */
export const showArticleHeroImage = false

export const FooterAuthor = 'NPMRUN';
export const FooterName = '编程百科';
export const FooterRepo = 'https://bitbucket.org/qqvv/pure-wiki';

// 远程地址，可自行修改对应的操作
export const enableRemote = true // 是否显示远程编辑按钮
const bitbucketNewURL = "https://bitbucket.org/qqvv/pure-wiki/create-file/33bf038960e3e8f3ef4e93c9f0d18906cfcb364e__placeholder__/?at=master"
const bitbucketEidtURL = "https://bitbucket.org/qqvv/pure-wiki/src/master__placeholder__?mode=edit&at=master"
const githubEditURL = 'https://github.com/ListenMoon/PureWiki/edit/master__placeholder__'
const githubNewURL = 'https://github.com/ListenMoon/PureWiki/new/master__placeholder__'
export function getEditURL(url: string) {
    return githubEditURL.replace("__placeholder__", url)
}
export function getNewURL(url: string) {
    return githubNewURL.replace("__placeholder__", url)
}
