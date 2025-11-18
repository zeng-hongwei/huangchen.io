// utils.js - 工具函数

/**
 * DOM操作工具
 */
const domUtils = {
    /**
     * 创建元素
     * @param {string} tag - 标签名
     * @param {Object} attrs - 属性对象
     * @param {string|Node} content - 内容
     * @returns {Element} 创建的元素
     */
    createElement(tag, attrs = {}, content = '') {
        const element = document.createElement(tag);
        Object.keys(attrs).forEach(key => {
            element.setAttribute(key, attrs[key]);
        });
        if (typeof content === 'string') {
            element.textContent = content;
        } else if (content instanceof Node) {
            element.appendChild(content);
        }
        return element;
    },

    /**
     * 添加事件监听器
     * @param {string} selector - 选择器
     * @param {string} event - 事件类型
     * @param {Function} handler - 事件处理函数
     */
    on(selector, event, handler) {
        document.addEventListener(event, (e) => {
            if (e.target.matches(selector)) {
                handler(e);
            }
        });
    }
};

/**
 * 数据处理工具
 */
const dataUtils = {
    /**
     * 格式化数字
     * @param {number} num - 要格式化的数字
     * @returns {string} 格式化后的字符串
     */
    formatNumber(num) {
        return num.toLocaleString();
    },

    /**
     * 验证邮箱
     * @param {string} email - 邮箱地址
     * @returns {boolean} 是否有效
     */
    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
};

/**
 * 动画工具
 */
const animationUtils = {
    /**
     * 淡入元素
     * @param {Element} element - 要淡入的元素
     * @param {number} duration - 持续时间（毫秒）
     */
    fadeIn(element, duration = 300) {
        element.style.opacity = 0;
        element.style.display = 'block';
        const start = performance.now();
        const animate = (timestamp) => {
            const elapsed = timestamp - start;
            const progress = elapsed / duration;
            element.style.opacity = Math.min(progress, 1);
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        requestAnimationFrame(animate);
    },

    /**
     * 滚动到元素
     * @param {Element} element - 目标元素
     * @param {number} duration - 持续时间（毫秒）
     */
    scrollToElement(element, duration = 500) {
        const start = window.pageYOffset;
        const end = element.offsetTop;
        const distance = end - start;
        const startTime = performance.now();
        const animate = (timestamp) => {
            const elapsed = timestamp - startTime;
            const progress = elapsed / duration;
            const easeInOutQuad = progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2;
            window.scrollTo(0, start + distance * easeInOutQuad);
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        requestAnimationFrame(animate);
    }
};

// 导出工具
window.domUtils = domUtils;
window.dataUtils = dataUtils;
window.animationUtils = animationUtils;