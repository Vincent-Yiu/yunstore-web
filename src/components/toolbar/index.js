import React from 'react'
import SearchBar from '../searchbar'
import FileUploader from '../uploader'
import emitter from "../../utils/event";
import './index.css'
export default class ToolBar extends React.Component {
    
    handleDelete=()=>{
        emitter.emit('handledelete','deleteSelected');
    }
    fetchData=()=>{console.log('click')}
    render() {
        return (
            <div className='toolbar'>
                <FileUploader handleAdd={this.props.handleAdd}></FileUploader>
                <button className='delete-button' style={{ display: 'none' }} onClick={this.handleDelete}>删除</button>
                <SearchBar ></SearchBar>
            </div>
        )
    }
}