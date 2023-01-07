import { visit } from "unist-util-visit";

function Block(divName, properties, children = []) {
    return {
        type: "leafDirective",
        __handled: true,
        data: {
            hName: divName,
            hProperties: properties,
        },
        children: children,
    };
}

export default function collectPlugin() {
    return (tree, file) => {
        visit(tree, (node) => {
            if (node.type === "leafDirective" && node.name === "collect") {
                const data = node.data || (node.data = {});
                const attributes = node.attributes || {};
                const children = node.children || [];
                const url = attributes.url;
                const demo = attributes.demo;
                const desc = attributes.desc;
                node.type = "leafDirective";
                node.__handled = true;
                data.hName = "div";
                data.hProperties = { class: "doc-card" };
                const dd = (node.children = [
                    Block(
                        "a",
                        {
                            href: url,
                            title: url,
                            class: "doc-card-a",
                            target: "_blank",
                        },
                        [
                            Block("div", { class: "doc-card-title" }, children),
                            Block("div", { class: "doc-card-describe" }, [
                                {
                                    type: "text",
                                    value: desc,
                                },
                            ]),
                        ]
                    ),
                ]);
                if (!!demo) {
                    node.children.push(
                        Block("div", { class: "doc-card-bottom" }, [
                            Block(
                                "a",
                                {
                                    href: demo,
                                    class: "doc-card-tag",
                                },
                                [
                                    {
                                        type: "text",
                                        value: "Demo",
                                    },
                                ]
                            ),
                        ])
                    );
                }
            }
            return node;
        });
    };
}
