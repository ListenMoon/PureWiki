import { isDev, showArticleHeroImage } from "@blog/config";
import { Post } from "@root/typings/post";
import { MarkdownInstance } from "astro";
import { collectDir, articleRoute } from "../share";
import { betterDirectorySort } from "./better-directory-sort";

function co(data: any, cb: any) {
    const array = Object.keys(data);
    const result = [];
    for (let i = 0; i < array.length; i++) {
        let value = cb(data[array[i]]);
        if (!value.title) {
            continue;
        }
        if (!isDev && value.isDraft) {
            continue;
        }
        let key = array[i].slice(1);
        const tempArr = key.split("/");
        // if(value.isDraft){
        //   tempArr[1] = "草稿"
        // }
        let num = 1; // 从内部文件夹开始
        let curFiles = result;
        while (num < tempArr.length) {
            const temp = tempArr[num];
            let cur = curFiles.filter((v) => v.name === temp);
            if (!cur.length) {
                // 文件夹
                let v = {
                    name: temp, //
                    // 用于匹配激活菜单
                    active:
                        "/collect/" +
                        tempArr
                            .slice(1)
                            .slice(0, num)
                            .join("/")
                            .replace(/\.(md|mdx)$/g, ""),
                    // 用于github的仓库地址完整路径,应该是跟下面那个差不多
                    path:
                        "/collect/" +
                        tempArr
                            .slice(1)
                            .slice(0, num)
                            .join("/")
                            .replace(/\.(md|mdx)$/g, ""),
                    // 文件地址，用于github的仓库地址完整路径
                    filePath:
                        "/collect/" + tempArr.slice(1).slice(0, num).join("/"),
                    // 数据存放
                    data: undefined,
                    // 子文件
                    children: [],
                };
                if (num === tempArr.length - 1) {
                    // 文件
                    delete v.children;
                    v.data = value;
                }
                curFiles.push(v);
                curFiles = v.children;
            } else {
                let o = cur[0];
                curFiles = o.children;
            }
            num++;
        }
    }
    return result;
}

const readFiles = import.meta.glob("@root/collect/**/*.{md,mdx}", {
    eager: true,
});

export async function getPosts() {
    return Object.values(readFiles) as MarkdownInstance<any>[];
}

export async function publishedTree() {
    let tree = co(readFiles, function (post) {
        return single(post);
    });
    tree = (function readTree(list: any) {
        for (let i = 0; i < list.length; i++) {
            const item = list[i];
            if (item.children && item.children.length) {
                item.children = readTree(item.children);
            }
        }
        return list.sort((a, b) => {
            return betterDirectorySort(
                { name: a.name, isDirectory: !a.data },
                { name: b.name, isDirectory: !b.data }
            );
        });
    })(tree);
    return tree;
}

export async function publishedList() {
    const tree = await publishedTree();
    let sorted = [];
    (function readTree(list: any) {
        for (let i = 0; i < list.length; i++) {
            const item = list[i];
            if (item.data) {
                sorted.push(item);
            }
            if (item.children && item.children.length) {
                readTree(item.children);
            }
        }
    })(tree);
    for (let i = 0; i < sorted.length; i++) {
        const item = sorted[i];
        item.data.beforeArticle = sorted[i - 1]?.data;
        item.data.nextArticle = sorted[i + 1]?.data;
    }
    return sorted.map((v) => v.data);
}

export async function sortPublishedList() {
    let posts = await publishedList();
    posts = posts.sort((a, b) => {
        if (b.pubTimestamp && a.pubTimestamp) {
            return b.pubTimestamp - a.pubTimestamp;
        } else {
            return -1;
        }
    });
    return posts;
}

export function single(post: MarkdownInstance<any>): Post {
    const isRoute = post.file.startsWith(articleRoute);
    let slug = post.file
        .replace(articleRoute, "")
        .slice(1)
        .replace(/\.(md|mdx)$/g, "");
    let url = post.url;
    let filePath = "/src/pages" + post.file.replace(articleRoute, "");
    if (!isRoute) {
        slug = post.file
            .replace(collectDir, "")
            .slice(1)
            .replace(/\.(md|mdx)$/g, "");
        url = "/collect/" + slug;
        filePath = post.file.replace(collectDir, "");
    }
    const isDraft = slug.split("/")[0].startsWith("drafts");
    const isPages = !!isRoute;

    let pubTimestamp = 0;
    if (post.frontmatter.pubDate) {
        pubTimestamp = new Date(post.frontmatter.pubDate).valueOf();
    }
    let updatedTimestamp = 0;
    if (post.frontmatter.updatedDate) {
        updatedTimestamp = new Date(post.frontmatter.updatedDate).valueOf();
    }
    let heroImage = post.frontmatter.heroImage;
    if (
        showArticleHeroImage &&
        !heroImage &&
        post.frontmatter._images &&
        !!post.frontmatter._images.length
    ) {
        heroImage = post.frontmatter._images[0].url;
    }

    return {
        ...post.frontmatter,
        heroImage,
        Content: post.Content,
        filePath: filePath,
        slug: slug,
        url,
        isDraft,
        isPages,
        nextArticle: undefined,
        beforeArticle: undefined,
        pubTimestamp: pubTimestamp,
        updatedTimestamp: updatedTimestamp,
    };
}

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
    return allPosts;
}
