/* 个人主页交互脚本(零依赖,渐进增强:JS 失效时页面仍完整可用) */
(function () {
  'use strict';

  /* 标记 JS 已启用:CSS 据此决定 .reveal 元素是否先隐藏 */
  document.documentElement.classList.add('js');

  /* ===== 主题切换(浅色 ↔ 深色,localStorage 持久化) ===== */
  var THEME_COLORS = { light: '#faf6ee', dark: '#171511' };
  var themeColorMetas = document.querySelectorAll('meta[name="theme-color"]');

  /* 手动主题下,theme-color meta 只跟系统走会导致浏览器 UI(Safari 标签栏等)
     与页面颜色脱节,这里把两条 meta 一并改成当前主题色 */
  function syncThemeColor(theme) {
    themeColorMetas.forEach(function (meta) {
      meta.setAttribute('content', THEME_COLORS[theme]);
    });
  }

  var initialTheme = document.documentElement.dataset.theme;
  if (initialTheme === 'light' || initialTheme === 'dark') {
    syncThemeColor(initialTheme);
  }

  var themeToggle = document.querySelector('.theme-toggle');
  if (themeToggle) {
    var systemDark = window.matchMedia('(prefers-color-scheme: dark)');
    var currentTheme = function () {
      return document.documentElement.dataset.theme ||
        (systemDark.matches ? 'dark' : 'light');
    };
    /* aria-pressed 让屏幕阅读器知道当前是否处于深色 */
    themeToggle.setAttribute('aria-pressed', String(currentTheme() === 'dark'));
    themeToggle.addEventListener('click', function () {
      var next = currentTheme() === 'dark' ? 'light' : 'dark';
      document.documentElement.dataset.theme = next;
      syncThemeColor(next);
      themeToggle.setAttribute('aria-pressed', String(next === 'dark'));
      try {
        localStorage.setItem('theme', next);
      } catch (e) {
        /* 隐私模式下 localStorage 可能不可写,主题仍在本页生效 */
      }
    });
  }

  /* ===== 移动端导航开合 ===== */
  var navToggle = document.querySelector('.nav-toggle');
  var siteNav = document.querySelector('.site-nav');
  if (navToggle && siteNav) {
    var closeNav = function (returnFocus) {
      document.body.classList.remove('nav-open');
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.setAttribute('aria-label', 'Open navigation menu');
      if (returnFocus) navToggle.focus();
    };
    navToggle.addEventListener('click', function () {
      var open = document.body.classList.toggle('nav-open');
      navToggle.setAttribute('aria-expanded', String(open));
      navToggle.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
      /* 菜单面板在 DOM 中位于按钮之前,展开后把焦点移进菜单,
         否则键盘用户按 Tab 会直接跳进正文 */
      if (open) {
        var firstLink = siteNav.querySelector('a');
        if (firstLink) firstLink.focus();
      }
    });
    /* 点击任意导航链接后自动收起菜单 */
    siteNav.addEventListener('click', function (e) {
      if (e.target.closest('a')) closeNav(false);
    });
    /* Escape 关闭菜单,焦点还给按钮 */
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && document.body.classList.contains('nav-open')) {
        closeNav(true);
      }
    });
  }

  /* ===== 滚动浮现 ===== */
  var revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    if ('IntersectionObserver' in window) {
      var revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15 });
      revealEls.forEach(function (el) {
        revealObserver.observe(el);
      });
    } else {
      /* 不支持 IntersectionObserver 的环境:直接全部显示 */
      revealEls.forEach(function (el) {
        el.classList.add('visible');
      });
    }
  }

  /* ===== 导航当前分区高亮(仅主页有锚点分区) ===== */
  var sections = document.querySelectorAll('main section[id]');
  var navLinks = document.querySelectorAll('.site-nav a[href^="#"]');
  if (sections.length && navLinks.length && 'IntersectionObserver' in window) {
    var linkById = {};
    navLinks.forEach(function (link) {
      linkById[link.getAttribute('href').slice(1)] = link;
    });
    /* rootMargin 收窄到视口中部:分区经过屏幕中间时才算「当前」 */
    var spyObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        /* 先清空再设置:回到无对应导航项的分区(如顶部 hero)时不残留高亮 */
        navLinks.forEach(function (l) {
          l.classList.remove('active');
        });
        var link = linkById[entry.target.id];
        if (link) link.classList.add('active');
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    sections.forEach(function (section) {
      spyObserver.observe(section);
    });
  }

  /* ===== 复制邮箱(优先 Clipboard API;API 不可用或写入被拒时回退为打开邮件客户端) ===== */
  var copyBtn = document.querySelector('.copy-email');
  if (copyBtn) {
    var copyStatus = document.querySelector('.copy-status');
    var defaultLabel = copyBtn.textContent;
    var resetTimer = null;
    copyBtn.addEventListener('click', function () {
      var email = copyBtn.dataset.email;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email).then(function () {
          copyBtn.textContent = 'Copied ✓';
          copyBtn.classList.add('copied');
          /* role="status" live region so screen readers announce the result */
          if (copyStatus) copyStatus.textContent = 'Email address copied to clipboard';
          clearTimeout(resetTimer);
          resetTimer = setTimeout(function () {
            copyBtn.textContent = defaultLabel;
            copyBtn.classList.remove('copied');
            if (copyStatus) copyStatus.textContent = '';
          }, 2000);
        }).catch(function () {
          location.href = 'mailto:' + email;
        });
      } else {
        location.href = 'mailto:' + email;
      }
    });
  }
})();
