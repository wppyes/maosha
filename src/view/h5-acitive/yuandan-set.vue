<template>
  <div class="DrawPrize boxright">    
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row>
      <el-table-column label="剩余总数量" align="center" prop="SurplusCount"></el-table-column>
      <el-table-column label="当日剩余数量" align="center" prop="DayCount"></el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="handleditor(scope.row)">
            <i class="el-icon-edit"></i>
          </el-button> 
        </template>
      </el-table-column>
    </el-table> 
    <el-dialog title="修改" :visible.sync="dialogFormVisible" :close-on-click-modal="false" width="600px">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="100px"
        style="width: 500px;"
      >       
        <el-form-item label="数量" prop="Count">
          <el-input placeholder="请输入数量"  v-model="temp.Count"/>
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
      dialogFormVisible:false,//是否展示弹框
      temp:{
        Id:0,
        Count:''
      }, 
      rules:{  
        Count: [
          { required: true, message: "请输入数量!", trigger: "blur" }
        ],
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList(){
      this.listLoading = true;
      request({
        url: "YuanDan/YDPrize/GetPrize",
        method: "get",
        params: {}
      }).then(response => {
        if (response.Status == 1) {
          let list=[];
          list.push(response.Model)
          this.list=list;
          this.listLoading = false;
        }
      });
    }, 
    handleditor(row) {
      this.temp.Id=row.Id;
      this.temp.Count=row.Count;
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    createData(){
      this.$refs["dataForm"].validate(valid => {
        if (valid) { 
          var param={
              Id:this.temp.Id,
              Count:this.temp.Count
          };     
          var data = this.$qs.stringify(param);
          request({
            url: "YuanDan/YDPrize/UpdatePrize",
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
  }
};
</script>
<style lang="scss" rel="stylesheet/scss">

</style>
