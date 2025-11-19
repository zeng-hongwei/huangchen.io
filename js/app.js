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
    initScrollSnap();
    initInstructorImage();
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
    },

    /**
     * 判断当前视口是否为移动端
     * @returns {boolean}
     */
    isMobile() {
        return window.matchMedia('(max-width: 768px)').matches;
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

    // 检查系统主题偏好
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const systemTheme = prefersDark ? 'dark' : 'light';
    
    // 从localStorage获取保存的模式，如果没有则使用跟随系统
    let currentMode = localStorage.getItem('theme-mode') || 'auto';
    
    // 根据模式设置主题
    applyTheme(currentMode, systemTheme);

    // 更新按钮状态
    updateThemeButton(currentMode);

    // 监听系统主题变化
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        const newSystemTheme = e.matches ? 'dark' : 'light';
        // 只有当模式是跟随系统时，才更新主题
        if (currentMode === 'auto') {
            setTheme(newSystemTheme);
        }
    });

    // 绑定点击事件
    themeToggle.addEventListener('click', () => {
        // 循环模式：light -> dark -> auto -> light...
        if (currentMode === 'light') {
            currentMode = 'dark';
        } else if (currentMode === 'dark') {
            currentMode = 'auto';
        } else {
            currentMode = 'light';
        }
        
        localStorage.setItem('theme-mode', currentMode);
        applyTheme(currentMode, systemTheme);
        updateThemeButton(currentMode);
    });

    /**
     * 根据模式应用主题
     * @param {string} mode - 'light', 'dark', 或 'auto'
     * @param {string} systemTheme - 系统偏好主题
     */
    function applyTheme(mode, systemTheme) {
        const theme = mode === 'auto' ? systemTheme : mode;
        setTheme(theme);
    }

    /**
     * 设置主题
     * @param {string} theme - 'light' 或 'dark'
     */
    function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
    }

    /**
     * 更新按钮显示
     * @param {string} mode - 当前模式
     */
    function updateThemeButton(mode) {
        if (mode === 'light') {
            themeIcon.className = 'ri-sun-line';
            themeText.textContent = '明亮';
        } else if (mode === 'dark') {
            themeIcon.className = 'ri-moon-line';
            themeText.textContent = '暗黑';
        } else {
            themeIcon.className = 'ri-computer-line';
            themeText.textContent = '跟随系统';
        }
    }
}

/**
 * 初始化整页滚动和过渡效果
 */
function initScrollSnap() {
    const sections = document.querySelectorAll('section.is-fullheight');
    const navbar = document.querySelector('.navbar');
    
    // 让第一屏立即可见
    if (sections.length > 0) {
        sections[0].classList.add('visible');
    }
    
    const observerOptions = {
        root: null,
        rootMargin: '-50% 0px -50% 0px',
        threshold: 0
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // 控制navbar显示/隐藏
                const isFirstSection = entry.target.id === 'home' || entry.target === sections[0];

                const isMobile = utils.isMobile();
                if (!isFirstSection && isMobile) {
                    navbar.classList.add('navbar-mini');
                } else {
                    navbar.classList.remove('navbar-mini');
                }
            } else {
                entry.target.classList.remove('visible');
            }
        });
    }, observerOptions);
    
    sections.forEach(section => {
        observer.observe(section);
    });

    window.addEventListener('resize', utils.debounce(() => {
        const firstSectionVisible = sections.length > 0 && sections[0].classList.contains('visible');
        if (!firstSectionVisible && utils.isMobile()) {
            navbar.classList.add('navbar-mini');
        } else {
            navbar.classList.remove('navbar-mini');
        }
    }, 150));
}

/**
 * 初始化讲师照片响应式显示
 */
function initInstructorImage() {
    const instructorFigure = document.querySelector('figure.image.is-2by3');
    if (!instructorFigure) return;
    
    function updateInstructorImage() {
        if (utils.isMobile()) {
            instructorFigure.classList.remove('is-2by3');
            instructorFigure.classList.add('is-1by1');
        } else {
            instructorFigure.classList.remove('is-1by1');
            instructorFigure.classList.add('is-2by3');
        }
    }
    
    // 初始设置
    updateInstructorImage();
    
    // 监听窗口大小变化
    window.addEventListener('resize', utils.debounce(updateInstructorImage, 100));
}