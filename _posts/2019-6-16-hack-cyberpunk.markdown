---
layout:     post
title:      “「黑入」赛博朋克 2077 的服务器”
subtitle:   “垃圾波兰蠢驴，这么良心让别的游戏商家怎么活”
date:       2019-6-16
author:     “Soptq”
header-img: "img/post-hack-cyberpunk.jpg"
catalog:    true
d3:         false
password:   false
mathjax:    false
mermaid:    true
cover:      "/img/in-post/post-hack-cyberpunk/cover.jpg"
tags:
    - games
---

### 引

{% include extensions/lazyload.html img='/img/in-post/post-hack-cyberpunk/1.jpg' %}

要说上周 E3 大会哪个游戏最出彩，我肯定说是赛博朋克：2077。从高一等这个游戏到大一的我现在只想和基努一起“烧光整个城市”。CD Projekt Red 官方上周除了公布了时长 4 分钟的宣传视频以外，还公布了游戏基础版以及豪华版的开箱视频。很多人的都被开箱内容吸引了，却忽视了视频开头的一个破解服务器 ssh 登陆密码的“特效”，暴露给我们的信息有服务器域名，端口，用户名以及密码。6 月 12 日有人证实这个服务器的确是可以通过上述暴露的信息登陆的（果然波兰蠢驴的细节从来不会让我失望）。既然官方都邀请我们进去瞧瞧了，那我们就去瞧瞧吧。

{% include extensions/lazyload.html img='/img/in-post/post-hack-cyberpunk/2.jpg' %}

{% include extensions/lazyload.html img='/img/in-post/post-hack-cyberpunk/3.jpg' %}

### 登陆服务器并下载资源

通过分析视频我们可以得到这样的信息：

```
Host: internal-cdprojektred.com
Port: 2020
Username: samurai
Password: WhenItsReady
```

通过代码直接进入服务器

```bash
ssh -p 2020 samurai@internal-cdprojektred.com
```

{% include extensions/lazyload.html img='/img/in-post/post-hack-cyberpunk/4.jpg' %}

嗯，果然是 `rbash` ，要不然官方相当于送了玩家一台服务器了，而且还有可能自家其他相连服务器也被渗透了。那我们试试这个 `rbash` 可以使用哪些命令吧。

{% include extensions/lazyload.html img='/img/in-post/post-hack-cyberpunk/5.jpg' %}

嗯，应该是只能用 `ls` ,  `pwd` 和  `echo` 了，通过 `ls` 看得出这个用户根目录下还存着东西的。那还说什么呢？先下载下来吧。

```bash
scp -P 2020 -r samurai@internal-cdprojektred.com:~/ ~/Desktop
```

不知道是不是服务器做了限速，整个过程平均速度只有 30k 左右，所有东西下了半个多小时才下完。我把这些数据上传了我自己的服务器，不想花时间的可以从这里下载。

{% include extensions/download.html downurl='https://server.soptq.me/down/samurai.zip' title='samurai.zip' content='Files that downloaded from CPR\'s server' %}

### 搞事情

#### `Nmap`

搞不搞事情，服务器就在那里。不管怎么说，先扫描一下吧。

```bash
sudo nmap -sS internal-cdprojektred.com
```

{% include extensions/lazyload.html img='/img/in-post/post-hack-cyberpunk/6.jpg' %}

什么？ `nmap` 提示我服务器下线了？不可能啊，才 `scp` 了的。肯定是拦截了 `nmap` 的 `ping` 扫描。那我们给扫描指令加一个 `PN` 参数

```bash
sudo nmap -sS -PN internal-cdprojektred.com
```

{% include extensions/lazyload.html img='/img/in-post/post-hack-cyberpunk/7.jpg' %}

可以看得到除了 `ssh` 的 `2020` 端口其他都被防火墙屏蔽完了。系统扫描的话应该是 `Debian`。

#### `ls`

其实我也不是想把这个服务器给拿下，我就是想看一下服务器的整体目录有没有什么隐藏的未公开的关于赛博朋克：2077的消息。我们知道 `ls -l` 是查看当前目录的整体信息，`ls <dir> -l` 可以查看 `dir` 目录的信息，那么我们把 `<dir>` 换成根目录，然后 `tab` 路径联想，是不是就可以变相地浏览目录了呢？

{% include extensions/lazyload.html img='/img/in-post/post-hack-cyberpunk/8.jpg' %}

果然吧！但是这个 `.dockerenv` 是个什么东西啊，我没怎么玩过 `docker` 不知道是不是 `docker` 生成的虚拟机在根目录就会产出一个 `.dockerenv` 文件。反正其他目录我们是比较熟悉了，就是标准的 `Linux` 目录。于是花了点时间把这个服务器所有的目录都做成了一张图，剔除了空文件夹以及没有用的文件夹（比如 `/dev` , `/lib` ）

<div class="mermaid">
    graph TD
        A[/] --> B[.dockerenv]
        A --> H[usr/]
        A --> I[bin/]
        A --> Q[home/]
        I --> AA[dir]
        I --> AB[ls]
        I --> AC[rbash]
        I --> AD[sh]
        I --> AE[true]
       Q --> Z[samurai]
    subgraph OUR HOME DIR
       Z --> BA[GOG]
       Z --> BB[GWENT]
       Z --> BC[Cyberpunk_2077]
    end
       H --> CA[bin/]
       H --> CF[sbin/]
       CA --> DA[id]
       CA --> DB[scp]
       CA --> DC[test]
       CF --> EA[nologin]
       CF --> EB[sshd]
</div>

可以看到官方其实还是给了我们一些其他的命令，比如 `dir` , `true`（疑惑？这是个什么命令）。不要被 `sh` 命令给骗了，运行不了的。 `id` 命令可以运行，结果如下：

```bash
samurai@internal-cdprojektred:~$ id
uid=10000(samurai) gid=10000(netrunner) groups=10000(netrunner)
```

`test` 命令也是一个谜一样的存在，不知道有什么用。 `/usr/sbin/` 里面的两个命令也是运行不了的，因为这个 `rbash` 限制了 `/` 不能出现在命令中。

#### 能不能上传我自己的命令呢？

就试试上传 `cat` 命令吧。

{% include extensions/lazyload.html img='/img/in-post/post-hack-cyberpunk/9.jpg' %}

不出意料哈，不可能让你上🚢的。

### 最后

不管怎么说啊， CD Projekt Red 真的是世纪良心公司，考虑到游戏明年 4 月份才发布，怕玩家等不及，就给了玩家一个服务器来玩玩。虽然官方把大门的钥匙都给你了，但还是有当黑客的感觉啊，仿佛提前进入了赛博朋克世界。对于这种公司，我只想说：我买爆！

{% include extensions/lazyload.html img='/img/in-post/post-hack-cyberpunk/10.jpg' %}
