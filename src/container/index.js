import React from 'react';
import { Layout, Menu, Breadcrumb, Icon } from 'antd';
import { Link } from 'react-router-dom'

import Top from './header'
import menus from '../config/menu'
import Contents from './content'

import './index.css'

const { Footer, Sider } = Layout;

export default class Container extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            collapsed: false,
            position: localStorage.getItem('position') == null ? menus[0].name : localStorage.getItem('position'),
        }
    }
    onCollapse = collapsed => {
        this.setState({ collapsed });
    };

    render() {
        return (
            <Layout style={{ minHeight: '100vh' }}>
                <Top></Top>
                <Layout>
                    <Sider theme='dark' collapsible collapsed={this.state.collapsed} onCollapse={this.onCollapse} collapsedWidth='80px'>
                        <Menu theme='dark' mode="inline">
                            {menus.map(menu => {
                                return (
                                    <Menu.Item key={menu.name} style={{ fontSize: "18px" }}>
                                        <Link to={menu.url} onClick={() => { localStorage.setItem('position', menu.name); this.setState({ position: localStorage.getItem('position') }) }}>
                                            <Icon type={menu.icon} theme="filled" style={{ verticalAlign: 'baseline', fontSize: '18px' }} />
                                            {menu.name}
                                        </Link>
                                    </Menu.Item>
                                )
                            })}

                        </Menu>
                    </Sider>
                    <Layout style={{ background: '#fff' }}>
                        <Breadcrumb className='breadcrumb'>
                            <Breadcrumb.Item>Yunstore</Breadcrumb.Item>
                            <Breadcrumb.Item>{this.state.position}</Breadcrumb.Item>
                        </Breadcrumb>
                        <Contents style={{ padding: '10px', background: '#fff' }}>
                        </Contents>
                        <Footer style={{ height: '48px', textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
                    </Layout>
                </Layout>
            </Layout>
        );
    }
}