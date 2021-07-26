<template>
  <div class="prizeset boxright">
     <el-form
        ref="datawuliu"
        :rules="ruleswuliu"
        :model="temp1"
        label-position="left"
        label-width="0"
        style="width: 350px;"
      >        
        <el-form-item label="" prop="filepath">          
          <el-upload
              class="upload-demo"
              drag
              ref="upload"
              accept=".xls,.xlsx"
              action=""
              :http-request="upLoad"
              >
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
              <div class="el-upload__tip" slot="tip">只能上传xls文件</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="subwuliu">确定</el-button>
      </div>
  </div>
</template>
<script>
import request from "@/utils/request";
import upfile from '@/utils/upload';
export default {
  name: "prizeset",
  data() {
    return {
      temp1:{
        filepath:''
      },
      ruleswuliu:{  
        filepath: [
          { required: true, message: "请上传文件！", trigger: "blur" }
        ]
      }
    };
  },
  created() {
  },
  methods: {   
    upLoad(param){
         upfile(param.file,'Upload/UploadFile',(data => {
             if(data.Status){
                 this.temp1.filepath=data.Path;
             }else{
                 this.$message({
                    message: data.Msg,
                    type: "error"
                });
             };
         }))
    }, 
    subwuliu(){
      this.$refs["datawuliu"].validate(valid => {
        if (valid) { 
          var param={
              filepath:this.temp1.filepath
          };  
          var data = this.$qs.stringify(param);
          request({
            url: "MoneyTree/WhiteList/Upload",
            method: "post",
            data
          }).then(response => {
            if (response.Status==1) {
              this.$message({
                message: response.Msg,
                type: "success"
              });
            }
          });
        }
      });
    }, 
  }
};
</script>
<style lang="scss" rel="stylesheet/scss">
.prizeset .wuliuinfo li{list-style: none; line-height:22px; margin-bottom: 10px; display: flex;}
.prizeset .wuliuinfo span{color: #999; margin-right: 10px; width: 145px;}
.prizeset .text-red{margin-left: 20px; color: #f00;}
</style>
