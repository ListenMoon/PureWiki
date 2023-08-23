// https://github.com/remarkjs/remark-directive
// https://github.com/syntax-tree/mdast-util-directive#syntax-tree

import { visit } from 'unist-util-visit';
import { h } from 'hastscript';
import { toString } from 'hast-util-to-string';
import {toHast} from 'mdast-util-to-hast'
import {toHtml} from 'hast-util-to-html'
import { runHighlighterWithAstro } from "@astrojs/prism/dist/highlighter";
import Slugger from 'github-slugger';
// import path from 'path';
// import fs from 'fs';
// import { normalizePath } from 'vite';

const slugs = new Slugger();

export default function calloutsPlugin() {
  return (tree, file) => {
    
    slugs.reset();

    visit(tree, "link", (node) => {
        node.target="_blank"
        const url = node.url
        const hast = toHast(node)
        if(hast){
            if(url.startsWith("http")){
                hast.properties["target"] = "_blank"
            }
            if(url.endsWith(".woff2") || url.endsWith(".zip")){
                hast.properties["target"] = "_blank"
            }
        }
        node.type = "html"
        node.value = toHtml(hast)
    })

    const images = [];
    visit(tree, 'image', (node) => {
        //===== 解析图片 ===== Start
        const name = node.url.split('/').reverse()[0];
        images.push({
          name: name,
          alt: node.alt,
          url: node.url,
        });
        //===== 解析图片 =====  End

        const url = node.url;
        const alt = node.alt;
        node.type = "html"
        const altStr=`alt="${alt}"`
        const altEl=`<div style="display: flex;justify-content: center;width:100px;white-space:nowrap;margin:0 auto;border-bottom:1px solid #e8e8e8;padding:4px 0;color: #c6c6c6;font-size: 0.875em;">${alt}</div>`
        delete node.url
        delete node.alt
        delete node.title
        node.value = `
            <div style="text-align: center;">
                <img style="display:block;margin:0 auto;max-width: 100%;" ${alt?altStr:''} src="${url}">
                ${alt?altEl:''}
            </div>
        `
    });

    const head = [];
    visit(tree, 'heading', (node) => {
      head.push({
        level: node.depth,
        id: slugs.slug(toString(node)), //slugs.slug(toString(node)),
        title: toString(node) //slugs.slug(toString(node)),
      });
    });
    // file.data.astro.frontmatter.setup = "import TT from '@blog/components/Text.astro'";
    file.data.astro.frontmatter._rawString = file.value;
    file.data.astro.frontmatter._images = images;
    file.data.astro.frontmatter._head = head;

    visit(tree, (node) => {
      if(node.value === "[TOC]" && node.type === "text"){
        node.type = "html";
        const head = file.data.astro.frontmatter._head
        let array = []
        for(let i = 0; i < head.length; i++){
          const v = head[i]
          if(v.level > 3) continue;
          array.push(`<li><a title="${v.title}" href="#${v.id}" style="overflow-x: hidden;white-space: nowrap;text-overflow: ellipsis;margin-left:${(v.level - 1) * 15}px"># ${v.title}</a></li>`)
        }
        node.value = `<ul class="toc">
          ${array.join("")}
        </ul>`
      }
    })

    visit(tree, (node) => {
      if (node.type === 'containerDirective') {
        if (node.name !== 'card') return;
        const data = node.data || (node.data = {});
        const attributes = node.attributes || {};
        node.__handled = true;
        const children =
          node.children.filter((v) => v.name !== 'card-title') || [];
        const cardTitle = node.children.filter(
          (v) => v.type === 'containerDirective' && v.name === 'card-title'
        )[0];
        const isVertical = !!(attributes.id === 'vertical');
        const isCenter = !!(attributes.class === 'center');

        data.hName = 'figure';
        data.hProperties = {
          class: `card ${isVertical ? 'card--vertical' : ''}`,
        };
        node.children = isVertical
          ? [
              {
                type: 'containerDirective',
                __handled: true,
                data: {
                  hName: 'div',
                  hProperties: {
                    class: `card__vertical-container`,
                    style: isCenter
                      ? `display: flex;justify-content: center;align-items: center;`: ''
                  },
                },
                children: [
                  {
                    type: 'containerDirective',
                    __handled: true,
                    data: {
                      hName: 'section',
                      hProperties: {},
                    },
                    children: children,
                  },
                ],
              },
            ]
          : children;
        if (!!cardTitle) {
          node.children.push({
            ...cardTitle,
            __handled: true,
            data: {
              hName: 'figcaption',
            },
          });
        }
      }
    });
    visit(tree, (node) => {
        // if (node.type === 'leafDirective' && node.name === 'demo') {
        //     const cwd = process.cwd()
        //     const data = node.data || (node.data = {});
        //     const attributes = node.attributes || {};
        //     if(attributes.path){
        //         const curPath = normalizePath(path.join(cwd, attributes.path))
        //         const code = fs.readFileSync(curPath, { encoding: "utf8", flag: 'r'})
        //         node.__handled = true
        //         data.hName = 'iframe'
        //         data.hProperties = {
        //             id: attributes.id ?? '',
        //             class: attributes.class ?? '',
        //             style: 'width: 100%;border: 1px solid #e9e9e9;',
        //             height: '300px',
        //             frameborder: '0',
        //             allowfullscreen: "true",
        //             srcdoc: code
        //         }
        //     }
        // }
        if (node.type === 'leafDirective' && node.name === 'demo') {
            const data = node.data || (node.data = {});
            const attributes = node.attributes || {};
            if(attributes.path){
                node.__handled = true
                data.hName = "div"
                data.hProperties = {
                    style: "position:relative;overflow:hidden;margin: 1.5em 0;"
                }
                node.children = [
                    {
                        type: "html",
                        __handled: true,
                        value: `<div style="background: #e9e9e9;padding: 0 1em;font-size:.75em;float:left;">${attributes.title || 'demo'}</div>`
                    },
                    {
                        type: "leafDirective",
                        __handled: true,
                        data: {
                            hName: 'iframe',
                            hProperties: {
                                id: attributes.id ?? '',
                                class: attributes.class ?? 'demo',
                                style: 'width: 100%;border: 1px solid #e9e9e9;display: block;box-sizing: border-box;max-height: 350px;',
                                height: '300px',
                                frameborder: '0',
                                allowfullscreen: "true",
                                onload: "this.style.height = this.contentDocument.documentElement.scrollHeight+'px'",
                                src: attributes.path
                            }
                        }
                    },
                    {
                        type: "html",
                        __handled: true,
                        value: `<div style="background: #e9e9e9;padding: 0 1em;font-size:.75em;"><a href="${attributes.path}" target="_blank">查看源站</a></div>`
                    },
                ]
            }
        }
        if (node.type === 'containerDirective' && node.name === 'demo') {
            const data = node.data || (node.data = {});
            const attributes = node.attributes || {};
            node.__handled = true
            const str = node.children.reduce((a, b)=>(a+'\n'+b.value), "")
            data.hName = "div"
            data.hProperties = {
                style: "position:relative;overflow:hidden;margin: 1.5em 0;"
            }
            let { html, classLanguage } = runHighlighterWithAstro(
                'html',
                str
            );
            node.children = [
                {
                    type: "html",
                    __handled: true,
                    value: `<div style="background: #e9e9e9;padding: 0 1em;font-size:.75em;float:left;">${attributes.title || 'demo'}</div>`,
                    children: []
                },
                    {
                        type: "leafDirective",
                        __handled: true,
                        data: {
                            hName: 'iframe',
                            hProperties: {
                                id: attributes.id ?? '',
                                class: attributes.class ?? 'demo',
                                style: 'width: 100%;border: 1px solid #e9e9e9;display: block;box-sizing: border-box;max-height: 350px;',
                                height: '300px',
                                frameborder: '0',
                                allowfullscreen: "true",
                                onload: "this.style.height = this.contentDocument.documentElement.scrollHeight+'px'",
                                srcdoc: `<!DOCTYPE html>
                                <html lang="en">
                                <head>
                                    <meta charset="UTF-8">
                                    <meta http-equiv="X-UA-Compatible" content="IE=edge">
                                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                                    <title>__title</title>
                                </head>
                                <body>
                                    __content
                                </body>
                                </html>`.replace(/[\r\n]/g, '').replace('__title',attributes.title || 'demo').replace('__content', str)
                            }
                        },
                        children: []
                    },
                    {
                        type: 'containerDirective',
                        __handled: true,
                        data: {
                          hName: 'div',
                          hProperties: {
                            style: `background: #e9e9e9;padding: 0 1em;font-size:.75em;`
                          },
                        },
                        children: [
                          {
                            type: 'containerDirective',
                            __handled: true,
                            data: {
                              hName: 'details',
                              hProperties: {},
                            },
                            children: [
                                {
                                    type: "html",
                                    __handled: true,
                                    value: `<summary style="cursor: pointer;">查看源码</summary>`
                                },
                                {
                                    type: 'containerDirective',
                                    __handled: true,
                                    data: {
                                        hName: 'div',
                                        hProperties: {
                                            style: `padding: 0 1em;font-size:.75em;overflow: hidden;`
                                        }
                                    },
                                    children: [
                                        {
                                            type: "html",
                                            __handled: true,
                                            value: `<pre class="${classLanguage}"><code is:raw class="${classLanguage}">${html}</code></pre>`
                                        }
                                    ]
                                },
                            ],
                          },
                        ],
                    },
                ]
        }
    })
    visit(tree, (node) => {
        if (node.type === 'leafDirective' && (node.name === 'iframe' || node.name === 'iframec')) {
            const data = node.data || (node.data = {});
            const attributes = node.attributes || {};
            const children = node.children || [];
            const url = attributes.url

            node.type = 'leafDirective'
            node.__handled = true
            data.hName = 'details'
            data.hProperties = { style:'margin-bottom: 1.2em;' }
            if(node.name === 'iframe'){
                data.hProperties.open = 'true'
            }
            node.children = [
                {
                    type: 'leafDirective',
                    __handled: true,
                    data: {
                      hName: 'summary',
                      hProperties: {
                        style: "background: #f3f3f3;padding: .3em .6em;cursor: pointer;user-select: none;"
                      },
                    },
                    children: [
                        {
                            type: 'leafDirective',
                            __handled: true,
                            data: {
                              hName: 'abbr',
                              hProperties: {
                                title: url
                              },
                            },
                            children: [
                                {
                                    type: 'text',
                                    value: '地址'
                                }
                            ]
                        },
                        {
                            type: 'text',
                            value: ' / '
                        },
                        ...children
                    ]
                },
                {
                    type: 'leafDirective',
                    __handled: true,
                    data: {
                      hName: 'iframe',
                      hProperties: {
                        id: attributes.id ?? '',
                        class: attributes.class ?? '',
                        style: 'width: 100%;border: 1px solid #e9e9e9;',
                        height: '300px',
                        frameborder: '0',
                        allowfullscreen: "true",
                        src: url
                      },
                    }
                },
            ]
        }
    })
    visit(tree, (node) => {
      if (
        node.type === 'textDirective' ||
        node.type === 'leafDirective' ||
        node.type === 'containerDirective'
      ) {
        if (node.__handled) return;
        const data = node.data || (node.data = {});
        const hast = h(node.name, node.attributes);
        data.hName = hast.tagName;
        data.hProperties = hast.properties;
      }
    });
  };
}
