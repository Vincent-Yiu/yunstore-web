import React from 'react';
import { Upload, Icon,Modal,Button  } from 'antd';
import 'antd/dist/antd.css';
import '../config'
import axios from 'axios';
// Axios.defaults.withCredentials = true;

function getBase64(file) 
    {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result);
          reader.onerror = error => reject(error);
        });
      }
class FileUpload extends React.Component
{
    fileCount;
    constructor(props)
    {
        super(props);
        this.handleCancel=this.handleCancel.bind(this);
        this.handleChange=this.handleChange.bind(this);
        this.handlePreview=this.handlePreview.bind(this);
        this.state = {
            visible:false,
            previewVisible: false,
            previewImage: '',
            fileList:[]
        }
    }
    handleCancel()
    {
        this.setState({ previewVisible: false });
    }
    handlePreview = async file => {
          if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
          }
      
          this.setState({
            previewImage: file.url || file.preview,
            previewVisible: true,
          });
        };
    formData=new FormData();
    handleUpload=()=>
    {
      axios({
        url:global.url+'/upload',
        method: 'post',
        data:this.formData,
        type: 'json',
      }
      ).then((res)=>{
        let str="";
        console.log(res.data['data'])
        for(let s of res.data['data'])
          str+=s+"\n";
        if(str!=="")
          alert(str+"文件已存在");
        
        this.formData.delete('files[]');
        this.props.func();    //reload
        
      })
    }
    handleChange = ({ file,fileList,event }) => {
      this.setState({ fileList },()=>{this.fileCount= this.state.fileList.length;
      
      })
      
      this.formData.append('files[]', file);
      console.log(this.formData.getAll('files[]').length+" "+fileList.length)
      if(this.formData.getAll('files[]').length===fileList.length)
      {
        console.log("try upload");
        this.handleUpload();
      }
      /*
      if(file['status']==='done')
      {
        this.props.func();    //reload
        console.log(file['response']);
      }*/
    };
    
    render() 
    {
          const { previewVisible, previewImage, fileList } = this.state;
          
          const { Dragger } = Upload;
          // let formData=new FormData();

          const fileinput=(
            <div className="clearfix">
              <Dragger
                action={global.url+"/upload"}
                listType="picture-card"
                fileList={fileList}
                onPreview={this.handlePreview}
                onChange={this.handleChange}
                multiple={true}
                withCredentials={true}
                beforeUpload={file => {
                  /*this.setState(state => ({
                    fileList: [...state.fileList, file],
                  }));*/
                  // formData.append('files[]', file);
                  // console.log(this.fileCount);
                  return false;
                }}
              >
                {/* {fileList.length >= 8 ? null : uploadButton} */}
                <p className="ant-upload-drag-icon">
                    <Icon type="inbox" />
                </p>
                <p className="ant-upload-text">单击或拖动文件到此区域进行上传</p>
                <p className="ant-upload-hint">
                支持单个或批量上传
                </p>
              </Dragger>
              <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                <img alt="example" style={{ width: '100%' }} src={previewImage} />
              </Modal>
            </div>
          )
          return (
            <div>
                <Button type="primary" ghost size={'large'} onClick={()=>{this.setState({visible:true})}}>
                上传文件
                </Button>
                <Modal
                  title="Basic Modal"
                  visible={this.state.visible}
                  // onOk={this.handleOk}
                  footer={null}
                  onCancel={()=>{this.setState({visible:false})}}
                  destroyOnClose={true}
                  afterClose={()=>{this.setState({fileList:[]})}}
                >
                {fileinput}
                </Modal>
            </div>            
          );
        }
      
    
}

export default FileUpload