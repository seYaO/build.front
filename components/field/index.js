const { extractComponentId } = require('../common/helper');

module.exports = {
    _handleVFieldChange(event) {
        const componentId = extractComponentId(event);
        event.componentId = componentId;

        console.info('[v:field:change]', event);

        if (this.handleVFieldChange) {
            return this.handleVFieldChange(event);
        }

        console.warn('页面缺少 handleVFieldChange 回调函数');
    },

    _handleVFieldFocus(event) {
        const componentId = extractComponentId(event);
        event.componentId = componentId;

        console.info('[v:field:focus]', event);

        if (this.handleVFieldFocus) {
            return this.handleVFieldFocus(event);
        }

        console.warn('页面缺少 handleVFieldFocus 回调函数');
    },

    _handleVFieldBlur(event) {
        const componentId = extractComponentId(event);
        event.componentId = componentId;

        console.info('[v:field:blur]', event);

        if (this.handleVFieldBlur) {
            return this.handleVFieldBlur(event);
        }

        console.warn('页面缺少 handleVFieldBlur 回调函数');
    }
};
