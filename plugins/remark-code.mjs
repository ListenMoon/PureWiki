// https://github.com/nemo-omen/remark-code-figure/blob/main/index.js
// https://github.com/syntax-tree/mdast#code

import { visit } from "unist-util-visit";
// import { runHighlighterWithAstro } from "@astrojs/prism/dist/highlighter";
import {toHast} from 'mdast-util-to-hast'
import {toHtml} from 'hast-util-to-html'

export default function remarkCode() {
    return function (tree) {
        visit(tree, "code", (node) => {
            let html = toHtml(toHast(node))
            let { lang, value, meta } = node;
            node.type = "html";
            node.value = `<figure class="code-figure">
                    <figcaption class="line-numbers-head">
                        <div class="custom-carbon">
                        <div class="custom-carbon-dot custom-carbon-dot--red"></div>
                        <div class="custom-carbon-dot custom-carbon-dot--yellow"></div>
                        <div class="custom-carbon-dot custom-carbon-dot--green"></div>
                        <div class="text">${!!lang ? `<span class="language">${lang}</span>` : ""}</div>
                        <div class="copy-btn">复制</div>
                        <textarea placeholder="." title="." style="display: none;">${value}</textarea>
                    </div>
                    </figcaption>
                    ${html}${!!meta
                    ? `<figcaption class="code-caption">${meta}</figcaption>`
                    : ""
                }
                </figure>`;
            return node;
        });
    };
}