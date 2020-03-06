<template>
  <div class="activity boxright">
    <div class="filter-container">
      <div class="filter-item" style="margin-right:20px;">
        <el-button type="primary" @click="linktoadd(0)">
          <i class="el-icon-circle-plus"></i> 增加活动
        </el-button>
      </div>
      <el-input
        placeholder="请输入活动标题"
        v-model="listQuery.name"
        style="width: 150px;"
        class="filter-item"
        clearable
      />  
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>   
    </div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row>
      <el-table-column label="活动名称" align="left" prop="Name"></el-table-column>
      <el-table-column label="封面图" align="center">
        <template slot-scope="scope">
          <img :src="scope.row.Cover+'?imageView2/1/w/40/h/40'" class="img">
        </template>
      </el-table-column>     
      <el-table-column label="跳转类型" align="center" prop="JumpType">
        <template slot-scope="scope">
          <span :class="'status'+scope.row.Status" v-text="setliexing(scope.row.JumpType)"></span>
        </template>
      </el-table-column>
      <el-table-column label="跳转连接" align="center" prop="Link"></el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="linktoadd(scope.row.Id)">
            <i class="el-icon-edit"></i>
          </el-button>
          <el-button size="mini" type="danger" @click="handledel(scope.row)">
            <i class="el-icon-delete"></i>
          </el-button>
        </template>
      </el-table-column>
    </el-table> 

    <pagination
      small
      layout="prev, pager, next"
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
import upfile from "@/utils/upload";
var tabarr=[];
export default {
  name: "activity",
  components: { Pagination },
  data() {
    return {
      Model: [{
        Text:'页面跳转',
        Value:1
      },{
        Text:'跳转2',
        Value:2
      }],
      list: [], //列表
      total:0,//总数量
      listLoading: false, //列表加载
      listQuery: {
        //搜素分页处理
        name:'',
        pageIndex: 1,
        pageSize: 15
      },
    };
  },
  created() {
    this.getList();
  },
  mounted () {
    this.$bus.$on('navactivechange', ()=> {
      this.getList()
    })
  },
  methods: {
    setliexing(type){
      for(let i in this.Model){
        if(this.Model[i].Value == type){
          return this.Model[i].Text;
        }
      }
    },
    getList(){
      this.listLoading = true;
      request({
        url: "ASpare/GetASpareList",
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
    },   
    handledel(row,value) {
      var data = this.$qs.stringify({ Id: row.Id});
      this.$confirm("确定要删除该活动吗？", "提示", {
        dangerouslyUseHTMLString: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(() => {
          request({
            url: "ASpare/DelASpare",
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
    linktoadd(id){
       this.$router.push({
        path: "/miaosha/navactive/add-navacitve",
        query: { id:id }
      });
    },
  }
};
</script>
<style lang="scss" rel="stylesheet/scss">
.activity {
  .img{width:40px; height:40px;}
  .status3{color:#F56C6C;}
  .status0{color:#67C23A;}
  .status1{color:#E6A23C;}
  .status2{color:#409EFF;}
  .status4{color:#909399;}
  .qingkong{margin-left: 30px; color: #409EFF;}
}
</style>
