<template>
  <div class="tongjilist boxright">
    <div class="filter-container">
      <el-select
        v-model="listQuery.type"
        placeholder="类型"
        clearable
        style="width: 150px"
        class="filter-item"
      >
        <el-option v-for="item in Dll" :label="item.Text" :value="item.Value" :key="item.Value"></el-option>
      </el-select>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" type="primary" @click="hongbao">发红包</el-button>
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
            pageSize: 15,
            type:''
        },
        list:[], 
        Balance:0,
        BalanceZl:0,  
        Dll:[],
    };
  },
  created() {
    this.getdata();    
      request({
        url: "SuctionPowder/SPUser/GetDll",
        method: "get",
        params:{}
      }).then(response => {
        if (response.Status==1) {   
          this.Dll=response.Dll;
        }            
      });
  },
  methods: {
    hongbao(){
      var data = this.$qs.stringify({ type:this.listQuery.type });
      this.$confirm("确定要发放红包吗？", "提示", {
        dangerouslyUseHTMLString: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(() => {
          request({
            url: "SuctionPowder/SPUser/FHongBao",
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
        })
        .catch(() => {});
    },
    getdata(){
      this.listLoading=true;
      request({
        url: "SuctionPowder/SPUser/GetUserFSList",
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
    handleFilter(){
      this.listQuery.pageIndex=1;
      this.getdata();
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss">
.tongji span {color: #f00;}
</style>
