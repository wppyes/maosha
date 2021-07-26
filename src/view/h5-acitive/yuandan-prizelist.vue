<template>
  <div class="prizeset boxright">
    <div class="filter-container"> 
      
      <el-input
        placeholder="名字"
        v-model="listQuery.name"
        style="width: 150px;"
        class="filter-item"
        clearable
      />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>  
       <el-button
        :loading="downloadLoading"
        class="filter-item"
        type="primary"
        icon="el-icon-download"
        @click="handleDownload"
      >下载</el-button>    
    </div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row>
      <el-table-column label="名字" align="center" prop="Name"></el-table-column>
      <el-table-column label="手机号码" align="center" prop="Phone"></el-table-column>
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
import upfile from '@/utils/upload';
export default {
  name: "prizeset",
  components: { Pagination },
  data() {
    return {
      list: [], //列表
      total:0,//总数量
      listLoading: false, //列表加载
      dialogwuliuVisible:false,
      dialognum:false,
      listQuery: {
        //搜素分页处理
        pageIndex: 1,
        pageSize: 11,
        name:''
      },
      downloadLoading:false,
    };
  },
  created() {
    this.getList();
  },
  methods: {   
    handleFilter() {
      this.listQuery.pageIndex = 1;
      this.getList();
    },
    getList(){
      this.listLoading = true;
      request({
        url: "YuanDan/YDPrize/GetLogList",
        method: "get",
        params: this.listQuery
      }).then(response => {
          this.listLoading = false;
        if (response.Status == 1) {
          if(response.List){
            this.list = response.List;
            this.total = response.PageCount;
          }
        }
      });
    },
    handleDownload(){
      this.downloadLoading = true;
      this.$confirm("确定要下载吗？", '提示', {
          dangerouslyUseHTMLString: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
          request({
            url: "YuanDan/YDPrize/GetLogExcel",
            method: "get",
            params: {}
          }).then(response => {
              if(response.Status==1){
                this.exportex(response,'中奖信息')
                this.downloadLoading = false
              }          
          });          
        }).catch(() => {   
          this.downloadLoading = false      
        });
    },
    exportex(response,title){
      import('@/vendor/Export2Excel').then(excel => {
          const tHeader = response.TableTitle;
          const filterVal = response.TableField;
          const data = this.formatJson(filterVal, response.List)
          if(response.List){
            excel.export_json_to_excel({
              header: tHeader,
              data,
              filename:  title
            });
          }
        
      }); 
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
          return v[j]
      }))
    },
  }
};
</script>
<style lang="scss" rel="stylesheet/scss">
.prizeset .wuliuinfo li{list-style: none; line-height:22px; margin-bottom: 10px; display: flex;}
.prizeset .wuliuinfo span{color: #999; margin-right: 10px; width: 145px;}
.prizeset .text-red{margin-left: 20px; color: #f00;}
</style>
