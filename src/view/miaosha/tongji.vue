<template>
  <div class="activity boxright">
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row>
      <el-table-column label="名称" align="center" prop="Name"></el-table-column>
      <el-table-column label="PV" align="center" prop="PV"></el-table-column>
      <el-table-column label="UV" align="center" prop="UV"></el-table-column>
      <el-table-column label="订单数量" align="center" prop="ProductCounts"></el-table-column>
      <el-table-column label="订单金额" align="center" prop="ProductSum"></el-table-column>
      <el-table-column label="查看产品" align="center" prop="UV">
        <template slot-scope="scope">          
          <el-button size="mini" type="primary" @click="chanpin(scope.row)">
            产品
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="查看任务" align="center" prop="UV">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="renwu(scope.row)" v-if="scope.row.IsMission!=0">
            任务
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      small
      layout="total,prev, pager, next"
      :total="total"
      :page.sync="listQuery.pageIndex"
      :limit.sync="listQuery.pageSize"
      @pagination="getList"
    />
    <el-dialog title="任务" :visible.sync="dialogVisible" :close-on-click-modal="false" width="700px">
      <el-table :data="rows.MissionList" border fit highlight-current-row>
        <el-table-column label="名称" align="center" prop="Name"></el-table-column>
        <el-table-column label="指标/次" align="center" prop="Count"></el-table-column>
      </el-table>
    </el-dialog>
    <el-dialog title="产品" :visible.sync="chanpinshow" :close-on-click-modal="false" width="1000px">
      <el-table :data="rows.ProductList" border fit highlight-current-row>
        <el-table-column label="名称" align="left" prop="Title"></el-table-column>
        <el-table-column label="原价/元" align="center" prop="Price" width="80px"></el-table-column>
        <el-table-column label="实付/元" align="center" prop="Pay" width="80px"></el-table-column>
        <el-table-column label="库存/件" align="center" prop="Num" width="80px"></el-table-column>
        <el-table-column label="剩余库存/件" align="center" prop="Balance" width="120px">
          <template slot-scope="scope">
          <span  :class="scope.row.Balance>0?'red':''">{{scope.row.Balance}}</span>
        </template>
        </el-table-column>
        <el-table-column label="销量/件" align="center" prop="Counts" width="110px"></el-table-column>
        <el-table-column label="总金额" align="center" prop="Sum" width="80px"></el-table-column>
        <el-table-column label="UV" align="center" prop="ProductUV" width="80px"></el-table-column>
        <el-table-column label="购买失败" align="center" prop="ProductCount" width="100px"></el-table-column>

      </el-table>
    </el-dialog>
  </div>
</template>
<script>
import request from "@/utils/request";
import Pagination from "@/components/Pagination";
export default {
  name: "activity",
  components: { Pagination },
  data() {
    return {
      titles:'',
      list: [], //列表
      total: 0, //总数量
      listLoading: false, //列表加载
      listQuery: {
        pageIndex: 1,
        pageSize: 15,
      },
      dialogVisible:false,
      chanpinshow:false,
      rows:{},
    };
  },
  created() {
    this.getList();
  },
  mounted() {
  },
  methods: {
    getList() {
      this.listLoading = true;
      request({
        url: "Statistics/GetStatisticsList",
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
    renwu(row){
      this.rows=row;
      this.dialogVisible=true;
    },
    chanpin(row){
      this.rows=row;
      this.chanpinshow=true;
    },
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
  .red{color: #f00;}
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
