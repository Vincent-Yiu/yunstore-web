import React from 'react';
import axios from 'axios';
import '../../config/config'
import { Table, Input, InputNumber, Popconfirm, Form, Divider } from 'antd';
import './index.css';
import Preview from '../preview'
import qs from 'qs'
import emitter from "../../utils/event";
import { postRequest, getRequest } from "../../utils/remote";
import SearchBar from '../searchbar'
import FileUploader from '../uploader'
import {dateFormatter} from '../../utils/formatter'

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
    this.eventEmitter.removeListener('handlesearch', () => { })
    this.eventEmitter.removeListener('handledelete', () => { })
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

  /**
   * 下载文件
   * @param {*} record 
   */
  handleDownload(record) {
    var url=host+'/resource/download.do?filename='+record.filename;
    var a = document.createElement('a')
    a.setAttribute('href', url)
    a.click();
    
  }

  /**
   * 删除一条数据项
   * @param {*} record 
   */
  handleDelete(record) {
    var url = "/resource/delete";
    postRequest(url, record)
      .then(() => {
        const data = [...this.state.displayData];
        this.setState({ displayData: data.filter(item => item.id !== record.id) });
        this.data = data.filter(item => item.id !== record.id);
      }).catch((e) => {
        console.log(e);
      })
  }

  /**
   * 上传文件后 拉取数据
   */
  handleAdd = () => {
    this.fetch();
  }

  //编辑框
  edit(key) {
    this.setState({ editingKey: key });
  }
  isEditing = record => record.id === this.state.editingKey;

  /**
   * 取消编辑
   */
  cancel = () => {
    this.setState({ editingKey: '' });
  };

  /**
   * 文件重命名保存
   * @param {*} form 
   * @param {*} record 
   */
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
      record.filename = row.filename;
      postRequest("/resource/update", record)
        .then(res => {
        })
    });
  }

  /**
   * 显示预览
   */
  showPreview = (record) => {
    this.setState({
      previewVisible: true,
      previewFile: record.filename
    })
  }

  /**
   * 隐藏预览
   */
  hidePreview = () => {
    this.setState({ previewVisible: false })
  }

  /**
   * 回收站恢复
   */
  handleRecover = (record) => {
    var url = "/resource/recover";
    postRequest(url, record)
      .then(() => {
        this.fetch();
      }).catch((e) => {
        console.log(e);
      })
  }

  /**
   * 操作栏选项
   */
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
      dataIndex: 'uploadTime',
      key: 'uploadTime',
      // editable: true,
      render:function(text,record,index){return dateFormatter(text)},
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

  /**
   * 拉取数据
   */
  fetch() {
    this.setState({ loading: true });

    var url = "/resource/list";
    var params = {'type':this.props.filetype};
    console.log(params)
    getRequest(url, params)
      .then((res) => {
        this.data = res.rows;
        this.setState({
          displayData: this.data,
          loading: false,
          scroll: (this.data.length > 13 ? { y: 600 } : {})
        });
      });
  }


  /**
   * 按文件名搜索
   */
  handleSearch = (searchText) => {
    const filterData = this.data.filter(({ filename }) => {
      filename = filename.toLowerCase();
      return filename.includes(searchText)
    });
    this.setState({ displayData: filterData });
  }

  /**
   * 删除所选项
   */
  handleDeleteSelected = () => {
    var url = '/resource/deleteSelected';
    var params = { ids: this.state.selectedRowKeys };
    console.log(params);
    postRequest(url, params)
      .then(res => {
        this.setState({ selectedRowKeys: [] })
        this.fetch();
      })
      .catch((e) => {
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
        <div className='toolbar'>
          <FileUploader handleAdd={this.handleAdd}></FileUploader>
          <button className='delete-button' style={{ display: 'none' }} onClick={this.handleDeleteSelected}>删除</button>
          <SearchBar handleSearch={this.handleSearch}></SearchBar>
        </div>

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