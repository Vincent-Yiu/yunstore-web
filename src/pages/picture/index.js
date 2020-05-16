import React from 'react';
import EditableFormTable from '../../components/table/'
import ToolBar from '../../components/toolbar'
import '../common.css'
export default class Index extends React.Component {
    
    onRef=(ref)=>{
        this.child=ref;
    }
    handleAdd=(e)=>{
        this.child.handleAdd();
    }
    render() {
        return (
            <div>
                {/* <ToolBar handleAdd={this.handleAdd}></ToolBar> */}
                <EditableFormTable wrappedComponentRef={(form) => this.child = form} filetype='img'></EditableFormTable>
            </div>
        )
    }
}