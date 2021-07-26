<template>
  <div class="kami boxright">
     <div class="back">
      <span @click="backto">
        <i class="el-icon-arrow-left"></i>返回
      </span>
    </div>
    <div class="filter-container">
        <div class="filter-item">
           <el-date-picker
              v-model="datas"
              type="daterange"
              align="left"
              unlink-panels
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
            ></el-date-picker> 
            <el-select
              v-model="listQuery.Status"
              placeholder="状态"
              clearable
              style="width: 150px"
            >
              <el-option v-for="item in StatusList" :label="item.Text" :value="item.Id" :key="item.Id"></el-option>
            </el-select>
          <el-button type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button> 
          <el-button type="primary" icon="el-icon-edit" @click="handleup">上传</el-button>
        </div>
      </div>
    
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row>
      <el-table-column label="批次" prop="Batch" align="center">
      </el-table-column>   
      <el-table-column label="卡号" prop="Card" align="center">
      </el-table-column>    
      <el-table-column label="卡密" prop="PassWord" align="center">
      </el-table-column>   
      <el-table-column label="有效期" prop="CardTime" align="center">
      </el-table-column>  
      <el-table-column label="使用时间" prop="UseTimeStr" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.Status==0?'-':scope.row.UseTimeStr}}</span>
        </template>
      </el-table-column>  
      <el-table-column label="状态" prop="Status" align="center">
        <template slot-scope="scope">
          <span :class="'status'+scope.row.Status">{{scope.row.Status==0?'未使用':'已使用'}}</span>
        </template>
      </el-table-column>     
      <el-table-column label="操作" align="center">
         <template slot-scope="scope">
          <el-button
            size="mini" type="danger"
            @click="handledel(scope.row)"><i class="el-icon-delete"></i></el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      small
      :total="total"
      layout="total,prev, pager, next"
      :page.sync="listQuery.pageIndex"
      :limit.sync="listQuery.pageSize"
      @pagination="getList"
    />
    <el-dialog :title="'上传'" :visible.sync="dialogwuliuVisible" :close-on-click-modal="false" width="650px">
      <el-form
        ref="datawuliu"
        :rules="ruleswuliu"
        :model="temp1"
        label-position="left"
        label-width="100px"
        style="width: 350px; margin-left:50px;"
      >    
        <el-form-item :label="'上传'" prop="filepath">          
          <el-upload
              class="upload-demo"
              drag
              ref="upload"
              accept=".xls,.xlsx"
              action=""
              :file-list="filelist"
              :on-change="handleChange"
              :on-remove="removefile"
              :http-request="upLoad"
              >
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
              <div class="el-upload__tip" slot="tip">只能上传xls文件</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="货品批次" prop="Batch">
          <el-input v-model="temp1.Batch" placeholder="请填写货品批次"/>
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-select
            v-model="temp1.type"
            placeholder="类型"
            clearable
            style="width: 150px"
            class="filter-item"
          >
            <el-option v-for="item in TypeList" :label="item.Text" :value="item.Id" :key="item.Id"></el-option>
          </el-select>
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
import upfile from '@/utils/upload';
import Pagination from "@/components/Pagination";
var validnum=(rule, value,callback)=>{
       var r = /^\d{4}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{2}$/
      if(r.test(value)){
        callback()
      }else{
        callback(new Error('请输入正确的货品批次'))
      }
  }
export default {
  name: "menus",
  components: {Pagination},
  data() {
    return {
      list: null,
      listLoading: true,
      total:0,//总数量
      downloadLoading:false,  
      listQuery: {
        //搜素分页处理
        ItemId:'',
        pageIndex: 1,
        pageSize: 10,
        Status:'',
        starttime:'',
        endtime:''
      },
      datas:'',
      temp1:{
        filepath:'',
        ItemId:'',
        Batch:'',
        type:''
      }, 
      TypeList:[{Id: 1, Text: "卡号+有效期"},{Id: 2, Text: "卡号+卡密+有效期"}],
      StatusList:[{Id: '0', Text: "未使用"},{Id:'1', Text: "已使用"}],
      dialogwuliuVisible:false,
      filelist:[],
      ruleswuliu:{ 
        filepath: [
          { required: true, message: "请上传文件！", trigger: "blur" }
        ],
        Batch: [
          { required: true, validator: validnum, trigger: "blur" }
        ],
        type: [
          { required: true, message: "请选择类型！", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.listQuery.ItemId = this.$route.query.id;
    this.temp1.ItemId = this.$route.query.id;
    this.getList();    
  },
  watch: {
    datas(val, oldval) {
      if(val){
        this.listQuery.starttime = val[0];
        this.listQuery.endtime = val[1];
      }else{
        this.listQuery.starttime='';
        this.listQuery.endtime='';
      }
    },
  },
  methods: {  
    backto() { 
      this.$router.go(-1); 
    },  
    handleFilter() {
      this.listQuery.pageIndex = 1;
      this.getList();
    }, 
    getList(){
      this.listLoading = true;
      request({
        url: "TProduct/GetProductInfoList",
        method: "get",
        params: this.listQuery
      }).then(response => {
        if (response.Status == 1) {
          this.list = response.List;
          this.total = response.PageCount;
          this.listLoading = false;
        }
      });
    },
    handledel(row){
      var data=this.$qs.stringify({Id:row.Id});
      this.$confirm("确定要删除吗？", '提示', {
          dangerouslyUseHTMLString: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
           request({
            url: "TProduct/Del",
            method: "post",
            data
          }).then(response => {
            if(response.Status==1){
              this.$message({
                message: response.Msg,
                type: 'success'
              });          
              const index = this.list.indexOf(row)
              this.list.splice(index, 1);
              this.$bus.$emit("productchange");
            }                      
          });
        }).catch(() => {         
      })  
    },
    handleup(){
      this.dialogwuliuVisible=true;
      this.temp1.filepath='';
      this.temp1.Batch='';
      this.temp1.type='';
      this.$nextTick(() => {
        this.$refs["datawuliu"].clearValidate();
      });
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
    removefile(file, fileList){
      this.filelist = fileList;
      this.temp1.filepath='';
    },
    handleChange(file, fileList){
      this.filelist = fileList.slice(-1);
    },
    subwuliu(){
      this.$refs["datawuliu"].validate(valid => {
        if (valid) {
          var param={
              filepath:this.temp1.filepath,
              Batch:this.temp1.Batch,
              type:this.temp1.type,
              ItemId:this.temp1.ItemId
          };  
          var data = this.$qs.stringify(param);
          request({
            url: "TProduct/UploadQM",
            method: "post",
            data
          }).then(response => {
            if (response.Status==1) {
              this.getList();  
              this.$refs['upload'].clearFiles();  
              this.dialogwuliuVisible = false;
              this.$bus.$emit("productchange");
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
  .kami {
  .status1{color:#F56C6C;}
  .status0{color:#409EFF;}
}
</style>
