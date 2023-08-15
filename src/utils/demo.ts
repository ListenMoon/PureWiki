import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import glob from "fast-glob";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function getAllHTML() {
    const tree = await import.meta.glob("@root/public/demo/**/*.html", {
        eager: true,
        as: "raw",
    })
    return tree;
}

async function praseDemo() {
    const tree = await getAllHTML()
    const result = {};
    for (const key in tree) {
        if (Object.prototype.hasOwnProperty.call(tree, key)) {
            const content = tree[key];
            const route = key.replace(/\/public/, '')
            let title = "未命名 | " + route;
            let desc = "";
            const titleReg = /<title>(.*?)<\/title>/i.exec(content);
            if (titleReg && titleReg[1]) {
                title = titleReg[1];
                if(!title.startsWith("Public:")){
                    continue
                }
                title = title.replace("Public:", "")
            }
            const descReg = /<meta name="description" content="(.*?)">/i.exec(
                content
            );
            if (descReg && descReg[1]) {
                desc = descReg[1];
            }
            const dir = path.parse(route).dir.replace(/\/demo/, "Demo");
            if (!result[dir]) result[dir] = [];
            result[dir].push({
                title,
                desc,
                dir,
                route,
            });
        }
    }
    return result;
}

export { praseDemo };
