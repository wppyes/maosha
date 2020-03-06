<template>
  <div class="miaoshalist boxright">
      <el-button class="filter-item" type="primary" @click="handleclose">关闭订单</el-button>   
      <el-button class="filter-item" type="primary" @click="handle">同步数据</el-button>   
    </div>
  </div>
</template>
<script>
import request from "@/utils/request";

export default {
  name: "miaoshalist",
  data() {
    return {  
    };
  },
  created() {
  },
  methods: {
    handleclose(){          
      this.$confirm("确定要关闭订单吗？", "提示", {
        dangerouslyUseHTMLString: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(() => {          
          request({
            url: "Auxiliary/GetCloseOrder",
            method: "get",
            params:{}
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
    handle(){      
      this.$confirm("确定要同步数据吗？", "提示", {
        dangerouslyUseHTMLString: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(() => {
          request({
            url: "Auxiliary/GetSynchroOrder",
            method: "get",
            params:{}
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
  }
};
</script>
<style lang="scss" rel="stylesheet/scss">
.miaoshalist {
  .img{width:40px; height:40px;}
  .status3{color:#F56C6C;}
  .status0{color:#67C23A;}
  .status1{color:#E6A23C;}
  .status2{color:#409EFF;}
  .status4{color:#909399;}
  .qingkong{margin-left: 30px; color: #409EFF;}
}
</style>
