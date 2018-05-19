import { Icon } from 'antd'

export const FooterLinks = [
    {
        key: 'Pro 首页',
        title: 'Pro 首页',
        href: 'http://pro.ant.design',
        blankTarget: true,
    },
    {
        key: 'github',
        title: <Icon type="github" />,
        href: 'https://github.com/ant-design/ant-design-pro',
        blankTarget: true,
    },
    {
        key: 'Ant Design',
        title: 'Ant Design',
        href: 'http://ant.design',
        blankTarget: true,
    },
];

export const FooterCopyright = ' 2018 蚂蚁金服体验技术部出品 ';

export const query = {
    'screen-xs': {
        maxWidth: 575,
    },
    'screen-sm': {
        minWidth: 576,
        maxWidth: 767,
    },
    'screen-md': {
        minWidth: 768,
        maxWidth: 991,
    },
    'screen-lg': {
        minWidth: 992,
        maxWidth: 1199,
    },
    'screen-xl': {
        minWidth: 1200,
    },
};

