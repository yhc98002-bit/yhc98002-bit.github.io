# 个人主页

纯 HTML / CSS / JavaScript 构建的个人主页 —— 零框架、零构建工具、零外部依赖。

<!-- TODO: 部署后把线上地址填在这里 -->
在线地址:https://username.github.io/

## 目录结构

```
├── index.html          # 主页(关于 / 技能 / 项目 / 联系)
├── 404.html            # 404 页(样式内联,不依赖 style.css)
├── favicon.svg         # 站点图标
├── css/style.css       # 全站唯一样式文件
├── js/main.js          # 全站唯一脚本文件
├── assets/images/      # 图片目录(头像、项目截图、og-image)
└── blog/
    ├── index.html      # 博客列表页
    └── posts/          # 文章目录
        ├── template.html               # 文章模板(复制它写新文章)
        └── YYYY-MM-DD-xxx.html         # 各篇文章
```

## 本地预览

两种方式:

1. **直接打开**:双击 `index.html` 即可,全部功能在现代浏览器下均可用(极个别浏览器若禁用了剪贴板,「复制邮箱」会自动回退为打开邮件客户端)。
2. **本地服务器**(和线上环境完全一致,推荐):

   ```bash
   cd 项目目录
   python3 -m http.server 8000
   ```

   然后访问 http://localhost:8000

## 如何写一篇新博客

1. 复制 `blog/posts/template.html`,在**同目录**下重命名为 `YYYY-MM-DD-英文短名.html`(如 `2026-09-01-my-post.html`);
2. 修改文件里的 `<title>`、`<h1>` 标题、`<time>` 日期(`datetime` 属性和显示文字两处)和正文;
3. 打开 `blog/index.html`,找到列表顶部的注释,复制一个 `<article>` 卡片块粘贴在注释下方,改成新文章的日期、链接、标题、摘要;
4. 本地预览确认后提交推送即可。

正文可用的排版元素(标题、列表、引用、代码块等)见示例文章 `blog/posts/2026-08-20-typography.html`,它就是排版样式的「自测页」。

## 如何加一个项目卡片

打开 `index.html`,找到项目区(`id="projects"`)里的注释,复制一个 `<article class="project-card">` 块,修改:

- 封面配色类:`cover-1` / `cover-2` / `cover-3`(有真实截图时,把整个 `<div class="project-cover">` 换成 `<img class="project-cover" src="assets/images/xxx.png" alt="项目截图">`);
- 项目名、描述、技术标签;
- 「在线演示」和「源码」两个链接。

## 上线前:替换占位内容清单

全局搜索 `TODO` 可以找到全部待替换处,主要包括:

- [ ] 所有页面的「你的名字」(导航、Hero、页脚、`<title>`)
- [ ] `index.html` 的 meta description、Open Graph 标签(`og:url` 和 `og:image` 都改为线上**完整绝对地址**——og:image 用相对路径时社交分享卡片不显示图片)
- [ ] Hero 区头像:把占位 `<svg>` 换成真实头像 `<img>`(图片放 `assets/images/`)
- [ ] 关于我的三段介绍、技能标签
- [ ] 三个示例项目 → 真实项目
- [ ] 联系区邮箱(`data-email` 属性也要改)和社交链接
- [ ] `assets/images/og-image.png`:准备一张 1200x630 的分享卡片图
- [ ] 两篇示例文章:改写或删除(删除时记得同步删掉 `blog/index.html` 里的卡片)
- [ ] `favicon.svg` 里的「你」字
- [ ] 若部署在项目子路径:`404.html` 里「回到首页」的链接

## 部署到 GitHub Pages

首次部署:

```bash
git init && git add -A && git commit -m "初始化个人主页"

# 方式一:用 gh CLI(推荐)
gh repo create <你的用户名>.github.io --public --source=. --push

# 方式二:GitHub 网页新建仓库后
git remote add origin git@github.com:<你的用户名>/<仓库名>.git
git push -u origin main
```

然后在 GitHub 仓库页面:**Settings → Pages → Source 选 「Deploy from a branch」→ 分支选 `main`、目录选 `/(root)` → Save**。等 1-2 分钟即可访问。

- 仓库名为 `<用户名>.github.io` 时,地址是 `https://<用户名>.github.io/`;
- 用其他仓库名时,地址是 `https://<用户名>.github.io/<仓库名>/`(全站用的相对路径,两种都能直接跑)。

之后的更新只需:

```bash
git add -A && git commit -m "更新内容" && git push
```

推送后 GitHub Pages 会自动重新发布。

## 技术说明

- **深色模式**:默认跟随系统,右上角按钮可手动切换(记住选择);每页 `<head>` 里的小段内联脚本用于防止深色用户刷新时闪白,请勿删除。
- **`.nojekyll`**:告诉 GitHub Pages 跳过 Jekyll 构建、按原样托管静态文件,请勿删除。
- **相对路径**:全站不用以 `/` 开头的绝对路径,保证本地双击、本地服务器、GitHub Pages 子路径三种环境行为一致(唯一例外是 404 页的首页链接,见上文清单)。
