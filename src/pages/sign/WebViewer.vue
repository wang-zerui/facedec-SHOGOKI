<template>
  <div>
    <a-upload
      name="file"
      accept=".pdf"
      :data="uploadData"
      :action="uploadUrl"
      @change="handleChange"
      :beforeUpload="beforeUpload"
    >
      <a-button> <a-icon type="upload" /> 上传新的pdf </a-button>
    </a-upload>
    <p>{{newPdf}}</p>
    <a-button @click="saveSignedPdfToServer">上传签名后pdf</a-button>
    <p>{{signedPdf}}</p>
    <div ref="viewer"></div>
  </div>
</template>

<script>
/* eslint-disable */
import WebViewer from '@pdftron/pdfjs-express'
import FileSaver from 'file-saver'
import ExpressUtils from '@pdftron/pdfjs-express-utils'

export default {
  name: 'WebViewer',
  props: {
    path: String,
    url: String,
    filename: {
      type: String,
      default: "myfile"
    },
  },
  data(){
    return{
      // 定义这个instance
      instance: null,
      RESERVED_BUTTONS_INDEX: [3,6,7,8,9,15],
      downloading: false,
      // 直接用这个URL就行，这个是我们写的上传函数，部署到阿里云了
      uploadUrl: "https://upload-java-face-casluoiosh.cn-hangzhou.fcapp.run",
      newPdf: "待上传，这里会展示URL",
      signedPdf: "待上传，这里会展示url",
      uploadData: {}
    }
  },
  methods: {
    beforeUpload(file){
      this.uploadData = {
        "filename": file.name
      }
      return true;
    },
    handleChange(info) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        this.$message.success(`${info.file.name} file uploaded successfully`);
        console.log("info",info)
        this.newPdf = info.file.response.url;
      } else if (info.file.status === 'error') {
        this.$message.error(`${info.file.name} file upload failed.`);
      }
    },
    async uploadNewPdf(){
      const hide = this.$message.loading("保存中...")
      const fileData = await this.instance.docViewer.getDocument().getFileData({});
      const blob = new Blob([fileData], {type: 'application/pdf'});

      const data = new FormData();
      data.append('file', blob);
      data.append('filename', "upload.pdf");
      const result = await fetch(this.uploadUrl, {
        method: "post",
        body: data
      })
      .then(res => res.json)
      const { code, url } = result;
      if(code != 0) return null; 
      hide();
      console.log(url)
      this.newPdf = url;
    },
    async saveSignedPdfToServer(){
      const filename = "signedPdf.pdf"

      
      const utils = new ExpressUtils();
      const hide = this.$message.loading("保存中...")
      const xfdf = await this.instance.annotManager.exportAnnotations({});
      const fileData = await this.instance.docViewer.getDocument().getFileData({});
      console.log(typeof fileData)
      // Set the annotations and document into the Utility SDK, then merge them together
      const resp = await utils
        .setFile(fileData)
        .setXFDF(xfdf)
        .merge();
      console.log(resp)
      // Get the resulting blob from the merge operation
      const mergedBlob = await resp.getBlob();
      const data = new FormData();
      data.append('file', mergedBlob);
      data.append('filename', filename);
      const result = await fetch(this.uploadUrl, {
        method: "post",
        body: data
      })
      .then(res => res.json())
      console.log(result)
      const { code, url } = result;
      if(code != 0) return null; 
      hide();
      this.signedPdf = url;
      return url;
    },
  },
  mounted: function () {
        let that = this;
        WebViewer({
            disableFlattenedAnnotations: true,
            path: this.path,
            initialDoc: this.url, // replace with your own PDF file
          }, this.$refs.viewer).then((instance) => {
            // NOTE: 注意保留这个instance
            that.instance = instance;
            const utils = new ExpressUtils();

            instance.setHeaderItems(header => {
              console.log(header.getItems())
              const items = header.getItems().filter((value, index) => {
                
                if(index == 15){
                  delete value.hidden
                }
                return that.RESERVED_BUTTONS_INDEX.indexOf(index)>=0
              });
              // console.log(header.getItems())
              header.update(items)
              header.push({
                type: 'actionButton',
                title: "下载文件",
                img: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/></svg>',
                onClick: async () => {
                  const hide = that.$message.loading("下载中...")
                  const xfdf = await instance.annotManager.exportAnnotations({});
                  const fileData = await instance.docViewer.getDocument().getFileData({});

                  // Set the annotations and document into the Utility SDK, then merge them together
                  const resp = await utils
                    .setFile(fileData)
                    .setXFDF(xfdf)
                    .merge();

                  // Get the resulting blob from the merge operation
                  const mergedBlob = await resp.getBlob();

                  // trigger a download for the user!
                  FileSaver.saveAs(mergedBlob, `${that.filename}.pdf`)
                  hide;
                }
              });
            });
        });

      }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
div {
  width: 100%;
  height: 100vh;
}
</style>
