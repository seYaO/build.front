import React, { Component } from 'react'
import { Icon } from 'antd'
import { Page } from 'components'
import styles from './style.less'

class Error extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <Page inner>
                <div className={styles.error}>
                    <Icon type="frown-o" />
                    <h1>404 Not Found</h1>
                </div>
            </Page>
        )
    }
}

export default Error