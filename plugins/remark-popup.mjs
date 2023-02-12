import { visit } from "unist-util-visit";
import { h } from 'hastscript';

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

export default function popupPlugin() {
    return (tree, file) => {
        visit(tree, (node) => {
            if ((node.type === 'textDirective') && (node.name === "popup")) {
                const data = node.data || (node.data = {});
                const attributes = node.attributes || {};
                const children = node.children || [];
                node.__handled = true;
                const tagName = "span"
                data.hName = tagName // 这里使用div会导致前面的行内元素放置在p元素中导致换行
                let className = "enshrine popup"
                data.hProperties = h(data.hName, { class: className }).properties;
                let title = ""
                let desc = ""
                if(children.length !== 0 && children[0].type === "text"){
                    const text = children[0].value.split("::")
                    !!text[0] && (title = text[0])
                    !!text[1] && (desc = text[1])
                }
                const _children = [
                    Block(
                        tagName,
                        {
                            class: "doc-card-a",
                            title: desc
                        },
                        [
                            Block(tagName, { class: "doc-card-describe" }, [
                                {
                                    type: "text",
                                    value: desc,
                                },
                            ])
                        ]
                    ),
                ];
                const child = []
                for (const key in attributes) {
                    if (Object.hasOwnProperty.call(attributes, key)) {
                        const element = attributes[key];
                        if(element){
                            const [url, name = key] = element.split("||")
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
                                            value: name,
                                        },
                                    ]
                                )
                            )
                        }
                    }
                }
                if(child.length){
                    _children.push(
                        Block(tagName, { class: "doc-card-bottom" }, child)
                    )
                }
                node.children = [
                    Block("a", { class: "text", style: "text-decoration: wavy underline #1abc9c;text-underline-offset: .3em;" }, [{
                        type: "text",
                        value: title
                    }]),
                    Block(tagName, { class: "dropdown" }, [
                        Block(tagName, { class: "doc-card" }, _children),
                    ]),
                ]
            }
            return node;
        });
    };
}
