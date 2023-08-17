// https://github.com/nemo-omen/remark-code-figure/blob/main/index.js
// https://github.com/syntax-tree/mdast#code

import { visit } from "unist-util-visit";
import { runHighlighterWithAstro } from "@astrojs/prism/dist/highlighter";

export default function remarkCode() {
    return function (tree) {
        visit(tree, "code", (node) => {
            let { lang, value, meta } = node;
            node.type = "html";
            let { html, classLanguage } = runHighlighterWithAstro(
                lang,
                value
            );
            let classes = [classLanguage];
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
                    <pre class="line-numbers ${classes.join(
                " "
            )}"><code is:raw class="${classLanguage}">${html}</code></pre>${!!meta
                    ? `<figcaption class="code-caption">${meta}</figcaption>`
                    : ""
                }
                </figure>`;
            return node;
        });
    };
}