/**
 * 
 * @param {*} el 
 */
function isInSight(el) {
    const bound = el.getBoundingClientRect();
    const clientHeight = window.innerHeight;

    // 如果只考虑向下滚动加载
    // const clientWidth = window.innerWidth;
    return bound.top <= clientHeight + 100; // +100 提前加载

}