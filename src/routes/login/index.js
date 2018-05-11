import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Button, Row, Form, Input } from 'antd'
import { config } from 'utils'
import styles from './style.less'

const FormItem = Form.Item

class Login extends Component {
    constructor(props) {
        super(props);
    }

    handleOkClick = () => {
        const { form, dispatch } = this.props;
        const { validateFieldsAndScroll } = form;
        validateFieldsAndScroll((errors, values) => {
            if (errors) return;

            dispatch({ type: 'login/login', payload: values });
        })
    }

    render() {
        const { form, loading } = this.props;
        const { getFieldDecorator } = form;

        return (
            <div className={styles.form}>
                <div className={styles.logo}>
                    <img alt="logo" src={config.logo} />
                    <span>{config.name}</span>
                </div>
                <form>
                    <FormItem hasFeedback>
                        {getFieldDecorator('username', {
                            rules: [{ required: true, },],
                        })(<Input onPressEnter={this.handleOkClick} placeholder="Username" />)}
                    </FormItem>
                    <FormItem hasFeedback>
                        {getFieldDecorator('password', {
                            rules: [{ required: true, },],
                        })(<Input type="password" onPressEnter={this.handleOkClick} placeholder="Password" />)}
                    </FormItem>
                    <Row>
                        <Button type="primary" onClick={this.handleOkClick} loading={loading.effects.login}>Sign in</Button>
                        <p>
                            <span>Username：guest</span>
                            <span>Password：guest</span>
                        </p>
                    </Row>
                </form>
            </div>
        )
    }
}

Login.propTypes = {
    form: PropTypes.object,
    dispatch: PropTypes.func,
    loading: PropTypes.object,
}

function mapStateToProps({ loading }) {
    return { loading };
}

export default connect(mapStateToProps)(Form.create()(Login))
