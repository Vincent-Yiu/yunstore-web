import React from 'react'
import { Modal } from 'antd';
import '../config/config'
const mimeTypes = {
    '.css': 'text/css',
    '.gif': 'image/gif',
    '.html': 'text/html',
    '.ico': 'image/x-icon',
    '.jpeg': 'image/jpeg',
    '.jpg': 'image/jpeg',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.pdf': 'application/pdf',
    '.png': 'image/png',
    '.svg': 'image/svg+xml',
    '.swf': 'application/x-shockwave-flash',
    '.tiff': 'image/tiff',
    '.txt': 'text/plain',
    '.wav': 'audio/x-wav',
    '.wma': 'audio/x-ms-wma',
    '.wmv': 'video/x-ms-wmv',
    '.xml': 'text/xml',
    '.xls': 'application/vnd.ms-excel'
};
class Preview extends React.Component {
    constructor(props) {
        super(props)
        this.state = { visible: this.props.visible }
    }

    handleShow = () => {
        this.setState({ visible: true })
    }
    handleHide = () => {
        this.props.hideModal();
    }
    render() {
        let url = global.host + "/" + this.props.filename+'#toolbar=0';
        // let url = 'file:E:/data/'+ this.props.filename;
        let ext = "." + url.replace(/.+\./, "");
        let mime = mimeTypes[ext];

        return (
            <div>
                <Modal
                    visible={this.props.visible}
                    onCancel={this.handleHide}
                    destroyOnClose={true}
                    footer={null}
                    mask={false}
                    centered={true}
                    closable={false}
                    // bodyStyle={{ width: '600px',height:'400px' }}
                //   maskTransitionName={'zoom'}
                //   transitionName={'zoom'}
                >
                    <object data={url}
                        type={mime}
                        width="100%"
                        height="400px"
                        standby="加载中..."
                    >
                        不支持该文件格式.
        </object>
                    {/* <iframe src={url} style={{width:'100%',height:'400px'}} frameborder="0" allowfullscreen></iframe> */}


{/* <iframe src="https://arxiv.org/ftp/arxiv/papers/2001/2001.09612.pdf#toolbar=0" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true"> </iframe> */}
                </Modal>
            </div>
        )


    }
}

export default Preview