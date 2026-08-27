/* 个人主页交互脚本(零依赖,渐进增强:JS 失效时页面仍完整可用) */
(function () {
  'use strict';

  /* 标记 JS 已启用:CSS 据此决定 .reveal 元素是否先隐藏 */
  document.documentElement.classList.add('js');

  /* ===== 主题切换(浅色 ↔ 深色,localStorage 持久化) ===== */
  var themeToggle = document.querySelector('.theme-toggle');
  if (themeToggle) {
    var systemDark = window.matchMedia('(prefers-color-scheme: dark)');
    themeToggle.addEventListener('click', function () {
      var current = document.documentElement.dataset.theme ||
        (systemDark.matches ? 'dark' : 'light');
      var next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.dataset.theme = next;
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
    navToggle.addEventListener('click', function () {
      var open = document.body.classList.toggle('nav-open');
      navToggle.setAttribute('aria-expanded', String(open));
      navToggle.setAttribute('aria-label', open ? '关闭导航菜单' : '打开导航菜单');
    });
    /* 点击任意导航链接后自动收起菜单 */
    siteNav.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        document.body.classList.remove('nav-open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.setAttribute('aria-label', '打开导航菜单');
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
        var link = linkById[entry.target.id];
        if (!link || !entry.isIntersecting) return;
        navLinks.forEach(function (l) {
          l.classList.remove('active');
        });
        link.classList.add('active');
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    sections.forEach(function (section) {
      spyObserver.observe(section);
    });
  }

  /* ===== 复制邮箱(Clipboard API 仅在 https/localhost 可用,file:// 下回退为 mailto) ===== */
  var copyBtn = document.querySelector('.copy-email');
  if (copyBtn) {
    var defaultLabel = copyBtn.textContent;
    var resetTimer = null;
    copyBtn.addEventListener('click', function () {
      var email = copyBtn.dataset.email;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email).then(function () {
          copyBtn.textContent = '已复制 ✓';
          copyBtn.classList.add('copied');
          clearTimeout(resetTimer);
          resetTimer = setTimeout(function () {
            copyBtn.textContent = defaultLabel;
            copyBtn.classList.remove('copied');
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
