---
layout:     post
title:      “instant.page 预加载脚本”
subtitle:   “1 分钟提升 1% 用户转化率”
date:       2019-9-18
author:     “Soptq”
header-img: "img/post_instant_page.jpg"
catalog:    true
cover: /img/in-post/post-instant-page/cover.jpg
tags:
    - jekyll
    - js
---

### instant.page

最近日常每日探索 `Github` 的时候发现一个 `js` 脚本叫做 [Instant.page](https://github.com/instantpage/instant.page)，号称 1 分钟提升网页 1% 的转化率。我本来就对提升网页性能这方面的东西很感兴趣，便立即用我的博客来尝试了一下这个脚本。结果确实还是有些效果的，加上部署脚本前后真的就花 1 分钟，感觉还是很值。

游览了一下[官网](https://instant.page)和[源代码](https://github.com/instantpage/instant.page/blob/master/instantpage.js)，这个脚本的原理大概是这样的：

* 对于桌面用户，在点击一个链接之前，一般会把鼠标移动到链接的上面触发 `Hover` 事件，再点击链接触发 `Click` 事件。
* 当鼠标悬浮在一个链接上超过 65 毫秒时，该脚本开始预加载这个链接。这时用户有两个选择。要么点击该链接，此时该链接已被预加载了一部分；要么鼠标移过这个链接，此时该脚本便放弃预加载该链接。
* 实验显示，若用户在悬浮到链接上面后紧接着继续点击该链接，`Hover` 与 `Click` 事件间至少平均有 300 毫秒的间隔。此时游览器相当于平白无故多有了 300 毫秒的加载时间。
* 对于移动用户，在用户点击链接后，因为系统要预留时间判定用户是点击还是长按，故一般用户手指结束点击到系统触发点击事件间有平均 80 毫秒的间隔。这段时间也会被该脚本拿来做预加载。
* instant.page 是渐进式增强，对不支持它的浏览器没有影响。

### 测试效果

{% include extensions/lazyload.html img='/img/in-post/post-instant-page/1.gif' %}

通过一段时间的体验，我发现 instant.page 还有如下的特点：

* instant.page 只预加载站内链接，所以对站外链接没有加速效果。
* instant.page 只预加载 `html` 而不预加载图片之类的引入的资源。这些引入的资源会在点击后加载，所以兼容一些工具库，比如 `fancybox`，`lazybox` 等等。
* 如果使用的是自己的服务器或者 CDN 的话，注意请求量应该会有一个增长。

### 食用方法

* 官方方法（使用 `Cloudflare CDN` 加速）

将下面的代码直接粘贴到 `<body>` 前面就可以了：

```javascript
<script src="//instant.page/2.0.0" type="module" defer integrity="sha384-D7B5eODAUd397+f4zNFAVlnDNDtO1ppV8rPnfygILQXhqu3cUndgHvlcJR2Bhig8"></script>
```

* 自托管

将[源代码](https://github.com/instantpage/instant.page/blob/master/instantpage.js)复制到本地，然后通过下面的代码在 `<body>` 前引入即可：

```javascript
<script src="@PATH@" type="module"></script>
```

* 我的方法（使用 `jsDelivr CDN` 加速）

因为我的网页主要还是国内用户访问，而 `Cloudflare` 的 `CDN` 服务时常在大陆内抽风，还是可以全球加速，在大陆也有运营许可的 `jeDelivr` 靠谱一点。所以把下面的代码贴到 `<body>` 之前就可以了：

```javascript
<script src="https://cdn.jsdelivr.net/npm/instant.page@2.0.0/instantpage.min.js" type="module" defer></script>
```
