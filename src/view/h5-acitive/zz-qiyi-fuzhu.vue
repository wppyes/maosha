<template>
  <div class="activity boxright">
    <div class="filter-container">
      <el-input
        placeholder="姓名"
        v-model="listQuery.name"
        style="width: 200px;"
        class="filter-item"
        clearable
      /> 
      <el-select
        v-model="listQuery.status"
        placeholder="选择状态"
        clearable
        style="width: 150px"
        class="filter-item"
      >
        <el-option v-for="item in arr1" :label="item.text" :value="item.id" :key="item.id"></el-option>
      </el-select>  
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-input
        placeholder="限制次数"
        v-model="Num"
        style="width: 120px;"
        class="filter-item"
        clearable
      />
      <el-button class="filter-item" type="primary" @click="xianzhi">确定</el-button>
    </div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row>
      <el-table-column label="编号" align="center" prop="Id"></el-table-column>
      <el-table-column label="姓名" align="left" prop="Name"></el-table-column>
      <el-table-column label="年龄" align="center" prop="Age"></el-table-column>
      <el-table-column label="手机号码" align="center" prop="Phone"></el-table-column>
      <el-table-column label="性别" align="center" prop="Sex">
         <template slot-scope="scope">
          {{scope.row.Sex==0?'男':'女'}}
        </template>
      </el-table-column>
      <el-table-column label="歌名" align="center" prop="Title"></el-table-column>
      <el-table-column label="票数" align="center" prop="Num"></el-table-column>
      <el-table-column label="视频" align="center" prop="Url">
        <template slot-scope="scope">
          <el-button size="mini" type="primary"  v-if="indexshipin!=scope.row.Id" @click="indexshipin=scope.row.Id">播放录音</el-button>
          <audio :src="scope.row.Url" autoplay v-else controls></audio>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="Status" width="80px">
        <template slot-scope="scope">
          <span :class="'status'+scope.row.Status">{{scope.row.Status==0?'语音转换失败':scope.row.Status==1?'未晋级':'晋级'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="200px">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" v-if="scope.row.Status==1" @click="jion(scope.row,2)">晋级</el-button>
          <el-button size="mini" type="primary" v-if="scope.row.Status==2" @click="jiapiao(scope.row)">操作</el-button>
          <el-button size="mini" type="danger" v-if="scope.row.Status==2" @click="jion(scope.row,1)">取消晋级</el-button>
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
    <el-dialog :title="titles" :visible.sync="dialogFormVisible" :close-on-click-modal="false" width="600px">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="100px"
        style="width: 500px; margin-left:50px;"
      >       
        <el-form-item label="票数" prop="Num">
          <el-input placeholder="请输入票数"  v-model="temp.Num" style="width: 215px;"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="yep">确定</el-button>
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
      list: [], //列表
      total: 0, //总数量
      listLoading: false, //列表加载
      downloadLoading:false,
      arr:[{id:1,text:'幼儿组'},{id:2,text:'少儿组'}],
      arr1:[{id:1,text:'未晋级'},{id:2,text:'晋级'}],
      dialogFormVisible:false,
      listQuery: {
        //搜素分页处理
        type: "",
        pageIndex: 1,
        pageSize: 15,
        name: "",
        status: "",   
      },
      titles:'',
      temp:{
        Num:'',
        Id:''
      },      
      rules: {
        Num: [{ required: true, message: "输入票数！", trigger: "blur" }],
      },
      indexshipin:-1,
      Num:''
    };
  },
  created() {
    this.getList();
    this.getxianzhi();
  },
  methods: {
    getxianzhi(){
      request({
        url: "RedSong/RSRecord/GetConfig",
        method: "get",
        params: {}
      }).then(response => {
        if (response.Status == 1) {
          this.Num = response.Model.Num;
        }
      });
    },
    xianzhi(){
      var data = this.$qs.stringify({Num:this.Num});
          request({
            url: "RedSong/RSRecord/UpdateConfig",
            method: "post",
            data
          }).then(response => {
            if (response.Status == 1) {  
              this.$message({
                message: response.Msg,
                type: "success"
              });
            }
          });
    },
    yep(){
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          var data = this.$qs.stringify(this.temp);
          request({
            url: "RedSong/RSRecord/Update_Num",
            method: "post",
            data
          }).then(response => {
            if (response.Status == 1) {  
              this.$message({
                message: response.Msg,
                type: "success"
              });
              for(let i in this.list){
                if(this.list[i].Id==this.temp.Id){
                  this.list[i].Num+=this.temp.Num*1;
                  break;
                }
              }
              this.dialogFormVisible=false;
            }
          });
        }
      });
    },
    jiapiao(item){
      this.titles='增加'+item.ChildrenName+'票数';
      this.temp.Id=item.Id;
      this.temp.Num='';  
      this.dialogFormVisible=true;
    },
    jion(row,status){
      var str=status==2?'晋级':'取消晋级';
      this.$confirm("确定要"+str+"吗？", '提示', {
          dangerouslyUseHTMLString: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
          var data = this.$qs.stringify({Id:row.Id,Status:status});
          request({
            url: "RedSong/RSRecord/Update",
            method: "post",
            data
          }).then(response => {
            if (response.Status == 1) {  
              this.$message({
                message: response.Msg,
                type: "success"
              });
              row.Status=status;
            }
          });          
        }).catch(() => {});
    },
    handleDownload(){
      this.downloadLoading = true;
      this.$confirm("确定要下载吗？", '提示', {
          dangerouslyUseHTMLString: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
          request({
            url: "RedSong/RSRecord/Excel",
            method: "get",
            params: {name:this.listQuery.name,
                      type:this.listQuery.type,
                      status:this.listQuery.status}
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
                      filename: '儿童节'
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
        url: "RedSong/RSRecord/GetRecordList",
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
  .status2 {
    color: #e6a23c;
  }
  .status1 {
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
