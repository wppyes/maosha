<template>
  <div class="hongbaolist boxright">
     <el-table v-loading="listLoading" :data="list" border fit highlight-current-row>
      <el-table-column label="手机号码" align="center" prop="Phone"></el-table-column>
      </el-table-column>
      <el-table-column label="金额" align="center" prop="Amount"></el-table-column>
      <el-table-column label="时间" align="center" prop="CreateTimeStr"></el-table-column>
      </el-table-column>

      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="handledel(scope.row)">
            发放红包
          </el-button>         
        </template>
      </el-table-column>
    </el-table> 

  </div>
</template>
<script>
import request from "@/utils/request";

export default {
  name: "hongbaolist",
  data() {
    return {
      list:[],  
      listLoading:false
    };
  },
  created() {
    this.getdata();
  },
  methods: {
    getdata(){
      this.listLoading=true;
      request({
        url: "QianYi/Log/GetLogList",
        method: "get",
        params:this.listQuery
      }).then(response => {
        if (response.Status==1) {   
          this.list=response.List;
          this.listLoading=false;  
        }            
      });
    },
    handledel(row) {
      var data = this.$qs.stringify({ Id: row.Id});
      this.$confirm("确定要发放吗？", "提示", {
        dangerouslyUseHTMLString: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(() => {
          request({
            url: "QianYi/Log/UpdatePrize",
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
  }
};
</script>
<style lang="scss" rel="stylesheet/scss">

</style>
