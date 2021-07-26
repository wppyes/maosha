<template>
  <div class="addproduct boxright">
    <div class="back">
      <span @click="backto">
        <i class="el-icon-arrow-left"></i>返回
      </span>
    </div>
    <el-form
      ref="dataForm"
      :rules="rules"
      :model="temp"
      label-position="left"
      label-width="150px"
      style="width: 800px; margin-left:20px;"
    >
         
      <el-form-item label="类型" prop="Title" style="width:500px">
        <el-select
          v-model="temp.Type"
          placeholder="选择类型"
          clearable
          style="width: 150px"
          class="filter-item"
        >
          <el-option v-for="item in Product" :label="item.Text" :value="item.Value" :key="item.Value"></el-option>
        </el-select>
        <el-select
          v-model="temp.Difference"
          placeholder="选择类型"
          clearable
          style="width: 150px"
          class="filter-item"
        >
          <el-option v-for="item in Difference" :label="item.Text" :value="item.Value" :key="item.Value"></el-option>
        </el-select>
      </el-form-item>  
      <el-form-item label="产品名称" prop="Title" style="width:500px">
        <el-input v-model="temp.Title" placeholder="请填写产品名称" />
      </el-form-item>
      <el-form-item label="封面图：" prop="Cover">
        <el-upload
          class="avatar-uploader"
          ref="upload"
          :show-file-list="false"
          accept=".jpg, .png"
          action
          :http-request="upLoad"
        >
          <img v-if="temp.Cover" :src="temp.Cover" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        <div class="chicun">尺寸：170*170</div>
      </el-form-item>
      <el-form-item label="产品主图：" prop="Images">
        <el-upload
          class="avatar-uploader"
          ref="upload1"
          :show-file-list="false"
          accept=".jpg, .png"
          action
          :http-request="upload1"
        >
          <img v-if="temp.Images" :src="temp.Images" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        <div class="chicun">尺寸：640*460</div>
      </el-form-item>
        <el-form-item label="描述" prop="Desc" style="width:800px">
          <el-input type="textarea" v-model="temp.Desc" placeholder="请填写描述" />
        </el-form-item>
      <div>
        <el-form-item label="详情" prop="Contents" style="width:1100px">
          <!-- <el-input v-model="temp.Contents" placeholder="请填写详情" /> -->
          <!-- <textarea id="myEditor" style="width:100%;"></textarea> -->
          <Tinymce ref="editor" v-model="temp.Contents" :key="tinymceFlag" :height="500" /> 
        </el-form-item>
      </div>
    </el-form>
    <el-button type="primary" style="margin-left:170px" @click="createData">确定</el-button>
  </div>
</template>
<script>
import request from "@/utils/request";
import upfile from "@/utils/upload1";

import Tinymce from '@/components/Tinymce/index1';
export default {
  name: "addproduct",
  components: { Tinymce},
  data() {
    return {
      Model: [{
        Text:'页面跳转',
        Value:1
      },{
        Text:'跳转2',
        Value:2
      }],
      temp: {
        Id: 0,
        Title: "", //名称
        Cover: "", //活动图片
        Images: "", //主图
        Contents: "", //详情
        Desc:'',//描述
        Type:'',//类型
        Difference:'',
      },
      editor: null,
      tinymceFlag:1,
      rules: {
        Type: [{ required: true, message: "选择类型！", trigger: "blur" }],
        Difference: [{ required: true, message: "选择类型！", trigger: "blur" }],
        Title: [
          { required: true, message: "产品名称必须填写！", trigger: "blur" }
        ],
        Cover: [
          { required: true, message: "产品图片必须上传！", trigger: "change" }
        ],
        Images: [{ required: true, message: "产品主图必须上传！", trigger: "blur" }],
        Contents: [
          { required: true, message: "详情必须填写！", trigger: "blur" }
        ],
        Desc: [
          { required: true, message: "描述必须填写！", trigger: "change" }
        ],
      },
      Difference:[],
      Product:[]
    };
  },
  created() {
    this.temp.Id = this.$route.query.id;
    this.getdll();    
    if(this.temp.Id==0){
      this.temp.Title='';
      this.temp.Cover = '';
      this.temp.Images = '';
      this.temp.Contents = '';
      this.temp.Desc = '';
      this.temp.Type = '';
      this.temp.Difference='';
    }  
  },
  mounted() {
    if(this.$route.query.id>0){      
      this.getdata();
    }else{
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    } 
  },
  methods: {
    getdll(){
      request({
        url: "AProduct/DDL",
        method: "get",
        params: {}
      }).then(response => {
        if (response.Status == 1) {
          this.Product=response.Product;
          this.Difference=response.Difference;
        }
      });
    },
    getdata() {
      request({
        url: "Product/GetProduct",
        method: "get",
        params: { id: this.temp.Id }
      }).then(response => {
        if (response.Status == 1) {
          this.temp.Title = response.Model.Title;
          this.temp.Cover = response.Model.Cover;
          this.temp.Images = response.Model.Images;
          this.temp.Contents = response.Model.Contents;
          this.temp.Desc = response.Model.Desc;
          this.temp.Type = response.Model.Type.toString();
          this.temp.Difference = response.Model.Difference.toString();
          this.$refs.editor.setContent(response.Model.Contents);  
          this.$nextTick(() => {
            this.$refs['dataForm'].clearValidate()
          })
        }
      });
    },
    upLoad(param) {
      upfile(param.file, "Upload/Upload?folder=ASpare", data => {
        if (data.Status) {
          this.temp.Cover = data.Path;
        } else {
          this.$message({
            message: data.Msg,
            type: "error"
          });
        }
      });
    },
    upload1(param) {
      upfile(param.file, "Upload/Upload?folder=ASpare", data => {
        if (data.Status) {
          this.temp.Images = data.Path;
        } else {
          this.$message({
            message: data.Msg,
            type: "error"
          });
        }
      });
    },
    backto() {
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
      this.$router.go(-1);
    },
    createData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          var data = this.$qs.stringify(this.temp);
          request({
            url: "Product/SetProduct",
            method: "post",
            data
          }).then(response => {
            if (response.Status == 1) {  
              this.$bus.$emit("productchange");
              this.$message({
                message: response.Msg,
                type: "success"
              });
              if(this.temp.Id==0){
                this.temp.Title='';
                this.temp.Cover = '';
                this.temp.Images = '';
                this.temp.Contents = '';
                this.temp.Desc = '';
                this.temp.Type = '';
                this.temp.Difference='';
                this.$refs.editor.setContent('');
              }  
              this.backto();
            }
          });
        }
      });
    },
  }
};
</script>
<style lang="scss" rel="stylesheet/scss">
.addproduct {
  .chicun {
    color: #f00;
  }
  .ql-container {
    height: 180px;
  }
}
</style>
