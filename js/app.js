// app.js - 主应用脚本

/**
 * 初始化应用
 */
document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    initSmoothScroll();
    initFAQ();
    initCarousel();
    initThemeToggle();
});

/**
 * 初始化导航栏汉堡包菜单
 */
function initNavbar() {
    const navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);
    if (navbarBurgers.length > 0) {
        navbarBurgers.forEach(el => {
            el.addEventListener('click', () => {
                const target = el.dataset.target;
                const $target = document.getElementById(target);
                el.classList.toggle('is-active');
                $target.classList.toggle('is-active');
            });
        });
    }
}

/**
 * 初始化平滑滚动
 */
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

/**
 * 初始化FAQ展开/折叠
 */
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            // 移除所有item的active类
            faqItems.forEach(otherItem => {
                otherItem.classList.remove('active');
            });
            // 为当前item添加active类
            item.classList.add('active');
        });
    });
}

/**
 * 初始化轮播（简单版本）
 */
function initCarousel() {
    // 这里可以添加轮播逻辑，如自动播放、导航按钮等
    // 目前使用CSS的滚动
}

/**
 * 工具函数
 */
const utils = {
    /**
     * 防抖函数
     * @param {Function} func - 要执行的函数
     * @param {number} wait - 等待时间
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    /**
     * 节流函数
     * @param {Function} func - 要执行的函数
     * @param {number} limit - 时间限制
     */
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
};

// 导出工具函数（如果需要）
window.utils = utils;

/**
 * 初始化主题切换
 */
function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const themeText = document.getElementById('theme-text');

    // 从localStorage获取保存的主题
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);

    // 更新按钮状态
    updateThemeButton(savedTheme);

    // 绑定点击事件
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        updateThemeButton(newTheme);
        localStorage.setItem('theme', newTheme);
    });

    /**
     * 设置主题
     * @param {string} theme - 'light' 或 'dark'
     */
    function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
    }

    /**
     * 更新按钮显示
     * @param {string} theme - 当前主题
     */
    function updateThemeButton(theme) {
        if (theme === 'dark') {
            themeIcon.className = 'ri-sun-line';
            themeText.textContent = '明亮';
        } else {
            themeIcon.className = 'ri-moon-line';
            themeText.textContent = '暗黑';
        }
    }
}