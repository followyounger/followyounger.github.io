---
layout:     post
title:      “黑客比普通程序员高在哪里”
subtitle:   “来自我的知乎回答”
date:       2019-8-17
author:     “Soptq”
header-img: "img/post-hacker-or-programmer.jpg"
catalog:    false
d3:         false
password:   false
mathjax:    false
mermaid:    false
tags:
    - python
    - zhihu
---

假设今天老板给我们一个任务，让我们判断一下一个 IP 在不在线。我们随手用 python 写一个 ping IP 的代码：

```python
import os

host = input('请输入要检测的 IP : ')
result = os.popen('ping -c 1 -t 1 %s' % (host)).read()

if 'ttl' in result:
  print('IP 在线')
else:
  print('IP 不在线')
```


{% include extensions/lazyload.html img='/img/in-post/post-hacker-or-programmer/1.jpg' %}

现在，你作为一名审核代码的人员，不考虑代码整体结构问题，不考虑为什么写这段代码的程序员用ping，用popen，你能看出什么问题吗？

如果看不出的话，想两个问题：
1. `popen` 的本质是什么？如果你不知道或者没有用过popen，试着不要去查，猜一下这个函数的作用。
2. 在这段程序中，`popen` 要执行的命令是什么？

既然 `popen` 后面执行的语句中的 `host` 变量是由用户输入的，那恶意用户是不是可以输入一个 `localhost && whoami` 呢？这样 `popen` 执行的代码就变成了 `ping -c 1 -t 1 localhost && whoami`。注意，就算上述例子中没有将运行结果直接打印出来，但没打印出来并不代表代码没有运行。例如如果我直接输入 `host`  为 `localhost && whoami` 的话，输出结果还是 `IP 存在`, 但这并不代表 `whoami` 命令没有运行，我们依旧可以建立一个 `Reverse Shell` 。为了验证结果，我们在代码里面让 `result` 被打印出来。

{% include extensions/lazyload.html img='/img/in-post/post-hacker-or-programmer/2.jpg' %}


这一项技巧叫做 命令注入（Command Injection），普通的程序员如果不是遇到了这类问题，应该是不会接触到这项技巧的，看见上面的漏洞代码也会觉得没什么问题，最多觉得有点不顺眼，但能第一时间反应出有安全漏洞的是占少数的。

这项技巧听起来好像很简单，比逆向，提权那些简单很多，但这项技巧是富有创造性的，下限很低，上限很高。

比如我们现在知道了存在上面这个问题，那么在输入阶段把一些关键字过滤一下总可以了吧。在这个问题中，我们想让用户输入的是一个 IP ，那就直接过滤掉空格吧，正常 IP 里面总不可能有空格吧。

再把 `&`, `;`, `-`,`||`,`|` 也过滤掉吧，万无一失。

```python
import os

host = input('请输入要检测的 IP : ')

forbidden = ['&', ';', '-', ' ', '||', '|']
for i in forbidden:
        if i in host:
            print('Catch you')
            exit()

result = os.popen('ping -c 1 -t 1 %s' % (host)).read()

if 'ttl' in result:
  print('IP 在线')
else:
  print('IP 不在线')
```

真的万无一失吗？

我们在 `/tmp` 目录下新建一个 `exp.sh`, 在里面输入我们想执行的命令，在这个例子中我们输入 `whoami`。然后 `chmod +x exp.sh` 赋予执行权限，再通过 `$(./exp.sh)` 就可以绕过黑名单过滤了。

{% include extensions/lazyload.html img='/img/in-post/post-hacker-or-programmer/3.jpg' %}


这是一个非常简单的例子，但却可以说明黑客比程序员高在什么地方。我认为高在对漏洞的敏感程度和创造力上。提高漏洞的敏感程度需要花大量的时间在 CVE ，黑客论坛等地方，而提高创造力则完全只能靠天赋和运气了。

也许你会觉得对于上面这个例子，你有很多种办法可以避免。首先我承认这个例子是我临时想的，很不好，但也请注意我的这个例子非常简单且不成熟。在现实的红蓝战场上，以 SQL 注入为例，都那么多年了，能完全避免的了吗？记得今年年初暗网暴露的 Collection 数据库集合，1000g 的各种被注入的数据库，涉及全球各种论坛，甚至包括某些银行，某些人口统计局，某些政府机构。代码思路是有限的，创造力是无限的。

