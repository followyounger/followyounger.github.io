---
layout:     post
title:      “关于全局搜索功能”
subtitle:   “如何在静态博客中实现如左上角一样的全局搜索功能”
date:       2019-4-3
author:     “Soptq”
header-img: "img/post-implement-search.jpg"
catalog:    true
d3:         false
password:   false
mathjax:    false
tags:
    - liquid
    - js
    - jekyll
---

### Jekyll Feature

`Jekyll` 是我认为的目前最强大的静态网站生成器之一，但很多功能 `Jekyll` 的官方好像都在文档里写得很不明显。例如很多 Jekyll 博客开发者都不知道的是，如果你的目录下存在一个 `*.json` 文件，且 `*.json` 文件的内容可以被  `Jekyll` 给解读的话（ 即内容是 `liquid` 代码 ），那么`Jekyll` 在生成静态博客的时候，会按照你的代码来帮你生成一个 `*.json`  文件。例如我如果有一个`*.json` 文件是这样的：

{% raw %}
```json

---
layout: none
---
[{% for i in (1..3) %}
{
"id": "{{ i }}"
}
{% endfor %}]
```
{% endraw %}

那么在 `Jekyll serve` 生成后，这个 `*.json` 文件会变成这样：

```json
[
	{
		"id": "1"
	}
	{
		"id": "2"
	}
	{
		"id": "3"
	}
]
```

这一点，也是使用 `Jekyll` 来做搜索功能最重要的一个点。

### 建立索引

有了上面的功能，关于如何实现全局搜索功能的思路就很简单了。因为是静态博客，我们只能用 `js` 来执行搜索，那么 `js` 搜索的目标，肯定是一个包含所有关键信息的文件。我们在根代码目录下创建一个 `search.json`：

{% raw %}
```json

---
layout: null
---
[
  {% for post in site.posts %}
    {
      "title"    : "{{ post.title | escape }}",
      "title-lower"    : "{{ post.title | escape | downcase}}",
      "sub-titile" : "{{ post.subtitle | escape }}",
      "sub-titile-lower" : "{{ post.subtitle | escape | downcase}}",
      "categories" : "{{ post.categories }}",
      "tags"     : "{{ post.tags | join: ', ' }}",
      "url"      : "{{ site.baseurl }}{{ post.url }}",
      "date"     : "{{ post.date }}",
      "content": {{ post.content | jsonify }},
      "desc"     : "{{ post.content | strip_html | strip_newlines | remove_chars | escape | truncate:200 }}"
} {% unless forloop.last %},{% endunless %}
  {% endfor %}
]
```
{% endraw %}

然后 `jekyll serve` ，这个文件就变成了（节选）：

```json
[
{
      "title"    : "“Introducing D3.js”",
      "title-lower"    : "“introducing d3.js”",
      "sub-titile" : "“Welcome to finally be in my blog”",
      "sub-titile-lower" : "“welcome to finally be in my blog”",
      "categories" : "",
      "tags"     : "Blog",
      "url"      : "/2019/01/08/import-d3js/",
      "date"     : "2019-01-08 00:00:00 +0800",
      "content": "<h3 id=\"引入\">引入</h3>\n\n<p>写上一篇博文的时候提到过 <a href=\"http://setosa.io/ev/image-kernels/\">setosa.io</a> 这个网站，里面用图表表示了很多高深的原理。我其实对此很感兴趣，但却没有深究。后来有人给我推荐了 <a href=\"https://github.com/d3/d3\">d3.js</a> 这个插件，我仿佛发现了新大陆。原来网页的表格也可以这么好看。于是赶忙花了点时间为我的博客引入这个插件，然后就顺便水篇博文吧。</p>\n\n<p>本来表格的数据需要写在代码中，但国外有个<a href=\"http://d3.js.yaml.jekyll.apievangelist.com/bar-chart/\">大佬</a>表示可以把表格数据写在 jekyll 的 _data 文件夹下来使代码更加优雅。我也是按照他的方法来做的。</p>\n\n<p>现在唯一的不足就是因为每一个表格的风格是不一样的，也就是说我必须为每一个表格单独写 CSS 和 JS，而且为了偷懒我是准备直接写在 post 文件下的，所以感觉现在博文有点混乱。其实可以考虑怎么统一一个风格。</p>\n\n<h3 id=\"demo\">Demo</h3>\n\n<h4 id=\"表格\">表格</h4>\n\n<div id=\"bar-chart\"></div>\n<script src=\"/js/Posts/d3demo.js\"></script>\n\n",
      "desc"     : "引入写上一篇博文的时候提到过 setosa.io 这个网站，里面用图表表示了很多高深的原理。我其实对此很感兴趣，但却没有深究。后来有人给我推荐了 d3.js 这个插件，我仿佛发现了新大陆。原来网页的表格也可以这么好看。于是赶忙花了点时间为我的博客引入这个插件，然后就顺便水篇博文吧。本来表格的数据需要写在代码中，但国外有个大佬表示可以把表格数据写在 jekyll 的 _data 文件夹下来使代..."
} 
]
```

这样的 `json` 文件。

### 使用 `js` 来对 `json` 进行检索

思路很简单，就是对 `json` 做解析。幸运的事，已经有开发者能帮我们把这样的功能做了出来，并且还打好了包：[simple-jekyll-search](https://github.com/christian-fei/Simple-Jekyll-Search)。

我们只需要把它引入工程，然后调用接口就可以得到结果了：

```javascript
SimpleJekyllSearch({
    searchInput: document.getElementById('search-input'),
    resultsContainer: document.getElementById('results-container'),
    json: '/search.json',
    searchResultTemplate: '<li><a href="{url}" style="display:block;width: 100%;padding-left:10px; padding-right:10px;"><i class="fa fa-angle-double-right fa-border" aria-hidden="true"></i>    {title}</a></li>',
    noResultsText: '',
    fuzzy: false
});
```

1. `searchInput` ：是输入搜索内容的元素
2. `resultsContainer` ：搜索完后输出的元素
3. `json` ：包含关键信息的 `json` 文件
4. `searchResultTemplate` ：格式化输出内容，其中 `{title}` 这样的字眼会被替换为结果。值得注意的是，比如想要格式化输出 `{title}`的话，那么这个 `title`关键字必须要出现在 `json` 文件里。
5. `noReusltText` ：如果没有结果的话输出什么
6. `fuzzy` ：是否启动懒搜索。

### 定制化

可以看得出，本博客的这个搜索界面是经过了定制的。关于如何实现界面，`css` 什么的这里就不多讲了，主要是提一下思路

我在搜索控件中加了一个 “搜素全站” 的功能，就是输入搜索内容后结果的第一条。点击他后会跳转到一个搜索页面来对搜索结果进行展示。嗯，有点像 Github 对吧。

对于这个功能，首先就是要搞清楚如何在静态网页中实现不同页面的变量传递。我们知道， `http://www.abc.com/` 和 `http://www.abc.com/?s=cde` 其实是一个地址，但是第二网址比第一个网址多了一个 `?s=cde`，这其实就是 `get` 操作的 `字符串参数`。正常而言，这段信息都应该是让服务器端用 `php` 来解析，但是实际上 `js` 也可以获取到这串参数。

```javascript
var str = url.searchParams.get("s"); // s=cde
```

然后就是如何在 `simple-jekyll-search` 的输出结果中加入搜索全站，并且在没有搜索结果时提供一个动画效果。实现这个功能我们需要去修改一下 `simple-jekyll-search` 的源代码：

```javascript
function render (results, query) {
    var len = results.length
    if (len === 0) {
      return appendToResultsContainer(options.noResultsText)
    }
    for (var i = 0; i < len; i++) {
      results[i].query = query
      appendToResultsContainer(_$Templater_7.compile(results[i]))
    }
  }
```

`render` 函数就是 `simple-jekyll-search` 的输出函数，很简单，就是判断结果如果没有，就输出 `noResultsText`，如果有结果，就把所有结果 `append` 到 `ResultsContainer` 里。

理清了代码思路，定制就很简单了。

```javascript

function render (results, query) {
    var len = results.length;
    if (len === 0) {
      return appendToResultsContainer( #NORESULT# )
    }
    if (options.searchInput != null && window.innerWidth > 932){
      var url = "/search/?q=" + query;
      appendToResultsContainer( #SEARCHTEMPLATE# );
    }
    for (var i = 0; i < len; i++) {
      appendToResultsContainer(_$Templater_7.compile(results[i]))
    }
  }
```

当 `len === 0` 的时候，就是没有结果，`#NORESULT#` 是你的动画的 html 代码。

当 当前网页的 url 中存在 `/search/?q=` （这是我的搜索页面的特征码）时，`#SEARCHTEMPLATE#` 是在搜索界面的格式话输出模版。


大概思路就是这样了，其他的应该就是小细节了，可以去查看源代码。关于搜索的主要源代码在 `_includes/footer`、`_layout/post`、`css/hux-blog.css` 和 `js/hux-blog.js` 里，也包括了界面实现。如果我的代码有帮助带你，请你记得给我一个 star。