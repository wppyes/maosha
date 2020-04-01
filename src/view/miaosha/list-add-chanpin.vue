<template>
  <div class="renwu boxright">
    <div class="back">
      <span @click="backto">
        <i class="el-icon-arrow-left"></i>返回
      </span>
    </div>
    <div class="filter-container" v-if="AStatus==0 || Role==1">
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
      <el-table-column label="排序" width="170px" align="center">
         <template slot-scope="scope">
          <span @click="sort(scope.row,scope.$index,-1)" :class="scope.$index==0?'disabled':''">  
          <i class="fa fa-arrow-up"></i>上移  
          </span>&nbsp;&nbsp;&nbsp;  
          <span @click="sort(scope.row,scope.$index,+1)" :class="scope.$index==list.length-1?'disabled':''">  
          <i class="fa fa-arrow-down"></i>下移  
          </span> 
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="linktoeditor(scope.row)" v-if="AStatus==0 || Role==1">
            <i class="el-icon-edit"></i>
          </el-button>
          <el-button size="mini" type="danger" @click="handledel(scope.row)" v-if="AStatus==0 || Role==1">
            <i class="el-icon-delete"></i>
          </el-button>
          <el-button size="mini" type="primary"  @click="handleup(scope.row)" v-if="scope.row.Difference==3 &&scope.row.Type==1 || scope.row.Difference==2 &&scope.row.Type==1">
            上传卡密（{{scope.row.Counts}}）
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
    <el-dialog title="上传文件" :visible.sync="dialogkamiVisible" :close-on-click-modal="false" width="650px">
      <el-form
        ref="datawuliu"
        :rules="ruleswuliu"
        :model="temp1"
        label-position="left"
        label-width="100px"
        style="width: 350px; margin-left:50px;"
      >        
        <el-button size="mini" type="danger" @click="delkami()" style="margin-bottom:20px">
            <i class="el-icon-delete"></i> 删除卡密
          </el-button>
        <el-form-item label="文件上传" prop="filepath">          
          <el-upload
              class="upload-demo"
              drag
              ref="upload"
              accept=".xls,.xlsx"
              action=""
              :http-request="upLoad"
              >
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
              <div class="el-upload__tip" slot="tip">只能上传xls文件</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogkamiVisible = false">取消</el-button>
        <el-button type="primary" @click="subwuliu">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import request from "@/utils/request";

import Pagination from "@/components/Pagination";

import upfile from '@/utils/upload';
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
      dialogkamiVisible:false,
      flag:true,
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
        Type:'',
        Difference:'',
        Desc:''
      },
      temp1:{
        apid:0,
        filepath:'',
        type:''
      },
      listQuery:{
        title:'',
        pageIndex: 1,
        pageSize: 5
      },
      list:[],
      iscreate:false,
      renwulist:[],
      Role:0,
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
      ruleswuliu:{  
        filepath: [
          { required: true, message: "请上传文件！", trigger: "blur" }
        ]
      }   
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
          this.Role=response.Role;
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
    sort: function (item, index, type) {//使用方法：传递当前数组的item,index下标,-1为上移，+1为下移 
        this.setup(item, index, type,this.renwulist);
    },
    setup: function (item, index, type, arr1) {
        if (!this.flag) {
            return;
        }
        this.flag = false;
        if ((type < 0 && index == 0) || (type > 0 && index == arr1.length - 1)) {
            return;
        }; 
        var temp = arr1[index];        
        var id1 = item.Id, id2 = arr1[index + type].Id;//当前id为 id1,替换id为id2
        var data=this.$qs.stringify({id1: id1, id2: id2,});
        request({
          url: "AProduct/Sort",
          method: "post",
          data
        }).then(response => {
          if(response.Status==1){              
            this.$set(arr1, index, arr1[index + type]);
            this.$set(arr1, index + type, temp);
          }
          this.flag = true;
        });
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
      this.temp.Type='';
      this.temp.Difference='';
      this.temp.Desc='';
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
          this.temp.Type=this.list[i].Type;
          this.temp.Difference=this.list[i].Difference;
          this.temp.Desc=this.list[i].Desc;
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
                Type:this.temp.Type,
                Difference:this.temp.Difference,
                Desc:this.temp.Desc

              }
              this.renwulist.push(param);
            }            
          });
        }
      });
    },    
    handleup(row){
      this.dialogkamiVisible=true;
      this.temp1.apid=row.Id;
      this.temp1.filepath='';
      this.temp1.type=row.Difference;
      this.$nextTick(() => {
        this.$refs["datawuliu"].clearValidate();
      });
    }, 
    upLoad(param){
      upfile(param.file,'Upload/UploadFile',(data => {
          if(data.Status){
              this.temp1.filepath=data.Path;
          }else{
              this.$message({
                message: data.Msg,
                type: "error"
            });
          };
      }))
    },     
    subwuliu(){
      this.$refs["datawuliu"].validate(valid => {
        if (valid) { 
          var param={
              filepath:this.temp1.filepath,
              apid:this.temp1.apid,
              type:this.temp1.type==2?0:1
          };  
          var data = this.$qs.stringify(param);
          request({
            url: "AProduct/UploadQM",
            method: "post",
            data
          }).then(response => {
            if (response.Status==1) {
              this.dialogkamiVisible = false;
              this.$message({
                message: response.Msg,
                type: "success"
              });
            }
          });
        }
      });
    }, 
    delkami(){
      var data = this.$qs.stringify({ apid: this.temp1.apid});
      this.$confirm("确定要删除卡密吗？", "提示", {
        dangerouslyUseHTMLString: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(() => {
          request({
            url: "AProduct/DelCode",
            method: "post",
            data
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
    }
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
    .el-table__body-wrapper .disabled{color: #C0C4CC;}
    .el-table__body-wrapper span{cursor: pointer;}
  }
</style>
