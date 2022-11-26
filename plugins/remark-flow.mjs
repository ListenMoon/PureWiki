// https://github.com/remarkjs/remark-directive
// https://github.com/syntax-tree/mdast-util-directive#syntax-tree

import { visit } from 'unist-util-visit';

export default function calloutsPlugin() {
  return (tree, file) => {
    visit(tree, "code", (node) => {
        let { lang } = node;
        if (lang === "flow") {
            node.type = "html";
            node.value = `<div class="mermaid">${node.value}</div>`;
        } else if (lang === "sequence") {
            node.type = "html";
            node.value = `<div class="mermaid">${node.value}</div>`;
            // 时序图
            // const el = {
            //     type: "element",
            //     tagName: "div",
            //     properties: {
            //         className: "sequence",
            //         style: "color: #80808057;font-size: 14px;margin: 6px 0;border-width: 0;text-align:center;",
            //     },
            //     children: [
            //         {
            //             type: "raw",
            //             value: "没有合适的库,暂不支持时序图解析",
            //             // value: value.replace(/[\r\n]/g, "_::_"),
            //         },
            //     ],
            // };
            // node.type = "html";
            // node.value = toHtml(el);
        }
        return node;
    });
  };
}
