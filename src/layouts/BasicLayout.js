import React, { Fragment } from 'react'
import { connect } from 'dva'
import { Route, Redirect, Switch, routerRedux } from 'dva/router'
import PropTypes from 'prop-types'
import DocumentTitle from 'react-document-title'
import { ContainerQuery } from 'react-container-query'
import pathToRegexp from 'path-to-regexp'
import classNames from 'classnames'
import { Layout, Icon, message } from 'antd'
// enquire.js-响应css媒体查询的轻量级javascript库
import { enquireScreen, unenquireScreen } from 'enquire-js'
import { GlobalHeader, GlobalFooter, SiderMenu } from 'components'
import NotFound from 'routes/Exception/404'
import { getRoutes } from 'utils/utils'
import Authorized from 'utils/Authorized'
import { getMenuData } from 'common/menu'
import { FooterLinks, FooterCopyright, query } from './enums'

const { Content, Header, Footer } = Layout;
const { AuthorizedRoute, check } = Authorized;

/**
 * 获取面包屑映射
 * @param {Object} menuData 菜单配置
 * @param {Object} routerData 路由配置
 */
const getBreadcrumbNameMap = (menuData, routerData) => {
    const result = {};
    const childResult = {};
    for (const i of menuData) {
        if (!routerData[i.path]) {
            result[i.path] = i;
        }
        if (i.children) {
            Object.assign(childResult, getBreadcrumbNameMap(i.children, routerData));
        }
    }
    return Object.assign({}, routerData, result, childResult);
};

let isMobile;
enquireScreen(b => isMobile = b);

class BasicLayout extends React.PureComponent {
    static childContextTypes = {
        location: PropTypes.object,
        breadcrumbNameMap: PropTypes.object,
    };

    state = { isMobile, };

    getChildContext() {
        const { location, routerData } = this.props;
        return {
            location,
            breadcrumbNameMap: getBreadcrumbNameMap(getMenuData(), routerData),
        };
    }

    componentDidMount() {
        this.enquireHandler = enquireScreen(mobile => {
            this.setState({
                isMobile: mobile,
            });
        });
        this.props.dispatch({
            type: 'user/fetchCurrent',
        });
    }

    componentWillUnmount() {
        unenquireScreen(this.enquireHandler);
    }

    // title
    getPageTitle() {
        const { routerData, location } = this.props;
        const { pathname } = location;
        let title = 'Ant Design Pro';
        let currRouterData = null;
        // match params path
        Object.keys(routerData).forEach(key => {
            if (pathToRegexp(key).test(pathname)) {
                currRouterData = routerData[key];
            }
        });
        if (currRouterData && currRouterData.name) {
            title = `${currRouterData.name} - Ant Design Pro`;
        }
        return title;
    }

    // 重定向
    getBashRedirect = () => {
        // According to the url parameter to redirect
        // 这里是重定向的,重定向到 url 的 redirect 参数所示地址
        const urlParams = new URL(window.location.href);

        const redirect = urlParams.searchParams.get('redirect');
        // Remove the parameters in the url
        if (redirect) {
            urlParams.searchParams.delete('redirect');
            window.history.replaceState(null, 'redirect', urlParams.href);
        } else {
            const { routerData } = this.props;
            // get the first authorized route path in routerData
            const authorizedPath = Object.keys(routerData).find(
                item => check(routerData[item].authority, item) && item !== '/'
            );
            return authorizedPath;
        }
        return redirect;
    }

    handleMenuCollapse = collapsed => {
        this.props.dispatch({
            type: 'global/changeLayoutCollapsed',
            payload: collapsed,
        });
    }

    handleNoticeClear = type => {
        message.success(`清空了${type}`);
        this.props.dispatch({
            type: 'global/clearNotices',
            payload: type,
        });
    }

    handleMenuClick = ({ key }) => {
        if (key === 'triggerError') {
            this.props.dispatch(routerRedux.push('/exception/trigger'));
            return;
        }
        if (key === 'logout') {
            this.props.dispatch({
                type: 'login/logout',
            });
        }
    }

    handleNoticeVisibleChange = visible => {
        if (visible) {
            this.props.dispatch({
                type: 'global/fetchNotices',
            });
        }
    }

    renderLayout = () => {
        const { currentUser, collapsed, fetchingNotices, notices, routerData, match, location, } = this.props;
        const bashRedirect = this.getBashRedirect();
        return (
            <Layout>
                <SiderMenu
                    // 不带Authorized参数的情况下如果没有权限,会强制跳到403界面
                    // If you do not have the Authorized parameter
                    // you will be forced to jump to the 403 interface without permission
                    Authorized={Authorized}
                    menuData={getMenuData()}
                    collapsed={collapsed}
                    location={location}
                    isMobile={this.state.isMobile}
                    onCollapse={this.handleMenuCollapse}
                />
                <Layout>
                    <Header style={{ padding: 0 }}>
                        <GlobalHeader
                            currentUser={currentUser}
                            fetchingNotices={fetchingNotices}
                            notices={notices}
                            collapsed={collapsed}
                            isMobile={this.state.isMobile}
                            onNoticeClear={this.handleNoticeClear}
                            onCollapse={this.handleMenuCollapse}
                            onMenuClick={this.handleMenuClick}
                            onNoticeVisibleChange={this.handleNoticeVisibleChange}
                        />
                    </Header>
                    <Content style={{ margin: '24px 24px 0', height: '100%' }}>
                        <Switch>
                            {
                                getRoutes(match.path, routerData).map(item => (
                                    <AuthorizedRoute
                                        key={item.key}
                                        path={item.path}
                                        component={item.component}
                                        exact={item.exact}
                                        authority={item.authority}
                                        redirectPath="/exception/403"
                                    />
                                ))
                            }
                            <Redirect exact from="/" to={bashRedirect} />
                            <Route render={NotFound} />
                        </Switch>
                    </Content>
                    <Footer style={{ padding: 0 }}>
                        <GlobalFooter links={FooterLinks} copyright={<Fragment>Copyright <Icon type="copyright" />{FooterCopyright}</Fragment>} />
                    </Footer>
                </Layout>
            </Layout>
        )
    }

    render() {
        return (
            <DocumentTitle title={this.getPageTitle()}>
                <ContainerQuery query={query}>
                    {params => <div className={classNames(params)}>{this.renderLayout()}</div>}
                </ContainerQuery>
            </DocumentTitle>
        );
    }
}

function mapStateToProps({ user, global, loading }) {
    return {
        currentUser: user.currentUser,
        collapsed: global.collapsed,
        fetchingNotices: loading.effects['global/fetchNotices'],
        notices: global.notices,
    };
}

export default connect(mapStateToProps)(BasicLayout);
