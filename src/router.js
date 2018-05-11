import React from 'react';
import { BrowserRouter, Switch, Route, Redirect, routerRedux } from 'dva/router'
import dynamic from 'dva/dynamic'
import { LocaleProvider } from 'antd'
// import enUS from 'antd/lib/locale-provider/en_US'
import zhCN from 'antd/lib/locale-provider/zh_CN'

const { ConnectedRouter } = routerRedux

import IndexPage from './routes/IndexPage'

function RouterConfig({ history, app }) {
    const routes = [
        {
            path: '/dashboard',
            models: () => [import(/* webpackChunkName: "dashboard" */'./models/example')],
            component: () => import(/* webpackChunkName: "dashboard" */'./routes/IndexPage'),
        },
    ];
    return (
        <ConnectedRouter history={history}>
            <BrowserRouter>
                <LocaleProvider locale={zhCN}>
                    <Switch>
                    {
                        routes.map(({ path, ...dynamics }, key) => (
                            <Route key={key} exact path={path}
                                component={dynamic({
                                    // app,
                                    ...dynamics,
                                })}
                            />
                        ))
                    }
                    </Switch>
                </LocaleProvider>
            </BrowserRouter>
        </ConnectedRouter>
    );
}

export default RouterConfig;
