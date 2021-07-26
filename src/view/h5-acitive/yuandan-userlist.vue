<template>
  <div class="prizeset boxright">
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row>
      <el-table-column label="昵称" align="center" prop="NickName"></el-table-column>
      <el-table-column label="层数" align="center" prop="Layer"></el-table-column>
      <el-table-column label="日期" align="center" prop="Day"></el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="handleditor(scope.row)">
            修改
          </el-button>
        </template>
      </el-table-column>
    </el-table>          
    <!-- <pagination
      small
      layout="total,prev, pager, next"
      :total="total"
      :page.sync="listQuery.pageIndex"
      :limit.sync="listQuery.pageSize"
      @pagination="getList"
    /> -->
    <el-dialog title="修改" :visible.sync="dialognum" :close-on-click-modal="false" width="650px">
      <el-form
        ref="datanum"
        :rules="rulesnum"
        :model="temp2"
        label-position="left"
        label-width="100px"
        style="width: 350px;"
      >        
         <el-form-item label="层数" prop="Count">
          <el-input placeholder="请输入要增加的层数" v-model="temp2.Count"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialognum = false">取消</el-button>
        <el-button type="primary" @click="subnum">确定</el-button>
      </div>
    </el-dialog>
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
      // total:0,//总数量
      listLoading: false, //列表加载
      dialognum:false,
      // listQuery: {
      //   //搜素分页处理
      //   pageIndex: 1,
      //   pageSize: 11,
      //   userid:''
      // },
      temp2:{
        Uid:'',
        Count:''
      },
      rulesnum:{
        Count:[
          { required: true, message: "请输入数量！", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {  
    handleditor(row) {
      this.temp2.Uid=row.Uid;
      this.temp2.Count='';
      this.dialognum = true;
      this.$nextTick(() => {
        this.$refs["datanum"].clearValidate();
      });
    },
    subnum(){
      this.$refs["datanum"].validate(valid => {
        if (valid) { 
          var param={
              Uid:this.temp2.Uid,
              Count:this.temp2.Count,
          };  
          var data = this.$qs.stringify(param);
          request({
            url: "YuanDan/YDPrize/UpdateUser",
            method: "post",
            data
          }).then(response => {
            if (response.Status==1) {   
              this.dialognum = false;
              this.$message({
                message: response.Msg,
                type: "success"
              });
              this.getList();
            }
          });
        }
      });
    },
    getList(){
      this.listLoading = true;
      request({
        url: "YuanDan/YDPrize/GetUserList",
        method: "get",
        params: {}
      }).then(response => {
          this.listLoading = false;
        if (response.Status == 1) {
          if(response.List){
            this.list = response.List;
            // this.total = response.PageCount;
          }
        }
      });
    },
  }
};
</script>
<style lang="scss" rel="stylesheet/scss">
.prizeset .wuliuinfo li{list-style: none; line-height:22px; margin-bottom: 10px; display: flex;}
.prizeset .wuliuinfo span{color: #999; margin-right: 10px; width: 145px;}
.prizeset .text-red{margin-left: 20px; color: #f00;}
</style>
