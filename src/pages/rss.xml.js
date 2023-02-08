import rss from '@astrojs/rss';
import { SITE_TITLE, SITE_DESCRIPTION, SITE_LANG } from '@blog/config';
import { sortPublishedList } from '@blog/utils';

let posts = await sortPublishedList();

/**
 * 10篇最新的文章
 */
export const get = () => {
  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    stylesheet: true,
    customData: `<language>${SITE_LANG || 'en-us'}</language>`,
    site: import.meta.env.SITE,
    items: posts.filter(v=>((v.rss === undefined || v.rss) && (v.mode !== "collect") && !v.isDraft)).slice(0, 10).map((post) => ({
      link: post.url,
      title: post.title,
      pubDate: post.pubDate || "", // 需保证pubDate不是undefined，否则可能会报错还不知道哪错了
      description: post.description,
    })),
  });
};
