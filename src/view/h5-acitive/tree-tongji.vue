<template>
  <div class="activitystatistics boxright">    
    <div class="filter-container">      
      <el-date-picker
        class="filter-item"
        v-model="value7"
        type="daterange"
        align="left"
        unlink-panels
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        value-format="yyyy-MM-dd"
        style="width:380px;"
      ></el-date-picker>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
    </div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row>
      <el-table-column label="PV" align="center" prop="PV"></el-table-column>
      <el-table-column label="UV" align="center" prop="UV"></el-table-column>
      <el-table-column label="抽奖数量" align="center" prop="DrawCount"></el-table-column>
      <el-table-column label="提交数量" align="center" prop="RechargeCount"></el-table-column>
      <el-table-column label="时间" align="center" prop="CreatedStr"></el-table-column>
    </el-table>                 
    <pagination
      small
      layout="total,prev, pager, next"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.sum"
      @pagination="getList"
    />
  </div>
</template>
<script>
import request from "@/utils/request";
import Pagination from "@/components/Pagination";
export default {
  name: "activitystatistics",
  components: { Pagination },
  data() {
    return {
      list: [], //列表
      total:0,//
      listLoading: false, //列表加载
      value7: "",
      listQuery: {
        //搜素分页处理
        pageIndex : 1,
        pageSize: 10,
        starttime:'',
        endtime:''
      },
    };
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
  created() {
    this.getList();
  },
  methods: {
    getList(){
      this.listLoading = true;
      request({
        url: "MoneyTree/Statistics/GetStatisticsList",
        method: "get",
        params: this.listQuery
      }).then(response => {
        if (response.Status == 1) {
          this.listLoading = false;
          this.list = response.List;
          this.total = response.PageCount;
        }
      });
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    },
  }
};
</script>
<style lang="scss" rel="stylesheet/scss">

</style>
