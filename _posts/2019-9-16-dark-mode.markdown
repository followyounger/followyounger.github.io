---
layout:     post
title:      “全新夜间模式切换引擎”
subtitle:   “响应系统主题切换”
date:       2019-9-16
author:     “Soptq”
header-img: "img/post_dark_mode.jpg"
catalog:    false
cover: /img/in-post/post-dark-mode/cover.jpg
tags:
    - jekyll
    - js
---

我认为夜间模式是当今每一个现代网页不可缺少的功能之一，所以很早之前我就为 `Soptlog` 引入了夜间模式的切换功能。当时的夜间模式切换引擎的工作原理大概是动态切换网页 `<head>` 中的主题配色 `css` ，这样的工作方式一开始看起来好像并没有什么问题，但是随着使用次数的增多，问题就逐渐暴露出来了：

1. `Soptlog` 是拥有离线模式的，可以缓存联网状态下加载过的资源。但是若在联网状态下没有切换过夜间模式，想在离线模式时切换就 GG 了，因为那时夜间模式的 `css` 还没有缓存过。

2. 我想把 `Soptlog` 打造地接近原生 `app` 。随着系统级的夜间模式逐渐普及，很多原生 `app` 的主题都支持随着系统主题的切换而切换。显然，我以前的引擎无法做到这样的功能。

3. 以前的主题引擎专为 `Soptlog` 中引入了主要 `css` 文件的页面设计，若某些页面有自己独立的 `css` 文件，则需要对主题引擎做修改，拓展性很低。

{% include extensions/lazyload.html img='/img/in-post/post-dark-mode/1.gif' %}

三点暴露的问题中，我最不能忍受的是第二点。因为我在应用与系统的配合度上是一名重度强迫症患者。所以趁着中秋节有点空闲，把博客的夜间模式切换引擎做了个更新。

解决第一个问题的方法很简单，就是把白天模式和夜间模式的 `css` 文件都通过 `<head>` 引入，而不是用到哪个才下载哪个。我一开始很担心这样会延长网页载入时间，然而后来发现其实对载入时间的影响微乎其微，几乎可以忽略。

在解决第二个问题之前，我们先要了解一下网页是如何知道系统的主题发生了改变。在支持主题切换的操作系统中，会有一个 `flag` 叫做 `prefers-color-scheme`。若我们在引入白天模式的 `css` 时加上限制条件 `media="prefers-color-scheme: light"` ，意思就是当系统主题切换为 `light` 时，网页调用这个文件里的配色。同理我们引入夜间模式的 `css` 时加上 `media="prefers-color-scheme:dark"` 就是让系统在黑暗模式时调用这个配色。而 `prefers-color-scheme: no-preference` 就是让系统在没有系统级主题的情况下调用这个配色，即默认配色。

所以要让网页主题支持随着系统主题的切换而切换，就只需要在 `<head>` 中加上：

```html
<link id="daily-theme" rel="stylesheet" href="{{ "/css/daily-mode.min.css" | prepend: site.baseurl }}" media="(prefers-color-scheme: light), (prefers-color-scheme: no-preference)">

<link id="dark-theme" rel="stylesheet" href="{{ "/css/dark-mode.min.css" | prepend: site.baseurl }}" media="(prefers-color-scheme: dark)">
```

那我们还想给用户一个开关，让他可以在系统设置暗黑模式的情况下手动把网页调整为白天模式。这个功能目前网上还没有相关教程，但 Github 上 GoogleChromeLab 做了个拓展控件叫做 [dark-mode-toggle](https://github.com/GoogleChromeLabs/dark-mode-toggle)，实现了相关功能。但是这个控件实在是太难看了，又没有提供不用控件直接 `js` 修改主题的 `API`，所以只能阅读控件的[源码](https://github.com/GoogleChromeLabs/dark-mode-toggle/blob/master/src/dark-mode-toggle.mjs)来自己造了。

{% include extensions/lazyload.html img='/img/in-post/post-dark-mode/3.jpg' %}

大概原理是这样的：

首先判断当前系统支不支持 `prefers-color-scheme`：

```javascript
const hasNativePrefersColorScheme =
    window.matchMedia('(prefers-color-scheme)').media !== 'not all';
```

若 `hasNativePrefersColorScheme` 为真就支持。

然后如何在一开始进入网页时判断当前的系统主题：

```javascript
if ((window.matchMedia('(prefers-color-scheme: light)').matches) ||
    (window.matchMedia('(prefers-color-scheme: no-preference)').matches)) {
    // 当前系统主题为白天模式
} else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    // 当前系统主题为夜间模式
}
```

接着如何监听系统主题切换事件：

```javascript
window.matchMedia('(prefers-color-scheme: dark)').addListener(({matches}) => {
    dispatchEvent(new CustomEvent("colorschemechange", {
        detail: {colorScheme: (matches ? "dark" : "daily")}
    }));
});
```

发生系统主题切换后这个 `listener` 会发射一个 `colorschemechange` 事件，我们就可以用 `eventlistener` 来监听了：

```javascript
window.addEventListener('colorschemechange', (e) => {
    // e.detail.colorScheme 就是切换后的系统主题 "dark" 或者 "daily"
});
```

然后切换主题的主要操作是这样的，假设我们现在的状态是这样的：

```html
<link id="daily-theme" rel="stylesheet" href="{{ "/css/daily-mode.min.css" | prepend: site.baseurl }}" media="(prefers-color-scheme: light), (prefers-color-scheme: no-preference)" data-original-media="(prefers-color-scheme: no-preference), (prefers-color-scheme: light)">

<link id="dark-theme" rel="stylesheet" href="{{ "/css/dark-mode.min.css" | prepend: site.baseurl }}" media="(prefers-color-scheme: dark)" data-original-media="(prefers-color-scheme: dark)">
```

因为我们之后要修改 `media` 值，所以 `data-original-media` 是对 `media` 做一个备份。我们现在是白天模式，我们要切换为夜间模式的 `js` 操作如下：

1. 将 `#daily-theme` 加上一个 `disabled` 属性

```javascript
document.querySelect("#daily-theme").setAttribute("disabled", "");
```

2. 将 `#daily-theme`的 `media` 属性修改为 `data-original-media` 的值，即还原 `media` 值。

```javascript
document.querySelect("#daily-theme").setAttribute("media", document.querySelect("#daily-theme").getAttribute("data-original-media"));
``` 

3. 将 `#dark-theme` 的 `disabled` 属性去掉，如果有的话：

```javascript
if (document.querySelect("#dark-theme").hasAttribute('disabled')) {
    document.querySelect("#dark-theme").removeAttribute('disabled');
}
```

4. 将 `#dark-theme` 的 `media` 属性修改为 `all`：

```javascript
document.querySelect("#dark-theme").setAttribute('media', 'all');
```

夜间模式修改为白天模式也是同理，反过来就可以了。这样的话既可以 `js` 切换主题，也可以系统级切换主题，我的强迫症也不难受了。

{% include extensions/lazyload.html img='/img/in-post/post-dark-mode/2.gif' %}

整个切换系统的核心代码是这样的：

```javascript
const hasNativePrefersColorScheme =
        window.matchMedia('(prefers-color-scheme)').media !== 'not all';
let theme_value = localStorage.getItem('theme'),
    daily_theme_list = [], dark_theme_list = [];
daily_theme_list.push(document.getElementById('daily-theme'));
dark_theme_list.push(document.getElementById('dark-theme'));
let loadMode = function(mode) {
    if (mode !== "daily" && mode !== "dark") return;
    daily_theme_list.forEach((obj) => {
        if (mode === "daily") {
            if (obj.hasAttribute('disabled')) {
                obj.removeAttribute('disabled');
            }
            obj.setAttribute('media', 'all');
        } else {
            obj.setAttribute('disabled', '');
            obj.setAttribute('media', obj.getAttribute('data-original-media'));
        }
    });
    dark_theme_list.forEach((obj) => {
        if (mode === "daily") {
            obj.setAttribute('disabled', '');
            obj.setAttribute('media', obj.getAttribute('data-original-media'));
        } else {
            if (obj.hasAttribute('disabled')) {
                obj.removeAttribute('disabled');
            }
            obj.setAttribute('media', 'all');
        }
    });
    localStorage.setItem('theme', mode);
    theme_value = mode;
};
```

可以看到 `loadMode` 方法是对 `daily_theme_list` 和 `dark_theme_list` 里的所有对象作处理，所以如果我们有独立的配色文件的话，只需要分别把白天模式配色对象和夜间模式配色对象 `push` 到数据里就可以了，第三个缺点也被解决了。

剩下的就是一些杂七杂八的处理逻辑了，比如监听事件，比如不支持系统级主题时的逻辑处理。具体可以去看[源代码](https://github.com/Soptq/Soptq.github.io/blob/master/_layouts/default.html)。
