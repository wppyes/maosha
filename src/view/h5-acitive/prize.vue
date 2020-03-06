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
      <el-table-column label="PId" align="center" prop="PId"></el-table-column>
      <el-table-column label="奖金" align="center" prop="Amount"></el-table-column>
      <el-table-column label="标题" align="center" prop="Name"></el-table-column>
      <el-table-column label="数量" align="center" prop="Num" width="100px"></el-table-column>
      <el-table-column label="剩余数量" align="center" prop="Balance" width="100px"></el-table-column>
      <el-table-column label="日限额" align="center" prop="Quota" width="150px"></el-table-column>
      <el-table-column label="日限额余量" align="center" prop="Qbalance" width="150px"></el-table-column>
      <el-table-column label="概率" align="center" prop="Rate" width="100px"></el-table-column>
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          <span :class="scope.row.Disabled==0?'maincolor':'pinkcolor'">{{scope.row.Disabled==0?'启用':'禁用'}}</span>  
          <el-button size="mini" :type="scope.row.Disabled==1?'primary':'danger'" @click="changestatus(scope.row)">
            {{scope.row.Disabled==1?'启用':'禁用'}}
          </el-button> 
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="handleditor(scope.row,'修改奖品',false)">
            <i class="el-icon-edit"></i>
          </el-button>
          <el-button size="mini" type="danger" @click="handledel(scope.row)">
            <i class="el-icon-delete"></i>
          </el-button>  
          <el-button size="mini" type="" @click="quan(scope.row)" v-if="scope.row.Type==3">
            导入券码(剩余{{scope.row.Counts}})
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
        <el-form-item label="PId" prop="PId">
          <el-input placeholder="请输入PId"  v-model="temp.PId" style="width: 215px;"/>
        </el-form-item>
        <el-form-item label="奖金" prop="Amount">
          <el-input placeholder="请输入奖金"  v-model="temp.Amount" style="width: 215px;"/>
        </el-form-item>
        <el-form-item label="标题" prop="Name">
          <el-input placeholder="请输入标题"  v-model="temp.Name" style="width: 215px;"/>
        </el-form-item>
        <el-form-item label="总数量" prop="Num">
          <el-input placeholder="请输入总数量"  v-model="temp.Num" style="width: 215px;"/>
        </el-form-item>
        <el-form-item label="剩余数量" prop="Balance">
          <el-input placeholder="请输入剩余数量"  v-model="temp.Balance" style="width: 215px;"/>
        </el-form-item>
        <el-form-item label="概率" prop="Rate">
          <el-input placeholder="请输入概率"  v-model="temp.Rate" style="width: 215px;"/>
        </el-form-item>
        <el-form-item label="日限额" prop="Quota">
          <el-input placeholder="请输入日限额"  v-model="temp.Quota" style="width: 215px;"/>
        </el-form-item>
        <el-form-item label="日限余量" prop="Qbalance">
          <el-input placeholder="请输入日限余量"  v-model="temp.Qbalance" style="width: 215px;"/>
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
        PId:'',
        Amount:'',
        Name:'',
        Num:'',
        Balance:'',
        Rate:'',
        Quota:'',
        Qbalance:'',
        Disabled:0
      }, 
      rules:{  
        PId: [
          { required: true, message: "请输入PId！", trigger: "blur" }
        ],
        Amount: [
          { required: true, message: "请输入奖金！", trigger: "blur" }
        ],
        Name: [
          { required: true, message: "请输入标题！", trigger: "blur" }
        ],
        Num:[
          { required: true, message: "请填写数量", trigger: "blur" }
        ],
        Balance:[
          { required: true, message: "请填写剩余数量", trigger: "blur" }
        ],
        Rate:[
          { required: true, message: "请填写概率", trigger: "blur" }
        ],
        Quota:[
          { required: true, message: "请填写每日中奖数量", trigger: "blur" }
        ],
        Qbalance:[
          { required: true, message: "请填写日限余量", trigger: "blur" }
        ],
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    changestatus(row){
      var str=row.Disabled==0?'禁用':'启用';
      var num=row.Disabled==0?1:0;
      var data = this.$qs.stringify({ id: row.Id,disabled:num});
      this.$confirm("确定要"+str+"吗？", "提示", {
        dangerouslyUseHTMLString: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(() => {
          request({
            url: "QianYi/Prize/UpdateDisabled",
            method: "post",
            data
          }).then(response => {
            if (response.Status==1) {
              this.$message({
                message: response.Msg,
                type: "success"
              });
              row.Disabled=num;
            }
          });
        })
        .catch(() => {});
    },
    getList(){
      this.listLoading = true;
      request({
        url: "QianYi/Prize/GetPrizeList",
        method: "get",
        params: {}
      }).then(response => {
        if (response.Status == 1) {
          this.list=response.List;
          this.listLoading = false;
        }
      });
    },
    handleadd(title,creat){
      this.temp.Id=0;
      this.temp.PId='';
      this.temp.Amount='';
      this.temp.Name='';
      this.temp.Num='';
      this.temp.Balance='';
      this.temp.Rate=''; 
      this.temp.Quota=''; 
      this.temp.Qbalance='';
      this.temp.Disabled=0;
      this.dialogStatus = title;
      this.dialogFormVisible = true;
      this.iscreate = creat;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },   
    handleditor(row, title, creat) {
      this.temp.Id=row.Id;
      this.temp.PId=row.PId;
      this.temp.Amount=row.Amount;
      this.temp.Name=row.Name;
      this.temp.Num=row.Num;
      this.temp.Balance=row.Balance;
      this.temp.Rate=row.Rate;
      this.temp.Quota=row.Quota;
      this.temp.Qbalance=row.Qbalance;
      this.temp.Disabled=row.Disabled;
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
              PId:this.temp.PId,
              Amount:this.temp.Amount,
              Name:this.temp.Name,
              Num:this.temp.Num,
              Balance:this.temp.Balance,
              Quota:this.temp.Quota,
              Rate:this.temp.Rate,
              Qbalance:this.temp.Qbalance,
              Disabled:this.temp.Disabled
          };     
          var data = this.$qs.stringify(param);
          request({
            url: "QianYi/Prize/SetPrize",
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
            url: "QianYi/Prize/DelPrize",
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
