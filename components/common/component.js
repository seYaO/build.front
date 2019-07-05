
function mapKeys(source, target, map) {
    console.log('----vantOptions----')
    console.log('source--', source)
    console.log('target--', target)
    console.log('map--', map)
    Object.keys(map).forEach(function (key) {
        if (source[key]) {
            target[map[key]] = source[key];
        }
    });
}

function VantComponent(vantOptions) {
    let _a
    if (vantOptions === void 0) { vantOptions = {} }
    let options = {}
    mapKeys(vantOptions, options, {
        data: 'data',
        props: 'properties',
        mixins: 'behaviors',
        methods: 'methods',
        beforeCreate: 'created',
        created: 'attached',
        mounted: 'ready',
        relations: 'relations',
        destroyed: 'detached',
        classes: 'externalClasses'
    });
    let relations = vantOptions.relations
    if (relation) {
        // options.relations = Object.assign(options.relations || {}, (_a = {}, _a["../" + relation.name + "/index"] = relation, _a));
        options.relations = { ...options.relations, ...(_a = {}, _a["../" + relation.name + "/index"] = relation, _a) }
    }
    // add default externalClasses
    // 添加默认外部样式类
    options.externalClasses = options.externalClasses || [];
    options.externalClasses.push('custom-class');
    // add default behaviors
    options.behaviors = options.behaviors || [];
    // options.behaviors.push(basic_1.basic);
    // map field to form-field behavior
    if (vantOptions.field) {
        options.behaviors.push('wx://form-field');
    }
    // add default options
    options.options = {
        multipleSlots: true,
        addGlobalClass: true
    };
    // index_1.observe(vantOptions, options);
    Component(options);

}