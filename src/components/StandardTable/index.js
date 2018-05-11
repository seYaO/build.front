import React, { PureComponent, Fragment } from 'react'
import { Table, Alert } from 'antd'
import styles from './style.less'

class StandardTable extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            selectedRowKeys: [],
        };
    }

    componentWillReceiveProps(nextProps) {
        const { selectedRows } = nextProps;
        const selectedRowKeys = selectedRows.map(item => item.id)

        this.setState({
            selectedRowKeys,
        });
    }

    handleRowSelectChange = (selectedRowKeys, selectedRows) => {
        if (this.props.onSelectRow) {
            this.props.onSelectRow(selectedRows);
        }

        this.setState({ selectedRowKeys });
    }

    handleTableChange = (pagination, filters, sorter) => {
        this.props.onChange(pagination, filters, sorter);
    }

    cleanSelectedKeys = () => {
        this.handleRowSelectChange([], []);
    }

    render() {
        const { selectedRowKeys } = this.state;
        const { list, pagination, loading, columns, bordered = false, rowSelectionShow = true, paginationShow = true, scrollX = 800 } = this.props;

        const paginationProps = {
            showSizeChanger: true,
            showQuickJumper: true,
            ...pagination,
        };

        const rowSelection = {
            selectedRowKeys,
            onChange: this.handleRowSelectChange,
            getCheckboxProps: record => ({
                disabled: record.disabled,
            }),
        };

        return (
            <div className={styles.standardTable}>
                {
                    rowSelectionShow
                    &&
                    <div className={styles.tableAlert}>
                        <Alert
                            message={(
                                <Fragment>
                                    已选择 <a style={{ fontWeight: 600 }}>{selectedRowKeys.length}</a> 项&nbsp;&nbsp;
                                <a onClick={this.cleanSelectedKeys} style={{ marginLeft: 24 }}>清空</a>
                                </Fragment>
                            )}
                            type="info"
                            showIcon
                        />
                    </div>
                }
                <Table
                    loading={loading}
                    rowKey="id"
                    bordered={bordered}
                    scroll={{ x: scrollX }}
                    rowSelection={rowSelectionShow ? rowSelection : null}
                    dataSource={list}
                    columns={columns}
                    pagination={paginationShow ? paginationProps : false}
                    onChange={this.handleTableChange}
                />
            </div>
        )
    }
}

export default StandardTable;
