<template>
  <div class="renwu boxright">
    
    <div class="back">
      <span @click="backto">
        <i class="el-icon-arrow-left"></i>返回
      </span>
    </div>
    <div class="filter-container">
      <div class="filter-item" style="margin-right:20px;">
        <el-button type="primary" @click="linktoadd">
          <i class="el-icon-circle-plus"></i> 新增用户
        </el-button>
        <el-input
          placeholder="请输入用户id"
          v-model="search.userid"
          style="width: 150px;"
          clearable
        />  
        <el-button type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>   
        <el-button type="primary" icon="el-icon-edit" @click="handleup">批量上传UserId</el-button>   

      </div>
    </div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row>
      <el-table-column label="UserId" align="center" prop="UserId"></el-table-column>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="danger" @click="handledel(scope.row)" >
            <i class="el-icon-delete"></i>
          </el-button>
        </template>
      </el-table-column>
    </el-table> 
        
    <pagination
      small
      layout="prev, pager, next"
      :total="total"
      :page.sync="search.pageIndex"
      :limit.sync="search.pageSize"
      @pagination="getdata"
    />
    <el-dialog :title="titles" :visible.sync="dialogVisible" :close-on-click-modal="false" width="500px">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item label="UserId" prop="UserId">
          <el-input v-model="temp.UserId" placeholder="请填写UserId"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="createData">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="批量上传UserId" :visible.sync="dialogwuliuVisible" :close-on-click-modal="false" width="650px">
      <el-form
        ref="datawuliu"
        :rules="ruleswuliu"
        :model="temp1"
        label-position="left"
        label-width="100px"
        style="width: 350px; margin-left:50px;"
      >        
        <el-form-item label="文件上传" prop="filepath">          
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
        <el-button @click="dialogwuliuVisible = false">取消</el-button>
        <el-button type="primary" @click="subwuliu">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import request from "@/utils/request";
import Pagination from "@/components/Pagination";
import upfile from '@/utils/upload';

export default {
  name: "renwu",
  components: { Pagination },
  data() {
    return {
      Model:[],
      listLoading:false,
      dialogVisible:false,
      titles:'',
      total:0,
      search:{
        pageIndex:1,
        pageSize:15,
        activity:'',
        userid:''
      },
      temp1:{
        activity:'',
        filepath:''
      },
      temp:{
        Activity:0,
        UserId:'',
      },
      dialogwuliuVisible:false,
      list:[],
      iscreat:false,
      rules: {
        UserId: [
          { required: true, message: "用户编号必须填写！", trigger: "blur" }
        ],
      },   
      ruleswuliu:{  
        filepath: [
          { required: true, message: "请上传文件！", trigger: "blur" }
        ]
      }
    };
  },
  created() {    
    this.search.activity=this.$route.query.id;
    this.temp.Activity=this.$route.query.id;
    this.temp1.activity=this.$route.query.id;
    this.getdata();
  },
  methods: {   
    backto() {
      this.$router.go(-1);
    },
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
              filepath:this.temp1.filepath,
              activity:this.temp1.activity
          };  
          var data = this.$qs.stringify(param);
          request({
            url: "ARoster/UploadRoster",
            method: "post",
            data
          }).then(response => {
            if (response.Status==1) {
              this.getdata();    
              this.dialogwuliuVisible = false;
              this.$message({
                message: response.Msg,
                type: "success"
              });
            }
          });
        }
      });
    },  
    handleup(){
      this.dialogwuliuVisible=true;
      this.temp1.filepath='';
      this.$nextTick(() => {
        this.$refs["datawuliu"].clearValidate();
      });
    }, 
    handleFilter(){
      this.search.pageIndex=1;
      this.getdata();
    },
    getdata(){
      this.listLoading=true;
      request({
        url: "ARoster/GetARosterList",
        method: "get",
        params:this.search
      }).then(response => {
        if (response.Status==1) {   
          this.list=response.List;
          this.total = response.PageCount;
          this.listLoading=false;  
        }            
      });
    },
    linktoadd(){
        this.titles='新增用户';
        this.temp.UserId='';
        this.$nextTick(() => {
          this.$refs["dataForm"].clearValidate();
        });
       this.dialogVisible=true;
    },
    handledel(row) {
      var data = this.$qs.stringify({ id: row.Id,activity:this.search.activity});
      this.$confirm("确定要删除该用户吗？", "提示", {
        dangerouslyUseHTMLString: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(() => {
          request({
            url: "ARoster/DelARoster",
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
          var param={
            Activity:this.temp.Activity,
            UserId:this.temp.UserId
          }
          var data = this.$qs.stringify(param);
          request({
            url: "ARoster/SetARoster",
            method: "post",
            data
          }).then(response => {
            if (response.Status==1){ 
              param.Id=response.AId;
              this.list.push(param);
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
