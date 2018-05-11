import React, { Component } from 'react'
import { connect } from 'dva'
import { withRouter } from 'dva/router'
import { BackTop, Layout } from 'antd'
import { Loader,  } from 'components'
import { classnames, config } from 'utils'
import Error from './error'

const { Content, Footer, Sider } = Layout

class App extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (<div></div>)
    }
}

App.propTypes = {
    children: PropTypes.element.isRequired,
    location: PropTypes.object,
    dispatch: PropTypes.func,
    app: PropTypes.object,
    loading: PropTypes.object,
}

function mapStateToProps({ app, loading }) {
    return { app, loading };
}

export default withRouter(connect(mapStateToProps)(App))