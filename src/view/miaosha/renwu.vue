<template>
  <div class="renwu boxright">
    <div class="filter-container">
      <div class="filter-item" style="margin-right:20px;">
        <el-button type="primary" @click="linktoadd(0)">
          <i class="el-icon-circle-plus"></i> 增加任务
        </el-button>
      </div>
    </div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row>
      <el-table-column label="编码" align="center" prop="Code">
         <template slot-scope="scope">
          <span v-text="setcode(scope.row.Code)"></span>
        </template>
      </el-table-column>
      <el-table-column label="名称" align="center" prop="Name"></el-table-column>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="linktoadd(scope.row)">
            <i class="el-icon-edit"></i>
          </el-button>
          <el-button size="mini" type="danger" @click="handledel(scope.row)" >
            <i class="el-icon-delete"></i>
          </el-button>
        </template>
      </el-table-column>
    </el-table> 
    
    <el-dialog :title="titles" :visible.sync="dialogVisible" :close-on-click-modal="false" width="500px">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item label="编码" prop="Code" style="width:500px">          
          <el-select
            v-model="temp.Code"
            placeholder="选择编码"
            clearable
            style="width: 150px"
            class="filter-item"
          >
            <el-option v-for="item in Model" :label="item.Text" :value="item.Value" :key="item.Value"></el-option>
          </el-select> 
        </el-form-item>
        <el-form-item label="名称" prop="Name">
          <el-input v-model="temp.Name" placeholder="请填写任务名称"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="createData">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import request from "@/utils/request";

export default {
  name: "renwu",
  data() {
    return {
      Model:[],
      listLoading:false,
      dialogVisible:false,
      titles:'',
      temp:{
        Id:0,
        Code:'',//任务编码
        Name:''//名称
      },
      list:[],
      iscreat:false,
      rules: {
        Code: [
          { required: true, message: "编码必须选择！", trigger: "blur" }
        ],
        Name: [
          { required: true, message: "名称必须填写！", trigger: "blur" }
        ],
      },   
    };
  },
  created() {
    this.getdata();
  },
  methods: {
    setcode(code){
      for(let i in this.Model){
        if(this.Model[i].Value == code){
          return this.Model[i].Text;
        }
      }
    },
    getdata(){
      this.listLoading=true;
      request({
        url: "Mission/GetMissionList",
        method: "get",
        params:{}
      }).then(response => {
        if (response.Status==1) {   
          this.listLoading=false;
          this.list=response.List;  
          this.Model=response.DDL;
        }            
      });
    },
    linktoadd(row){
      if(row==0){
        this.titles='增加任务';
        this.temp.Id=0;
        this.temp.Code='';
        this.temp.Name='';
        this.iscreat=true;
      }else{
        this.titles='修改任务';
        this.temp.Id=row.Id;
        this.temp.Code=row.Code.toString();
        this.temp.Name=row.Name;
        this.iscreat=false;
      };
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
      this.dialogVisible=true;
    },
    handledel(row) {
      var data = this.$qs.stringify({ Id: row.Id});
      this.$confirm("确定要删除该任务吗？", "提示", {
        dangerouslyUseHTMLString: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(() => {
          request({
            url: "Mission/DelMission",
            method: "post",
            data
          }).then(response => {
            if (response.Status==1) {
              const index = this.list.indexOf(row);
              this.list.splice(index, 1);
              this.$message({
                message: response.Msg,
                type: "success"
              });
            }
          });
        })
        .catch(() => {});
    },
    createData(){      
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          var data = this.$qs.stringify(this.temp);
          request({
            url: "Mission/SetMission",
            method: "post",
            data
          }).then(response => {
            if (response.Status==1) { 
              if(this.iscreat){
                let param={
                  Id:response.AId,
                  Code:this.temp.Code,
                  Name:this.temp.Name
                }     
                this.list.push(param);              
              }else{
                for(let i in this.list){
                  if (this.list[i].Id == this.temp.Id){
                    this.list[i].Name=this.temp.Name;
                    this.list[i].Code=this.temp.Code;
                    break;
                  }  
                }          
              }
              this.$bus.$emit("renwuchange");
              this.dialogVisible = false
              this.$message({
                message: response.Msg,
                type: 'success'
              })
            }            
          });
        }
      });
    },
  }
};
</script>
<style lang="scss" rel="stylesheet/scss">

</style>
