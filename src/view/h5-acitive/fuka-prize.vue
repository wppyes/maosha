<template>
  <div class="DrawPrize boxright">    
    <div class="filter-container">
      <div class="filter-item" style="margin-right:20px;">
        <el-button type="primary" @click="handleadd('增加奖品',true)">
          <i class="el-icon-circle-plus"></i> 增加奖品
        </el-button>   
      </div>           
    </div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row>
      <el-table-column label="类型" align="center" prop="Type">
         <template slot-scope="scope">
           <span v-text="setype(scope.row.Type)"></span>
        </template>
      </el-table-column>
      <el-table-column label="标题" align="center" prop="Title"></el-table-column>
      <el-table-column label="数量" align="center" prop="Num" width="100px"></el-table-column>
      <el-table-column label="剩余数量" align="center" prop="SurplusNum" width="100px"></el-table-column>
      <el-table-column label="卡片数量" align="center" prop="CardNum" width="150px"></el-table-column>
      <el-table-column label="卡片余量" align="center" prop="CardSNum" width="150px"></el-table-column>
      <el-table-column label="日限额" align="center" prop="DayNum" width="150px"></el-table-column>
      <el-table-column label="日限额余量" align="center" prop="DaySNum" width="150px"></el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="handleditor(scope.row,'修改奖品',false)">
            <i class="el-icon-edit"></i>
          </el-button>
          <el-button size="mini" type="danger" @click="handledel(scope.row)">
            <i class="el-icon-delete"></i>
          </el-button>  
        </template>
      </el-table-column>
    </el-table> 
    <el-dialog :title="dialogStatus" :visible.sync="dialogFormVisible" :close-on-click-modal="false" width="600px">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="100px"
        style="width: 500px; margin-left:50px;"
      >       
      
        <el-form-item label="类型" prop="Type">
          <el-select
            v-model="temp.Type"
            placeholder="选择类型"
            clearable
            style="width: 150px"
            class="filter-item"
          >
            <el-option v-for="item in Dll" :label="item.Text" :value="item.Value" :key="item.Value"></el-option>
          </el-select> 
        </el-form-item>
 
        <el-form-item label="标题" prop="Title">
          <el-input placeholder="请输入标题"  v-model="temp.Title" style="width: 215px;"/>
        </el-form-item>
        <el-form-item label="总数量" prop="Num">
          <el-input placeholder="请输入总数量"  v-model="temp.Num" style="width: 215px;"/>
        </el-form-item>
        <el-form-item label="剩余数量" prop="SurplusNum">
          <el-input placeholder="请输入剩余数量"  v-model="temp.SurplusNum" style="width: 215px;"/>
        </el-form-item>
        <el-form-item label="卡片数量" prop="CardNum">
          <el-input placeholder="请输入卡片数量"  v-model="temp.CardNum" style="width: 215px;"/>
        </el-form-item>
        <el-form-item label="卡片余量" prop="CardSNum">
          <el-input placeholder="请输入卡片余量"  v-model="temp.CardSNum" style="width: 215px;"/>
        </el-form-item>
        <el-form-item label="日限额" prop="DayNum">
          <el-input placeholder="请输入日限额"  v-model="temp.DayNum" style="width: 215px;"/>
        </el-form-item>
        <el-form-item label="日限余量" prop="DaySNum">
          <el-input placeholder="请输入日限余量"  v-model="temp.DaySNum" style="width: 215px;"/>
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
import upfile from "@/utils/upload";
export default {
  name: "DrawPrize",
  data() {
    return {
      list: [], //列表
      listLoading: false, //列表加载
      dialogStatus:'',//弹框标题
      dialogFormVisible:false,//是否展示弹框
      iscreate:true,//是否是增加
      temp:{
        Id:0,
        Type:'',
        Title:'',
        Num:'',
        SurplusNum:'',
        CardNum:'',
        CardSNum:'',
        DayNum:'',
        DaySNum:''
      }, 
      Dll:[],
      rules:{  
        Type: [
          { required: true, message: "请选择类型！", trigger: "blur" }
        ],
        Title: [
          { required: true, message: "请输入标题！", trigger: "blur" }
        ],
        Num:[
          { required: true, message: "请填写数量", trigger: "blur" }
        ],
        SurplusNum:[
          { required: true, message: "请填写剩余数量", trigger: "blur" }
        ],
        CardNum:[
          { required: true, message: "请填写卡片数量", trigger: "blur" }
        ],
        CardSNum:[
          { required: true, message: "请填写卡片剩余数量", trigger: "blur" }
        ],
        DayNum:[
          { required: true, message: "请填写日限数量", trigger: "blur" }
        ],
        DaySNum:[
          { required: true, message: "请填写日限余量", trigger: "blur" }
        ],
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    setype(type){
      for(let i in this.Dll){
        if(this.Dll[i].Value==type){
          return this.Dll[i].Text
        }
      }
    },
    getList(){
      this.listLoading = true;
      request({
        url: "SuctionPowder/Config/GetConfigList",
        method: "get",
        params: {}
      }).then(response => {
        if (response.Status == 1) {
          this.list=response.List;
          this.Dll=response.Dll;
          this.listLoading = false;
        }
      });
    },
    handleadd(title,creat){
      this.temp.Id=0;
      this.temp.Type='';
      this.temp.Title='';
      this.temp.Num='';
      this.temp.SurplusNum='';
      this.temp.CardNum=''; 
      this.temp.CardSNum=''; 
      this.temp.DayNum='';
      this.temp.DaySNum='';
      this.dialogStatus = title;
      this.dialogFormVisible = true;
      this.iscreate = creat;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },   
    handleditor(row, title, creat) {
      this.temp.Id=row.Id;
      this.temp.Type=row.Type.toString();
      this.temp.Title=row.Title;
      this.temp.Num=row.Num;
      this.temp.SurplusNum=row.SurplusNum;
      this.temp.CardNum=row.CardNum;
      this.temp.CardSNum=row.CardSNum;
      this.temp.DayNum=row.DayNum;
      this.temp.DaySNum=row.DaySNum;
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
              Type:this.temp.Type,
              Title:this.temp.Title,
              Num:this.temp.Num,
              SurplusNum:this.temp.SurplusNum,
              CardNum:this.temp.CardNum,
              CardSNum:this.temp.CardSNum,
              DayNum:this.temp.DayNum,
              DaySNum:this.temp.DaySNum
          };     
          var data = this.$qs.stringify(param);
          request({
            url: "SuctionPowder/Config/SetConfig",
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
    handledel(row) {
      var data = this.$qs.stringify({ Id: row.Id });
      this.$confirm("确定要删除奖品吗？", "提示", {
        dangerouslyUseHTMLString: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(() => {
          request({
            url: "SuctionPowder/Config/DelConfig",
            method: "post",
            data
          }).then(response => {
            if (response.Status==1) {
              this.$message({
                message: response.Msg,
                type: "success"
              });
              const index = this.list.indexOf(row);
              this.list.splice(index, 1);
            }
          });
        })
        .catch(() => {});
    },
  }
};
</script>
<style lang="scss" rel="stylesheet/scss">
.DrawPrize {
  .PrizeImg{width:40px; height:40px;}
  .title{margin:  20px 0;}
}
</style>
