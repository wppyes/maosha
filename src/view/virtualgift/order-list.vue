<template>
  <div class="activity boxright">
    <div class="filter-container">
      <el-input
        placeholder="产品id"
        v-model="listQuery.ItemId"
        style="width: 150px;"
        class="filter-item"
        clearable
      />
      <el-select
        v-model="listQuery.CId"
        placeholder="选择客户"
        clearable
        style="width: 150px"
        class="filter-item"
      >
        <el-option v-for="item in user" :label="item.Name" :value="item.Id" :key="item.Id"></el-option>
      </el-select>
      <el-select
        v-model="listQuery.PCategory"
        placeholder="产品分类"
        clearable
        style="width: 150px"
        class="filter-item"
      >
        <el-option v-for="item in type" :label="item.Name" :value="item.Id" :key="item.Id"></el-option>
      </el-select>
      <el-input
        placeholder="订单编号"
        v-model="listQuery.CustomerOrder"
        style="width: 150px;"
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
      
      <!-- <el-button
        :loading="downloadLoading"
        class="filter-item"
        type="primary"
        icon="el-icon-download"
        @click="handleDownload"
      >下载订单</el-button> -->
    </div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row>
      <el-table-column label="客户" align="center" prop="CustomerName" width="100px"></el-table-column>
      <el-table-column label="订单号" align="center" prop="CustomerOrder" width="200px"></el-table-column>
      <el-table-column label="批次" align="center" prop="Batch" width="160px"></el-table-column>
      <el-table-column label="产品信息" align="center" prop="Card">
        <el-table-column
          prop="ProductName"
          label="产品名字"
           width="100px"
          >
        </el-table-column>
        <el-table-column
          prop="ItemId"
           width="100px"
          label="产品id"
          >
        </el-table-column>
        <el-table-column
          prop="Card"
          label="卡"
          >
        </el-table-column>
         <el-table-column
          prop="PassWord"
          label="密"
          width="200">
        </el-table-column>
        <el-table-column
          prop="CardTime"
          align="center"
          label="有效期"
          width="130">
        </el-table-column>
      </el-table-column>
      <el-table-column label="面值" prop="Price" align="center" width="100px"></el-table-column>
      <el-table-column label="实扣金额" align="center" prop="ActualPrice" width="100px"></el-table-column>
      <el-table-column label="时间" align="center" prop="CreatedStr" width="160px"></el-table-column> 
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
      list: [], //列表
      total: 0, //总数量
      listLoading: false, //列表加载
      value7:'',
      downloadLoading:false,
      listQuery: {
        //搜素分页处理
        pageIndex: 1,
        pageSize: 10,
        CId: "",
        PCategory: "",
        ItemId: "",
        CustomerOrder: "",        
        starttime:'',
        endtime:''
      },
      type:[],
      user:[]
    };
  },
  created() {
    this.getList();
    this.getmodel();
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
      this.$confirm("确定要下载订单吗？", '提示', {
          dangerouslyUseHTMLString: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
          request({
            url: "Orders/GetOrderExcel",
            method: "get",
            params: {name:this.listQuery.name,
                      ordernum:this.listQuery.ordernum,
                      userid:this.listQuery.userid,
                      productname:this.listQuery.productname,
                      activityId:this.listQuery.activityId,
                      status:this.listQuery.status,
                      starttime:this.listQuery.starttime,
                      endtime:this.listQuery.endtime}
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
                      filename: '订单'
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
    getmodel() {
      request({
        url: "Order/DDL",
        method: "get",
        params: {}
      }).then(response => {
        if (response.Status == 1) {
          this.type = response.List;
          this.user = response.CList;
        }
      });
    },
    getList() {
      this.listLoading = true;
      request({
        url: "Order/GetOrderList",
        method: "get",
        params: this.listQuery
      }).then(response => {
        if (response.Status == 1) {
          this.list = response.List;
          this.total = response.PageCount;
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
