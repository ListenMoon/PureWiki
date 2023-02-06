import { fromMarkdown } from "mdast-util-from-markdown";
import { mdxjsEsm } from "micromark-extension-mdxjs-esm";
import { mdxjsEsmFromMarkdown } from "mdast-util-mdxjs-esm";
import * as acorn from "acorn";
// import { mdxJsx } from "micromark-extension-mdx-jsx";
// import { mdxJsxFromMarkdown } from "mdast-util-mdx-jsx";
import fg from "fast-glob";

// https://github.com/syntax-tree/mdast-util-mdxjs-esm
// https://github.com/withastro/astro/search?q=mdxjsEsm
// mdx插件
export default function remarkGlobalComponent() {
    return (tree, file) => {
        const list = fg
            .sync(["src/mdxGlobal/**/*"])
            .map((v) => {
                let result = v.match(/src\/mdxGlobal\/(.*?)$/);
                if (result && result[1]) {
                    return result[1];
                }
            })
            .filter((v) => v);
        const components = list
            .map((v) => {
                const name = v.match(/(.*?)\./)
                if(name && name[1]){
                    return `import ${name[1]} from '@blog/mdxGlobal/${v}'\r\n`
                }
            })
            .filter((v) => v)
            .join("");
        const compTree = fromMarkdown(components, {
            extensions: [mdxjsEsm({ acorn, addResult: true })],
            mdastExtensions: [mdxjsEsmFromMarkdown],
        });
        // const comSource = fromMarkdown("<Testaaa></Testaaa>\r\n", {
        //     extensions: [mdxJsx({ acorn: acorn, addResult: true })],
        //     mdastExtensions: [mdxJsxFromMarkdown],
        // });

        file.value = components + file.value;
        tree.children.unshift(...compTree.children);
    };
}
