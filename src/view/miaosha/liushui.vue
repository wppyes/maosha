<template>
  <div class="activity boxright">
    <div class="filter-container">
      <el-input
        placeholder="姓名/手机号码/产品名字/订单编号/用户编号"
        v-model="listQuery.title"
        style="width: 350px;"
        class="filter-item"
        clearable
      />      
      <el-date-picker
        class="filter-item"
        v-model="value7"
        type="daterange"
        align="left"
        unlink-panels
        range-separator="-"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        value-format="yyyy-MM-dd"
      ></el-date-picker>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button
        :loading="downloadLoading"
        class="filter-item"
        type="primary"
        icon="el-icon-download"
        @click="handleDownload"
      >下载订单流水</el-button>
      <span class="red">总支付金额：{{PayAmount}}</span>
    </div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row>
      <el-table-column label="内部订单编号" align="center" prop="OrderNum" width="180px"></el-table-column>
      <el-table-column label="银行订单编号" align="center" prop="PayOrderNum" width="180px"></el-table-column>
      <el-table-column label="产品名称" align="center" prop="Title"></el-table-column>
      <el-table-column label="订单金额" align="center" prop="Amount" width="80px"></el-table-column>
      <el-table-column label="支付金额" align="center" prop="PayAmount" width="80px"></el-table-column>
      <el-table-column label="时间" align="center" prop="CreatedStr" width="180px"></el-table-column>
    </el-table>

    <pagination
      small
      layout="total,prev, pager, next"
      :total="total"
      :page.sync="listQuery.pageIndex"
      :limit.sync="listQuery.pageSize"
      @pagination="getList"
    />

  </div>
</template>
<script>
import request from "@/utils/request";
import Pagination from "@/components/Pagination";
var tabarr = [];
export default {
  name: "activity",
  components: { Pagination },
  data() {
    return {
      titles:'',
      Model: [],
      list: [], //列表
      total: 0, //总数量
      listLoading: false, //列表加载
      downloadLoading:false,
      listQuery: {
        //搜素分页处理
        title: "",
        pageIndex: 1,
        pageSize: 15,
        starttime:'',
        endtime:''
      },
      item:{},
      value7:'',
      PayAmount:0
    };
  },
  created() {
    this.getList();
  },
  mounted() {
  },
  watch: {
    value7(val, oldval) {
      if(val){
        this.listQuery.starttime = val[0];
        this.listQuery.endtime = val[1];
      }else{
        this.listQuery.starttime='';
        this.listQuery.endtime='';
      }
    }
  },
  methods: {
    handleDownload(){
      this.downloadLoading = true;
      this.$confirm("确定要下载订单流水吗？", '提示', {
          dangerouslyUseHTMLString: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
          console.log(1);
          request({
            url: "Transaction/Excel",
            method: "get",
            params: {title:this.listQuery.title,starttime:this.listQuery.starttime,endtime:this.listQuery.endtime}
          }).then(response => {
              if(response.Status==1){
                import('@/vendor/Export2Excel').then(excel => {
                  const tHeader = response.TableTitle;
                  const filterVal = response.TableField;
                  const data = this.formatJson(filterVal, response.List)
                  if(response.List){
                    excel.export_json_to_excel({
                      header: tHeader,
                      data,
                      filename: '订单流水'
                    });
                  }
                
              }); 
              this.downloadLoading = false
            }          
          });          
        }).catch(() => {   
          this.downloadLoading = false      
        });
    }, 
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
          return v[j]
      }))
    },
    getList() {
      this.listLoading = true;
      request({
        url: "Transaction/GetTransactionList",
        method: "get",
        params: this.listQuery
      }).then(response => {
        if (response.Status == 1) {
          this.list = response.List;
          this.total = response.PageCount;
          this.PayAmount=response.PayAmount;
          this.listLoading = false;
        }
      });
    },
    handleFilter() {
      this.listQuery.pageIndex = 1;
      this.getList();
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss">
.activity {
  .img {
    width: 40px;
    height: 40px;
  }
  .status3 {
    color: #f56c6c;
  }
  .red{padding-left: 10px; color: #f00;}
  .status0 {
    color: #67c23a;
  }
  .status1 {
    color: #e6a23c;
  }
  .status2 {
    color: #409eff;
  }
  .status4 {
    color: #909399;
  }
  .qingkong {
    margin-left: 30px;
    color: #409eff;
  }
  ul li{list-style: none; line-height: 30px;}
  .flex{display: flex;}
  .flex ul{width: 570px; margin-left: 10px;
  }
}
</style>
