import { ContentState, convertToRaw, EditorState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';


const RichTextEdtor = (props: any,ref: React.Ref<unknown>) => {
    const [editorState, setEditorState] = useState(EditorState.createEmpty())
    // const [html,setHtml] = useState<string>()
    const {detail} = props

    // 这个功能有问题 怎么又可以了！@！
    const uploadImageCallBack = (file:any)=> {   
        return new Promise(
          (resolve, reject) => {
            const xhr = new XMLHttpRequest();
            // 上传图片的接口
            xhr.open('POST', 'http://localhost:5000/manage/img/upload');
            const data = new FormData();
            // 数据键值对
            data.append('image', file);
            xhr.send(data);
            // 成功时候调用
            xhr.addEventListener('load', () => {
              const response = JSON.parse(xhr.responseText);
            //   得到图片地址
              const url = response.data.url
            //   这里格式要注意
              resolve({data:{link: url}});
            });
            xhr.addEventListener('error', () => {
              const error = JSON.parse(xhr.responseText);
              reject(error);
            });
          }
        );
      }

    // 如果editor有值

   useEffect(() => {
       const html = props.detail
        if(html){
            const contentBlock:any = htmlToDraft(html)
            if(contentBlock) {
                const contentState = ContentState.createFromBlockArray(contentBlock)
                const editorState = EditorState.createWithContent(contentState)
                setEditorState(editorState)
            }
        }
   }, [detail]) 

    // 使得父组件能使用子组件方法 获取detail
    useImperativeHandle(ref, () => ({
        // 返回标签格式字符串 即数据库需要的数据
        getDetail: () => draftToHtml(convertToRaw(editorState?.getCurrentContent() ))
    }))
 
    // 输入过程中 实施回调
    const onEditorStateChange = (eState:EditorState)=>{
        setEditorState(eState)
    }
    return(
    <>
        <Editor
            editorState={editorState}
            // // 输入过程中 实施回调
            onEditorStateChange={onEditorStateChange}
            // 通过类名写样式
            // editorClassName="editor-class"
            /* 通过style指定样式 */
            editorStyle={{border: '1px solid black', minHeight: 200, paddingLeft:10}}
            /* toolbarStyle={<toolbarStyleObject>} */
            // 工具栏配置
            // 上传图片默认只支持url地址形式 
            toolbar={{
                image: {uploadCallback: uploadImageCallBack, alt:{present: true, mandatory: true}}
            }}
        />
        
    </>

    )
}

export default forwardRef(RichTextEdtor)
