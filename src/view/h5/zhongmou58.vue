<template>
  <div class="activity boxright">
    <div class="filter-container">
      <el-input
        placeholder="姓名/手机号"
        v-model="listQuery.name"
        style="width: 150px;"
        class="filter-item"
        clearable
      />
      <el-select
        v-model="listQuery.sex"
        placeholder="性别"
        clearable
        style="width: 150px"
        class="filter-item"
      >
        <el-option label="男" value="0"></el-option>
        <el-option label="女" value="1"></el-option>
      </el-select>
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
      >下载</el-button>
    </div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row>
      <el-table-column label="排名" align="center" prop="Num" width="80px"></el-table-column>
      <el-table-column label="姓名" align="center" prop="Name" width="80px"></el-table-column>
      <el-table-column label="性别" align="center" prop="SexStr" width="80px"></el-table-column>
      <el-table-column label="手机" align="center" prop="Phone" width="200px"></el-table-column>
      <el-table-column label="地址" align="center" prop="Address">
        <template  slot-scope="scope">
          {{scope.row.Province}}{{scope.row.City}}{{scope.row.County}}{{scope.row.Address}}
        </template>
      </el-table-column>
      <el-table-column label="祝福" align="center" prop="Desc"></el-table-column>
      <el-table-column label="时间" align="center" prop="CreatedStr" width="200px"></el-table-column>
      <el-table-column label="图片" align="center" prop="Url" width="200px">
        <template slot-scope="scope">
          <el-image 
            style="width: 100px; height: 100px"
            :src="scope.row.Url" 
            :preview-src-list="srcList">
          </el-image>
        </template>
         
      </el-table-column>
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
        name: "",
        page: 1,
        sum: 10,
        sex: "",   
        starttime:'',
        endtime:'',
        province:'',
        city:'',
        county:''
      },
      srcList:[],
    };
  },
  created() {
    this.getList();
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
      this.$confirm("确定要下载吗？", '提示', {
          dangerouslyUseHTMLString: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
          request({
            url: "InformationOneCollection/ExcelInformation",
            method: "get",
            params: {name:this.listQuery.name,
                      sex:this.listQuery.sex,
                      qutlets:this.listQuery.qutlets,
                      starttime:this.listQuery.starttime,
                      endtime:this.listQuery.endtime
                    }
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
                      filename: '信息'
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
        url: "InformationOneCollection/GetInformationList",
        method: "get",
        params: this.listQuery
      }).then(response => {
        if (response.Status == 1) {
          this.list = response.List;
          this.total = response.PageCount;
          this.listLoading = false;
          this.srcList=[];
          for(let i in response.List){
            this.srcList.push(response.List[i].Url)
          }
        }
      });
    },
    handleFilter() {
      this.listQuery.page = 1;
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
