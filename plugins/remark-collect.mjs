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
                node.type = "leafDirective";
                node.__handled = true;
                data.hName = "div";
                data.hProperties = { class: "doc-card" };
                let title = ""
                let desc = ""
                if(children.length !== 0 && children[0].type === "text"){
                    const text = children[0].value.split("||")
                    !!text[0] && (title = text[0])
                    !!text[1] && (desc = text[1])
                }
                node.children = [
                    Block(
                        "div",
                        {
                            class: "doc-card-a",
                            title: desc
                        },
                        [
                            Block("div", { class: "doc-card-title" }, [{
                                type: "text",
                                value: title
                            }]),
                            Block("div", { class: "doc-card-describe" }, [
                                {
                                    type: "text",
                                    value: desc,
                                },
                            ]),
                        ]
                    ),
                ];
                const child = []
                if (!!url) {
                    child.push(
                        Block(
                            "a",
                            {
                                href: url,
                                class: "doc-card-tag",
                            },
                            [
                                {
                                    type: "text",
                                    value: "网址",
                                },
                            ]
                        )
                    )
                }
                for (const key in attributes) {
                    if (Object.hasOwnProperty.call(attributes, key)) {
                        const element = attributes[key];
                        if(key !== "url" && key !== "desc" && element){
                            child.push(
                                Block(
                                    "a",
                                    {
                                        href: element,
                                        class: "doc-card-tag",
                                    },
                                    [
                                        {
                                            type: "text",
                                            value: key,
                                        },
                                    ]
                                )
                            )
                        }
                    }
                }
                node.children.push(
                    Block("div", { class: "doc-card-bottom" }, child)
                )
            }
            return node;
        });
    };
}
