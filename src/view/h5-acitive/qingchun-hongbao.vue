<template>
  <div class="DrawPrize boxright">    
    <div class="filter-container">
      <div class="filter-item" style="margin-right:20px;">
        <el-button type="primary" @click="handleadd('增加红包',true)">
          <i class="el-icon-circle-plus"></i> 增加红包
        </el-button>   
      </div> 
      <el-input class="filter-item" v-model="quety.openid" style="width: 115px;"/>
      <el-input class="filter-item" v-model="quety.amount" style="width: 115px;"/>  
      <el-button  class="filter-item" type="primary" @click="yep">
          确定
      </el-button>  
    </div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row show-summary :summary-method="getall">
      <el-table-column label="奖金" align="center" prop="Amount"></el-table-column>
      <el-table-column label="数量" align="center" prop="Num"></el-table-column>
      <el-table-column label="剩余数量" align="center" prop="SurplusNum"></el-table-column>
      <el-table-column label="概率" align="center" prop="Rate"></el-table-column>
      <el-table-column label="消费金额" align="center" prop="jine">
        <template slot-scope="scope">
          {{scope.row.Amount*(scope.row.Num-scope.row.SurplusNum)}}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="handleditor(scope.row,'修改红包',false)">
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
 
        <el-form-item label="奖金" prop="Amount">
          <el-input placeholder="请输入奖金"  v-model="temp.Amount" style="width: 215px;"/>
        </el-form-item>
        <el-form-item label="数量" prop="Num">
          <el-input placeholder="请输入数量"  v-model="temp.Num" style="width: 215px;"/>
        </el-form-item>
        <el-form-item label="剩余数量" prop="SurplusNum">
          <el-input placeholder="请输入剩余数量"  v-model="temp.SurplusNum" style="width: 215px;"/>
        </el-form-item>
        <el-form-item label="概率" prop="Rate">
          <el-input placeholder="请输入卡片概率"  v-model="temp.Rate" style="width: 215px;"/>
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
        Amount:'',
        Num:'',
        SurplusNum:'',
        Rate:''
      }, 
      quety:{
        openid:'',
        amount:''
      },
      rules:{  
        Amount: [
          { required: true, message: "请输入奖金！", trigger: "blur" }
        ],
        Num:[
          { required: true, message: "请填写数量", trigger: "blur" }
        ],
        SurplusNum:[
          { required: true, message: "请填写剩余数量", trigger: "blur" }
        ],
        Rate:[
          { required: true, message: "请填写概率", trigger: "blur" }
        ],
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    yep(){
      if(this.quety.openid==''){
        this.$message({
          message: '错误操作',
          type: "error"
        });
        return
      }
      if(this.quety.amount==''){
        this.$message({
          message: '错误操作',
          type: "error"
        });
        return
      }
       var data = this.$qs.stringify(this.quety);
        request({
          url: "GuardYouth/GYPrize/GetHongBao",
          method: "post",
          data
        }).then(response => {
          if (response.Status==1) {          
            this.$message({
              message: response.Msg,
              type: "success"
            });
          }
        });
    },
    getall(param){
        const { columns, data } = param;
        const sums = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '总计';
            return;
          }
          if(column.property=='jine'){
            var num=0;
            for(var i in this.list){
              num+=this.list[i].Amount*(this.list[i].Num-this.list[i].SurplusNum)
            }
            sums[index] = num;
          }else{
            sums[index] = '';
          }
        });

        return sums;
    },
    getList(){
      this.listLoading = true;
      request({
        url: "GuardYouth/GYPrize/GetGYPrizeList",
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
      this.temp.Amount='';
      this.temp.Num='';
      this.temp.SurplusNum='';
      this.temp.Rate=''; 
      this.dialogStatus = title;
      this.dialogFormVisible = true;
      this.iscreate = creat;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },   
    handleditor(row, title, creat) {
      this.temp.Id=row.Id;
      this.temp.Amount=row.Amount;
      this.temp.Num=row.Num;
      this.temp.SurplusNum=row.SurplusNum;
      this.temp.Rate=row.Rate;
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
              Amount:this.temp.Amount,
              Num:this.temp.Num,
              SurplusNum:this.temp.SurplusNum,
              Rate:this.temp.Rate
          };     
          var data = this.$qs.stringify(param);
          request({
            url: "GuardYouth/GYPrize/SetGYPrize",
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
      this.$confirm("确定要删除红包吗？", "提示", {
        dangerouslyUseHTMLString: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(() => {
          request({
            url: "GuardYouth/GYPrize/DelPrize",
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
  .el-table__footer-wrapper tbody td{color: #f00;}
}
</style>
