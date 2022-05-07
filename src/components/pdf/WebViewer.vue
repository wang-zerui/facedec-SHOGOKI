<template>
  <div>
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
    }
  },
  data(){
    return{
      RESERVED_BUTTONS_INDEX: [6,7,8,9,15],
      downloading: false,
    }
  },
  methods: {
    saveToServer(){

    }
  },
  mounted: function () {
        let that = this;
        WebViewer({
            disableFlattenedAnnotations: true,
            path: this.path,
            initialDoc: this.url, // replace with your own PDF file
          }, this.$refs.viewer).then((instance) => {
            console.log(instance)
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
