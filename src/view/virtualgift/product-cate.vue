<template>
  <div class="product-cate boxright">
    <div class="filter-container">
        <div class="filter-item">
          <el-button type="primary" @click="handleadd(0,'增加分类',true)"><i class="el-icon-circle-plus"></i> 增加分类</el-button>
        </div>
      </div>
    
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row>
      <el-table-column label="分类名称" prop="Name" align="center">
      </el-table-column>    
      <el-table-column label="操作" align="center">
         <template slot-scope="scope">
          <el-button
            size="mini"  type="primary"
            @click="handleditor(scope.row,'修改分类',false)"><i class="el-icon-edit"></i></el-button>
          <el-button
            size="mini" type="danger"
            @click="handledel(scope.row)"><i class="el-icon-delete"></i></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :title="dialogStatus" :visible.sync="dialogFormVisible" :close-on-click-modal="false" width="550px">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item label="分类名称" prop="Name">
          <el-input v-model="temp.Name" placeholder="请填写分类名称"/>
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
export default {
  name: "menus",
  data() {
    return {
      list: null,
      listLoading: true,
      temp: {
        Id: 0,
        Name: ''
      },
      dialogStatus:'',//面板标题    
      dialogFormVisible: false,//面板是否展示
      iscreate:false,//是否是添加
      rules: {
        Name: [{ required: true, message: '分类名称必须填写！', trigger: 'blur' }],
      },
    };
  },
  created() {
    request({
      url: "Classify/GetClassifyList",
      method: "get",
      params: {}
    }).then(response => {
      if(response.Status==1){
        this.list = response.List;
        this.listLoading = false;
      }
    });
  },
  methods: {
    handleditor(row,title,creat){      
      this.temp={
        Id: row.Id,
        Name: row.Name
      };
      this.dialogStatus = title;
      this.dialogFormVisible = true;
      this.iscreate=creat;
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handledel(row,title){
      var data=this.$qs.stringify({Id:row.Id,status:1});
      this.$confirm("确定要删除该产品分类吗？", '提示', {
          dangerouslyUseHTMLString: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
           request({
            url: "Classify/UpdateStatus",
            method: "post",
            data
          }).then(response => {
            if(response.Status==1){
              this.$message({
                message: response.Msg,
                type: 'success'
              });          
              const index = this.list.indexOf(row)
              this.list.splice(index, 1) 
            }                      
          });
        }).catch(() => {         
      })  
    },
    handleadd(row,title,creat){   
      this.temp={
        Id: 0,
        Name: ''
      };
      this.iscreate=creat;
      this.dialogStatus = title;
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData(){
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {              
          this.subrequest(); 
        }
      })
    },   
    subrequest(){
      var data=this.$qs.stringify(this.temp);
      request({
          url: "Classify/SetClassify",
          method: "post",
          data
        }).then(response => {
          if(response.Status==1){
            if(this.iscreate){
              this.temp.Id=response.AId;
              this.list.push(this.temp);             
            }else{
              for(let i in this.list){
                if (this.list[i].Id === this.temp.Id) {
                  this.list[i].Name=this.temp.Name;
                  break
                }  
              }            
            }
            this.dialogFormVisible = false;
            this.$message({
              message: response.Msg,
              type: 'success'
            })
          }
        });
    },
  }
};
</script>
<style lang="scss" rel="stylesheet/scss">
  .product-cate .disabled{color: #C0C4CC;}
  .product-cate span{cursor: pointer;}
  
  .product-cate .chicun {
    color: #f00;
  }
</style>
