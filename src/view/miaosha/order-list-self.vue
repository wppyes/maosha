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
      <br/>  
      <el-autocomplete
        class="filter-item"
        v-model="listQuery1.name"
        clearable
        :fetch-suggestions="querySearch"
        placeholder="请输入活动名称"
        @select="handleSelect"
      ></el-autocomplete>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
      
      <el-button
        :loading="downloadLoading"
        class="filter-item"
        type="primary"
        icon="el-icon-download"
        @click="handleDownload"
      >下载订单</el-button>
    </div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row>
      <el-table-column label="编号" align="left" prop="PayOrderNum" width="250px">
        <template slot-scope="scope">
         UserId：{{scope.row.UserId}}<br/>内部：{{scope.row.OrderNum}}<br/>银行：{{scope.row.PayOrderNum}}
        </template>
      </el-table-column>
      <el-table-column label="活动/产品" align="left" prop="Title" width="200px">
        <template slot-scope="scope">
          <span class="status2">活动：{{scope.row.ActivityName}}</span>
         <br/>产品：{{scope.row.Title}}
        </template>
      </el-table-column>
      <el-table-column label="支付金额" align="center" prop="PayAmount" width="80px"></el-table-column>
      <el-table-column label="收货信息" align="center" width="150px">
        <template slot-scope="scope">{{scope.row.Name}}<br/>{{scope.row.Phone}}</template>
      </el-table-column>
      <el-table-column label="运单编号" align="center" prop="LogisticCode" width="150px"></el-table-column>
      <el-table-column label="时间" align="center" prop="CreatedStr" width="180px"></el-table-column>
      <el-table-column label="状态" align="center" prop="Status" width="80px">
        <template slot-scope="scope">
          <span :class="'status'+scope.row.Status" v-text="setliexing(scope.row.Status)"></span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            @click="wuliu(scope.row)"
            v-if="scope.row.Status==3"
          >物流</el-button>
          <el-button size="mini" type="primary" @click="detail(scope.row)">详情</el-button>
          <el-button size="mini" type="primary" @click="changeshow(scope.row)">状态</el-button>
          <el-button size="mini" type="primary" v-if="scope.row.Status==0 || scope.row.Status==4 " @click="changestatus(scope.row,1)">成功</el-button>
          <el-button size="mini" type="danger" v-if="scope.row.Status==0 || scope.row.Status==4 " @click="changestatus(scope.row,0)">失败</el-button>
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
    <el-dialog title="修改状态" :visible.sync="dialogchange" :close-on-click-modal="false" width="700px">
      <el-form ref="changeForm" :rules="changerules" :model="changetemp" label-position="left" label-width="100px" style="width: 400px;">
        <el-form-item label="状态" prop="status">          
          <el-select
              v-model="changetemp.status"
              placeholder="订单状态"
              class="filter-item"
            >
              <el-option v-for="item in Model" :label="item.Text" :value="item.Value" :key="item.Value"></el-option>
            </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogchange = false">取消</el-button>
        <el-button type="primary" @click="changeyep">确定</el-button>
      </div>
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
      dialogchange:false,
      value7:'',
      downloadLoading:false,
      listQuery1:{
        name: "",
        pageIndex: 1,
        pageSize: 100,
        status:-1
      },
      listQuery: {
        //搜素分页处理
        name: "",
        pageIndex: 1,
        pageSize: 6,
        ordernum: "",
        userid: "",
        productname: "",
        status: "",        
        starttime:'',
        endtime:'',
        activityId:''
      },
      item:{},
      changetemp:{
        ordernum:'',
        status:''
      },
      changerules: {
        status: [
          { required: true, message: "状态必须选择！", trigger: "blur" }
        ],
      },
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
    changeyep(){
      this.$refs["changeForm"].validate(valid => {
        if (valid) {
          var data = this.$qs.stringify(this.changetemp);
          request({
            url: "Orders/UpdateOrder",
            method: "post",
            data
          }).then(response => {
            if (response.Status==1) { 
              this.dialogchange = false
              this.$message({
                message: response.Msg,
                type: 'success'
              });
              this.getList();
            }            
          });
        }
      });
   
    },
    changeshow(row){
      this.dialogchange=true;
      this.changetemp.ordernum=row.OrderNum;
      this.changetemp.status='';
      this.$nextTick(() => {
        this.$refs["changeForm"].clearValidate();
      });
    },
    changestatus(row,type){
      var data = this.$qs.stringify({id:row.Id,type:type});
      var str= type==1?'成功':'失败'
      this.$confirm("确定要处理"+str+"吗？", "提示", {
        dangerouslyUseHTMLString: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(() => {
          request({
            url: "Orders/UpdateOrder",
            method: "post",
            data
          }).then(response => {
            if (response.Status==1) {
              row.Status=type;
              this.$message({
                message: response.Msg,
                type: "success"
              });
            }
          });
        })
        .catch(() => {});
    },
    querySearch(queryString, cb) {
      request({
          url: "Activity/GetActivityList",
          method: "get",
          params: this.listQuery1
        }).then(response => {
          if (response.Status == 1) {
            for (let i = 0; i < response.List.length; i++) {
              response.List[i].value = response.List[i].Name;    
            }
             cb(response.List);
             if(queryString==''){
                this.listQuery.activityId = '';
                this.handleFilter();
             }
          }
      });
    },    
    handleSelect(item) {
      this.listQuery.activityId = item.Id;
      this.handleFilter();
    },
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
