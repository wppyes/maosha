<template>
  <div class="prizeset boxright">
    <div class="filter-container">
       <el-select
        v-model="listQuery.Customer"
        placeholder="选择客户"
        clearable
        style="width: 150px"
        class="filter-item"
      >
        <el-option v-for="item in CList" :label="item.Name" :value="item.Id" :key="item.Id"></el-option>
      </el-select> 
      <el-select
        v-model="listQuery.Status"
        placeholder="选择状态"
        clearable
        style="width: 120px"
        class="filter-item"
      >
        <el-option label="未发货" value="0"></el-option>
        <el-option label="已发货" value="1"></el-option>
      </el-select> 
       <el-input
        placeholder="产品编号/名称,收货人/电话，物流/单号，订单号"
        v-model="listQuery.ItemId"
        style="width: 350px;"
        class="filter-item"
        clearable
      />  
      <el-date-picker
          v-model="value6"
          type="daterange"
          unlink-panels
          range-separator="至"
          class="filter-item"
          value-format="yyyy-MM-dd"
          clearable
          style="width: 420px;"
          start-placeholder="开始日期"
          end-placeholder="结束日期" />
      </el-date-picker>      
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>   
      <el-button class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">下载</el-button>      
      <el-button class="filter-item" type="primary" icon="el-icon-edit" @click="handleup">批量物流</el-button>   
      <span style="color:#f00; margin-left:20px">格式：（id,物流名称，物流单号）</span>
    </div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row>
      <el-table-column label="客户" align="center" prop="CName" width="100px"></el-table-column>
      <el-table-column label="产品" align="center" prop="PName"></el-table-column>
      <el-table-column label="收货人" align="center" prop="Name" width="80px"></el-table-column>
      <el-table-column label="电话" align="center" prop="Phone" width="120px"></el-table-column>
      <el-table-column label="地址" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.Address}}</span>          
        </template>
      </el-table-column>
      <el-table-column label="物流名称" align="center" prop="LogisticsName" width="120px">
      </el-table-column>
      <el-table-column label="物流单号" align="center" prop="LogisticsCode" width="200px">
      </el-table-column>
      <el-table-column label="时间" align="center" prop="CreateTimeStr" width="200px">
        <template slot-scope="scope">
          <div>订单：{{scope.row.CreatedStr}}</div>    
          <div>发货：{{scope.row.UpdateTimeStr}}</div>           
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="80px">
        <template slot-scope="scope">
          <el-button size="mini" v-if="scope.row.Status==0" type="primary" @click="handlefafang(scope.row,'发放')">
            发放
          </el-button>
          <el-button size="mini" type="warning"  @click="handleditor(scope.row,'修改')" v-if="scope.row.Status==1">
            修改
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
      @pagination="getList"
    />
    <el-dialog :title="dialogStatus" :visible.sync="dialogFormVisible" :close-on-click-modal="false" width="500px">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="100px"
        style="width: 350px; margin-left:50px;"
      >        
         <el-form-item label="物流" prop="LogisticsName">
          <el-select v-model="temp.LogisticsName" placeholder="请选择物流">
            <el-option v-for="item in Model" :label="item.Name" :key="item.Name" :value="item.Name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="物流编号" prop="LogisticsCode">
          <el-input placeholder="请输入物流编号"  v-model="temp.LogisticsCode"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="createData">确定</el-button>
      </div>
    </el-dialog>    
    <el-dialog title="批量设置物流" :visible.sync="dialogwuliuVisible" :close-on-click-modal="false" width="650px">
      <el-form
        ref="datawuliu"
        :rules="ruleswuliu"
        :model="temp1"
        label-position="left"
        label-width="100px"
        style="width: 350px; margin-left:20px;"
      >     
        <el-form-item label="文件上传" prop="filepath">          
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
  name: "prizeset",
  components: { Pagination },
  data() {
    return {
      list: [], //列表
      total:0,//门店总数量
      listLoading: false, //列表加载
      dialogStatus:'',//弹框标题
      dialogFormVisible:false,//是否展示弹框
      Model:[],//物流列表
      CList:[],//
      value6:'',
      downloadLoading:false,
      dialogwuliuVisible:false,
      temp:{
        Id:0,
        LogisticsName:'',
        LogisticsCode:''
      }, 
      temp1:{
        filepath:''
      },
      filelist:[],
      listQuery: {
        //搜素分页处理
        pageIndex: 1,
        pageSize: 15,
        Customer:'',
        ItemId:'',
        starttime:'',
        endtime:'',
        Status:''
      },
      rules:{  
        LogisticsName: [
          { required: true, message: "请选择物流！", trigger: "blur" }
        ],
        LogisticsCode: [
          { required: true, message: "请输入运单编号！", trigger: "blur" }
        ]
      },
      ruleswuliu:{  
        filepath: [
          { required: true, message: "请上传文件！", trigger: "blur" }
        ],
      }
    };
  },
  watch:{ 
    value6(val, oldval) {
      if(val){
        this.listQuery.starttime = val[0];
        this.listQuery.endtime = val[1];
      }else{
        this.listQuery.starttime='';
        this.listQuery.endtime='';
      }
    }
  },
  created() {
    this.getList();
    this.getmodel();
  },
  methods: {
    getList(){
      this.listLoading = true;
      request({
        url: "ActualOrder/GetActualOrderList",
        method: "get",
        params: this.listQuery
      }).then(response => {
          this.listLoading = false;
        if (response.Status == 1) {
          this.list=[];
          this.total=0;
          if(response.List){
            this.list = response.List;
            this.total = response.PageCount;
          }
        }
      });
    },
    getmodel(){
      request({
        url: "ActualOrder/DDL",
        method: "get",
        params: {}
      }).then(response => {
        if (response.Status == 1) {
          this.Model=response.List;
          this.CList=response.CList;
        }
      });
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    },
    handlefafang(row,title){
      this.temp.Id=row.Id;
      this.temp.LogisticsName='';
      this.temp.LogisticsCode='';
      this.dialogStatus = title+'物流';
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },   
    handleditor(row, title, creat) {
      this.temp.Id=row.Id;
      this.temp.LogisticsName=row.LogisticsName;
      this.temp.LogisticsCode=row.LogisticsCode;
      this.dialogStatus = title+'物流';
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    handleDownload(){
      this.downloadLoading = true;
      this.$confirm("确定要导出物流信息吗？", '提示', {
          dangerouslyUseHTMLString: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
          request({
            url: "ActualOrder/GetActualOrderExcel",
            method: "get",
            params: {Customer:this.listQuery.Customer,ItemId:this.listQuery.ItemId,starttime:this.listQuery.starttime,endtime:this.listQuery.endtime,Status:this.listQuery.Status}
          }).then(response => {
              if(response.Status==1){
                this.exportex(response,'物流信息')
                this.downloadLoading = false
              }          
          });          
        }).catch(() => {   
          this.downloadLoading = false      
        });
    },
    exportex(response,title){
      import('@/vendor/Export2Excel').then(excel => {
          const tHeader = response.TableTitle;
          const filterVal = response.TableField;
          const data = this.formatJson(filterVal, response.List)
          if(response.List){
            excel.export_json_to_excel({
              header: tHeader,
              data,
              filename:  title
            });
          }
        
      }); 
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
          return v[j]
      }))
    },
    createData(){
      this.$refs["dataForm"].validate(valid => {
        if (valid) { 
          var param={
              id:this.temp.Id,
              LogisticsName:this.temp.LogisticsName,
              LogisticsCode:this.temp.LogisticsCode
          };    
          var data = this.$qs.stringify(param);
          request({
            url: "ActualOrder/UpdateStatus",
            method: "post",
            data
          }).then(response => {
            if (response.Status==1) {
              this.getList();    
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
    handleup(){
      this.dialogwuliuVisible=true;
      this.temp1.filepath='';
      this.temp1.type='';
      this.$nextTick(() => {
        this.$refs["datawuliu"].clearValidate();
      });
    }, 
    removefile(file, fileList){
      this.filelist = fileList;
      this.temp1.filepath='';
    },
    handleChange(file, fileList){
      this.filelist = fileList.slice(-1);
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
            url: "ActualOrder/UploadActualOrder",
            method: "post",
            data
          }).then(response => {
            if (response.Status==1) {
              this.getList();    
              this.$refs['upload'].clearFiles(); 
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
</style>
