import { Route } from 'react-router-dom'
import React from 'react'
import './content.css'
import Loadable from 'react-loadable'

import { Layout } from 'antd';
const { Content } = Layout;
const Loading = () => <div>Loading...</div>

const Home=Loadable({
    loader: () => import('../pages/home'),
    loading: Loading
})
const Picture=Loadable({
    loader: () => import('../pages/picture'),
    loading: Loading
})
const Document=Loadable({
    loader: () => import('../pages/document'),
    loading: Loading
})
const Video=Loadable({
    loader: () => import('../pages/video'),
    loading: Loading
})
const Trash=Loadable({
    loader: () => import('../pages/trash'),
    loading: Loading
})

const Contents = () => (
    <Content className="content" id="content">
        <Route exact path='/' component={Home}/>
        <Route path='/home' component={Home}/>
        <Route path='/picture' component={Picture}/>
        <Route path='/document' component={Document}/>
        <Route path='/video' component={Video}/>
        <Route path='/trash' component={Trash}/>
    </Content>
)
export default Contents;