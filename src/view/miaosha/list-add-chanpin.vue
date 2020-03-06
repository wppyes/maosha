<template>
  <div class="renwu boxright">
    <div class="back">
      <span @click="backto">
        <i class="el-icon-arrow-left"></i>返回
      </span>
    </div>
    <div class="filter-container" v-if="AStatus==0">
      <div class="filter-item" style="margin-right:20px;">
        <el-button type="primary" @click="handleadd">
          <i class="el-icon-circle-plus"></i> 增加产品
        </el-button>
      </div>
    </div>
    <el-table v-loading="listLoading1" :data="renwulist" border fit highlight-current-row>
      <el-table-column label="名称" align="center" prop="Title"></el-table-column>
      </el-table-column>
      <el-table-column label="总库存" align="center" prop="Num" width="100px"></el-table-column>
      </el-table-column>
      <el-table-column label="剩余库存" align="center" prop="Balance" width="100px"></el-table-column>
      </el-table-column>
      <el-table-column label="原价" align="center" prop="Price" width="100px"></el-table-column>
      </el-table-column>
      <el-table-column label="实付价格" align="center" prop="Pay" width="100px"></el-table-column>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="linktoeditor(scope.row)" v-if="AStatus==0">
            <i class="el-icon-edit"></i>
          </el-button>
          <el-button size="mini" type="danger" @click="handledel(scope.row)" v-if="AStatus==0">
            <i class="el-icon-delete"></i>
          </el-button>
        </template>
      </el-table-column>
    </el-table> 
    <el-dialog :title="titles" :visible.sync="dialogVisible" top="60px" :close-on-click-modal="false" width="500px">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" style="width: 400px;">
            <div class="filter-container">
              <el-input
                placeholder="请输入产品标题"
                v-model="listQuery.title"
                style="width: 250px;"
                class="filter-item"
                clearable
              />  
              <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>   
            </div>
              
            <el-form-item label="选择产品" prop="Title">
              <el-radio-group v-model="checked" size="small">
                <el-radio v-for="item in list" :label="item.Id" :key="item.Id" border>{{item.Title}}</el-radio>
              </el-radio-group>
       
            </el-form-item> 
              <pagination
                small
                layout="prev, pager, next"
                :total="total"
                :page.sync="listQuery.pageIndex"
                :limit.sync="listQuery.pageSize"
                @pagination="getdata"
              />   
          <el-form-item label="总库存" prop="Num">
            <el-input v-model="temp.Num" style="width: 150px;" placeholder="请填写总库存" />
          </el-form-item>
          <el-form-item label="原价" prop="Price">
            <el-input v-model="temp.Price" style="width: 150px;" placeholder="请填写原价" />
          </el-form-item>
          <el-form-item label="实付价格" prop="Pay">
            <el-input v-model="temp.Pay" style="width: 150px;" placeholder="请填写实付价格" />
          </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="createData">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import request from "@/utils/request";

import Pagination from "@/components/Pagination";
export default {
  name: "renwu",
  components: { Pagination },
  data() {
    return {
      listLoading1:false,
      dialogVisible:false,
      titles:'',
      total:0,
      checked:'',
      AStatus:'',
      temp:{
        Id:0,
        Activity:'',
        Title:'',//名称
        Cover:'',
        Images:'',//
        Contents:'',
        Num:'',
        Balance:'',
        Price:'',
        Pay:'',
      },
      listQuery:{
        title:'',
        pageIndex: 1,
        pageSize: 5
      },
      list:[],
      iscreate:false,
      renwulist:[],
      rules: {
        Title: [
          { required: true, message: "产品名称必须填写！", trigger: "blur" }
        ],
        Num: [
          { required: true, message: "总库存必须填写！", trigger: "blur" }
        ],
        Price: [
          { required: true, message: "原价必须填写！", trigger: "blur" }
        ],
        Pay: [
          { required: true, message: "实付价格必须填写！", trigger: "blur" }
        ],
        Cover: [
          { required: true, message: "产品图片必须上传！", trigger: "change" }
        ],
        Images: [{ required: true, message: "产品主图必须上传！", trigger: "blur" }],
      },   
    };
  },
  created() {
    this.temp.Activity=this.$route.query.id;
    this.getdata();
    this.getalrenwu();
  },
  mounted () {
    this.$bus.$on('productchange', ()=> {
      this.getdata();
    })
    this.$bus.$on('list-productchange', ()=> {
      this.getalrenwu();
    })
  },
  methods: {
    getalrenwu(){
      this.listLoading1=true;
      request({
        url: "AProduct/GetAProductList",
        method: "get",
        params:{activity:this.temp.Activity}
      }).then(response => {
        if (response.Status==1) {   
          this.renwulist=response.List;   
          this.AStatus=response.AStatus;
          this.listLoading1=false;
        }            
      });
    },
    backto() {
      this.$router.go(-1);
    },
    getdata(){ 
      request({
        url: "Product/GetProductList",
        method: "get",
        params:this.listQuery
      }).then(response => {
        if (response.Status==1) {   
          this.list=response.List;  
        }            
      });
    },
    handleFilter() {
      this.listQuery.pageIndex = 1;
      this.getdata();
    },  
    handleadd(){
      this.titles='新增产品';
      this.checked='';
      this.temp.Id=0;   
      this.temp.Title='';
      this.temp.Cover='';
      this.temp.Images='';
      this.temp.Contents='';
      this.temp.Num='';
      this.temp.Price='';
      this.temp.Pay='';
      this.iscreate=true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
      this.dialogVisible=true;
    },
    linktoeditor(row){
       this.$router.push({
        path: "/miaosha/list/list-editor-product",
        query: { id:row.Id }
      });
    },
    handledel(row) {
      var data = this.$qs.stringify({ Id: row.Id});
      this.$confirm("确定要移除该产品吗？", "提示", {
        dangerouslyUseHTMLString: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(() => {
          request({
            url: "AProduct/DelAProduct",
            method: "post",
            data
          }).then(response => {
            if (response.Status==1) {
              const index = this.renwulist.indexOf(row);
              this.renwulist.splice(index, 1);
              this.$message({
                message: response.Msg,
                type: "success"
              });
            }
          });
        })
        .catch(() => {});
    },
    createData(){ 
      this.temp.Balance=this.temp.Num;
      for(let i in this.list){
        if(this.list[i].Id==this.checked){
          this.temp.Title=this.list[i].Title;
          this.temp.Cover=this.list[i].Cover;
          this.temp.Images=this.list[i].Images;
          this.temp.Contents=this.list[i].Contents;
        }
      }
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          var data = this.$qs.stringify(this.temp);
          request({
            url: "AProduct/SetAProduct",
            method: "post",
            data
          }).then(response => {
            if (response.Status==1) { 
              this.dialogVisible = false
              this.$message({
                message: response.Msg,
                type: 'success'
              });
              let param={
                Id:response.AId,
                Activity:this.temp.Activity,                  
                Title:this.temp.Title,//名称
                Cover:this.temp.Cover,
                Images:this.temp.Images,//
                Contents:this.temp.Contents,
                Num:this.temp.Num,
                Balance:this.temp.Balance,
                Price:this.temp.Price,
                Pay:this.temp.Pay,
              }
              this.renwulist.push(param);
            }            
          });
        }
      });
    },
  }
};
</script>
<style lang="scss" rel="stylesheet/scss">
  .renwu{ 
    h3{
      margin: 10px 0 20px;
      font-weight: 400;
      color: #1f2f3d;
      font-size: 22px;
    }
    .el-radio.is-bordered+.el-radio.is-bordered{margin-left: 0;}
    .el-radio.is-bordered{margin-bottom: 10px;}
  }
</style>
