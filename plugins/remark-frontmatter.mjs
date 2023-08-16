// function isMDFile (name) {
//     var _a;
//     return Boolean((_a = name) == null ? void 0 : (_a.endsWith(".mdx") || _a.endsWith(".md")));
// }

export default function frontmatterPlugin () {
    return async (tree, file) => {
        // let curFile = file.history[0]
        // if (curFile && isMDFile(curFile)) {
            // const stat = fs.statSync(curFile);
            // const mtimeMs = stat.mtimeMs
            // const birthtimeMs = stat.birthtimeMs
            // let pubTimestamp = birthtimeMs
            // // if (!post.frontmatter.pubDate) {
            // //     post.frontmatter.pubDate = dateTimeFormat(birthtimeMs, "yyyy/MM/dd HH:mm:ss")
            // // } else {
            // //     pubTimestamp = new Date(post.frontmatter.pubDate).valueOf()
            // // }
            // let updatedTimestamp = mtimeMs
            // // if (!post.frontmatter.updatedDate) {
            // //     post.frontmatter.updatedDate = dateTimeFormat(mtimeMs, "yyyy/MM/dd HH:mm:ss")
            // // } else {
            // //     updatedTimestamp = new Date(post.frontmatter.updatedDate).valueOf()
            // // }
            // console.log(dateTimeFormat(mtimeMs, "yyyy/MM/dd HH:mm:ss"));

            // if (file.data.astro.frontmatter) {
            //     const frontmatter = file.data.astro.frontmatter
            //     console.log(await import("../markdownConfig.mjs"));
            //     if (frontmatter) {
            //         for (const key in frontmatter) {
            //             const value = frontmatter[key];
            //             console.log(key, value);
            //         }
            //     }
            // }
        // }
    }
}