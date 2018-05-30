import '@babel/polyfill'
import 'url-polyfill'
import dva from 'dva'
import { message } from 'antd'
import createLoading from 'dva-loading'
import createHistory from 'history/createBrowserHistory'
// import createHistory from 'history/createHashHistory'

// 1. Initialize
const app = dva({
    history: createHistory(),
    onError(error) {
        message.error(error.message)
    }
});

// 2. Plugins
app.use(createLoading());

// 3. Model
app.model(require('./models/global').default);

// 4. Router
app.router(require('./router').default);

// 5. Start
app.start('#root');

export default app._store; // eslint-disable-line
