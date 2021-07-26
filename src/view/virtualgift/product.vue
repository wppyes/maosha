<template>
  <div class="product boxright">       
    <div class="filter-container">
      <div class="filter-item" style="margin-right:20px;">
        <el-button type="primary" @click="handleadd(0,'增加产品',true)">
          <i class="el-icon-circle-plus"></i> 增加产品
        </el-button>
         <el-input
            placeholder="产品名字"
            v-model="listQuery.Name"
            style="width: 150px;"
            clearable
          />
        <el-button type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
      </div>
    </div>   
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row>
      <el-table-column label="产品Id" align="center" prop="ItemId" width="100px"></el-table-column>
      <el-table-column label="产品名称" align="left" prop="Name"></el-table-column>
      <el-table-column label="面值" align="center" prop="PurchasePrice" width="100px"></el-table-column>   
      <el-table-column label="状态" align="center" prop="YYCount" width="100px">
        <template slot-scope="scope">
          <span :class="'status'+scope.row.Status">{{scope.row.Status==0?'正常':'下架'}}</span>
        </template>
      </el-table-column>  
      <el-table-column label="操作" align="center" width="300px">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="handleditor(scope.row,'修改产品',false)">
            <i class="el-icon-edit"></i>
          </el-button>
          <el-button size="mini" type="primary" @click="shangjai(scope.row,0)" v-if="scope.row.Status!=0">
            上架
          </el-button>
          <el-button size="mini" v-if="scope.row.Status==0" type="danger" @click="shangjai(scope.row,1)">
            下架
          </el-button>
          <el-button size="mini" type="primary" @click="showdetail(scope.row)">
            查看详情
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
    <el-dialog :title="dialogStatus" :visible.sync="dialogFormVisible" :close-on-click-modal="false" width="900px" top="50px">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" style="width: 800px;">
        <el-form-item label="产品Id" prop="ItemId">
          <el-input v-model="temp.ItemId" placeholder="请填写产品Id"/>
        </el-form-item>
        <el-form-item label="产品名称" prop="Name">
          <el-input v-model="temp.Name" placeholder="请填写产品名称"/>
        </el-form-item>
        <el-form-item label="进货价" prop="PurchasePrice">
          <el-input v-model="temp.PurchasePrice" placeholder="请填写进货价"/>
        </el-form-item>
        <el-form-item label="封面图：" prop="SmallImage">    
          <Uploadimg v-model="temp.SmallImage" ref="upLoadimg" :filepath="'/zzbank/'"></Uploadimg>
          <div class="chicun">尺寸：170*170</div>
        </el-form-item>
        <el-form-item label="产品主图：" prop="Images">
          <loadread ref="upLoadimgs" v-model="temp.Images" :filepath="'/zzbank/'"></loadread>
          <div class="chicun">尺寸：640*640</div>
        </el-form-item>  
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="createData">确定</el-button>
      </div>
    </el-dialog>
      <el-dialog title="产品详情" :visible.sync="dialogshowVisible" :close-on-click-modal="false" width="900px">
      <div class="block">
        <el-image style="width:100px; height:100px" :src="item.SmallImage"></el-image>
      </div>
      <div class="block">
        <el-image style="width:200px; height:200px; margin:5px" v-for="(item,index) in item.imagelist" :src="item" :key="index"></el-image>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import request from "@/utils/request";
import Pagination from "@/components/Pagination";
import Uploadimg from '@/components/Uploadqiniu/single';
import loadread from '@/components/Uploadqiniu/loadread';
export default {
  name: "product",
  components: { Pagination,Uploadimg,loadread},
  data() {
    return {
      list: [], //列表
      listLoading: false, //列表加载
      total: 0, //总数量
      listQuery: {
        //搜素分页处理
        pageIndex: 1,
        pageSize: 10,
        Name: ""
      },
      temp: {
        Id: 0,
        Name: '',
        ItemId:'',
        Price:0,
        Category:0,
        PurchasePrice:'',
        SmallImage:'',
        Images:''
      },
      item:{},
      dialogStatus:'',//面板标题    
      dialogFormVisible: false,//面板是否展示
      iscreate:false,//是否是添加
      dialogshowVisible:false,
      rules: {
        Name: [{ required: true, message: '名称必须填写！', trigger: 'blur' }],
        ItemId: [{ required: true, message: '产品Id必须填写！', trigger: 'blur' }],
        PurchasePrice: [{ required: true, message: '进货价必须填写！', trigger: 'blur' }],
        SmallImage: [{ required: true, message: '缩略图必须上传！', trigger: 'blur' }],
        Images: [{ required: true, message: '图片必须上传！', trigger: 'blur' }],
      },
    };
  },
  created() {
    this.getList();    
  },
  mounted () {
    this.$bus.$on('productchange', ()=> {
      this.getList()
    })
  },
  methods: {
    handleFilter() {
      this.listQuery.pageIndex = 1;
      this.getList();
    },
    getList(){
      this.listLoading = true;
      request({
        url: "TProduct/GetProductSTList",
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
    handleadd(row,title,creat){
      this.temp.Id=0;
      this.temp.Name='';
      this.temp.ItemId='';
      this.temp.PurchasePrice='';
      this.temp.SmallImage='';
      this.temp.Images='';
      this.iscreate=creat;
      this.dialogStatus = title;
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleditor(row,title,creat){      
      this.temp.Id=row.Id;
      this.temp.Name=row.Name;
      this.temp.ItemId=row.ItemId;
      this.temp.PurchasePrice=row.PurchasePrice;
      this.temp.SmallImage=row.SmallImage;
      this.temp.Images=row.Images;
      this.dialogStatus = title;
      this.dialogFormVisible = true;
      this.iscreate=creat;
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData(){
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {              
          var param={
            Id:this.temp.Id,
            Name:this.temp.Name,
            ItemId:this.temp.ItemId,
            Price:0,
            PurchasePrice:this.temp.PurchasePrice,
            Category:0,
            Type:1,
            SmallImage:this.temp.SmallImage,
            Images:this.temp.Images
          }
          var data=this.$qs.stringify(param);
          request({
              url: "TProduct/SetProduct",
              method: "post",
              data
            }).then(response => {
              if(response.Status==1){
                if(this.iscreate){
                  param.Id=response.AId;
                  this.list.push(param);      
                }else{
                  for(let i in this.list){
                    if (this.list[i].Id === this.temp.Id) {
                      this.list[i].Name=this.temp.Name;
                      this.list[i].ItemId=this.temp.ItemId;
                      this.list[i].PurchasePrice=this.temp.PurchasePrice;
                      this.list[i].SmallImage=this.temp.SmallImage;
                      this.list[i].Images=this.temp.Images;
                      break
                    }  
                  }            
                }
                this.dialogFormVisible = false;
                this.$message({
                  message: response.Msg,
                  type: 'success'
                })
              }
            });
        }
      })
    },  
    showdetail(row){
      this.item=row;
      if(row.Images){
        this.item.imagelist=JSON.parse(row.Images)
      }
      this.dialogshowVisible=true;
    },
    shangjai(row,value) {
      var str= value==1?'确定要下架该产品吗？':'确定要上架该产品吗？';
      var data = this.$qs.stringify({ Id: row.Id,Status:value});
      this.$confirm(str, "提示", {
        dangerouslyUseHTMLString: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(() => {
          request({
            url: "TProduct/UpdateStatus",
            method: "post",
            data
          }).then(response => {
            if (response.Status==1) {
              this.$message({
                message: response.Msg,
                type: "success"
              });
              row.Status=value;
            }
          });
        })
        .catch(() => {});
    }, 
  }
};
</script>
<style lang="scss" rel="stylesheet/scss">
.product {
  .status1{color:#F56C6C;}
  .status2{color:#67C23A;}
  .status3{color:#E6A23C;}
  .status0{color:#409EFF;}
  .status4{color:#909399;}
  .qingkong{margin-left: 30px; color: #409EFF;}
}
</style>
