import React from 'react';
import axios from 'axios';
import '../../config'
import { Table, Input, InputNumber, Popconfirm, Form, Divider} from 'antd';
import './index.css';
import Preview from '../preview'
import qs from 'qs'
import emitter from "../../utils/event";

axios.defaults.withCredentials = true;
const host = global.host;


const EditableContext = React.createContext();
class EditableCell extends React.Component {
  getInput = () => {
    if (this.props.inputType === 'number') {
      return <InputNumber />;
    }
    return <Input />;
  };

  renderCell = ({ getFieldDecorator }) => {
    const {
      editing,
      dataIndex,
      title,
      inputType,
      record,
      index,
      children,
      ...restProps
    } = this.props;
    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item style={{ margin: 0 }}>
            {getFieldDecorator(dataIndex, {
              rules: [
                {
                  required: true,
                  message: `Please Input ${title}!`,
                },
              ],
              initialValue: record[dataIndex],
            })(this.getInput())}
          </Form.Item>
        ) : (
            children
          )}
      </td>
    );
  };

  render() {
    return <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>;
  }
}

class Antdtable extends React.Component {
  constructor(props) {
    super(props);
    // this.props.onRef(this)
    this.state = {
      displayData: [],
      loading: false,
      scroll: {},
      editingKey: '',
      previewVisible: false,
      previewFile: '',
      searchText: '',
      selectedRowKeys: [],
    };
    this.data = [];
    this.selectedRowKeys = [];
    this.source = axios.CancelToken.source() //生成取消令牌用于组件卸载阻止axios请求
  }
  componentDidMount() {
    this.fetch()
    this.eventEmitter = emitter.addListener('handlesearch', (searchText) => {
      this.onSearch(searchText)
    });
    this.eventEmitter = emitter.addListener('handledelete', (deleteSelected) => {
      this.deleteSelected()
    });
  }

  componentWillUnmount() {
    this.source.cancel('组件卸载,取消请求');
    this.setState = (state, callback) => {
      return
    }
    this.eventEmitter.removeListener('handlesearch',()=>{})
    this.eventEmitter.removeListener('handledelete',()=>{})
  }

  componentDidUpdate(prevProps) {
    // 典型用法（不要忘记比较 props）：
    if (this.props.filetype !== prevProps.filetype) {
      // this.typeFilter(this.props.filetype);
      // this.setState({type:this.props.filetype});
      this.fetch();
      this.setState({ selectedRowKeys: [] })
    }
  }

  handleDownload(record) {
    const url = host + '/download?filename=' + record.filename;
    const a = document.createElement('a')
    a.setAttribute('href', url)
    a.click();
  }

  handleDelete(record) {
    const id = record.id;
    axios({
      url: host + '/delete',
      method: 'post',
      params: {
        id: id,
      },
      type: 'json',
    }
    ).then(() => {
      const data = [...this.state.displayData];
      this.setState({ displayData: data.filter(item => item.id !== record.id) });
      this.data = data.filter(item => item.id !== record.id);
    }).catch((e) => {
      console.log(e);
    })
  }
  handleAdd = () => {
    this.fetch();
  }

  //编辑框
  edit(key) {
    this.setState({ editingKey: key });
  }
  isEditing = record => record.id === this.state.editingKey;

  cancel = () => {
    this.setState({ editingKey: '' });
  };

  save(form, record) {
    form.validateFields((error, row) => {
      if (error) {
        return;
      }
      const newData = [...this.state.displayData];
      const index = newData.findIndex(item => record.id === item.id);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        this.setState({ displayData: newData, editingKey: '' });
      } else {
        newData.push(row);
        this.setState({ displayData: newData, editingKey: '' });
      }
      axios({
        url: host + '/rename',
        method: 'post',
        params: {
          id: record.id,
          filename: row.filename,
        },
        type: 'json',
      }).then(res => {
        console.log(res);
      })
    });
  }

  showPreview = (record) => {
    this.setState({
      previewVisible: true,
      previewFile: record.filename
    })
  }

  hidePreview = () => {
    this.setState({ previewVisible: false })
  }

  handleRecover = (record) => {
    axios({
      url: host + '/recover',
      method: 'post',
      params: {
        id: record.id,
      },
      type: 'json',
    }).then(res => {
      this.fetch();
    })
  }

  action = (text, record) => {
    const { editingKey } = this.state;
    const editable = this.isEditing(record);
    return (
      <span>
        <Popconfirm title="确定删除?" onConfirm={() => this.handleDelete(record)} okText='确认' cancelText='取消'>
          <a href="javascript:;">删除</a>
        </Popconfirm>
        <Divider type="vertical" />
        {this.props.filetype !== 'trash' ? (<span>
          <a href="javascript:;" onClick={() => this.handleDownload(record)} >下载</a>
          <Divider type="vertical" />
          <a href="javascript:;" onClick={() => this.showPreview(record)}>预览</a>
          <Divider type="vertical" />
          {editable ? (
            <span>
              <EditableContext.Consumer>
                {form => (
                  <a
                    onClick={() => this.save(form, record)}
                    style={{ marginRight: 8, color: '#faad14' }}
                  >
                    保存
              </a>
                )}
              </EditableContext.Consumer>
              <a style={{ color: '#faad14' }} onClick={() => this.cancel(record.id)}>取消</a>
            </span>) : (
              <a href="javascript:;" disabled={editingKey !== ''} onClick={() => this.edit(record.id)}>
                重命名
            </a>)}
        </span>) :
          (<a href="javascript:;" onClick={() => this.handleRecover(record)}>恢复</a>)
        }
      </span>
    )
  }

  columns = [
    {
      title: '文件名',
      dataIndex: 'filename',
      key: 'filename',
      sorter: true,
      width: '20%',
      editable: true,
    },
    {
      title: '上传时间',
      dataIndex: 'uploadtime',
      key: 'uploadtime',
      // editable: true,
      width: '20%',
    },
    {
      title: '文件类型',
      // editable: true,
      dataIndex: 'type',
      key: 'type',
      // width: '20%',
    },
    {
      title: '文件大小',
      dataIndex: 'size',
      // editable: true,
      key: 'size',
      // width: '20%',
    },
    {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      render: (text, record) =>
        this.state.displayData.length >= 1 ? this.action(text, record)
          : null,
    },
  ];

  fetch() {
    this.setState({ loading: true });
    axios({
      url: host+'/data',
      method: 'post',
      type: 'json',
      params: {
        type: this.props.filetype,
      },
      cancelToken: this.source.token
    }).then(res => {
      this.data = res.data;
      this.setState({
        displayData: res.data,
        loading: false,
        scroll: (res.data.length > 13 ? { y: 600 } : {})
      });
    }).catch((e) => {
      console.log(e);
    });
  };

  onSearch = (searchText) => {
    const filterData = this.data.filter(({ filename }) => {
      filename = filename.toLowerCase();
      return filename.includes(searchText)
    });
    this.setState({ displayData: filterData });
  }


  deleteSelected = () => {
    axios({
      url: host + '/deleteselect',
      method: 'post',
      params: { ids: this.state.selectedRowKeys },
      type: 'json',
      paramsSerializer: function (params) {
        return qs.stringify(params, { arrayFormat: 'repeat' })
      }
    }).then(() => {
      this.setState({ selectedRowKeys: [] })
      this.fetch();
    }).catch((e) => {
      this.setState({ selectedRowKeys: [] })

      console.log(e);
    })
  }
  render() {
    const components = {
      body: {
        cell: EditableCell,
      },
    };
    const columns = this.columns.map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          inputType: 'text',
          dataIndex: col.dataIndex,
          title: col.title,
          editing: this.isEditing(record),
        }),
      };
    });
    const { selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: (selectedRowKeys, selectedRows) => {
        if (selectedRowKeys.length > 0)
          document.getElementsByClassName('delete-button')[0].style = 'display:block'
        else
          document.getElementsByClassName('delete-button')[0].style = 'display:none'
        this.setState({ selectedRowKeys });
      }
    };
    return (
      <div>
        <EditableContext.Provider value={this.props.form}>
          <Table
            components={components}
            columns={columns}
            rowKey={record => record.id}
            // rowKey={(record, index) => index}
            dataSource={this.state.displayData}
            loading={this.state.loading}
            // onChange={this.handleTableChange}
            pagination={false}
            bordered
            size="middle"
            scroll={this.state.scroll}
            // rowClassName="editable-row"
            rowSelection={rowSelection}
          />
        </EditableContext.Provider>
        <Preview visible={this.state.previewVisible} filename={this.state.previewFile} hideModal={this.hidePreview}></Preview>

      </div>
    );
  }
}
const EditableFormTable = Form.create()(Antdtable);

export default EditableFormTable;