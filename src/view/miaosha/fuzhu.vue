<template>
  <div class="miaoshalist boxright">
    <div>
      <el-button class="filter-item" type="primary" @click="handleclose">关闭订单</el-button>   
      <el-button class="filter-item" type="primary" @click="handle">同步数据</el-button>   
    </div>
    <br/>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row>
      <el-table-column label="名称" align="center" prop="Title"></el-table-column>
      </el-table-column>
      <el-table-column label="总库存" align="center" prop="Num" width="100px"></el-table-column>
      </el-table-column>
      <el-table-column label="剩余库存" align="center" prop="Balance" width="100px"></el-table-column>
      </el-table-column>
      <el-table-column label="原价" align="center" prop="Price" width="100px"></el-table-column>
      </el-table-column>
      <el-table-column label="实付价格" align="center" prop="Pay" width="100px"></el-table-column>
      </el-table-column>    
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="caozuo(scope.row)">
            操作
          </el-button>

        </template>
      </el-table-column>
    </el-table> 
    <el-dialog title="操作设置" :visible.sync="showdio" :close-on-click-modal="false" width="700px">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" style="width: 500px; margin-left:50px;">
        <div class="filter-container">
          <el-input
            placeholder="请输入id"
            v-model="temp.userid"
            style="width: 150px;"
            class="filter-item"
            clearable
          />  
          <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>   
        </div>
        <el-form-item label="选择地址" prop="AId"> 
         <el-radio-group v-model="temp.AId" size="small">
            <el-radio v-for="item in dizhilist" :key="item.Id" :label="item.Id" border>{{item.Name}}-{{item.Phone}}-{{item.Province}}{{item.City}}{{item.Area}}{{item.Address}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="活动时间" prop="time">          
            <el-date-picker
              v-model="temp.time"
              type="datetime"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择日期时间">
            </el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showdio = false">取消</el-button>
        <el-button type="primary" @click="createData">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import request from "@/utils/request";

export default {
  name: "miaoshalist",
  data() {
    return {  
      listLoading:true,
      list:[],
      temp:{
        Id:'',
        AId:'',
        userid:'',
        time:''
      },
      showdio:false,
      dizhilist:[],
      rules: {
        time: [
          { required: true, message: "时间必须选择！", trigger: "blur" }
        ],
        userid: [
          { required: true, message: "用户必须选择！", trigger: "blur" }
        ],
      },  
    };
  },
  created() {
    this.getdata();
  },
  methods: {
    handleFilter(){
       request({
            url: "AProduct/GetContactsList",
            method: "get",
            params:{userid:this.temp.userid}
          }).then(response => {
            if (response.Status==1) {                 
               this.dizhilist=response.List;
            }            
          });
    },
    caozuo(row){
      this.showdio=true;
      this.temp.Id=row.Id;      
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    createData(){      
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          var data = this.$qs.stringify(this.temp);
          request({
            url: "AProduct/SetRedis",
            method: "post",
            data
          }).then(response => {
            if (response.Status==1) { 
              this.showdio = false
              this.$message({
                message: response.Msg,
                type: 'success'
              });
            }            
          });
        }
      });
    },
    getdata(){
      request({
            url: "AProduct/GetAProduct_List",
            method: "get",
            params:{}
          }).then(response => {
            if (response.Status==1) {                 
               this.listLoading=false;
               this.list=response.List;
            }            
          });
    },
    handleclose(){          
      this.$confirm("确定要关闭订单吗？", "提示", {
        dangerouslyUseHTMLString: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(() => {          
          request({
            url: "Auxiliary/GetCloseOrder",
            method: "get",
            params:{}
          }).then(response => {
            if (response.Status==1) {   
              this.$message({
                message: response.Msg,
                type: "success"
              }); 
            }            
          });
        })
        .catch(() => {});
    },
    handle(){      
      this.$confirm("确定要同步数据吗？", "提示", {
        dangerouslyUseHTMLString: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(() => {
          request({
            url: "Auxiliary/GetSynchroOrder",
            method: "get",
            params:{}
          }).then(response => {
            if (response.Status==1) {   
              this.$message({
                message: response.Msg,
                type: "success"
              }); 
            }            
          });
        })
        .catch(() => {});
    },
  }
};
</script>
<style lang="scss" rel="stylesheet/scss">
.miaoshalist {
  .img{width:40px; height:40px;}
  .status3{color:#F56C6C;}
  .status0{color:#67C23A;}
  .status1{color:#E6A23C;}
  .status2{color:#409EFF;}
  .status4{color:#909399;}
  .qingkong{margin-left: 30px; color: #409EFF;}
  .el-radio.is-bordered+.el-radio.is-bordered{margin-left: 0;}
  .el-radio--small.is-bordered{margin-bottom: 10px;}
}
</style>
