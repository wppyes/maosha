<template>
  <div class="DrawPrize boxright">
    <div class="filter-container">
      <div class="filter-item" style="margin-right:20px;">
        <el-button type="primary" @click="handleadd('增加广告',true)">
          <i class="el-icon-circle-plus"></i> 增加广告
        </el-button>
      </div>  
    </div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row>
      <el-table-column label="图片" align="center" width="80px">
        <template slot-scope="scope">
          <img :src="scope.row.Img+'?imageView2/1/w/50/h/50'" class="PrizeImg">
        </template>
      </el-table-column>
      <el-table-column label="链接" align="center" prop="Url"></el-table-column>
      <el-table-column label="操作" align="center" width="200px">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="handleditor(scope.row,'修改广告',false)">
            <i class="el-icon-edit"></i> 编辑
          </el-button>
          <el-button size="mini" type="danger" @click="handledel(scope.row)">
            <i class="el-icon-delete"></i> 删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>   
    <el-dialog :title="dialogStatus" :visible.sync="dialogFormVisible" :close-on-click-modal="false" width="600px">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="100px"
        style="width: 500px; margin-left:50px;"
      >        
        <el-form-item label="图片" prop="Img">
          <div class="video">
            <el-upload
              class="avatar-uploader"
              ref="upload"
              :show-file-list="false"
              accept=".jpg, .png"
              action
              :http-request="upLoad"
            >
              <img v-if="temp.Img" :src="temp.Img" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </div>
        </el-form-item>
        <el-form-item label="链接" prop="Url">
          <el-input placeholder="请输入链接" v-model="temp.Url"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="createData">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import request from "@/utils/request";
import upfile from "@/utils/upload";
export default {
  name: "DrawPrize",
  data() {
    return {
      list: [], //列表
      total:0,//门店总数量
      listLoading: false, //列表加载
      dialogStatus:'',//弹框标题
      dialogFormVisible:false,//是否展示弹框
      iscreate:true,//是否是增加
      temp:{
        Id:0,
        Url:'',
        Img:'',
      }, 
      rules:{  
        Img:[
          { required: true, message: "请上传图片", trigger: "blur" }
        ],
        Url:[
          { required: true, message: "请填写链接", trigger: "blur" }
        ],
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList(){
      this.listLoading = true;
      request({
        url: "MoneyTree/Advert/GetAdvertList",
        method: "get",
        params: {}
      }).then(response => {
        if (response.Status == 1) {
          this.list = response.List;
          this.listLoading = false;
        }
      });
    },
    upLoad(param) {
      upfile(param.file, "Upload/Upload?folder=MoneyTree", data => {
        if (data.Status) {
          this.temp.Img = data.Path;
        } else {
          this.$message({
            message: data.Msg,
            type: "error"
          });
        }
      });
    },
    handleadd(title,creat){
      this.temp.Id=0;
      this.temp.Img='';
      this.temp.Url='';
      this.dialogStatus = title;
      this.dialogFormVisible = true;
      this.iscreate = creat;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },   
    handleditor(row, title, creat) {
      this.temp.Id=row.Id;
      this.temp.Img=row.Img;
      this.temp.Url=row.Url;
      this.dialogStatus = title;
      this.dialogFormVisible = true;
      this.iscreate = creat;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    createData(){
      this.$refs["dataForm"].validate(valid => {
        if (valid) { 
          var param={
              Id:this.temp.Id,
              Img:this.temp.Img,
              Url:this.temp.Url
          };     
          var data = this.$qs.stringify(param);
          request({
            url: "MoneyTree/Advert/SetAdvert",
            method: "post",
            data
          }).then(response => {
            if (response.Status==1) {
              if(this.iscreate){
                param.Id=response.AId;
                this.list.push(param);
              }else{
                for (let i in this.list) {
                    if (this.list[i].Id == param.Id) {
                        this.list[i].Img = this.temp.Img;
                        this.list[i].Url = this.temp.Url;
                    };
                };
              }                   
              this.dialogFormVisible = false;
              this.$message({
                message: response.Msg,
                type: "success"
              });
            }
          });
        }
      });
    },    
    handledel(row) {
      var data = this.$qs.stringify({ Id: row.Id });
      this.$confirm("确定要删除吗？", "提示", {
        dangerouslyUseHTMLString: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(() => {
          request({
            url: "MoneyTree/Advert/DelAdvert",
            method: "post",
            data
          }).then(response => {
            if (response.Status==1) {
              this.$message({
                message: response.Msg,
                type: "success"
              });
              const index = this.list.indexOf(row);
              this.list.splice(index, 1);
            }
          });
        })
        .catch(() => {});
    },
  }
};
</script>
<style lang="scss" rel="stylesheet/scss">
.DrawPrize {
  .PrizeImg{width:40px; height:40px;}
}
</style>
