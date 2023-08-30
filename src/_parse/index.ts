import type { Post } from "@root/typings/post";
import { ShowDraft, isDev, showArticleHeroImage } from "@blog/config";
import { MarkdownInstance } from "astro";
import { articleDir, articleRoute } from "@blog/share";

/**
 * 将所有文章改造成树结构
 * @param data import.meta.glob收集的所有文章
 * @param cb 可以对获取到的每个文章进行处理
 * @returns 文章树
 */
export function parseArticlesToTree(data: any) {
    const array = Object.keys(data)
    const result = []
    for (let i = 0; i < array.length; i++) {
        let value = parsePost(data[array[i]])
        if (!value.title) {
            continue
        }
        if (!ShowDraft && value.isDraft) {
            continue
        }
        if (!isDev && value.isDraft) {
            continue
        }
        let key = array[i].slice(1)
        const tempArr = key.split("/")
        // if(value.isDraft){
        //   tempArr[1] = "草稿"
        // }
        let num = 1 // 从内部文件夹开始
        let curFiles = result;
        while (num < tempArr.length) {
            const temp = tempArr[num]
            let cur = curFiles.filter(v => v.name === temp)
            if (!cur.length) {
                // 文件夹
                let v = {
                    name: temp, // 
                    // 用于匹配激活菜单
                    active: "/post/" + tempArr.slice(1).slice(0, num).join('/').replace(/\.(md|mdx)$/g, ''),
                    // 文件夹才有的字段
                    cateActive: "/cate/" + tempArr.slice(1).slice(0, num).join('/').replace(/\.(md|mdx)$/g, ''),
                    // 用于github的仓库地址完整路径,应该是跟下面那个差不多
                    path: "/article/" + tempArr.slice(1).slice(0, num).join('/').replace(/\.(md|mdx)$/g, ''),
                    // 文件地址，用于github的仓库地址完整路径
                    filePath: "/article/" + tempArr.slice(1).slice(0, num).join('/'),
                    // 数据存放
                    data: undefined,
                    // 子文件
                    children: []
                }
                if (num === tempArr.length - 1) {
                    // 文件
                    delete v.children
                    delete v.cateActive
                    v.data = value
                }
                curFiles.push(v)
                curFiles = v.children
            } else {
                let o = cur[0]
                curFiles = o.children
            }
            num++
        }
    }
    return result
}

/**
 * 获取所有的文章
 */
export async function getPosts(data: any) {
    const posts = Object.values(data) as MarkdownInstance<any>[]
    let allPosts = posts
        .filter((post) => post.frontmatter.title)
        .map((post) => parsePost(post))
        .filter((post) => isDev || !post.isDraft);
    if (!ShowDraft) {
        allPosts.filter((post) => !post.isDraft)
    }
    allPosts = allPosts.sort((a, b) => {
        if (b.pubTimestamp && a.pubTimestamp) {
            return b.pubTimestamp - a.pubTimestamp;
        } else {
            return -1;
        }
    });
    return allPosts;
}

/**
 * 将原始文章统一成一致的格式
 * @param post 文章
 * @returns 统一的文章格式
 */
export function parsePost(post: MarkdownInstance<any>): Post {
    const isRoute = post.file.startsWith(articleRoute);
    let slug = post.file
        .replace(articleRoute, '')
        .slice(1)
        .replace(/\.(md|mdx)$/g, '');
    let url = post.url;
    let filePath = '/src/pages' + post.file.replace(articleRoute, '')
    if (!isRoute) {
        slug = post.file
            .replace(articleDir, '')
            .slice(1)
            .replace(/\.(md|mdx)$/g, '');
        url = '/post/' + slug;
        filePath = post.file.replace(articleDir, '')
    }
    const isDraft = slug.split('/')[0].startsWith('drafts');
    const isPages = !!isRoute;

    let pubTimestamp = 0
    if (post.frontmatter.pubDate) {
        pubTimestamp = new Date(post.frontmatter.pubDate).valueOf()
    }
    let updatedTimestamp = 0
    if (post.frontmatter.updatedDate) {
        updatedTimestamp = new Date(post.frontmatter.updatedDate).valueOf()
    }
    let heroImage = post.frontmatter.heroImage
    if (showArticleHeroImage && !heroImage && post.frontmatter._images && !!post.frontmatter._images.length) {
        heroImage = post.frontmatter._images[0].url
    }

    return {
        ...post.frontmatter,
        heroImage,
        Content: post.Content,
        filePath: filePath,
        slug: slug,
        url, // 如果在src/pages目录外，此时url为undefined,那么就使用上面的slug手动拼接路由
        isDraft,
        isPages,
        nextArticle: undefined,
        beforeArticle: undefined,
        pubTimestamp: pubTimestamp,
        updatedTimestamp: updatedTimestamp,
    };
}