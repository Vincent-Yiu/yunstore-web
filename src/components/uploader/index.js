import React from "react"
import "./index.css"
import SparkMD5 from "spark-md5"
import Uploader from "simple-uploader.js"
import { Icon } from 'antd'
export default class FileUploader extends React.Component {
    constructor() {
        super();
        this.state = {
            fileList: [],
            progress: {},
            showDialog: false,
        }
        this.running = false;
    }
    componentDidMount() {
        // console.log(SparkMD5.hashBinary("hello"));
        this.initUploader();
    }
    initUploader = () => {
        this.uploader = new Uploader({
            // target: '/api/photo/redeem-upload-token', 
            target: global.host + '/upload',
            // query: { upload_token: 'my_token' }
            chunkSize: 1024 * 1024 * 10,
            allowDuplicateUploads: true,
            testChunks: true,
            checkChunkUploadedByResponse: this.getMissChunk,
            progressCallbacksInterval: 200,
        })
        this.uploader.assignBrowse(document.getElementById('uploader'))


        this.uploader.on('fileAdded', (file, event) => {
            this.computeMD5(file)
            return true;
        })

        this.uploader.on('fileProgress', (rootFile, file) => {
            // Handle progress for both the file and the overall upload
            document.getElementById("progress" + file.name).innerHTML = (file.progress() === 1 ? "上传成功" : (Math.floor(file.progress() * 100) + "%  "
                + Uploader.utils.formatSize(file.averageSpeed) + '/s '))
            let p = new Array();

            p[file.name] = Math.floor(file.progress() * 100);
            this.setState({ progress: p })
            this.setState({ speed: rootFile.averageSpeed })
            // document.getElementById('bar').style.width = Math.floor(this.uploader.progress() * 100) + '%'

        })
        this.uploader.on('filesSubmitted', (files, fileList) => {
            this.setState({ showDialog: true })
            let appendFileList = this.state.fileList;
            console.log(appendFileList.concat(fileList))
            this.setState({ fileList: appendFileList.concat(fileList) })
            this.uploader.upload();
        });
        this.uploader.on("fileRemoved", (file) => {
            console.log(file.name + ' removed')
            let newFileList = this.state.fileList.filter((curItem) => {
                if (curItem === file)
                    return false;
                return true;
            })
            this.setState({ fileList: newFileList })
        })

        this.uploader.on("complete", () => {
            this.props.handleAdd();
        })
    }

    computeMD5 = (file) => {
        var blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice,
            chunkSize = 1024 * 1024 * 10,                           // 以每片2MB大小来逐次读取
            chunks = Math.ceil(file.size / chunkSize),
            currentChunk = 0,
            spark = new SparkMD5(),    //创建SparkMD5的实例
            fileReader = new FileReader();

        file.pause();
        loadNext()
        fileReader.onload = (e) => {
            console.log("md5:Read chunk number: " + (currentChunk + 1) + "of " + chunks);
            spark.appendBinary(e.target.result);                 // append array buffer
            currentChunk += 1;
            if (currentChunk < chunks) {
                loadNext();
            } else {
                let md5 = spark.end();
                console.log("compute md5 loading! " + md5);
                file.uniqueIdentifier = md5
                file.identifier=md5
                file.resume();
            }

        };

        fileReader.onerror = function () {
            console.log("something went wrong");
        };

        function loadNext() {
            var start = currentChunk * chunkSize,
                end = start + chunkSize >= file.size ? file.size : start + chunkSize;

            fileReader.readAsBinaryString(blobSlice.call(file.file, start, end));
        }
        // file.resume()
    }

    //判断缺失块  返回false时，该chunk上传
    getMissChunk = (chunk, message) => {
        // console.log(message)
        let msg = JSON.parse(message)
        //文件已存在 不上传
        if (msg.status.value === 100) {
            console.log(chunk.file.name + " exist")
            alert("文件已存在")
            return true;
        }

        //文件不存在 上传整个
        if (msg.status.value === 101) {
            // console.log(chunk.file.name + " not exist  try chunk:" + chunk.offset)
            return false
        }

        //上传缺失块
        let missChunkArray = msg.data
        if (missChunkArray.indexOf(chunk.offset - 1) > -1)
            return false;
        else
            return true;
    }
    //转换大小
    renderSize = (value) => {
        if (null === value || value === '') {
            return "0 Bytes";
        }
        var unitArr = new Array("Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB");
        var index = 0,
            srcsize = parseFloat(value);
        index = Math.floor(Math.log(srcsize) / Math.log(1024));
        var size = srcsize / Math.pow(1024, index);
        //  保留的小数位数
        size = size.toFixed(2);
        return size + unitArr[index];
    }
    render() {
        const listItem = (
            <table style={{ width: '100%', tableLayout: "fixed" }}>
                <colgroup>
                    <col className='file-name-th'></col>
                    <col className='file-size'></col>
                    <col className='file-path'></col>
                    <col className='file-status'></col>
                    <col className='file-op'></col>
                </colgroup>
                <thead>
                    <tr>
                        <th>文件名</th>
                        <th>文件大小</th>
                        <th>文件路径</th>
                        <th>进度</th>
                        <th>操作</th>
                    </tr>
                </thead>
                <tbody >
                    {this.state.fileList.map((item, index) => {
                        return (
                            <tr key={index}>
                                <td className="file-name">
                                    {item.file.name}
                                </td>
                                <td >
                                    {this.renderSize(item.file.size)}
                                </td>
                                <td >
                                    in
                                </td>

                                <td>
                                    <span id={"progress" + item.name} className="file-progress" style={{ width: '60px' }}>
                                    </span>
                                    <span id="hi" className="speed">
                                    </span>
                                </td>
                                <td>
                                    <span id={"resume" + index} style={{ display: "none" }} onClick={() => { item.resume(); document.getElementById("resume" + index).style.display = "none"; document.getElementById("pause" + index).style.display = "inline"; }}>
                                        <Icon type="play-circle" />
                                    </span>
                                    <span id={"pause" + index} onClick={() => { item.pause(); document.getElementById("resume" + index).style.display = "inline"; document.getElementById("pause" + index).style.display = "none"; }}>
                                        <Icon type="pause" />
                                    </span>

                                    <span onClick={() => { item.cancel() }} style={{ marginLeft: "5px" }}>
                                        <Icon type="delete" />
                                    </span>
                                </td>
                            </tr>)
                    })}
                </tbody>
            </table>
        )

        const pannel = (
            <div className="upload-dialog" id="upload-dialog" >
                <div className="dialog-header" style={{ display: "block" }}>
                    <span className="dialog-header-title" >
                        文件上传
                    </span>
                    <div className="dialog-control">
                        <span className=" dialog-close">
                            <span onClick={() => this.setState({ showDialog: false })}>×
                        </span>
                        </span>
                        <span className=" dialog-min ">
                            <span >-</span>
                        </span>
                    </div>
                </div>


                <div className="uploader-list-wrapper">

                    <div className="uploader-list">
                        {listItem}
                    </div>
                </div>

            </div>
        )
        return (
            <div >
                <button id="uploader" className='upload-button'>文件上传</button>
                {/* <div className='uploader-progress '>
                    <div className="progress-container">
                        <div id="bar" className="progress-bar">
                        </div>
                    </div>
                </div> */}
                <div style={{ width: '800px' }}>
                    {this.state.showDialog ? pannel : null}
                </div>
            </div>
        )
    }
}