---
layout:     post
title:      “用 Github Probot 做仓库的自动化脚本”
subtitle:   “blog-updates-observer”
date:       2019-6-14
author:     “Soptq”
header-img: "img/post-updates-observer.jpg"
catalog:    false
d3:         false
password:   false
mathjax:    false
mermaid:    false
cover:      "/img/in-post/post-updates-observer/cover.jpg"
tags:
    - Github
---

我的博客的访问量统计系统是自己写的，部署在之前买的 DO 服务器上。如果更新了新文章后，统计系统会有一个 API 可以向数据库插入并初始化新文章的数据。为了不让任何人都可以随意向我的数据库中插入数据，这个 API 设计成需要一个密码才能通过。考虑到网页的源代码是可见的，这让我不可能在网页源代码中直接自动化的在有新文章时去调用这个 API，所以一直以来我都是更新了文章后去手动调用这个 API。虽然比敲数据库代码效率高得多，但久而久之还是有点烦。

解决思路很好想，只要 Github 检测到我的更新后调用我的钩子就可以了。幸运的是，Github APP 就是专门做这种事情的程序，而且最近 Github 发布了 [`Probot`](https://probot.github.io) 来大幅简化了 Github APP 的开发过程，使得每个人都可以很快的做出自己想要的功能。

看了下 Gtihub 的官方教程，不是很难。但是明天就考六级了，我还没有复习；下周就是高数概统大物三连测，我甚至还没有开始预习。于是我 `clone` 了 Gtihub 提供的 [`Probot`](https://probot.github.io) 框架，看这教程和 Github API [文档](https://developer.github.com/webhooks/#events)写了 1 个多小时写完了。

Github [链接](https://github.com/Soptq/blog-updates-observer-app)，欢迎 ✨
