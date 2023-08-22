import { visit, SKIP } from "unist-util-visit";
import { h } from "hastscript";
import { toHast } from "mdast-util-to-hast";
import { toHtml } from "hast-util-to-html";

function Block(divName, properties, children = []) {
    return {
        type: "textDirective",
        __handled: true,
        data: {
            hName: divName,
            hProperties: properties,
        },
        children: children,
    };
}

export default function remarkTabs() {
    return function (tree) {
        visit(tree, (node) => {
            if (node.type === "containerDirective" && node.name === "tabs") {
                const attributes = node.attributes || {};
                if (!attributes.name) return;
                node.data = {
                    hName: "div",
                    hProperties: {
                        class: `tabs ` + (attributes.class ?? ""),
                    },
                };

                let children = node.children;
                node.children = [];
                children.forEach((el, index) => {
                    if (el.type === "containerDirective" && el.name === "tab") {
                        let label = el.children[0];
                        node.children.push(
                            Block("input", {
                                type: "radio",
                                name: attributes.name,
                                id: `${attributes.name}-tab${index}`,
                                checked: index === 0 ? "checked" : "",
                            })
                        );
                        node.children.push(
                            Block(
                                "label",
                                {   
                                    class: "tab-name",
                                    for: `${attributes.name}-tab${index}`,
                                },
                                [label]
                            )
                        );
                        node.children.push(
                            Block("div", { class: "tab" }, el.children.slice(1))
                        );
                        el.children = [];
                    }
                });
                // console.log(node);
                // console.log(toHtml(toHast(node)));
                node.__handled = true;
                return node;
            }
            // return SKIP
        });
    };
}
