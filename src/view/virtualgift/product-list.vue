<template>
  <div class="product boxright"> 
    <el-tabs v-model="Category" type="card" @tab-click="handleClick">
        <el-tab-pane v-for="item in CategoryList" 
            :key="item.Id" 
            :name="item.Id+''"
            :label="item.Name">
        </el-tab-pane>   
    </el-tabs>        
    <div class="filter-container">
      <div class="filter-item" style="margin-right:20px;">
        <el-button type="primary" @click="handleadd(0,'增加产品',true)">
          <i class="el-icon-circle-plus"></i> 增加产品
        </el-button>
      </div>
    </div>   
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row>
      <el-table-column label="产品Id" align="center" prop="ItemId" width="100px"></el-table-column>
      <el-table-column label="产品名称" align="left" prop="Name"></el-table-column>
      <el-table-column label="面值" align="center" prop="Price" width="100px"></el-table-column>   
      <el-table-column label="进货价" align="center" prop="PurchasePrice" width="100px"></el-table-column>  
      <el-table-column label="总库存" align="center" prop="Sum" width="100px"></el-table-column>  
      <el-table-column label="剩余库存" align="center" prop="SYCount" width="100px"></el-table-column>  
      <el-table-column label="已用数量" align="center" prop="YYCount" width="100px"></el-table-column>  
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
          <el-button size="mini" type="primary" @click="linktohuafei(scope.row)">
            增加库存
          </el-button>
        </template>
      </el-table-column>
    </el-table> 
    <el-dialog :title="dialogStatus" :visible.sync="dialogFormVisible" :close-on-click-modal="false" width="550px">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item label="产品Id" prop="ItemId">
          <el-input v-model="temp.ItemId" placeholder="请填写产品Id"/>
        </el-form-item>
        <el-form-item label="产品名称" prop="Name">
          <el-input v-model="temp.Name" placeholder="请填写产品名称"/>
        </el-form-item>
        <el-form-item label="产品面值" prop="Price">
          <el-input v-model="temp.Price" placeholder="请填写产品面值"/>
        </el-form-item>
        <el-form-item label="进货价" prop="PurchasePrice">
          <el-input v-model="temp.PurchasePrice" placeholder="请填写进货价"/>
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
var biglist=[];
export default {
  name: "product",
  components: { Pagination },
  data() {
    return {
      list: [], //列表
      listLoading: false, //列表加载
      CategoryList:[],
      Category:'1',
      temp: {
        Id: 0,
        Name: '',
        ItemId:'',
        Category:'',
        Price:'',
        PurchasePrice:''
      },
      dialogStatus:'',//面板标题    
      dialogFormVisible: false,//面板是否展示
      iscreate:false,//是否是添加
      rules: {
        Name: [{ required: true, message: '名称必须填写！', trigger: 'blur' }],
        ItemId: [{ required: true, message: '产品Id必须填写！', trigger: 'blur' }],
        Price: [{ required: true, message: '面值必须填写！', trigger: 'blur' }],
        PurchasePrice: [{ required: true, message: '进货价必须填写！', trigger: 'blur' }]
      },
    };
  },
  created() {
    request({
      url: "TProduct/DDL",
      method: "get",
      params: {}
    }).then(response => {
      if (response.Status == 1) {
        this.CategoryList=response.List;
        this.Category=response.List[0].Id+'';
        this.temp.Category=response.List[0].Id;
      }
    });
    this.getList();    
  },
  mounted () {
    this.$bus.$on('productchange', ()=> {
      this.getList()
    })
  },
  methods: {
    handleClick(){
      this.temp.Category=this.Category;
      this.showlist();
    },
    getList(){
      this.listLoading = true;
      request({
        url: "TProduct/GetProductList",
        method: "get",
        params: {}
      }).then(response => {
        if (response.Status == 1) {
          biglist=response.List;
          this.showlist();
          this.listLoading = false;
        }
      });
    },  
    showlist(){
      this.list=[];
      for(let i in biglist){
        if(biglist[i].Category==this.Category){
          this.list.push(biglist[i])
        }
      }
    },
    handleadd(row,title,creat){
      this.temp.Id=0;
      this.temp.Name='';
      this.temp.ItemId='';
      this.temp.Price='';
      this.temp.PurchasePrice='';
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
      this.temp.Price=row.Price;
      this.temp.PurchasePrice=row.PurchasePrice;
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
            Price:this.temp.Price,
            PurchasePrice:this.temp.PurchasePrice,
            Category:this.temp.Category,
            Type:0
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
                  biglist.push(param);    
                  this.showlist()         
                }else{
                  for(let i in this.list){
                    if (this.list[i].Id === this.temp.Id) {
                      this.list[i].Name=this.temp.Name;
                      this.list[i].ItemId=this.temp.ItemId;
                      this.list[i].Price=this.temp.Price;
                      this.list[i].PurchasePrice=this.temp.PurchasePrice;
                      this.list[i].Category=this.temp.Category;
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
    linktohuafei(row){
     this.$router.push({
        path: "product-list/kami",
        query: { id:row.ItemId }
      });
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
