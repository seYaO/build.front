import React from 'react';
import { BrowserRouter, Switch, Route, Redirect, routerRedux } from 'dva/router'
import dynamic from 'dva/dynamic'
import { LocaleProvider } from 'antd'
// import enUS from 'antd/lib/locale-provider/en_US'
import zhCN from 'antd/lib/locale-provider/zh_CN'
import App from 'routes/app'

const { ConnectedRouter } = routerRedux

function RouterConfig({ history, app }) {

    return (
        <LocaleProvider locale={zhCN}>
            <ConnectedRouter history={history}>
                <Switch>
                    <Route exact path="/" render={() => (<Redirect to="/dashboard" />)} />
                </Switch>
            </ConnectedRouter>
        </LocaleProvider>
    );
}

export default RouterConfig;
