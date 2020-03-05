import React from 'react';
import {Popconfirm,List,Icon,Checkbox} from 'antd';
import axios from 'axios';
import './showpicture.css'
const url=global.url+'/data';

class ShowPicture extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state={
            data:[],
            loading: false,
            hasMore: true,
            checkboxHidden:[],
        }
    }
    componentDidMount()
    {
        /*let data=[];
        for(let i=1;i<100;i++)
        {
            data.push({
                fileid:119,
                filename:+(i%4+1)+".gif",
                src:"http://127.0.0.1:8080/filedata/"+(i%4+1)+".gif",
            })
        }
        this.setState({data:data});*/
        this.fetch();
    }

    fetch=()=> {
        this.setState({ loading: true });
        axios({
          url: url,
          method: 'post',
          type: 'json',
          params:{
            type:'img',
          },
          }).then(res => {
            console.log(res.data)
            this.setState({
                data:res.data,
                loading: false,
            });
        }).catch((res)=>{
          console.log(res);
        });
    }; 

    handleDownload=(item)=>
    {
        // e.stopPropagation();
        console.log(item.filename);
        // return;
        
        const url=global.url+'/download?filename='+item.filename;
        const a = document.createElement('a')
        a.setAttribute('href', url)
        a.click();
    }
    handleEdit=(item)=> {
        console.log(item.fileid);
        // return;
        axios({
          url:global.url+'/rename',
          method: 'post',
          params: {
            fileid:item.fileid,
            filename:this.inputValue.value,
          },
          type: 'json',
        }).then(res=>{
          console.log(res);
          this.fetch();
        })
        
    }

    handleDelete=(item)=>
    {
      
      axios({
        url:global.url+'/delete',
        method: 'post',
        params: {
          fileid:item.fileid,
        },
        type: 'json',
      }
      ).then((res)=>{
        console.log(res);
        this.fetch();
      }).catch((res)=>{
        console.log(res);
      })
    }

    render()
    {
        const displayList=(
            <div style={{height:600}}>
            <Checkbox.Group className='scroll-container' onChange={(checkedValues)=>{console.log(checkedValues)}}>
            <List 
            grid={{
              gutter: 10,
              // column:4,
              xs: 1,
              sm: 2,
              md: 4,
              lg: 4,
              xl: 5,
              xxl: 8,
            }}
            dataSource={this.state.data}
            renderItem={item => (
                <List.Item style={{width:'156px',border:'1px solid red' }}
                    actions={ [
                    <Popconfirm
                        title="确定删除吗?"
                        icon={<Icon type="delete" />}
                        onConfirm={()=>this.handleDelete(item)}
                        // onCancel={cancel}
                        okText="确认"
                        cancelText="取消"
                    >
                    <Icon type="delete" key="delete" />
                    </Popconfirm>,

                    <Popconfirm
                        title={<input ref={input => this.inputValue = input} className="rename_input" defaultValue={item.filename}></input>}
                        icon={<Icon type="edit" />}
                        onConfirm={()=>this.handleEdit(item)}
                        // onCancel={cancel}
                        okText="确认"
                        cancelText="取消"
                    >
                    <Icon type="edit" key="edit" />
                    </Popconfirm>,

                    <Icon type="download" key="download" onClick={()=>this.handleDownload(item)} />,
                  ]}>
                    <div onMouseOver={()=>{document.getElementById(''+item.fileid).style.display = "block";}} onMouseLeave={()=>{document.getElementById(''+item.fileid).style.display = "none";}} style={{width:'156px',height:'156px',position:'relative'}}>
                    <img   src={global.url+item.url+item.filename} alt="example"  onFocus={()=>{console.log(item.fileid)}}></img>
                    <div id={''+item.fileid}  style={{display:'none'}}>
                    <Checkbox   value={item.fileid} ></Checkbox>
                    </div>
                    </div>
                </List.Item>
            )}
            >
            </List>
            </Checkbox.Group>
            </div>
        )
        // return <h1>hello</h1>;
        return (
          <div>
          <div style={{padding:10, display:'inline-block'}}>
          </div>
          {displayList}
          </div>
          )
    }
}
export default ShowPicture;