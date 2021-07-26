<template>
  <div class="prizeset boxright">
    <div class="filter-container"> 
      
      <el-input
        placeholder="用户编号"
        v-model="listQuery.userid"
        style="width: 150px;"
        class="filter-item"
        clearable
      />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" type="primary" icon="el-icon-edit" @click="handleup">批量设置白名单</el-button>   
      <div class="filter-item" style="margin:0 10px; color:#f00">
        剩余奖品数量（{{Balance}}）
      </div>
      <el-button class="filter-item" type="primary" @click="changenum">修改剩余数量</el-button>  
    </div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row>
      <el-table-column label="用户编号" align="left" prop="UserId"></el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="danger" @click="handledel(scope.row)">
            <i class="el-icon-delete"></i> 删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>          
    <pagination
      small
      layout="total,prev, pager, next"
      :total="total"
      :page.sync="listQuery.pageIndex"
      :limit.sync="listQuery.pageSize"
      @pagination="getList"
    />
    <el-dialog title="批量设置白名单" :visible.sync="dialogwuliuVisible" :close-on-click-modal="false" width="650px">
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
    <el-dialog title="修改剩余奖品数量" :visible.sync="dialognum" :close-on-click-modal="false" width="650px">
      <el-form
        ref="datanum"
        :rules="rulesnum"
        :model="temp2"
        label-position="left"
        label-width="100px"
        style="width: 350px; margin-left:50px;"
      >        
         <el-form-item label="数量" prop="balance">
          <el-input placeholder="请输入数量" v-model="temp2.balance"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialognum = false">取消</el-button>
        <el-button type="primary" @click="subnum">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import request from "@/utils/request";
import Pagination from "@/components/Pagination";
import upfile from '@/utils/upload';
export default {
  name: "prizeset",
  components: { Pagination },
  data() {
    return {
      list: [], //列表
      total:0,//总数量
      listLoading: false, //列表加载
      dialogwuliuVisible:false,
      dialognum:false,
      listQuery: {
        //搜素分页处理
        pageIndex: 1,
        pageSize: 11,
        userid:''
      },
      temp1:{
        filepath:''
      },
      temp2:{
        balance:''
      },
      Balance:'',
      ruleswuliu:{  
        filepath: [
          { required: true, message: "请上传文件！", trigger: "blur" }
        ]
      },
      rulesnum:{
        balance:[
          { required: true, message: "请输入数量！", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
    this.getnum();
  },
  methods: {   
    getnum(){
      request({
        url: "MoneyTree/WhiteList/GetPrizeData",
        method: "get",
        params: {}
      }).then(response => {
        if (response.Status == 1) {
          this.Balance=response.Balance;
        }
      });
    },
    subnum(){
      this.$refs["datanum"].validate(valid => {
        if (valid) { 
          var param={
              balance:this.temp2.balance
          };  
          var data = this.$qs.stringify(param);
          request({
            url: "MoneyTree/WhiteList/UpdateBalance",
            method: "post",
            data
          }).then(response => {
            if (response.Status==1) {   
              this.dialognum = false;
              this.$message({
                message: response.Msg,
                type: "success"
              });
              this.getnum();
            }
          });
        }
      });
    },
    changenum(){
      this.dialognum=true;
      this.temp2.balance='';
      this.$nextTick(() => {
        this.$refs["rulesnum"].clearValidate();
      });
    },
    handleFilter() {
      this.listQuery.pageIndex = 1;
      this.getList();
    },
    getList(){
      this.listLoading = true;
      request({
        url: "MoneyTree/WhiteList/GetWhiteList",
        method: "get",
        params: this.listQuery
      }).then(response => {
          this.listLoading = false;
        if (response.Status == 1) {
          if(response.List){
            this.list = response.List;
            this.total = response.PageCount;
          }
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
    handledel(row){
      var data=this.$qs.stringify({UserId:row.UserId});
      this.$confirm("确定要删除吗？", '提示', {
          dangerouslyUseHTMLString: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
           request({
            url: "MoneyTree/WhiteList/Del",
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
  }
};
</script>
<style lang="scss" rel="stylesheet/scss">
.prizeset .wuliuinfo li{list-style: none; line-height:22px; margin-bottom: 10px; display: flex;}
.prizeset .wuliuinfo span{color: #999; margin-right: 10px; width: 145px;}
.prizeset .text-red{margin-left: 20px; color: #f00;}
</style>
