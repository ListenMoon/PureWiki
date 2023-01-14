import type { Post } from '#/post';
import { isDev, showArticleHeroImage } from '@blog/config';
import type { MarkdownInstance } from 'astro';
import { articleDir, articleRoute } from '@blog/share';
import { betterDirectorySort } from './better-directory-sort';

function co(data: any, cb: any) {
    const array = Object.keys(data)
    const result = []
    for (let i = 0; i < array.length; i++) {
        let value = cb(data[array[i]])
        if (!value.title) {
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
                    name: temp,
                    active: "/post/" + tempArr.slice(1).slice(0, num).join('/').replace(/\.(md|mdx)$/g, ''),
                    path: "/article/" + tempArr.slice(1).slice(0, num).join('/').replace(/\.(md|mdx)$/g, ''),
                    filePath: "/article/" + tempArr.slice(1).slice(0, num).join('/'),
                    data: undefined,
                    children: []
                }
                if (num === tempArr.length - 1) {
                    // 文件
                    delete v.children
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
export async function getPosts() {
    const obj = await import.meta.glob('@root/article/**/*.{md,mdx}', {
        eager: true,
    });
    return Object.values(obj) as MarkdownInstance<any>[];
}

/**
 * 获取文件树
 */
export async function publishedTree() {
    const obj = await import.meta.glob('@root/article/**/*.{md,mdx}', {
        eager: true,
    });
    let tree = co(obj, function (post) {
        return single(post)
    });
    // 排序
    tree = (function readTree(list: any) {
        for (let i = 0; i < list.length; i++) {
            const item = list[i];
            if (item.children && item.children.length) {
                item.children = readTree(item.children)
            }
        }
        return list.sort((a, b) => {
            return betterDirectorySort(
                { name: a.name, isDirectory: !a.data },
                { name: b.name, isDirectory: !b.data },
            );
        })
    })(tree);
    return tree
}

export async function publishedList() {
    const tree = await publishedTree()
    let sorted = [];
    (function readTree(list: any) {
        for (let i = 0; i < list.length; i++) {
            const item = list[i];
            if (item.data) {
                sorted.push(item)
            }
            if (item.children && item.children.length) {
                readTree(item.children)
            }
        }
    })(tree)
    for (let i = 0; i < sorted.length; i++) {
        const item = sorted[i];
        item.data.beforeArticle = sorted[i - 1]?.data
        item.data.nextArticle = sorted[i + 1]?.data
    }
    return sorted.map(v => v.data)
}

/**
 * 处理单个文章信息
 */
export function single(post: MarkdownInstance<any>): Post {
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

    //   优点是不用自己每个都写时间与更新时间，但这是基于本地的，如果在一台新电脑上时间肯定对不上，可以考虑写入文件内
    //   const stat = fs.statSync(post.file);
    //   const mtimeMs = stat.mtimeMs
    //   const birthtimeMs = stat.birthtimeMs
    //   let pubTimestamp = birthtimeMs
    //   if(!post.frontmatter.pubDate){
    //     post.frontmatter.pubDate = dateTimeFormat(birthtimeMs, "yyyy/MM/dd HH:mm:ss")
    //   }else{
    //     pubTimestamp = new Date(post.frontmatter.pubDate).valueOf()
    //   }
    //   let updatedTimestamp = mtimeMs
    //   if(!post.frontmatter.updatedDate){
    //     post.frontmatter.updatedDate = dateTimeFormat(mtimeMs, "yyyy/MM/dd HH:mm:ss")
    //   }else{
    //     updatedTimestamp = new Date(post.frontmatter.updatedDate).valueOf()
    //   }

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

/**
 * 处理文章信息
 */
export async function published(): Promise<Post[]> {
    const posts = await getPosts();
    let allPosts = posts
        .filter((post) => post.frontmatter.title)
        .map((post) => single(post))
        .filter((post) => isDev || !post.isDraft);
    allPosts = allPosts.sort((a, b) => {
        if (b.pubTimestamp && a.pubTimestamp) {
            return b.pubTimestamp - a.pubTimestamp;
        } else {
            return -1;
        }
    });
    //   for (let i = 0; i < allPosts.length; i++) {
    //     const post = allPosts[i];
    //     if (post.top) {
    //       const delOne = allPosts.splice(i, 1);
    //       allPosts.unshift(delOne[0]);
    //     }
    //   }
    return allPosts;
}

/**
 * 获取置顶文章
 */
export async function getTopPublished(): Promise<Post[]> {
    let allPosts = (await publishedList()).filter(v => !!v.top)
    return allPosts;
}

/**
 * 获取Astro.props的文章数据，判断是不是解析过了
 */
export function getPost(props: any): any {
    const { frontmatter } = props;
    const isMd = !!frontmatter;
    return isMd ? single(props) : props;
}
