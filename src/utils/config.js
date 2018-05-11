const APIV1 = '/api/v1'
const APIV2 = '/api/v2'

const ColProps = {
    xs: 24,
    sm: 12,
    style: {
        marginBottom: 16,
    },
};

const TwoColProps = {
    ...ColProps,
    xl: 96,
};

const formItemLayout = {
    labelCol: {
        span: 6,
    },
    wrapperCol: {
        span: 14,
    },
}

const selectOpts = {
    showSearch: true,
    placeholder: '请选择',
    style: {
        width: '100%'
    },
    allowClear: true,
    optionFilterProp: 'children',
    filterOption: (input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0,
}

module.exports = {
    name: '保险结算系统',
    footerText: 'Ant Design Admin  © 2017 zuiidea',
    logo: 'http://file.40017.cn/baoxian/settlement/icon-01.png',
    CORS: [],
    openPages: ['/login'],
    apiPrefix: '/settlement',
    APIV1,
    APIV2,
    ColProps,
    TwoColProps,
    formItemLayout,
    selectOpts,
}
