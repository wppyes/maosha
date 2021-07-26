<template>
  <div class="UserPayment boxright">
        <div class="filter-container">            
            <el-date-picker
                v-model="value7"
                type="daterange"
                align="left"
                unlink-panels
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :picker-options="pickerOptions2"
                value-format="yyyy-MM-dd"
                style="position:relative; top:-4px; width:380px;"
            ></el-date-picker>    
            <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
        </div>
        <el-table v-loading="listLoading" :data="list" border fit highlight-current-row show-summary :summary-method="setsum">
            <el-table-column label="名称" prop="Name">
            </el-table-column>
            <el-table-column label="加款/元" prop="Sum" align="center">
                <template slot-scope="scope">
                   {{parseFloat(scope.row.Sum).toLocaleString()}}               
                </template>
            </el-table-column>   
        </el-table>
  </div>
</template>
<script>
import request from "@/utils/request";
export default {
  name: "UserPayment",
  data() {
    return {
        list: null,
        listLoading: true,  
        listQuery: {
            starttime:'',
            endtime:''
        },
        value7: "",
        pickerOptions2: {
            shortcuts: [
            {
                text: "最近一周",
                onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                picker.$emit("pick", [start, end]);
                }
            },
            {
                text: "最近一个月",
                onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                picker.$emit("pick", [start, end]);
                }
            },
            {
                text: "最近三个月",
                onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                picker.$emit("pick", [start, end]);
                }
            }
            ]
        },
        total:0,
        all: {
            Sum: 0
        },

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
    handleFilter(){
        this.getList();
    },
    getList(){
          this.listLoading = true;
          request({
          url: "Payment/GetPaymentList",
          method: "get",
          params: this.listQuery
          }).then(response => {                  
              if(response.Status==1){
                      this.list = response.List;
                      this.all.Sum=0;
                      for (let i in response.List) {
                          this.all.Sum += response.List[i].Sum;
                      }
                      if(this.all.Sum){
                        this.all.Sum = this.all.Sum.toFixed(2);
                      }
                      
                    this.listLoading=false;
              }
          });
    },    
    setsum(param){
       const { columns,  data } = param;
        const sums = [];
        columns.forEach((column, index) => {
          if(index === 0) {
            sums[index] = '总计：';
            return;
          }
          switch(column.property) {
            case "Sum":
              sums[index] = this.all.Sum;
            break;
            default:
            break;
          }
      });
      return sums;
    }, 
  }
};
</script>
<style lang="scss" rel="stylesheet/scss">
.UserPayment{
  .status2 {
    color: #67c23a;
  }
  .status3 {
    color: #f56c6c;
  }
}

</style>
