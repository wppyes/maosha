<template>
  <div class="tongjilist boxright">
    <div class="filter-container">
      <span v-for="item in typearr" v-text="settext(item)"></span>
   
    </div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row>
      <el-table-column label="手机号码" align="center" prop="Phone">
      </el-table-column>
      <el-table-column label="红包金额" align="center" prop="Balance"></el-table-column>
      </el-table-column>
      <el-table-column label="卡片种类数量" align="center" prop="Num"></el-table-column>
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
        typearr:[] 
    };
  },
  created() {
    this.getdata();
    request({
        url: "SuctionPowder/SPUser/GetTongJi",
        method: "get",
        params:{}
      }).then(response => {
        if (response.Status==1) {   
          this.typearr=response.List
        }            
      });
  },
  methods: {
    settext(item){
      console.log(item)
      if(item.Type==1){
        return '关注量：'+item.Count
      }
      if(item.Type==2){
        return '获取口令次数：'+item.Count
      }
    },
    getdata(){
      this.listLoading=true;
      request({
        url: "SuctionPowder/SPUser/GetUserList",
        method: "get",
        params:this.listQuery
      }).then(response => {
        if (response.Status==1) {   
          this.list=response.List;
          this.total = response.PageCount;
          this.listLoading=false;  
        }            
      });
    },
  }
};
</script>
<style lang="scss" rel="stylesheet/scss">
.tongjilist span {color: #f00;}
.tongjilist .filter-container span{padding-right: 20px;}
</style>
