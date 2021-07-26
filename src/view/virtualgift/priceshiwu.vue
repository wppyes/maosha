<template>
  <div class="product boxright"> 
    <div class="back">
      <span @click="backto">
        <i class="el-icon-arrow-left"></i>返回
      </span>
    </div>  
    <div class="filter-container">
      <div class="filter-item" style="margin-right:20px;">
        <el-button type="primary" @click="handleadd(0,'设置供货价',true)">
          <i class="el-icon-circle-plus"></i> 设置供货价
        </el-button>
      </div>
    </div>   
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row>
      <el-table-column label="产品Id" align="center" prop="ItemId" width="100px"></el-table-column>
      <el-table-column label="产品名称" align="left" prop="Name"></el-table-column>
      <el-table-column label="进货价" align="center" prop="PurchasePrice" width="100px"></el-table-column> 
      <el-table-column label="价格" align="center" prop="XSPrice" width="100px"></el-table-column> 
      <el-table-column label="操作" align="center" width="300px">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="handleditor(scope.row,'修改供货价',false)">
            <i class="el-icon-edit"></i>
          </el-button>
          <el-button
            size="mini" type="danger"
            @click="handledel(scope.row)"><i class="el-icon-delete"></i></el-button>
        </template>
      </el-table-column>
    </el-table> 
    <el-dialog :title="dialogStatus" :visible.sync="dialogFormVisible" :close-on-click-modal="false" width="550px">
       <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item label="供货价" prop="Price">
          <el-input v-model="temp.Price" placeholder="请填写供货价"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="createData">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="设置供货价" :visible.sync="dialogAddVisible" :close-on-click-modal="false" width="850px">
       <el-card class="box-card" v-for="item in chiocelist" :key="item.Id">
        <div class="flex">
          <div class="left-one">名称：{{item.Name}}<br/>进货价：{{item.PurchasePrice}}</div>
          <div>
            <el-input v-model="item.setprice" placeholder="请填写价格" style="width:200px"/>
          </div>
          <el-button type="primary" @click="sub(item)">确定</el-button>
        </div>
      </el-card>
    </el-dialog>
  </div>
</template>
<script>
import request from "@/utils/request";
import Pagination from "@/components/Pagination";
export default {
  name: "product",
  components: { Pagination },
  data() {
    return {
      list: [], //列表
      chiocelist:[],//
      listLoading: false, //列表加载
      temp: {
        Id: 0,
        Price:''
      },
      tempadd:{
        CId:'',
        ItemId:'',
        Price:'',
      },
      dialogStatus:'',//面板标题    
      dialogFormVisible: false,//面板是否展示
      dialogAddVisible:false,
      rules: {
        Name: [{ required: true, message: '名称必须填写！', trigger: 'blur' }],
        ItemId: [{ required: true, message: '产品Id必须填写！', trigger: 'blur' }],
        PurchasePrice: [{ required: true, message: '进货价必须填写！', trigger: 'blur' }]
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
    handleClick(){
      this.temp.Category=this.Category;
      this.showlist();
    }, 
    backto() { 
      this.$router.go(-1); 
    },  
    sub(row){
       var param={
          CId:this.tempadd.CId,
          ItemId:row.ItemId,
          Price:row.setprice
        }
        if(row.setprice=='' || parseFloat(row.setprice)<0){
          this.$message({
                message: '请输入正确的价格',
                type: 'error'
              })
          return
        }
        var data=this.$qs.stringify(param);
        request({
            url: "Customer/SetCustomerPrice",
            method: "post",
            data
          }).then(response => {
            if(response.Status==1){
              const index = this.chiocelist.indexOf(row)
              this.chiocelist.splice(index, 1); 
              this.getList();
              this.$message({
                message: response.Msg,
                type: 'success'
              })
            }
          });
    },
    getList(){
      this.listLoading = true;
      request({
        url: "Customer/GetCustomerPriceList",
        method: "get",
        params: {CId:this.$route.query.id,Type:1}
      }).then(response => {
        if (response.Status == 1) {
          this.list=response.List;
          this.listLoading = false;
        }
      });
    },  
    handledel(row){
      var data=this.$qs.stringify({Id:row.Id});
      this.$confirm("确定要删除吗？", '提示', {
          dangerouslyUseHTMLString: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
           request({
            url: "Customer/UpdateCustomerPriceStatus",
            method: "post",
            data
          }).then(response => {
            if(response.Status==1){
              this.$message({
                message: response.Msg,
                type: 'success'
              });          
              const index = this.list.indexOf(row)
              this.list.splice(index, 1);
            }                      
          });
        }).catch(() => {         
      })  
    },
    handleadd(row){
      this.tempadd.CId=this.$route.query.id;
      this.tempadd.ItemId='';
      this.temp.Price='';
      this.dialogAddVisible = true;
      this.getchoicelist();
    },
    getchoicelist(){
      request({
        url: "Customer/GetProductCategoryTypeList",
        method: "get",
        params: {CId:this.$route.query.id}
      }).then(response => {
        if (response.Status == 1) {
          for(let i in response.List){
            response.List[i].setprice=response.List[i].PurchasePrice;
          }
          this.chiocelist=response.List;
        }
      });
    },
    handleditor(row,title,creat){      
      this.temp.Id=row.Id;
      this.temp.Price=row.XSPrice;
      this.dialogStatus = title;
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData(){
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {              
          var param={
            Id:this.temp.Id,
            Price:this.temp.Price
          }
          var data=this.$qs.stringify(param);
          request({
              url: "Customer/UpdateCustomerPrice",
              method: "post",
              data
            }).then(response => {
              if(response.Status==1){
                for(let i in this.list){
                    if (this.list[i].Id === this.temp.Id) {
                      this.list[i].XSPrice=this.temp.Price;
                      break
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
  .box-card{margin-bottom: 10px;
    .flex{
      display: flex; justify-content: space-between;
    }
    
  .left-one{width: 250px;}
  }
}
</style>
