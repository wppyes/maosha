<template>
  <div class="ncustomer1 boxright">
    
    <div class="filter-container">
      <el-button type="primary" class="add" @click="handleadd('增加客户',true)" style="margin-right:20px;">
        <i class="el-icon-circle-plus"></i> 增加客户
      </el-button>
    </div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row>
      <el-table-column label="客户名" prop="Name" align="center" width="150px"></el-table-column>
      <el-table-column label="密钥" prop="APIKey" align="center"></el-table-column>
      <el-table-column label="账户(元)" align="center" width="200px">
            <template slot-scope="scope">
                 {{parseFloat(scope.row.Balance).toLocaleString()}}
            </template>
      </el-table-column>
      <el-table-column label="状态" prop="LoginName" align="center" width="100px">
          <template slot-scope="scope">
            <span :class="'status'+scope.row.Status">{{scope.row.Status==1?'禁用':'正常'}}</span>
            </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-tag size="small" @click="handleditor(scope.row,'修改客户',false)">
            <i class="el-icon-edit"></i>
          </el-tag>
          <el-tag v-show="scope.row.Status==0" size="small" type="danger" @click="changes(scope.row,1)">
            禁用
          </el-tag>
          <el-tag v-show="scope.row.Status==1" size="small"  @click="changes(scope.row,0)">
            启用
          </el-tag>
          <el-tag size="small" @click="resetPwd(scope.row)" type="success">修改密钥</el-tag>
          <el-tag size="small" @click="jiakuanpanel(scope.row,'加款')">加款</el-tag>
          <el-tag size="small" @click="jiakuanlist(scope.row,'加款记录')">加款记录</el-tag>
          <el-tag size="small" @click="liushuilist(scope.row,'交易流水')">交易流水</el-tag>
          <el-tag size="small" type="warning" @click="linkjiage(scope.row)">价格设置</el-tag>
          <el-tag size="small" type="warning" @click="linkjiage1(scope.row)">价格设置(实物)</el-tag>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :title="dialogStatus" :visible.sync="dialogFormVisible" width="550px">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="100px"
        style="width: 400px; margin-left:50px;"
      > 
        <el-form-item label="客户名字" prop="name">
          <el-input v-model="temp.name" placeholder="请填写客户名字"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="iscreate?createData():changeData()">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="dialogStatus" :visible.sync="dialogaddVisible" width="550px">
      <el-form
        ref="dataFormadd"
        :rules="rulesadd"
        :model="tempadd"
        label-position="left"
        label-width="100px"
        style="width: 400px; margin-left:50px;"
      >       
        <el-form-item label="充值金额" prop="amount">
          <el-input v-model="tempadd.amount" placeholder="请填写充值金额"/>
        </el-form-item>
        <el-form-item label="描述" prop="remark">
          <el-input v-model="tempadd.remark" type="textarea" placeholder="请填写描述"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogaddVisible = false">取消</el-button>
        <el-button type="primary" @click="addbth">确定</el-button>
      </div>
    </el-dialog>
     <el-dialog :title="dialogStatus" :visible.sync="dialogadd" width="800px">
       <div class="filter-container">            
             <el-date-picker
              class="filter-item"
              v-model="jkdata"
              type="daterange"
              align="left"
              unlink-panels
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
            ></el-date-picker>   
            <el-button class="filter-item" type="primary" icon="el-icon-search" @click="jkhandlefilter">搜索</el-button>
        </div>
        <el-table v-loading="listjkLoading" :data="jklist" border fit highlight-current-row>
            <el-table-column label="加款金额" align="center">
                <template slot-scope="scope">
                    {{parseFloat(scope.row.Amount).toLocaleString()}}
                </template>
            </el-table-column>
            <el-table-column label="加款时间" prop="CreatedStr" align="center"></el-table-column>   
            </el-table>
            <pagination
            v-show="jktotal>0"
            :total="jktotal"
            layout="total,prev, pager, next"
            :page.sync="jklistQuery.pageIndex"
            :limit.sync="jklistQuery.pageSize"
            @pagination="getjiakuan"
            />
    </el-dialog>
    <el-dialog :title="dialogStatus" :visible.sync="dialoginfoVisible" top="50px" width="900px">
        <div class="filter-container">            
            <el-date-picker
              class="filter-item"
              v-model="jydata"
              type="daterange"
              align="left"
              unlink-panels
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
            ></el-date-picker>            
            <el-input
                placeholder="请输入关键字"
                v-model="jylistQuery.category"
                style="width: 150px;"
                class="filter-item"
                clearable
            />
            <el-button class="filter-item" type="primary" icon="el-icon-search" @click="jyhandlefilter">搜索</el-button>
        </div>
        <el-table v-loading="listjyLoading" :data="jylist" border fit highlight-current-row>
            <el-table-column label="流水号" prop="OrderId" align="center">
            </el-table-column>
            <el-table-column label="收支金额" prop="Amount" align="center">
                <template slot-scope="scope">
                    <span :class="[scope.row.Category==0?'status0':'status1']">
                        {{scope.row.Category==1?'-':'+'}}{{scope.row.Amount}}
                    </span>                    
                </template>
            </el-table-column>
            <el-table-column label="交易后余额" prop="Balance" align="center"></el-table-column>   
            <el-table-column label="类型" prop="Category" align="center">
              <template slot-scope="scope">
              <span :class="[scope.row.Category==0?'status0':'status1']">
                  {{scope.row.Category==0?'收入':'支出'}}
              </span> 
              </template>
            </el-table-column>        
            <el-table-column label="时间" prop="CreatedStr" align="center"></el-table-column>        
            </el-table>
            <pagination
            v-show="jytotal>0"
            :total="jytotal"
            layout="total,prev, pager, next"
            :page.sync="jylistQuery.pageIndex"
            :limit.sync="jylistQuery.pageSize"
            @pagination="getjiaoyi"
            />
    </el-dialog>
  </div>
</template>
<script>
import request from "@/utils/request";
import Pagination from "@/components/Pagination";
var validnum=(rule, value,callback)=>{
       var r = /^[0-9]*[1-9][0-9]*$/
      var r1=/^(-?\d+)(\.\d+)?$/
      if(r.test(value) || r1.test(value)&&value>0){
        callback()
      }else{
        callback(new Error('请输入正确的金额'))
      }
  }
export default {
  name: "ncustomer",
  components: { Pagination },
  data() {
    return {
      list: null,
      listLoading: true,   
      listjkLoading:true,   
      listjyLoading:false,
      jklistQuery: {
        pageIndex: 1, //页数
        pageSize: 10, //每页展示数量
        cid:'',
        starttime:'',
        endtime:''
      },
      jktotal:0,   
      jylistQuery: {
        pageIndex: 1, //页数
        pageSize: 10, //每页展示数量
        cid:'',
        starttime:'',
        endtime:'',
        category:''
      },
      jytotal:0,  
      temp: {
        Id: 0,
        name: ""
      },
      tempadd:{
        cid:0,
        amount:'',
        remark:''        
      },
      jkdata:'',
      jydata:'',
      dialogStatus: "", //面板标题
      dialogFormVisible: false, //增改用户名字
      dialogaddVisible: false, //加款面板是否展示
      dialogadd:false,//加款列表面板是否展示
      dialoginfoVisible:false,//流水列表面板是否展示
      iscreate: false, //是否是添加
      jklist:[],
      jylist:[],
      rules: {
        name: [
          { required: true, message: "客户名必须填写！", trigger: "blur" }
        ]
      },
      rulesadd:{
        amount: [
         { required: true, trigger: ['change'], validator: validnum }
        ],
      }
    };
  },
  created() {
      this.getList();
  },
  watch: {
    jkdata(val, oldval) {
      if(val){
        this.jklistQuery.starttime = val[0];
        this.jklistQuery.endtime = val[1];
      }else{
        this.jklistQuery.starttime='';
        this.jklistQuery.endtime='';
      }
    },
    jydata(val, oldval) {
      if(val){
        this.jylistQuery.starttime = val[0];
        this.jylistQuery.endtime = val[1];
      }else{
        this.jylistQuery.starttime='';
        this.jylistQuery.endtime='';
      }
    },
  },
  methods: {
    linkjiage(row){
      this.$router.push({
        path: "ncustomer/price",
        query: { id:row.Id }
      });
    },
    linkjiage1(row){
      this.$router.push({
        path: "ncustomer/priceshiwu",
        query: { id:row.Id }
      });
    },
    getList(){//获取列表
        this.listLoading = true;
        request({
        url: "Customer/GetCustomerList",
        method: "get",
        params: this.listQuery
        }).then(response => {
            if(response.Status==1){ 
            this.list = response.List;
            this.listLoading=false;
            }
        });
    },  
    handleditor(row, title, creat) {   //修改客户信息 面板  
      this.temp={
        Id: row.Id,
        name:row.Name
      };
      this.dialogStatus = row.Name+'-'+title;
      this.dialogFormVisible = true;
      this.iscreate = creat;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    handleadd(title, creat) {//新增客户信息面板
      this.temp={
        Id: 0,
        name: ""
      }
      this.dialogStatus = title;
      this.dialogFormVisible = true;
      this.iscreate = creat;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    changeData(){//修改客户信息
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          var data = this.$qs.stringify(this.temp);
          request({
            url: "Customer/Update",
            method: "post",
            data
          }).then(response => {
            if (response.Status==1) {   
              for (let i in this.list) {
                  if (this.list[i].Id == this.temp.Id) {
                      this.list[i].Name = this.temp.name;
                      break
                  };
              };
              this.$message({
                message: response.Msg,
                type: "success"
              });              
              this.dialogFormVisible = false;
            }            
          });
        }
      });
    
    },
    createData() {//新增客户信息
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          var data = this.$qs.stringify(this.temp);
          request({
            url: "Customer/SetCustomer",
            method: "post",
            data
          }).then(response => {
            if (response.Status==1) {   
              var param={
                  Id:response.AId,
                  Name:this.temp.name,
                  Status:0,
                  APIKey:response.APIKey,
                  Balance:0
                }
                this.temp.Id = response.AId;
                this.list.push(param);
              this.$message({
                message: response.Msg,
                type: "success"
              });              
              this.dialogFormVisible = false;
            }            
          });
        }
      });
    },    
    changes(row, type) {//修改用户状态
      var cz=type == 0?'启用':'禁用'
      this.$confirm('确定要' + cz + '吗？', "提示", {
        dangerouslyUseHTMLString: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(() => {
          var data = this.$qs.stringify({ Id: row.Id,Status: type});
          request({
            url: "Customer/UpdateStatus",
            method: "post",
            data
          }).then(response => {
            if (response.Status==1) {
              row.Status = type;
              this.$message({
                message: response.Msg,
                type: "success"
              });
            }
          });
        })
        .catch(() => {});
    },
    resetPwd(row) {//修改密钥
      var data = this.$qs.stringify({ Id: row.Id });
      this.$confirm("确定要修改密钥吗？", "提示", {
        dangerouslyUseHTMLString: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(() => {
          request({
            url: "Customer/UpdateAPIKey",
            method: "post",
            data
          }).then(response => {
            if (response.Status==1) {
              row.APIKey=response.APIKey;
              this.$message({
                message: response.Msg,
                type: "success"
              });
            }
          });
        })
        .catch(() => {});
    },
    addbth(){//加款操作
      this.$refs["dataFormadd"].validate(valid => {
        if (valid) {
          var data = this.$qs.stringify(this.tempadd);
        request({
            url: "Customer/UpdateBalance",
            method: "post",
            data
          }).then(response => {
            if (response.Status==1) {
              this.$message({
                message: response.Msg,
                type: "success"
              });
              this.getList();
              this.dialogaddVisible = false;
            }
          });
        }
      });
       
    },
    jiakuanpanel(row,title){//展示加款面板
      this.dialogStatus = row.Name+'-'+title;
      this.dialogaddVisible = true;
      this.tempadd={
        id: row.Id,
        amount:'',
        remark:'' 
      };
      this.$nextTick(() => {
        this.$refs["dataFormadd"].clearValidate();
      });
    },
    jiakuanlist(row,title){//展示加款列表面板
       this.dialogStatus = row.Name+'-'+title;
       this.dialogadd = true;
       this.jklistQuery.pageIndex=1;
       this.jklistQuery.starttime='';
       this.jklistQuery.endtime='';
       this.jklistQuery.cid=row.Id;
       this.getjiakuan();
    },
    jkhandlefilter(){
      this.jklistQuery.pageIndex=1;
      this.getjiakuan();
    },
    getjiakuan(){
      this.listjkLoading = true;
        request({
        url: "Customer/GetCustomerChargeList",
        method: "get",
        params: this.jklistQuery
        }).then(response => {
          if(response.Status==1){
              this.jklist = response.List;
              this.jktotal = response.PageCount;
              this.listjkLoading=false;
          }
        });
    },
    liushuilist(row,title){//展示交易流水面板
      this.dialogStatus = row.Name+'-'+title;
       this.dialoginfoVisible = true;
       this.jylistQuery.pageIndex=1;
       this.jylistQuery.starttime='';
       this.jylistQuery.endtime='';
       this.jylistQuery.cid=row.Id;
       this.jylistQuery.category='';
       this.getjiaoyi();
    },    
    jyhandlefilter(){
      this.jylistQuery.pageIndex=1;
      this.getjiaoyi();
    },
    getjiaoyi(){
      this.listjkLoading = true;
        request({
        url: "Customer/GetTransactionList",
        method: "get",
        params: this.jylistQuery
        }).then(response => {
          if(response.Status==1){
              this.jylist = response.List;
              this.jytotal = response.PageCount;
              this.listjyLoading=false;
          }
        });
    },
  }
};
</script>
<style lang="scss" rel="stylesheet/scss">
.ncustomer .add {
  margin-bottom: 20px;
}
.ncustomer1{
  .el-tag{cursor: pointer;}
  .status0 {
    color: #409eff;
  }
  .status2 {
    color: #e6a23c;
  }
  .status1 {
    color: #f56c6c;
  }
  .status4 {
    color: #67c23a;
  }
  .status5 {
    color: #500f51;
  }
  .status6 {
    color: #51210f;
  }
}

</style>
