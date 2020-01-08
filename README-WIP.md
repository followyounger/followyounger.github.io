# Soptlog

[![license](https://img.shields.io/github/license/Soptq/Soptq.github.io.svg)](LICENSE)
[![standard-readme compliant](https://img.shields.io/badge/readme%20style-standard-brightgreen.svg?style=flat-square)](https://github.com/RichardLitt/standard-readme)

![banner](https://soptq.me/portfolio/images/2018.02.04-prot.jpg)



Soptlog is a static website that powered by jekyll and hosted by Github Pages. Soptlog is derived but different from [Huxpro](https://github.com/Huxpro/huxpro.github.io). A lot of features and new technologies are applied to Soptlog which make it maybe the best jekyll personal website in the world.

## Table of Contents

- [Live Preview](#live-preview)
- [Install](#install)
- [Usage](#usage)
    - [Get Started](#get-started)
    - [Start to customize](#start-to-customize)
    - [Make necessary images](#make-necessary-images)
    - [Writing Posts](#writing-posts)
    - [Add aplayer support for post](#add-aplayer-support-for-post)
    - [Add password protection for post](#add-password-protection-for-post)
    - [Featured Tags](#featured-tags)
    - [Friends](#friends)
    - [Keynote Layout](#keynote-layout)
    - [Customize About page](#customize-about-page)
    - [Customize Portfolio page](#customize-portfolio-page)
    - [Comment](#comment)
    - [Analytics](#analytics)
    - [Header Image](#header-images)
    - [Setting Backend (Optional)](#setting-backend)
- [Update](#update)
- [Contributing](#contributing)
- [License](#license)


## Live Preview

[Soptlog](https://soptq.me)

## Install

Just cloning the entire repository

```shell
cd my-blog
git clone https://github.com/Soptq/Soptq.github.io.git
```

## Usage

### Get Started

As it is not a boilerplate but a website i'm currently using, you need to clean up my data first by: 

1. Deleting everything under `_data/` folder, `_posts/` folder and `demo/` folder.
2. Deleting everything under `img/` folder except `cms.jpg`, `icon_wechat.png`.
3. Deleting everything under `portfolio/images/` folder which contains `prot` in its file name
3. Delete `data/gpg-public-key.txt` file

After deleting you might find `jekyll s` command reporting error. Don't worry, we will guide you through.

### Start to customize

You can easily customize the blog by modifying `_config.yml`

```yaml
# Site Setting
title: Soptlog  # title of your website
SEOTitle: Soptlog | Soptq’s Blog  # SEOTitle of your website, check out docs for more infomation
email: contact@soptq.me # your email
description: "..." # description of your website
keyword: “keyword1, keyword2” # your site's keyword, for search engine to optimize
url: "https://soptq.me"              # your host, for absolute URL
baseurl: ""         # for example, '/blog' if your blog hosted on 'host/blog'

...
```

For more options, please check out [Jekyll - Official Site](http://jekyllrb.com/). Most of them are very descriptive so feel brave to dive into code directly as well.


### Make necessary images

1. Your avatar in `img/avatar.jpg`
2. Your avatar in `portfolio/images/avatar.jpg` and `portfolio/images/avatar-round.jpg`
3. (Optional) Your PWA icon in `img/icon/`
4. (Optional) Your launch image  in `img/splash`


### Writing Posts

Posts are simply Markdown files in the `_posts/`

Metadata of posts are written in **front-matter**, A example post could start with:

```yaml

---
layout:     post
title:      "Hello Everyone"
subtitle:   "Hello World, Hello Blog"
date:       2019-08-31 12:00:00
author:     "Soptq"
header-img: "img/post-bg-2015.jpg"
tags:
    - Life
---

```

Below is the preset front-matter you can use directly:

| front-matter | value | usage | required |
| ------------- | ------------- | ------------- | ------------- |
| layout | string | set a layout of this post, recommended keep this untouched| Yes |
| title | string | set a title of this post | Yes |
| subtitle | string | set a subtitle of this post | No |
| date | string | set a public date of this post | Yes |
| author | string | set a author of this post| Yes |
| header-img | string | set a header image of this post | No |
| header-style | string | set to "text" to enable text style header | No |
| header-img-credit | string | state header image credit | No |
| header-img-credit-href | string | state header image url | No |
| catalog | bool | set if you want to enable toc of this post | No |
| cover | string | set a preview image to display in index | No |
| tags| string | set tags for this page | Yes |
| reproduce | bool | if this post is reproduced, set this option to true to display a reproduce notification | No |
| reproduce_auther | string | state the reproduce_auther | No |
| reproduce_link | string | state the reproduce link | No |
| aplayer | bool | set to true to enable aplayer support | No |
| d3 | bool | set to true to enable d3 support| NO |
| mathjax | bool | set to true to enable mathjax support| NO |
| password | bool | set to true to enable password protection for this post| No |
| multilingual  | bool | set to true to enable language selection | No |


### Add `aplayer` support for post

1. converse your music format to m3u8, and save them to a directory.
2. Add `aplayer: true` to the front-matter of your markdown post.
3. Create a new YAML file in `_data/aplayer/`, for example `example.yaml`.

```yaml
- name: 母の手
  artist: 出羽良彰
  url: https://server.soptq.me/blog/music/hls/post_girls_who_falls/1.m3u8
  cover: https://server.soptq.me/blog/music/hls/post_girls_who_falls/1.jpg
  theme: 3C4548
```

4. Create a new Json file in `data/aplayer/`, for example `example.json`.

```json
---
layout: none
---
[{% for music in site.data.aplayer.example %}
{
"name": "{{ music.name }}",
"artist": "{{ music.artist }}",
"url" : "{{ music.url }}",
"cover": "{{ music.cover }}",
"theme": "#{{ music.theme }}",
"type": "hls"
}{% if forloop.last == false %},{% endif %}
{% endfor %}]
```

5. Add `<div id="aplayer" data-name="example.json" data-lrc-type="0"></div>` to your markdown post file.

How does it worked?

When jekyll generate the site, it will read YAML file in `_data/aplayer/` and converse it into a json file by the templete in `data/aplayer/`, then when `aplayer` initialize itselt, it will read the file in `data-name` attribute to get proper arguments.


### Add password protection for post

1. Prerender your markdown to html.
2. Encrypt your html by using built-in online tool in CMS. (will write a docs later)
3. Add `password: true` to the front-matter of your markdown post.
4. Copy your original post content to another file, then replace them with your encrypted content.


How does it worked & live preview ?

[添加密码保护](https://soptq.me/2019/01/18/add-pswd/), Password for this post is `testpassword`


### Featured Tags

Featured-Tags is similar to any cool tag features in website like Medium.

Featured Tags information is configured as a JSON string in _config.yml

```yaml
# Featured Tags
featured-tags: true  
featured-condition-size: 1     # A tag will be featured if the size of it is more than this condition value
```

The only thing need to be paid attention to is `featured-condition-size`, which indicate a criteria that tags need to have to be able to "featured". Internally, a condition `{% if tag[1].size > {{site.featured-condition-size}} %}` are made.


### Friends

Friends is a common feature of any blog. It helps with SEO if you have a bi-directional hyperlinks with your friends sites. This module can live when sidebar is off as well.

Friends information is configured as a JSON string in _config.yml

```yaml
# Friends
friends: [
    {
        title: "Foo Blog",
        href: "http://foo.github.io/"
    },
    {
        title: "Bar Blog",
        href: "http://bar.github.io"
    }
]
```

### Keynote Layout

There is a increased trend to use Open Web technology for keynotes and presentations via Reveal.js, Impress.js, Slides, Prezi etc. I consider a modern blog should have first-class support to embed these HTML based presentation so Keynote layout are made.

To use, in the front-matter:

```yaml
---
layout:     keynote
iframe:     "http://huangxuan.me/js-module-7day/"
---
```

The `iframe` element will be automatically resized to adapt different form factors and device orientation. Because most of the keynote framework prevent the browser default scroll behavior. A bottom-padding is set to help user and imply user that more content could be presented below.


### Customize `About` page

Edit `about.html` file.

### Customize `Portfolio` page

Edit `portfolio/index.html`


### Comment

Currently, Disqus is supported as third party discussion system.

Comment information is configured as a JSON string in _config.yml

```yaml
disqus_username: _your_disqus_short_name_
```

### Analytics

Google Analytics and Baidu Tongji are supported with a simple config away:

```yaml
# Baidu Analytics
ba_track_id: 4cc1f2d8f3067386cc5cdb626a202900

# Google Analytics
ga_track_id: 'UA-xxxxxxxx-1'            # Format: UA-xxxxxx-xx
ga_domain: your_domain
```

Just checkout the code offered by Google/Baidu, and copy paste here, all the rest is already done for you.

(Google might ask for meta tag `google-site-verification`)


### Header Image

Change header images of any pages or any posts is pretty easy as mentioned above. Just add a `header-img: your-header-path` to any pages or posts' front-matter. Default header image is a `Css Gradient Effect`


### Setting Backend (Optional)

Yes, this blog use backend to support visitor counting, comment recoding. However, all service can be replaced to something that needn't a backend.

#### Visitor counting

I use a visitor counting system i wrote, you can replace it with busuanzi.js

#### comment recoding

I use (disqus-php-api)[https://github.com/fooleap/disqus-php-api] as my commenting system which need a backend to reverse proxy disqus api.

You can replace it just with official disqus.



## Contributing

Contribution is welcome, feel free to open an issue and fork. Waiting for your pull request.


## License

[Apache License 2.0.](LICENSE) Copyright (c) 2018-2019 Soptlog
