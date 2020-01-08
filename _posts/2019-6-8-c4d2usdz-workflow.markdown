---
layout:     post
title:      “使用 C4d 生成 USDZ 模型的正确工作流程”
subtitle:   “使用了 UNFOLD3D 以及 Substance Painter”
date:       2019-6-8
author:     “Soptq”
header-img: "img/post-c4d2usdz-workflow.jpg"
catalog:    true
d3:         false
password:   false
mathjax:    false
mermaid:    false
cover:      "/img/in-post/post-c4d2usdz-workflow/cover.jpg"
tags:
    - swift
---

### 引

上周 WWDC 2019 开完后，我便发现苹果的美国官方网站 Mac Pro 2019 的介绍中新增了 AR 演示。虽然这个演示只支持 iOS 用户，但是其令人震撼的实时渲染效果让我又一次被苹果圈粉。仔细查了一下，虽然 AR 整个行业目前都非常 “低调”， 但是 2018 年的时候苹果就已经联合皮克斯发布了新一代 AR 创作格式 USDZ 并在 iOS 12 中深度集成了 Quick Look 功能以支持基于 PBR 的 AR 体验。为了方便开发者人员转换模型到 USDZ 格式，苹果也在 Xcode 10 中集成了名为 `usdz_converter` 的 API。使用这个 API 并传入一个模型以及可选的 6 个 PBR 贴图（这个后面要讲），就可以生成一个 USDZ 模型。

{% include extensions/appleAR.html usdz='https://server.soptq.me/blog/usdz/macpro.usdz' img='/img/in-post/post-c4d2usdz-workflow/1.jpg' %}


作为折腾小能手的我，自然想自己做一个模型试试。得益于高中的时候闲的无聊学了一段时间的 C4D，建个模型还是不是问题的。可是在导出 PBR 贴图的过程中遇到了非常多的问题。因为我 C4D 学艺不精，不知道怎么导出烘培后的贴图，四处谷歌发现好像 Blender 可以导出贴图，又去学了一段时间的 Blender，发现学习成本太高了，于是又把目标转回了 C4D。捣鼓了半天，现在终于搞清楚了完整的工作流程。

整个流程分为 4 个步骤：
1. C4D 建模，导出 obj
2. UNFOLD3D 展开模型，导出展开了的 obj
3. Substance Painter 制作贴图，导出贴图
4. `usdz_converter` 合成模型

值得注意的是，前三个流程涉及到三款软件，我一个一个都细讲是不可能的。所以我只是讲一个大概。三个软件都非常有名，Youtube 上面教程一大把。

### C4D 建模，导出 obj

这个阶段真没什么好说的，要说的话可以说一年。为了方便演示，我就建了一个球的模型。导出 obj ，不用导出材质

{% include extensions/lazyload.html img='/img/in-post/post-c4d2usdz-workflow/2.jpg' %}

### UNFOLD3D 展开 UV

这一步其实是可以在 C4d 里面完成的，我使用 UNFOLD3D 完全是因为习惯。所以这一步只要你知道怎么把 UV 弄好，跳过也没事了。

打开 UNFOLD3D，加载 obj 模型。先用鼠标选一条线，然后工具栏点 Cut 将模型沿着这条线剪开，然后点击工具栏 Unfold 展开模型。UV 中如果有区域显示为红色说明这个区域无法完全展开，最好在这个区域再加一条线。这里我就选择球的腰线展开成两个圆，然后另存为一个 obj ，UNFOLD3D 将自动把 UV 信息插入到这个 obj 模型里面。

{% include extensions/lazyload.html img='/img/in-post/post-c4d2usdz-workflow/3.jpg' %}

### Substance Painter 制作贴图

打开 Substance Painter，新建项目，选择有 UV 信息的 obj 模型，选择 PBR 渲染方式，创建项目。然后在右边添加图层制作想要的材质效果。做好后导出贴图，导出后应该会有 6 个贴图：
1. Base Color 基础颜色
2. Metallic 金属度贴图
3. Normal 法线贴图
4. Roughness 粗糙度贴图
5. Height 置换贴图
6. Glossy 光泽贴图

{% include extensions/lazyload.html img='/img/in-post/post-c4d2usdz-workflow/4.jpg' %}

{% include extensions/lazyload.html img='/img/in-post/post-c4d2usdz-workflow/5.jpg' %}

到目前为止，贴图就制作完成了

### `usdz_converter` 合成模型

首先既然这个工具是集成在 Xcode 10 里面的，意味着什么我不用说了吧。{% include extensions/spoiler.html content='以下操作需要一台 Mac 。' %}

然后如果之前没有开启 Xcode 的 CLI 的话，需要去 Xcode -> Preferences -> Locations -> Command Line Tools 中选择一个 CLI。

然后打开一个终端，输入以下命令：

```bash
xcrun usdz_converter input.obj output.usdz \
-color_map PATH_TO_COLOR_MAP \
-normal_map PATH_TO_NORMAL_MAP \
-metallic_map PATH_TO_METALLIC_MAP \
-roughness_map PATH_TO_ROUGHNESS_MAP \
-ao_map PATH_TO_AO_MAP \
-emissive_map PATH_TO_EMISSIVE_MAP
```


1. `input.obj`: 输入的存在 UV 信息的 obj
2. `output.obj`: 输出的 USDZ 模型
3. 下面的 6 行就是各种贴图，不是必选。

然后经过一段时间的转换，一个漂亮的可以被 iOS 预览的 USDZ 模型就做好了。

{% include extensions/appleAR.html usdz='https://server.soptq.me/blog/usdz/ball.usdz' img='/img/in-post/post-c4d2usdz-workflow/6.jpg' %}


可以看到，苹果的 AR 不仅渲染效果优秀，而且 AR 物体似乎已经可以跟环境进行交互了。上图中球的右边是可以反射得到我红色的移动硬盘的，这也是最惊艳我的一点。观察了一下，这种效果的实现应该是裁剪了一部分像素作为环境输入，但还是相当强了。

