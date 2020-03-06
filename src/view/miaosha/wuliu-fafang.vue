<template>
  <div class="prizeset boxright">
    <div class="filter-container">  
        <el-button
          :loading="downloadLoading"
          class="filter-item"
          type="primary"
          icon="el-icon-download"
          @click="handleDownload"
        >下载模板</el-button>
      <el-button class="filter-item" type="primary" icon="el-icon-edit" @click="handleup">批量设置物流</el-button>   
    </div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row>
      <el-table-column label="奖品" align="left" prop="Title"></el-table-column>
      <el-table-column label="收货人" align="center" prop="Name" width="80px"></el-table-column>
      <el-table-column label="电话" align="center" prop="Phone" width="120px"></el-table-column>
      <el-table-column label="地址" align="left">
        <template slot-scope="scope">
          <span>{{scope.row.Address}}</span>          
        </template>
      </el-table-column>
      <el-table-column label="运单编号" align="center" prop="LogisticCode" width="200px"></el-table-column>
      <el-table-column label="操作" align="center" width="100px">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" v-if="scope.row.Status==1" @click="handlefafang(scope.row,'发放',true,scope.$index)">
            发放
          </el-button>
          <el-button size="mini" type="primary" v-if="scope.row.Status==3" @click="handleditor(scope.row,'修改',false,scope.$index)">
            <i class="el-icon-edit"></i> 修改
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
         <el-form-item label="物流" prop="Name">
          <el-select v-model="wuliu" placeholder="请选择物流">
            <el-option v-for="item in Model" :label="item.Name" :key="item.Id" :value="item.Id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="物流编号" prop="LogisticCode">
          <el-input placeholder="请输入物流编号"  v-model="temp.LogisticCode"/>
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
        style="width: 350px; margin-left:50px;"
      >        
         <el-form-item label="物流" prop="lid">
          <el-select v-model="temp1.lid" placeholder="请选择物流">
            <el-option v-for="item in Model" :label="item.Name" :key="item.Id" :value="item.Id"></el-option>
          </el-select>
        </el-form-item>
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
var activeindex=0;
export default {
  name: "prizeset",
  components: { Pagination },
  data() {
    return {
      list: [], //列表
      total:0,//总数量
      listLoading: false, //列表加载
      dialogStatus:'',//弹框标题
      dialogFormVisible:false,//是否展示弹框
      iscreate:true,//是否是增加
      Model:[],//物流列表
      wuliu:'',
      temp:{
        Id:0,
        OrderNum:'',
        ShipperId:'',
        ShipperName:'',
        ShipperCode:'',
        LogisticCode:''
      }, 
      downloadLoading: false,
      dialogwuliuVisible:false,
      listQuery: {
        //搜素分页处理
        pageIndex: 1,
        pageSize: 13,
      },
      temp1:{
        lid:0,
        filepath:''
      },
      rules:{  
        LogisticCode:[
          { required: true, message: "请填写物流编号！", trigger: "blur" }
        ]
      },
      ruleswuliu:{  
        filepath: [
          { required: true, message: "请上传文件！", trigger: "blur" }
        ]
      }
    };
  },
  watch:{
    wuliu(val, oldVal){
      if(val){        
        for(let i in this.Model){
          if(this.Model[i].Id==val){ 
            this.temp.ShipperId=this.Model[i].Id;
            this.temp.ShipperName=this.Model[i].Name;
            this.temp.ShipperCode=this.Model[i].ShipperCode;
            break;
          }
        }
      }
    }
  },
  created() {
    this.getList();
    this.getmodel();
  },
  methods: {
    handleDownload(){
      this.downloadLoading = true;
      this.$confirm("确定要下载模板吗？", '提示', {
          dangerouslyUseHTMLString: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
          request({
            url: "Logistics/Excel",
            method: "get",
            params: {}
          }).then(response => {
              if(response.Status==1){
                import('@/vendor/Export2Excel').then(excel => {
                  const tHeader = response.TableTitle;
                  const filterVal = response.TableField;
                  const data = this.formatJson(filterVal, response.List)
                  if(response.List){
                    excel.export_json_to_excel({
                      header: tHeader,
                      data,
                      filename: '物流模板'
                    });
                  }
                
              }); 
              this.downloadLoading = false
            }          
          });          
        }).catch(() => {   
          this.downloadLoading = false      
        });
    }, 
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
          return v[j]
      }))
    },
    getList(){
      this.listLoading = true;
      request({
        url: "Logistics/GetOrdersList",
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
    getmodel(){
      request({
        url: "Logistics/Express",
        method: "get",
        params: {}
      }).then(response => {
        if (response.Status == 1) {
          this.Model=response.Model;
        }
      });
    },
    handlefafang(row,title,creat,index){
      activeindex=index;
      this.temp.OrderNum=row.OrderNum
      this.wuliu=this.Model[0].Id;
      this.temp.Id=0;
      this.temp.ShipperId=this.Model[0].Id;
      this.temp.ShipperName=this.Model[0].Name;
      this.temp.ShipperCode=this.Model[0].ShipperCode;
      this.temp.LogisticCode='';
      this.dialogStatus = title;
      this.dialogFormVisible = true;
      this.iscreate = creat;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },   
    handleditor(row, title, creat,index) {
      activeindex=index;
      this.temp.Id=row.Id;
      this.temp.OrderNum=row.OrderNum
      this.temp.LogisticCode=row.LogisticCode;
      this.wuliu=row.ShipperId;
      for(let i in this.Model){
        if(this.Model[i].Id==row.ShipperId){      
          this.temp.ShipperId=this.Model[i].Id;
          this.temp.ShipperName=this.Model[i].Name;
          this.temp.ShipperCode=this.Model[i].ShipperCode;
          break;
        }
      }
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
              OrderNum:this.temp.OrderNum,
              ShipperId:this.temp.ShipperId,
              ShipperName:this.temp.ShipperName,
              ShipperCode:this.temp.ShipperCode,
              LogisticCode:this.temp.LogisticCode
          };    
          var data = this.$qs.stringify(param);
          request({
            url: "Logistics/SetLogistics",
            method: "post",
            data
          }).then(response => {
            if (response.Status==1) {
              if(this.iscreate){
                this.list[activeindex].Id=response.AId;
                this.list[activeindex].Status=3;
              }
              this.list[activeindex].ShipperId=this.temp.ShipperId;
              this.list[activeindex].LogisticCode=this.temp.LogisticCode;              
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
      this.temp1.lid=this.Model[0].Id;
      this.temp1.filepath='';
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
    subwuliu(){
      this.$refs["datawuliu"].validate(valid => {
        if (valid) { 
          var param={
              filepath:this.temp1.filepath,
              lid:this.temp1.lid
          };  
          var data = this.$qs.stringify(param);
          request({
            url: "Logistics/LogisticsBatch",
            method: "post",
            data
          }).then(response => {
            if (response.Status==1) {
              this.getList();    
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
