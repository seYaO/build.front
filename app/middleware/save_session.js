/**
 * [延长用户 Session 有效期]
 * @return {[type]} [description]
 */
module.exports = () => {
    return async function saveSession(ctx, next) {
        await next();
        // 如果 Session 是空的，则不保存
        if(!ctx.session.populated) return;
        ctx.session.save();
    }
}