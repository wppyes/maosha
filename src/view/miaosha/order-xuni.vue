<template>
  <div class="activity boxright">
    <div class="filter-container">
      <el-input
        placeholder="订单编号"
        v-model="listQuery.ordernum"
        style="width: 150px;"
        class="filter-item"
        clearable
      />
      <el-input
        placeholder="用户编号"
        v-model="listQuery.userid"
        style="width: 150px;"
        class="filter-item"
        clearable
      />
      <el-input
        placeholder="产品名字"
        v-model="listQuery.productname"
        style="width: 150px;"
        class="filter-item"
        clearable
      />
      <el-input
        placeholder="姓名/手机号码"
        v-model="listQuery.name"
        style="width: 200px;"
        class="filter-item"
        clearable
      />
      <el-select
        v-model="listQuery.status"
        placeholder="订单状态"
        clearable
        style="width: 150px"
        class="filter-item"
      >
        <el-option v-for="item in Model" :label="item.Text" :value="item.Value" :key="item.Value"></el-option>
      </el-select>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
    </div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row>
      <el-table-column label="订单编号" align="left" prop="PayOrderNum">
        <template slot-scope="scope">
         内部：{{scope.row.OrderNum}}<br/>银行：{{scope.row.PayOrderNum}}
        </template>
      </el-table-column>
      <el-table-column label="产品名称" align="left" prop="Title"></el-table-column>
      <el-table-column label="支付金额" align="center" prop="PayAmount" width="80px"></el-table-column>
      <el-table-column label="收货信息" align="center" width="200px">
        <template slot-scope="scope">{{scope.row.Name+' '+scope.row.Phone}}</template>
      </el-table-column>
      <el-table-column label="运单编号" align="center" prop="LogisticCode" width="150px"></el-table-column>
      <el-table-column label="状态" align="center" prop="Status" width="80px">
        <template slot-scope="scope">
          <span :class="'status'+scope.row.Status" v-text="setliexing(scope.row.Status)"></span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="200px">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            @click="wuliu(scope.row)"
            v-if="scope.row.Status==3"
          >物流</el-button>
          <el-button size="mini" type="primary" @click="detail(scope.row)">详情</el-button>
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

    <el-dialog :title="titles" :visible.sync="dialogwuliu" :close-on-click-modal="false" width="700px">
      <ul>
        <li>运单编号：{{item.LogisticCode}}</li>
        <li>快递名称：{{item.ShipperName}}</li>
        <li class="flex">物流信息：
          <ul>
            <li v-for="miaoshu in item.Traces">{{miaoshu.AcceptTime}} <span>{{miaoshu.AcceptStation}}</span></li>
          </ul>
        </li>
      </ul>
    </el-dialog>
    <el-dialog :title="titles" :visible.sync="dialogdingdan" :close-on-click-modal="false" width="700px">
        <ul>
          <li>收货地址：{{item.Address}}</li>
          <li>下单时间：{{item.CreatedStr}}</li>
          <li>支付时间：{{item.PayTimeStr}}</li>
          <li>支付成功时间：{{item.CompleteTimeStr}}</li>
          <li>关闭时间：{{item.CloseTimeStr}}</li>
          <li class="flex"><span>描述：</span>
            <ul>
              <li v-for="miaoshu in item.Remark">{{miaoshu.Event}} {{miaoshu.Time}}</li>
            </ul>
          </li>
        </ul>
    </el-dialog>
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
      dialogwuliu: false,
      dialogdingdan:false,
      listQuery: {
        //搜素分页处理
        name: "",
        pageIndex: 1,
        pageSize: 10,
        ordernum: "",
        userid: "",
        productname: "",
        status: ""
      },
      item:{},

    };
  },
  created() {
    this.getList();
    this.getmodel();
  },
  mounted() {
    this.$bus.$on("navactivechange", () => {
      this.getList();
    });
  },
  methods: {
    detail(row) {      
      this.titles=row.Name+'的订单详情';
      this.dialogdingdan=true;
      this.item=row;
      if(row.Remark){
        this.item.Remark=JSON.parse(row.Remark);
      }else{
        this.item.Remark='';
      }
      
    },
    wuliu(row) {
      this.titles=row.Name+'的物流信息';
      this.dialogwuliu=true;
      this.item=row;
      if(row.Traces){
        this.item.Traces=JSON.parse(row.Traces);
      }else{
        this.item.Traces='';
      }
    },
    getmodel() {
      request({
        url: "Orders/DDL",
        method: "get",
        params: {}
      }).then(response => {
        if (response.Status == 1) {
          this.Model = response.Model;
        }
      });
    },
    setliexing(type) {
      for (let i in this.Model) {
        if (this.Model[i].Value == type) {
          return this.Model[i].Text;
        }
      }
    },
    getList() {
      this.listLoading = true;
      request({
        url: "Orders/GetOrdersList",
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
