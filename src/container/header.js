import React from 'react';
import { Icon, Layout } from 'antd'
import './header.css'
const { Header } = Layout;
export default class Top extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Header className='header'>
                <div className='header-text'>YunStore</div>
                <div className='header-item'>
                    <Icon type="user" style={{ verticalAlign: 'middle' }} /> &nbsp;
                    {/* {this.props.match.params.username}    &nbsp;&nbsp;&nbsp;&nbsp; */}
                        jim    &nbsp;&nbsp;&nbsp;&nbsp;
                    <label onClick={() => { localStorage.removeItem('auth'); this.props.history.push('/') }}>
                        <Icon type="logout" style={{ verticalAlign: 'middle' }} /> 注销
                    </label>
                </div>
            </Header>
        )
    }
}