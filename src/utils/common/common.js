import dayjs from "dayjs";

/**
 * @desc  格式化时间
 * @param {(Object|string|number)} time
 * @param {string} format
 * @returns {string | null}
 */
export function formatDateTime(
    time = undefined,
    format = "YYYY-MM-DD HH:mm:ss"
) {
    return dayjs(time).format(format);
}

export function formatDate(date = undefined, format = "YYYY-MM-DD") {
    return formatDateTime(date, format);
}

export function getWeekDay(num) {
    let name = "";
    switch (num) {
        case 0:
            name = "星期一";
            break;
        case 1:
            name = "星期二";
            break;
        case 2:
            name = "星期三";
            break;
        case 3:
            name = "星期四";
            break;
        case 4:
            name = "星期五";
            break;
        case 5:
            name = "星期六";
            break;
        case 6:
            name = "星期日";
            break;
        default:
            break;
    }
    return name;
}
// 把文件流转换为二进制
export const getFileBinary = function (file, callBack) {
    var reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = function (e) {
        if (typeof callBack === "function") {
            callBack.call(this, this.result);
        }
    };
};
/**
 * @desc  函数节流
 * @param {Function} fn
 * @param {Number} wait
 * @returns {Function}
 */
export function throttle(fn, wait) {
    var context, args;
    var previous = 0;

    return function () {
        var now = +new Date();
        context = this;
        args = arguments;
        if (now - previous > wait) {
            fn.apply(context, args);
            previous = now;
        }
    };
}

/**
 * @desc  函数防抖
 * @param {Function} func
 * @param {number} wait
 * @param {boolean} immediate
 * @return {*}
 */
export function debounce(method, wait, immediate) {
    let timeout;
    return function (...args) {
        let context = this;
        if (timeout) {
            clearTimeout(timeout);
        }
        // 立即执行需要两个条件，一是immediate为true，二是timeout未被赋值或被置为null
        if (immediate) {
            /**
             * 如果定时器不存在，则立即执行，并设置一个定时器，wait毫秒后将定时器置为null
             * 这样确保立即执行后wait毫秒内不会被再次触发
             */
            let callNow = !timeout;
            timeout = setTimeout(() => {
                timeout = null;
            }, wait);
            if (callNow) {
                method.apply(context, args);
            }
        } else {
            // 如果immediate为false，则函数wait毫秒后执行
            timeout = setTimeout(() => {
                /**
                 * args是一个类数组对象，所以使用fn.apply
                 * 也可写作method.call(context, ...args)
                 */
                method.apply(context, args);
            }, wait);
        }
    };
}
