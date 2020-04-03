<template>
  <div class="miaoshalist boxright">
    <div class="filter-container">
      <div class="filter-item" style="margin-right:20px;">
        <el-button type="primary" @click="linktoadd(0)">
          <i class="el-icon-circle-plus"></i> 增加活动
        </el-button>
      </div>
      <el-input
        placeholder="请输入活动标题"
        v-model="listQuery.name"
        style="width: 150px;"
        class="filter-item"
        clearable
      />  
       <el-select
          v-model="listQuery.status"
          placeholder="选择活动状态"
          clearable
          style="width: 150px"
          class="filter-item"
        >
          <el-option v-for="item in Model" :label="item.Text" :value="item.Value" :key="item.Value"></el-option>
        </el-select>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>   
    </div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row>
      <el-table-column label="名称" align="center" prop="Name"></el-table-column>
      </el-table-column>
      <el-table-column label="活动时间" align="center" prop="StartTimeStr" width="250px">
        <template slot-scope="scope">
          {{scope.row.StartTimeStr}} - {{scope.row.DeadlineStr}}
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="Status" width="100px">
         <template slot-scope="scope">
          <span v-text="setstatus(scope.row.Status)" :class="'status'+scope.row.Status"></span>
        </template>
      </el-table-column>
      <el-table-column label="任务" align="center" prop="Status" width="100px">
        <template slot-scope="scope">          
          <el-button size="mini" type="primary" @click="handlerenwu(scope.row)" v-if="scope.row.IsMission==1">
            任务
          </el-button>  
        </template>
      </el-table-column>
      <el-table-column label="产品" align="center" prop="Status" width="100px">
        <template slot-scope="scope">          
          <el-button size="mini" type="primary" @click="handlechanpin(scope.row)">
            产品
          </el-button>  
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="linktoadd(scope.row)" v-if="scope.row.Status==0">
            <i class="el-icon-edit"></i>
          </el-button>
          <el-button size="mini" type="danger" @click="handledel(scope.row)" v-if="scope.row.Status==0">
            <i class="el-icon-delete"></i>
          </el-button>
          <el-button size="mini" type="primary" @click="handlzhuagntai(scope.row,1)" v-if="scope.row.Status==0">
            上架
          </el-button> 
          <el-button size="mini" type="danger" @click="handlzhuagntai(scope.row,0)" v-if="scope.row.Status==1">
            下架
          </el-button>      
          <el-button size="mini" type="danger" @click="handlzhuagntai(scope.row,2)" v-if="scope.row.Status==1">
            结束活动
          </el-button>         
        </template>
      </el-table-column>
    </el-table> 
    
    <el-dialog :title="titles" :visible.sync="dialogVisible" :close-on-click-modal="false" width="700px">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" style="width: 500px; margin-left:50px;">
        <el-form-item label="活动名称" prop="Name">
          <el-input v-model="temp.Name" placeholder="请填写任务名称"/>
        </el-form-item>
        <el-form-item label="活动时间" prop="StartTime">          
            <el-date-picker
              v-model="value"
              type="datetimerange"
              align="left"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd HH:mm:ss"
            ></el-date-picker>
        </el-form-item>
        <el-form-item label="任务开启" prop="IsMission">
          <el-switch
            v-model="temp.IsMission"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-text="是"
            inactive-text="否">
          </el-switch>
        </el-form-item>                
        <el-form-item label="备注信息" prop="ARId" v-show="temp.IsMission">
          <el-select
            v-model="temp.ARId"
            placeholder="选择备注信息"
            clearable
            style="width:400px"
          >
            <el-option v-for="item in marklist" :label="item.Contents" :value="item.Id" :key="item.Id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="createData">确定</el-button>
      </div>
    </el-dialog>
   <pagination
      small
      layout="prev, pager, next"
      :total="total"
      :page.sync="listQuery.pageIndex"
      :limit.sync="listQuery.pageSize"
      @pagination="getdata"
    />
  </div>
</template>
<script>
import request from "@/utils/request";

import Pagination from "@/components/Pagination";
export default {
  name: "miaoshalist",
  components: { Pagination },
  data() {
    return {
      Model:[],
      listLoading:false,
      dialogVisible:false,
      titles:'',
      temp:{
        Id:0,
        StartTime:'',//开始时间
        Deadline:'',//结束时间
        Name:'',//名称
        IsMission:false,
        ARId:''
      },
      value:'',
      total:0,
      listQuery: {
        //搜素分页处理
        name:'',
        pageIndex: 1,
        pageSize: 15,
        status:''
      },
      list:[],
      iscreat:false,
      rules: {
        StartTime: [
          { required: true, message: "时间必须选择！", trigger: "blur" }
        ],
        Name: [
          { required: true, message: "名称必须填写！", trigger: "blur" }
        ],
        IsMission: [
          { required: true, message: "是否有任务必须选择！", trigger: "blur" }
        ],
      },   
      marklist:[]
    };
  },
  created() {
    this.getdata();
    this.getDDll();
  },
  watch: {
    value(val, oldval) {
      if(val){
        this.temp.StartTime = val[0];
        this.temp.Deadline = val[1];
      }else{
        this.temp.StartTime='';
        this.temp.Deadline='';
      }
    }
  },
  methods: {
    getmark(){
      request({
        url: "ARemarks/GetRemarksAllList",
        method: "get",
        params:{}
      }).then(response => {
        if (response.Status==1) {    
          this.marklist=response.List;
        }            
      });
    },
    setstatus(code){
      for(let i in this.Model){
        if(this.Model[i].Value == code){
          return this.Model[i].Text;
        }
      }
    },
    handlzhuagntai(row,type){      
      var data = this.$qs.stringify({ Id: row.Id,status:type});
      var str= type==1?'上架':type==2?'结束活动':'下架';
      this.$confirm("确定要"+str+"该活动吗？", "提示", {
        dangerouslyUseHTMLString: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(() => {
          request({
            url: "Activity/SetStatus",
            method: "post",
            data
          }).then(response => {
            if (response.Status==1) {
              row.Status=type;
              this.$message({
                message: response.Msg,
                type: "success"
              });
            }
          });
        })
        .catch(() => {});
    },
    handlerenwu(row){
      this.$router.push({
        path: "/miaosha/list/list-add-renwu",
        query: { id:row.Id }
      });
    },
    handlechanpin(row){
      this.$router.push({
        path: "/miaosha/list/list-add-chanpin",
        query: { id:row.Id }
      });
    },
    getDDll(){      
      request({
        url: "Activity/DDL",
        method: "get",
        params:{}
      }).then(response => {
        if (response.Status==1) {    
          this.Model=response.Model;
        }            
      });
    },
    getdata(){
      this.listLoading=true;
      request({
        url: "Activity/GetActivityList",
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
      this.getmark();
      if(row==0){
        this.titles='增加活动';
        this.temp.Id=0;
        this.temp.Name='';
        this.temp.StartTime='';
        this.temp.Deadline='';
        this.temp.IsMission=false;
        this.temp.ARId='';
        this.iscreat=true;
      }else{
        this.titles='修改活动';
        this.temp.Id=row.Id;
        this.temp.Name=row.Name;
        this.value=[new Date(row.StartTimeStr),new Date(row.DeadlineStr)];
        this.temp.StartTime=row.StartTimeStr;
        this.temp.Deadline=row.DeadlineStr;
        this.temp.ARId=row.ARId;
        this.temp.IsMission=row.IsMission==0?false:true;
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
            url: "Activity/DelActivity",
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
    handleFilter(){
      this.listQuery.pageIndex = 1;
      this.getdata();
    },
    createData(){      
      let Mission=this.temp.IsMission?1:0;
      if(!this.temp.IsMission){
        this.temp.ARId=0;
      }
      let subdata={
        Id:this.temp.Id,
        Name:this.temp.Name,
        StartTime:this.temp.StartTime,
        Deadline:this.temp.Deadline,
        IsMission:Mission,
        ARId:this.temp.ARId
      }
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          var data = this.$qs.stringify(subdata);
          request({
            url: "Activity/SetActivity",
            method: "post",
            data
          }).then(response => {
            if (response.Status==1) { 
              if(this.iscreat){
                let param={
                  Id:response.AId,
                  Name:this.temp.Name,
                  StartTimeStr:this.temp.StartTime,
                  DeadlineStr:this.temp.Deadline,
                  IsMission:Mission,
                  ARId:this.temp.ARId,
                  PV:0,
                  UV:0,
                  Status:0
                }     
                this.list.push(param);              
              }else{
                for(let i in this.list){
                  if (this.list[i].Id == this.temp.Id){
                    this.list[i].Name=this.temp.Name;
                    this.list[i].StartTimeStr=this.temp.StartTime;
                    this.list[i].DeadlineStr=this.temp.Deadline;
                    this.list[i].ARId=this.temp.ARId;
                    this.list[i].IsMission=Mission;
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
.miaoshalist {
  .img{width:40px; height:40px;}
  .status3{color:#F56C6C;}
  .status0{color:#67C23A;}
  .status1{color:#E6A23C;}
  .status2{color:#409EFF;}
  .status4{color:#909399;}
  .qingkong{margin-left: 30px; color: #409EFF;}
}
</style>
