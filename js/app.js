// app.js - 主应用脚本

/**
 * 初始化应用
 */
document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    initSmoothScroll();
    initFAQ();
    initThemeToggle();
    initScrollSnap();
    initInstructorImage();
    initCasesCarousel();
    initStatsFlip();
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
    if (!faqItems.length) return;

    const ensureFirstActive = () => {
        const hasActive = Array.from(faqItems).some(item => item.classList.contains('active'));
        if (!hasActive && faqItems[0]) {
            faqItems[0].classList.add('active');
        }
    };

    const attachMobileHandlers = () => {
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            if (!question) return;
            if (!question._faqHandler) {
                question._faqHandler = () => {
                    faqItems.forEach(otherItem => otherItem.classList.remove('active'));
                    item.classList.add('active');
                };
            }
            question.addEventListener('click', question._faqHandler);
        });
    };

    const detachHandlers = () => {
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            if (question && question._faqHandler) {
                question.removeEventListener('click', question._faqHandler);
            }
        });
    };

    const setAllExpanded = () => {
        faqItems.forEach(item => item.classList.add('active'));
    };

    let currentMobileState = null;

    const applyFAQMode = () => {
        const isMobile = utils.isMobile();
        if (isMobile === currentMobileState) return;
        currentMobileState = isMobile;

        detachHandlers();

        if (isMobile) {
            faqItems.forEach(item => item.classList.remove('active'));
            ensureFirstActive();
            attachMobileHandlers();
        } else {
            setAllExpanded();
        }
    };

    applyFAQMode();
    window.addEventListener('resize', utils.debounce(applyFAQMode, 150));
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
     * 初始化案例跑马灯
     */
    function initCasesCarousel() {
        const carousel = document.querySelector('#cases .carousel');
        if (!carousel) return;

        const items = carousel.querySelectorAll('.carousel-item');
        if (items.length === 0) return;

        let currentIndex = 0;
        let autoplayId = null;

        const setActiveState = () => {
            items.forEach((item, index) => {
                item.classList.toggle('active', index === currentIndex);
            });
        };

        const scrollToCurrent = (behavior = 'smooth') => {
            const activeItem = items[currentIndex];
            if (!activeItem) return;

            setActiveState();

            const containerWidth = carousel.clientWidth;
            const itemWidth = activeItem.clientWidth;
            const desiredLeft = activeItem.offsetLeft - (containerWidth - itemWidth) / 2;
            const maxScroll = carousel.scrollWidth - containerWidth;
            const clampedLeft = Math.max(0, Math.min(desiredLeft, maxScroll));

            if (typeof carousel.scrollTo === 'function') {
                carousel.scrollTo({ left: clampedLeft, behavior });
            } else {
                carousel.scrollLeft = clampedLeft;
            }
        };

        const moveToNext = () => {
            currentIndex = (currentIndex + 1) % items.length;
            scrollToCurrent();
        };

        const syncActiveWithScroll = () => {
            const containerCenter = carousel.scrollLeft + carousel.clientWidth / 2;
            let closestIndex = currentIndex;
            let smallestDistance = Number.POSITIVE_INFINITY;

            items.forEach((item, index) => {
                const itemCenter = item.offsetLeft + item.clientWidth / 2;
                const distance = Math.abs(itemCenter - containerCenter);
                if (distance < smallestDistance) {
                    smallestDistance = distance;
                    closestIndex = index;
                }
            });

            if (closestIndex !== currentIndex) {
                currentIndex = closestIndex;
                setActiveState();
            }
        };

        const stopAutoplay = () => {
            if (autoplayId) {
                clearInterval(autoplayId);
                autoplayId = null;
            }
        };

        const startAutoplay = () => {
            stopAutoplay();
            autoplayId = setInterval(moveToNext, 3000);
        };

        scrollToCurrent('auto');

        if (items.length > 1) {
            startAutoplay();
            carousel.addEventListener('mouseenter', stopAutoplay);
            carousel.addEventListener('mouseleave', startAutoplay);
            carousel.addEventListener('scroll', utils.throttle(syncActiveWithScroll, 120));
        }

        window.addEventListener('resize', utils.debounce(() => scrollToCurrent('auto'), 150));
    }

    /**
     * 初始化数字翻牌动画
     */
    function initStatsFlip() {
        const section = document.getElementById('results');
        if (!section) return;

        const statNumbers = Array.from(section.querySelectorAll('.stat-number'));
        if (!statNumbers.length) return;

        statNumbers.forEach(el => {
            const targetValue = Number(el.dataset.target ?? el.textContent.trim()) || 0;
            el.dataset.target = String(targetValue);
            if (!el.querySelector('.digit')) {
                el.innerHTML = '<span class="digit">0</span>';
            } else {
                el.querySelector('.digit').textContent = '0';
            }
        });

        const animateStat = (el) => {
            const digitEl = el.querySelector('.digit');
            if (!digitEl) return;
            const target = Number(el.dataset.target) || 0;
            const duration = 1500;
            const start = performance.now();
            let lastValue = 0;

            const tick = (now) => {
                const progress = Math.min((now - start) / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                const currentValue = Math.round(eased * target);

                if (currentValue !== lastValue) {
                    digitEl.textContent = currentValue;
                    digitEl.classList.remove('flip');
                    void digitEl.offsetWidth;
                    digitEl.classList.add('flip');
                    lastValue = currentValue;
                }

                if (progress < 1) {
                    requestAnimationFrame(tick);
                }
            };

            requestAnimationFrame(tick);
        };

        let played = false;
        const playOnce = () => {
            if (played) return;
            played = true;
            statNumbers.forEach(animateStat);
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    playOnce();
                    observer.disconnect();
                }
            });
        }, { threshold: 0.4 });

        observer.observe(section);
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