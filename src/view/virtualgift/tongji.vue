<template>
  <div class="tongji boxright">
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row>
      <el-table-column label="公司名称" prop="Name" align="center"></el-table-column>
      <el-table-column label="历史账单" prop="Payment" align="center">
        <template slot-scope="scope">
          <el-tag size="small" style="cursor: pointer;" @click="handlehistory(scope.row,'历史账单')">
            点击查看
          </el-tag>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :title="dialogStatus" :visible.sync="dialogVisible" width="850px" height="600px">
      <el-table v-loading="listLoading1" :data="tablist" border fit highlight-current-row>
        <el-table-column label="月份" prop="Month" align="center">
        </el-table-column>
        <el-table-column label="期初余额" align="center">
              <template slot-scope="scope">
                   {{parseFloat(scope.row.InitalBalance).toLocaleString()}}               
              </template>
        </el-table-column>
        <el-table-column label="加款金额" align="center">
            <template slot-scope="scope">
              {{parseFloat(scope.row.IncomeAmount).toLocaleString()}}    
            </template>
        </el-table-column>
        <el-table-column label="消费金额" align="center">
            <template slot-scope="scope">
              {{parseFloat(scope.row.ConsumeAmount).toLocaleString()}}    
            </template>
        </el-table-column>
        <el-table-column label="期末金额" align="center">
            <template slot-scope="scope">
              {{parseFloat(scope.row.EndingBalance).toLocaleString()}}  
            </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="total>0"
        layout="total,prev, pager, next"
        :total="total"
        :page.sync="historylist.pageIndex"
        :limit.sync="historylist.pageSize"
        @pagination="gethistory"
      />
    </el-dialog>  
  </div>
</template>
<script>
import request from "@/utils/request";
import Pagination from "@/components/Pagination";
export default {
  name: "tongji",
  components: { Pagination },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      dialogVisible:false,
      dialogStatus:'',
      listLoading1:true,
      historylist:{
        CId:'',
        pageIndex:1,
        pageSize:10
      },
      tablist:[],
      total:0
    };
  },
  created() {
    this.getList();
  },
  methods: {
    handlehistory(row,title){
      this.dialogStatus=row.Name+'-'+title;
      this.historylist.CId=row.Id;
      this.historylist.pageIndex=1;
      this.dialogVisible=true;
      this.gethistory();
    },
    gethistory(){
      this.listLoading1 = true;
      request({
        url: "CustomerBill/GetCustomerBillList",
        method: "get",
        params: this.historylist
      }).then(response => {
        if(response.Status==1){
        this.tablist = response.List;
        this.total = response.PageCount;
        this.listLoading1 = false;
        }
      });
    },
    getList() {
      this.listLoading = true;
      request({
        url: "CustomerBill/GetCustomerList",
        method: "get",
        params: {}
      }).then(response => {
        if(response.Status==1){
        this.list = response.List;
        this.listLoading = false;
        }
      });
    },
  }
};
</script>
<style lang="scss" rel="stylesheet/scss">

.tongji{  
  .el-row {
    line-height: 38px;
    color: #303133;
    .el-col {
      border-radius: 4px;
      margin-bottom: 20px;
      .box {
        text-indent: 20px;
        border-radius: 4px;
        min-height: 36px;
        border: 1px solid #ebeef5;
        .el-row {
          border-top: 1px solid #ebeef5;
          padding: 10px 0;
          .el-col {
            margin-bottom: 0;
          }
        }
        .el-icon-refresh {
          margin-left: -10px;
        }
      }
    }
  }
  .title {
    color: #303133;
    font-weight: normal;
  }
  .status4 {
    color: #409eff;
  }
  .status2 {
    color: #67c23a;
  }
  .status3 {
    color: #f56c6c;
  }
  .status1 {
    color: #e6a23c;
  }
  .status5 {
    color: #500f51;
  }
  .status6 {
    color: #51210f;
  }
  .tab {
    margin-bottom: 20px;
    span {
      margin-right: 10px;
      cursor: pointer;
    }
  }
  .tips {
    line-height: 30px;
    margin-top: 5px;
    color: #303133;
  }
}
</style>
