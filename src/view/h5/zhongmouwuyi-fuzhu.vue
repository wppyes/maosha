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
      <el-select
        v-model="listQuery.qutlets"
        placeholder="支行"
        clearable
        style="width: 150px"
        class="filter-item"
      >
        <el-option v-for="item in wangian" :label="item.name" :value="item.name" :key="item.name"></el-option>
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
      <el-button type="primary" @click="handleadd"
        class="filter-item">
          <i class="el-icon-circle-plus"></i> 增加
        </el-button>
    </div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row>
      <el-table-column label="排名" align="center" prop="Num" width="80px"></el-table-column>
      <el-table-column label="姓名" align="center" prop="Name" width="80px"></el-table-column>
      <el-table-column label="性别" align="center" prop="SexStr" width="80px"></el-table-column>
      <el-table-column label="手机" align="center" prop="Phone" width="200px"></el-table-column>
      <el-table-column label="支行" align="center" prop="Outlets" width="200px"></el-table-column>
      <el-table-column label="地址" align="center" prop="Address"></el-table-column>
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
    
    <el-dialog title="增加" :visible.sync="dialogFormVisible" :close-on-click-modal="false" width="600px">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="100px"
        style="width: 500px; margin-left:50px;"
      >        
        <el-form-item label="名字" prop="Name">
          <el-input placeholder="请输入名字" v-model="temp.Name"/>
        </el-form-item>
        <el-form-item label="性别" prop="Sex">
          <el-select
            v-model="temp.Sex"
            placeholder="性别"
            clearable
            style="width: 150px"
            class="filter-item"
          >
            <el-option label="男" value="0"></el-option>
            <el-option label="女" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="手机" prop="Phone">
          <el-input placeholder="请输入手机" v-model="temp.Phone"/>
        </el-form-item>
        <el-form-item label="地址" prop="Address">
          <el-input placeholder="请输入地址" v-model="temp.Address"/>
        </el-form-item>
        <el-form-item label="网点" prop="Outlets">
           <el-select
            v-model="temp.Outlets"
            placeholder="支行"
            clearable
            style="width: 150px"
            class="filter-item"
          >
            <el-option v-for="item in wangian" :label="item.name" :value="item.name" :key="item.name"></el-option>
          </el-select>
        </el-form-item>
        
        <el-form-item label="图片" prop="Img">
          <div class="video">
            <el-upload
              class="avatar-uploader"
              ref="upload"
              :show-file-list="false"
              accept=".jpg, .png"
              action
              :http-request="upLoad"
            >
              <img v-if="temp.Url" :src="temp.Url" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="createData">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import request from "@/utils/request";
import Pagination from "@/components/Pagination";
import upfile from "@/utils/upload";
var tabarr = [];
export default {
  name: "activity",
  components: { Pagination },
  data() {
    return {
      dialogFormVisible:false,
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
        qutlets: "",     
        starttime:'',
        endtime:''
      },
      srcList:[],
      wangian:[
						{name:"官渡大街支行",address:"郑州市中牟县官渡大街中段",tel:"62121608",tel2:"62121810"},
						{name:"刘集支行",address:"郑州市中牟县刘集镇人民政府斜对面",tel:"62399280",tel2:"56529703/62399287"},
						{name:"官渡支行",address:"郑州市中牟县官渡镇人民路1号",tel:"62230909",tel2:"62230300"},
						{name:"九龙支行",address:"郑州市经济技术开发区九龙办事处九龙村一组一号",tel:"60211005",tel2:"60211019"},
						{name:"狼城岗支行",address:"郑州市中牟县狼城岗镇西狼村狼东路南侧",tel:"62220868",tel2:"62220899"},
						{name:"白沙支行",address:"郑州市郑东新区白沙镇恒通路50号",tel:"62367703",tel2:"62121810"},
						{name:"张庄支行",address:"郑州市航空港经济综合实验区张庄办事处张庄北街",tel:"62376508",tel2:"62376505"},
						{name:"雁鸣湖支行",address:"郑州市中牟县雁鸣湖镇东村社区商业楼一楼",tel:"56569503",tel2:"56569507"},
						{name:"万滩支行",address:"郑州市郑东新区杨桥办事处万滩村万三路北段",tel:"56569588",tel2:"56569587"},
						{name:"马庄支行",address:"郑州市航空港区鄱阳湖路与凌空街交叉口西南角",tel:"86216601",tel2:"86216608"},
						{name:"韩寺支行",address:"郑州市中牟县韩寺镇中刁路中段",tel:"62301568",tel2:"62301565"},
						{name:"祥云支行",address:"郑州市经济技术开发区中谢路祥云办事处西50米",tel:"56569557",tel2:"56569559"},
						{name:"姚家支行 ",address:"中牟县姚家镇社区（镇政府东）",tel:"56569572",tel2:"56569573"},
						{name:"大孟支行",address:"郑州市中牟县大孟镇政府北50米",tel:"56569577",tel2:"56569578"},
						{name:"广惠街支行",address:"郑州市中牟县新城区商都大道与宝峰街交叉口向南200米路西",tel:"62031105",tel2:"62031112"},
						{name:"郑庵支行",address:"郑州市中牟县郑庵镇万三路与中芦路交叉口东900米路北",tel:"62031003",tel2:"62031007"},
						{name:"三官庙支行",address:"中牟县三官庙乡S102与S223交叉口向东50米路北 ",tel:"61736518",tel2:"61736517"},
						{name:"八岗支行",address:"郑州市航空港经济综合实验区八岗村",tel:"86690351",tel2:"61736559"},
						{name:"黄店支行",address:"郑州市中牟县刁家乡人民路1号",tel:"56569112",tel2:"85391561"},
						{name:"刁家支行",address:"郑州市中牟县黄店镇人民政府东200米路南",tel:"85391562",tel2:"56569116"},
						{name:"冯堂支行",address:"郑州市航空港经济综合实验区冯堂办事处冯堂村",tel:"56569591",tel2:"56569593"},
						{name:"杨桥支行",address:"郑州市郑东新区杨桥办事处杨桥村主街",tel:"56529706",tel2:"56529708"},
						{name:"康庄支行",address:"郑州市郑东新区白沙镇康庄村康庄大道路东",tel:"56569563",tel2:""},
						{name:"商都支行",address:"中牟县商都大道与清阳街交叉口向东200米路南（中牟县房管大厦一楼） ",tel:"56569520",tel2:""},
						{name:"京航支行",address:"郑州市经济技术开发区新安路与龙飞北街交叉口西北角",tel:"56569510",tel2:"56569508"},
						{name:"绿博支行",address:"郑州市中牟县广惠街与富贵六路交叉口向西200米",tel:"56569612",tel2:""},
						{name:"锦凤支行",address:"郑州市经济技术开发区新安路与前肖路交叉口西贾社区锦凤花园一楼商铺",tel:"56569626",tel2:""},
						{name:"郑开支行",address:"郑州市郑东新区郑开大道71号恒通国际广场东北角",tel:"62191731",tel2:""},
						{name:"晨阳路支行",address:"郑州市中牟县绿博家苑商业步行街（晨阳路与牡丹一街路东）",tel:"56529700",tel2:"56529703/62399287"}
          ],
      temp:{
        Name:'',
        Sex:'',
        Phone:'',
        Address:'',
        Outlets:'',
        Url:''
      }, 
      rules:{  
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
    upLoad(param) {
      upfile(param.file, "Upload/UploadK?folder=info", data => {
        if (data.Status) {
          this.temp.Url = data.Path;
        } else {
          this.$message({
            message: data.Msg,
            type: "error"
          });
        }
      });
    },
    createData(){
      this.$refs["dataForm"].validate(valid => {
        if (valid) {    
          var data = this.$qs.stringify(this.temp);
          request({
            url: "InformationCollection/SetCollection",
            method: "post",
            data
          }).then(response => {
            if (response.Status==1) {                
              this.dialogFormVisible = false;
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
    handleadd(){
      this.dialogFormVisible=true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
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
            url: "InformationCollection/ExcelInformation",
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
        url: "InformationCollection/GetInformationList",
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
