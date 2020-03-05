import React from 'react'
import { Input } from 'antd'
import './index.css'
import emitter from "../../utils/event";

export default class SearchBar extends React.Component {
    
    handleSearch = (searchText) => {
        emitter.emit('handlesearch',searchText);
    }
    render() {
        return <Input.Search className='searchbar' placeholder="搜索文件名" onSearch={this.handleSearch} allowClear></Input.Search>
    }
}