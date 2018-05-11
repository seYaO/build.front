import React from 'react';
import { BrowserRouter, Switch, Route, Redirect, routerRedux } from 'dva/router'
import dynamic from 'dva/dynamic'
import { LocaleProvider } from 'antd'
// import enUS from 'antd/lib/locale-provider/en_US'
import zhCN from 'antd/lib/locale-provider/zh_CN'
import App from 'routes/app'

const { ConnectedRouter } = routerRedux

import IndexPage from './routes/IndexPage'

function RouterConfig({ history, app }) {
    const error = dynamic({
        app,
        component: () => import(/* webpackChunkName: "error" */'./routes/error'),
    })

    const routes = [
        {
            path: '/login',
            models: () => [import(/* webpackChunkName: "login" */'./models/login')],
            component: () => import(/* webpackChunkName: "login" */'./routes/login/'),
        },
        {
            path: '/dashboard',
            models: () => [import(/* webpackChunkName: "dashboard" */'./models/dashboard')],
            component: () => import(/* webpackChunkName: "dashboard" */'./routes/dashboard/'),
        },
        {
            path: '/test',
            models: () => [import(/* webpackChunkName: "dashboard" */'./models/example')],
            component: () => import(/* webpackChunkName: "dashboard" */'./routes/IndexPage'),
        },
    ];
    return (
        <ConnectedRouter history={history}>
            <BrowserRouter>
                <LocaleProvider locale={zhCN}>
                    <Switch>
                        <Route exact path="/" render={() => (<Redirect to="/dashboard" />)} />
                        {
                            routes.map(({ path, ...dynamics }, key) => (
                                <Route key={key} exact path={path}
                                    component={dynamic({
                                        app,
                                        ...dynamics,
                                    })}
                                />
                            ))
                        }
                        <Route component={error} />
                    </Switch>
                </LocaleProvider>
            </BrowserRouter>
        </ConnectedRouter>
    );
}

export default RouterConfig;
