<template>
  <div class="tongjilist boxright">
    <div class="filter-container">
        <div class="filter-item tongji">
            总绑定金额：<span>{{Balance}}</span>元，总助力金额：<span>{{BalanceZl}}</span>元
        </div>  
    </div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row>
      <el-table-column label="姓名" align="center" prop="Name"></el-table-column>
      </el-table-column>
      <el-table-column label="手机号码" align="center" prop="Phone">
      </el-table-column>
      <el-table-column label="绑定金额" align="center" prop="Balance"></el-table-column>
      </el-table-column>
      <el-table-column label="助力获得金额" align="center" prop="Balancezl"></el-table-column>
      </el-table-column>
    </el-table> 

   <pagination
      small
      layout="total,prev, pager, next"
      :total="total"
      :page.sync="listQuery.pageIndex"
      :limit.sync="listQuery.pageSize"
      @pagination="getdata"
    />
  </div>
</template>
<script>
import request from "@/utils/request";

import Pagination from "@/components/Pagination";
export default {
  name: "tongjilist",
  components: { Pagination },
  data() {
    return {
        listLoading:true,
        total:0,
        listQuery: {
            pageIndex: 1,
            pageSize: 15
        },
        list:[], 
        Balance:0,
        BalanceZl:0,  
    };
  },
  created() {
    this.getdata();
  },
  methods: {
    getdata(){
      this.listLoading=true;
      request({
        url: "QianYi/User/GetUserList",
        method: "get",
        params:this.listQuery
      }).then(response => {
        if (response.Status==1) {   
          this.list=response.List;
          this.Balance=response.Balance;
          this.BalanceZl=response.BalanceZl;
          this.total = response.PageCount;
          this.listLoading=false;  
        }            
      });
    },
  }
};
</script>
<style lang="scss" rel="stylesheet/scss">
.tongji span {color: #f00;}
</style>
