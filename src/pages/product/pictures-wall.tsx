import { Upload, Modal, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { forwardRef, ReactElement, ReactNode, useEffect, useImperativeHandle, useState } from 'react';
import { UploadFile } from 'antd/lib/upload/interface';
import { reqDeleteImg } from '../../api';
import { Iimg } from '../../typings';
// 用于图片上传的组件

interface Iprops{
  children?: ReactNode
  getImgs?: Function
  imgs?:Iimg[]
}

const PicturesWall= (props:Iprops,pwRef:any):ReactElement => {
    const {imgs} = props
    const [previewVisible,setPreviewVisivle] = useState(false) //表示是否显示预览
    const [previewImage,setPreviewImage] = useState('') //预览大图的url
    const [previewTitle,setPreviewTitle] = useState('')
    const [fileList,setFileList] = useState<UploadFile[]>()
    const [initImgs,setInitImgs] = useState([])
      const getImgs = ()=> fileList
          // 使得父组件能使用子组件方法 获取detail
    useImperativeHandle(pwRef, () => ({
      // 返回标签格式字符串 即数据库需要的数据
      getImgs
  }))
      

   

      const getBase64= (file:any) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result);
          reader.onerror = error => reject(error);
        });
      }
      
    //   隐藏modal
      const handleCancel = () => setPreviewVisivle(false)
    
      const handlePreview = async(file:any) => {
        if (!file.url && !file.preview) {
          file.preview = await getBase64(file.originFileObj);
        }
        // file.preview是base64 使得没上传也能预览
        setPreviewImage(file.url || file.preview,)
        setPreviewVisivle(true)
        setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1))
      };
  
      const handleChange = async(obj:any) => {
          const{file,fileList} = obj
          console.log(1);
          
          console.log(file);
          
        //   注意 file中没有url 得在response中取
    // name: "3.jpg"
    // percent: 0
    // size: 103627
    // status: "uploading"
    // type: "image/jpeg"
    // uid: "rc-upload-1640328085060-20"
        // 一定上传成功 修正url 且数据库的name 不是3.jpg 注意
        if(file.status === 'done'){
            const result = file.response // 因为是done 其实下面已经成功不可能失败 
            console.log('1'+file);
            console.log(file.response);   
            
            
            if(result.status === 0){
                message.success('上传图片成功！')
                const {url,name} = result.data
                file.url = url
                file.name = name
            }else{
                message.error('上传图片失败！')
            }
        }else if(file.status === 'removed'){//界面删除完成，数据库的还在
          
          const result = await reqDeleteImg(file.name)
          console.log(file.name);
          
          console.log(result);
          // 一直删除失败，不知道现在是不是会自动删了 奇怪
          if(result.status === 0){
            message.success('成功删除图片')
          }else{
            message.error('删除图片失败')
          }

        }
        //在操作过程中更新filelist 
        setFileList(fileList)
      } ;
    
        const uploadButton = (
          <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
          </div>
        );
        // 设置初始图片
        useEffect(() => {
          if(imgs && imgs?.length>0){
             let iImgs = imgs.map( (img,index)=> ({
              uid: -index + '',
              name: img+'',
              status: 'done',
              url: img.url
    
            }) ) 
            setInitImgs(iImgs)
            // console.log(initImgs);
          }
        }, [imgs])
        useEffect(() => {
          setFileList(initImgs)
        }, [initImgs])
    
    return (
        <>
          <Upload
        //   上传图片接口地址
            action="http://localhost:5000/manage/img/upload"
            // 限制文件类型 为图片
            accept='image/*'
            //上传图片的样式 text 等
            listType="picture-card"
            // 发送到后台的文件参数名 默认file, 接口需要image
            name='image'
            // 所有已上传图片文件的数组
            fileList={fileList}
            // 显示预览
            onPreview={handlePreview}
            onChange={handleChange} 
          >
            {fileList?.length >= 6 ? null : uploadButton}
          </Upload>
          <Modal
            visible={previewVisible}
            title={previewTitle}
            footer={null}
            onCancel={handleCancel}
          >
            <img alt="example" style={{ width: '100%' }} src={previewImage} />
          </Modal>
        </>
    )
}

export default forwardRef(PicturesWall)
