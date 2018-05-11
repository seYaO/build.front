import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import styles from './style.less'

class Loader extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { spinning, fullScreen } = this.props;

        return (
            <div className={classNames(styles.loader, { [styles.hidden]: !spinning, [styles.fullScreen]: fullScreen, })}>
                <div className={styles.warpper}>
                    <div className={styles.inner} />
                    <div className={styles.text} >LOADING</div>
                </div>
            </div>
        )
    }
}

Loader.propTypes = {
    spinning: PropTypes.bool,
    fullScreen: PropTypes.bool,
}

export default Loader