import { Layout, Menu, Breadcrumb, Icon } from 'antd';
import {withRouter} from "react-router-dom";

import React from 'react';
import 'antd/dist/antd.css';
import './view.css';
const { Header, Content, Footer, Sider } = Layout;

class View extends React.Component {
  constructor(props)
  {
    super(props);
    let type=localStorage.getItem('type');
    this.state = {
      collapsed: false,
      positon:(type===null|type==='all'?'全部文件':(type==='img')?'图片':(type==='doc')?'文档':'回收站'),
      filetype:(type===null|type==='all'?'all':(type==='img')?'img':(type==='doc')?'doc':'trash'),
      showpicture:true,
    };
  } 
  onCollapse = collapsed => {
    this.setState({ collapsed });
  };

  render() {
    return (
      <Layout  style={{minHeight: '100vh' }}>
        <Header className='header'>
            <div className='header-text'>YunStore</div>
            <div className='header-item'>
              <Icon type="user" style={{verticalAlign:'middle'}}/> 
              {/* {this.props.match.params.username}    &nbsp;&nbsp;&nbsp;&nbsp; */}
              <label  onClick={()=>{localStorage.removeItem('auth');this.props.history.push('/')}}>
              <Icon type="logout" style={{verticalAlign:'middle'}}/> 注销
              </label>
            </div>
        </Header>
        <Layout>
        <Sider theme='dark' collapsible collapsed={this.state.collapsed} onCollapse={this.onCollapse}>
          {/* <div className="logo" /> */}
          <Menu theme='dark' mode="inline">
            <Menu.Item className="customclass"  key="1">
                <a  onClick={()=>{this.props.history.push("/all");localStorage.setItem("type","all");this.setState({positon:'全部文件',filetype:'all'})}} >
                <Icon type="file" style={{verticalAlign:'baseline',fontSize:'18px'}}/>
                <span style={{fontSize:'18px'}}>全部文件</span>
                </a>
            </Menu.Item>
            <Menu.Item className="customclass" key="2">
                <a onClick={()=>{ this.props.history.push("/image");localStorage.setItem("type","img");this.setState({positon:'图片',filetype:'img'});}}>
                <Icon type="picture" theme="filled" style={{verticalAlign:'baseline',fontSize:'18px'}}/>
                <span style={{fontSize:'18px'}}>图片</span>
                </a>
            </Menu.Item>
            <Menu.Item className="customclass" key="3">
                <a  onClick={()=>{this.props.history.push("/document");localStorage.setItem("type","doc");this.setState({positon:'文档',filetype:'doc'})}}>
                <Icon type="file-text" theme="filled" style={{verticalAlign:'baseline',fontSize:'18px'}}/>
                <span style={{fontSize:'18px'}}>文档</span>
                </a>
            </Menu.Item><Menu.Item className="customclass" key="4">
                <a  onClick={()=>{this.props.history.push("/trash");localStorage.setItem("type","trash");this.setState({positon:'回收站',filetype:'trash'})}}>
                <Icon type="rest" theme="filled" style={{verticalAlign:'baseline',fontSize:'18px'}}/>
                <span style={{fontSize:'18px'}}>回收站</span>
                </a>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout>
          <Content style={{ padding:'20px',background: '#fff'}}>
            {/* <div className='breadcontainer'> */}
            <Breadcrumb className='breadcrumb'>
              <Breadcrumb.Item>Yunstore</Breadcrumb.Item>
              <Breadcrumb.Item>{this.state.positon}</Breadcrumb.Item>
            </Breadcrumb>
            {/* </div> */}
            <div>
                {/* <div className='buttoncontainer'> */}
                {/* </div> */}
                <div id='data'>
                    {/* {this.state.filetype==='img'?<ShowPicture></ShowPicture>:<EditableFormTable filetype={this.state.filetype}></EditableFormTable>} */}
                </div>
            </div>
          </Content>
          <Footer style={{height:'48px',textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
        </Layout>
        </Layout>
      </Layout>
    );
  }
}
class ViewAll extends React.Component
{
  render()
  {
    return <View type='all'></View>
  }
}
class ViewImg extends React.Component
{
  render()
  {
    return <View type='img'></View>
  }
}
class ViewDoc extends React.Component
{
  render()
  {
    return <View type='doc'></View>
  }
}
export  default withRouter(View);