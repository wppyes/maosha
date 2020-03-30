<template>
  <div class="renwu boxright">
    <div class="filter-container">
      <div class="filter-item" style="margin-right:20px;">
        <el-button type="primary" @click="linktoadd(0)">
          <i class="el-icon-circle-plus"></i> 增加描述
        </el-button>
      </div>
      <el-input
        placeholder="请输入描述标题"
        v-model="listQuery.title"
        style="width: 150px;"
        class="filter-item"
        clearable
      />  
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>  
    </div>

    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row>
      <el-table-column label="标题" align="center" prop="Title"></el-table-column>
      <el-table-column label="内容" align="center" prop="Contents"></el-table-column>
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
    
   <pagination
      small
      layout="prev, pager, next"
      :total="total"
      :page.sync="listQuery.pageIndex"
      :limit.sync="listQuery.pageSize"
      @pagination="getdata"
    />
    <el-dialog :title="titles" :visible.sync="dialogVisible" :close-on-click-modal="false" width="500px">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item label="标题" prop="Title">
          <el-input v-model="temp.Title" type="textarea" placeholder="请填写标题"/>
        </el-form-item>
        <el-form-item label="内容" prop="Contents">
          <el-input v-model="temp.Contents" type="textarea" placeholder="请填写内容"/>
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

import Pagination from "@/components/Pagination";
export default {
  name: "renwu",
  components: { Pagination },
  data() {
    return {
      total:0,
      listQuery: {
        //搜素分页处理
        title:'',
        pageIndex: 1,
        pageSize: 15,
      },
      Model:[],
      listLoading:false,
      dialogVisible:false,
      titles:'',
      temp:{
        Id:0,
        Title:'',//任务编码
        Contents:''//名称
      },
      list:[],
      iscreat:false,
      rules: {
        Title: [
          { required: true, message: "编码必须填写！", trigger: "blur" }
        ],
        Contents: [
          { required: true, message: "名称必须填写！", trigger: "blur" }
        ],
      },   
    };
  },
  created() {
    this.getdata();
  },
  methods: {   
    handleFilter(){
      this.listQuery.pageIndex = 1;
      this.getdata();
    },
    getdata(){
      this.listLoading=true;
      request({
        url: "ARemarks/GetRemarksList",
        method: "get",
        params:this.listQuery
      }).then(response => {
        if (response.Status==1) {   
          this.list=response.List;
          this.total = response.PageCount;
          this.listLoading=false;  
        }            
      });
    },
    linktoadd(row){
      if(row==0){
        this.titles='增加描述';
        this.temp.Id=0;
        this.temp.Title='';
        this.temp.Contents='';
        this.iscreat=true;
      }else{
        this.titles='修改描述';
        this.temp.Id=row.Id;
        this.temp.Title=row.Title;
        this.temp.Contents=row.Contents;
        this.iscreat=false;
      };
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
      this.dialogVisible=true;
    },
    handledel(row) {
      var data = this.$qs.stringify({ Id: row.Id});
      this.$confirm("确定要删除该描述吗？", "提示", {
        dangerouslyUseHTMLString: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(() => {
          request({
            url: "ARemarks/DelRemarks",
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
            url: "ARemarks/SetRemarks",
            method: "post",
            data
          }).then(response => {
            if (response.Status==1) { 
              if(this.iscreat){
                let param={
                  Id:response.AId,
                  Title:this.temp.Title,
                  Contents:this.temp.Contents
                }     
                this.list.push(param);              
              }else{
                for(let i in this.list){
                  if (this.list[i].Id == this.temp.Id){
                    this.list[i].Title=this.temp.Title;
                    this.list[i].Contents=this.temp.Contents;
                    break;
                  }  
                }          
              }
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
