<template>
  <div class="addnavactive boxright">
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
      <el-form-item label="活动名称" prop="Name" style="width:500px">
        <el-input v-model="temp.Name" placeholder="请填写活动名称" />
      </el-form-item>
      <el-form-item label="活动图片：" prop="Cover">
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
      <el-form-item label="跳转类型" prop="JumpType" style="width:500px">          
        <el-select
          v-model="temp.JumpType"
          placeholder="选择跳转类型"
          clearable
          style="width: 150px"
          class="filter-item"
        >
          <el-option v-for="item in Model" :label="item.Text" :value="item.Value" :key="item.Value"></el-option>
        </el-select> 
      </el-form-item>
      <el-form-item label="跳转连接" prop="Link" style="width:500px">
        <el-input v-model="temp.Link" placeholder="请填写跳转连接" />
      </el-form-item>
      <div>
        <el-form-item label="描述" prop="Contents" style="width:800px">
          <!-- <el-input v-model="temp.Contents" placeholder="请填写跳转连接" /> -->
          <textarea id="myEditor" style="width:100%;"></textarea>
        </el-form-item>
      </div>
    </el-form>
    <el-button type="primary" style="margin-left:170px" @click="createData">确定</el-button>
  </div>
</template>
<script>
import request from "@/utils/request";
import upfile from "@/utils/upload";

export default {
  name: "addnavactive",
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
        Name: "", //名称
        Cover: "", //活动图片
        Link: "", //规则
        JumpType:'',
        Contents: "", //描述
      },
      editor: null,
      rules: {
        Name: [
          { required: true, message: "活动名称必须填写！", trigger: "blur" }
        ],
        Cover: [
          { required: true, message: "活动图片必须上传！", trigger: "change" }
        ],
        JumpType: [{ required: true, message: "跳转类型必须选择！", trigger: "blur" }],
        Link: [
          { required: true, message: "跳转链接必须填写！", trigger: "change" }
        ],
        Contents: [
          { required: true, message: "描述必须填写！", trigger: "blur" }
        ],
      },
    };
  },
  created() {
    this.temp.Id = this.$route.query.id;
  },
  mounted() {
    UE.delEditor("myEditor");
    this.editor = UE.getEditor("myEditor", {
      toolbars: [
        [
          "fullscreen",
          "source",
          "|",
          "undo",
          "redo",
          "|",
          "bold",
          "italic",
          "underline",
          "fontborder",
          "fontfamily",
          "fontsize",
          "strikethrough",
          "|",
          "superscript",
          "subscript",
          "removeformat",
          "formatmatch",
          "autotypeset",
          "blockquote",
          "pasteplain",
          "|",
          "forecolor",
          "backcolor",
          ,
          "simpleupload",
          "insertimage",
          "|",
          "justifyleft",
          "justifyright",
          "justifycenter",
          "justifyjustify",
          "cleardoc"
        ]
      ],
      initialFrameHeight: 400
    });
    
  },
  activated () {
    if (this.$route.query.id > 0) {
      this.getdata();
    } else {
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    }
　},
  destroyed() {
    //销毁后，第一次和切换路由后都能加载出来
    this.editor.destroy();
  },
  methods: {
    getdata() {
      request({
        url: "ASpare/GetASpare",
        method: "get",
        params: { id: this.temp.Id }
      }).then(response => {
        if (response.Status == 1) {
          this.temp.Name = response.Model.Name;
          this.temp.Cover = response.Model.Cover;
          this.temp.Link = response.Model.Link;
          this.temp.JumpType = response.Model.JumpType;
          this.temp.Contents = response.Model.Contents;
          this.editor.ready(() => {
            this.editor.setContent(response.Model.Contents);
          });
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
    backto() {
      this.temp.Name = '';
      this.temp.Cover = '';
      this.temp.Link = '';
      this.temp.JumpType = '';
      this.temp.Contents = '';
      this.$router.go(-1);
    },
    createData() {
      this.temp.Contents = this.editor.getContent();
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          var data = this.$qs.stringify(this.temp);
          request({
            url: "ASpare/SetASpare",
            method: "post",
            data
          }).then(response => {
            if (response.Status == 1) {  
              this.$bus.$emit("navactivechange");
              this.$message({
                message: response.Msg,
                type: "success"
              });
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
.addnavactive {
  .chicun {
    color: #f00;
  }
  .ql-container {
    height: 180px;
  }
}
</style>
