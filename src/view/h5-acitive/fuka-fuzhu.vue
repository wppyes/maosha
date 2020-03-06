<template>
  <div class="hongbaolist boxright">
     <div class="filter-container">
      <el-input
        placeholder="手机号码"
        v-model="listQuery.phone"
        style="width: 150px;"
        class="filter-item"
        clearable
      />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="getdata">搜索</el-button>
    </div>
     <el-table v-loading="listLoading" :data="list" border fit highlight-current-row>
      <el-table-column label="手机号码" align="center" prop="Phone"></el-table-column>
      </el-table-column>
      <el-table-column label="昵称" align="center" prop="NickName"></el-table-column>
      <el-table-column label="金额" align="center" prop="Balance" width="80px"></el-table-column>
      <el-table-column label="种类" align="center" prop="Num" width="80px"></el-table-column>
      <el-table-column label="卡片" align="center" prop="Card"></el-table-column>
      </el-table-column>

      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="kapian(scope.row)">
            发放卡片
          </el-button>     
          <el-button size="mini" type="primary" @click="hongbao(scope.row)">
            发放红包
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
 
        <el-form-item label="选择" prop="id">
          <el-select
            v-model="temp.id"
            placeholder="类型"
            clearable
            style="width: 150px"
            class="filter-item"
          >
            <el-option v-for="item in arr" :label="item" :value="item" :key="item"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="createData">确定</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="dialogStatus" :visible.sync="dialogVisible" :close-on-click-modal="false" width="600px">
      <el-form
        ref="dataForm1"
        :rules="rules1"
        :model="temp1"
        label-position="left"
        label-width="100px"
        style="width: 500px; margin-left:50px;"
      >       
 
        <el-form-item label="选择" prop="id">
          <el-select
            v-model="temp1.id"
            placeholder="类型"
            clearable
            style="width: 150px"
            class="filter-item"
          >
            <el-option v-for="item in model" :label="item.Amount" :value="item.Id" :key="item.Id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="createData1">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import request from "@/utils/request";

export default {
  name: "hongbaolist",
  data() {
    return {
      list:[],  
      listLoading:false,
      listQuery:{
        phone:''
      },
      arr:[1,2,3,4,5,6,7,8,9,10],
      dialogStatus:'',
      dialogFormVisible:false,
      dialogVisible:false,
      rules:{        
        id: [
          { required: true, message: "请选择id！", trigger: "blur" }
        ],
      },
      temp:{
        uid:'',
        id:''
      },
      temp1:{
        uid:'',
        id:''
      },
      rules1:{        
        id: [
          { required: true, message: "请选择id！", trigger: "blur" }
        ],
      },
      model:[]
    };
  },
  created() {
    request({
        url: "SuctionPowder/SPPrize/GetPrizeList",
        method: "get",
        params:{}
      }).then(response => {
        if (response.Status==1) {   
          this.model=response.List;
        }            
      });
  },
  methods: {
    getdata(){
      this.listLoading=true;
      request({
        url: "SuctionPowder/SPUser/GetUser",
        method: "get",
        params:this.listQuery
      }).then(response => {
        if (response.Status==1) {   
          this.list=response.Model;
          this.listLoading=false;  
        }            
      });
    },
    createData(){
      this.$refs["dataForm"].validate(valid => {
        if (valid) {          
          var data = this.$qs.stringify(this.temp);
          request({
            url: "SuctionPowder/SPUser/FaKa",
            method: "post",
            data
          }).then(response => {
            if (response.Status==1) {
              this.dialogFormVisible=false;
              this.$message({
                message: response.Msg,
                type: "success"
              });
            }
          });
        }
      });
    },
    createData1(){
      this.$refs["dataForm1"].validate(valid => {
        if (valid) {          
          var data = this.$qs.stringify(this.temp1);
          request({
            url: "SuctionPowder/SPUser/SetFaHongBao",
            method: "post",
            data
          }).then(response => {
            if (response.Status==1) {
              this.dialogVisible=false;
              this.$message({
                message: response.Msg,
                type: "success"
              });
            }
          });
        }
      });
    },
    kapian(row) {
      this.temp.uid=row.Uid;
      this.temp.id='';  
      this.dialogStatus='发放卡片';
      this.dialogFormVisible=true;
    },
    hongbao(row){
      this.temp1.uid=row.Uid;
      this.temp1.id='';  
      this.dialogStatus='发放卡片';
      this.dialogVisible=true;
    },
  }
};
</script>
<style lang="scss" rel="stylesheet/scss">

</style>
