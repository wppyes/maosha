<template>
  <div class="renwu boxright">
    <div class="back">
      <span @click="backto">
        <i class="el-icon-arrow-left"></i>返回
      </span>
    </div>
    <div class="filter-container" v-if="AStatus==0 || Role==1">
      <div class="filter-item" style="margin-right:20px;">
        <el-button type="primary" @click="handleadd">
          <i class="el-icon-circle-plus"></i> 增加任务
        </el-button>
      </div>
    </div>
    <el-table v-loading="listLoading1" :data="renwulist" border fit highlight-current-row>
      <el-table-column label="名称" align="center" prop="Name"></el-table-column>
      </el-table-column>
      <el-table-column label="任务指标" align="center" prop="Count"></el-table-column>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="linktoeditor(scope.row)" v-if="AStatus==0 || Role==1">
            <i class="el-icon-edit"></i>
          </el-button>
          <el-button size="mini" type="danger" @click="handledel(scope.row)" v-if="AStatus==0 || Role==1">
            <i class="el-icon-delete"></i>
          </el-button>
        </template>
      </el-table-column>
    </el-table> 
    <el-dialog :title="titles" :visible.sync="dialogVisible" :close-on-click-modal="false" width="500px">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" style="width: 400px;">
        <el-form-item label="任务" prop="MId">          
          <el-select
            v-model="temp.MId"
            placeholder="选择任务"
            class="filter-item"
            :disabled="!iscreate"
          >
            <el-option v-for="item in list" :label="item.Name" :value="item.Id" :key="item.Id"></el-option>
          </el-select> 
        </el-form-item>
        <el-form-item label="任务指标" prop="Count">
          <el-input v-model="temp.Count" placeholder="请填写任务指标"/>
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

export default {
  name: "renwu",
  data() {
    return {
      listLoading1:false,
      dialogVisible:false,
      titles:'',
      temp:{
        Id:0,
        Activity:'',
        MId:'',
        Count:'',//
        Name:''//名称
      },
      AStatus:'',
      list:[],
      iscreate:false,
      renwulist:[],
      Role:0,
      rules: {
        Count: [
          { required: true, message: "任务指标必须填写！", trigger: "blur" }
        ],
        MId: [
          { required: true, message: "任务必须选择！", trigger: "blur" }
        ],
      },   
    };
  },
  created() {
    this.getdata();
    this.getalrenwu();
    this.temp.Activity=this.$route.query.id;
  },
  mounted () {
    this.$bus.$on('renwuchange', ()=> {
      this.getdata();
    })
  },
  methods: {
    getalrenwu(){
      this.listLoading1=true;
      request({
        url: "AMission/GetAMissionList",
        method: "get",
        params:{activity:this.$route.query.id}
      }).then(response => {
        if (response.Status==1) {   
          this.renwulist=response.List;   
          this.listLoading1=false;
          this.AStatus=response.AStatus;          
          this.Role=response.Role;
        }            
      });
    },
    backto() {
      this.$router.go(-1);
    },
    getdata(){ 
      request({
        url: "Mission/GetMissionAllList",
        method: "get",
        params:{}
      }).then(response => {
        if (response.Status==1) {   
          this.list=response.List;  
        }            
      });
    },
    handleadd(){
      this.titles='增加任务';
      this.temp.Id=0;
      this.temp.Count='';
      this.temp.Name='';
      this.temp.MId='';
      this.iscreate=true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
      this.dialogVisible=true;
    },
    gettempdata(){
      if(this.temp.MId==''){
        return;
      }
      for(let i in this.list){
        if(this.list[i].Id==this.temp.MId){
          this.temp.Name=this.list[i].Name;
          return;
        }
      }
    },
    linktoeditor(row){
      this.titles='修改任务';
      this.temp.Id=row.Id;
      this.temp.Count=row.Count;
      this.temp.Name=row.Name;
      this.temp.MId=row.MId;
      this.iscreate=false;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
      this.dialogVisible=true;
    },
    handledel(row) {
      var data = this.$qs.stringify({ Id: row.Id});
      this.$confirm("确定要移除该任务吗？", "提示", {
        dangerouslyUseHTMLString: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(() => {
          request({
            url: "AMission/DelAMission",
            method: "post",
            data
          }).then(response => {
            if (response.Status==1) {
              const index = this.renwulist.indexOf(row);
              this.renwulist.splice(index, 1);
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
      this.gettempdata();    
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          var data = this.$qs.stringify(this.temp);
          request({
            url: "AMission/SetAMission",
            method: "post",
            data
          }).then(response => {
            if (response.Status==1) { 
              this.dialogVisible = false
              this.$message({
                message: response.Msg,
                type: 'success'
              });
              if(this.iscreate){
                let param={
                  Id:response.AId,
                  Activity:this.temp.Activity,
                  MId:this.temp.MId,
                  Count:this.temp.Count,//
                  Name:this.temp.Name//名称
                }
                this.renwulist.push(param);
              }else{
                 for(let i in this.renwulist){
                  if (this.renwulist[i].Id == this.temp.Id){
                    this.renwulist[i].MId=this.temp.MId;
                    this.renwulist[i].Name=this.temp.Name;
                    this.renwulist[i].Count=this.temp.Count;
                    break;
                  }  
                }
              }
            }            
          });
        }
      });
    },
  }
};
</script>
<style lang="scss" rel="stylesheet/scss">
  .renwu{ 
    h3{
      margin: 40px 0 20px;
      font-weight: 400;
      color: #1f2f3d;
      font-size: 22px;
    }
  }
</style>
