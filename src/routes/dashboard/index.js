import React, { Component } from 'react'
import { Timeline } from 'antd'
import { Page } from 'components'
import styles from './style.less'

class Dashboard extends Component{
    render() {
        return (
            <Page inner>
                <div className={styles.home}>
                    <h1>更新日志</h1>
                    <Timeline>
                        <Timeline.Item>
                            <p className={styles.title}>2018-03-12</p>
                            <p>首页</p>
                        </Timeline.Item>
                        <Timeline.Item>
                            <p className={styles.title}>2018-03-09</p>
                            <p>项目基础框架</p>
                        </Timeline.Item>
                    </Timeline>
                </div>
            </Page>
        )
    }
}
export default Dashboard
