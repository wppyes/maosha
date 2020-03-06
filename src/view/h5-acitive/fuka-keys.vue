<template>
  <div class="DrawPrize boxright">    
    <div class="filter-container">
      <div class="filter-item" style="margin-right:20px;">
        <el-button type="primary" @click="handleadd('增加关键字',true)">
          <i class="el-icon-circle-plus"></i> 增加关键字
        </el-button>   
      </div>           
    </div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row>
      <el-table-column label="类型" align="center" prop="Amount">
        <template slot-scope="scope">
          <span v-text="keysget(scope.row)"></span> 
        </template>
      </el-table-column>
      <el-table-column label="关键字" align="center" prop="Key"></el-table-column>
      <el-table-column label="回复" align="center" prop="Value"></el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="handleditor(scope.row,'修改关键字',false)">
            <i class="el-icon-edit"></i>
          </el-button>
          <el-button size="mini" type="danger" @click="handledel(scope.row)">
            <i class="el-icon-delete"></i>
          </el-button>  
        </template>
      </el-table-column>
    </el-table> 
    <el-dialog :title="dialogStatus" :visible.sync="dialogFormVisible" :close-on-click-modal="false" width="600px">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="100px"
        style="width: 500px; margin-left:50px;"
      >       
 
        <el-form-item label="类型" prop="Type">
          <el-select
            v-model="temp.Type"
            placeholder="请选择类型"
            clearable
            style="width: 150px"
            class="filter-item"
          >
            <el-option v-for="item in Dll" :label="item.Text" :value="item.Value" :key="item.Value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="关键字" prop="Key">
          <el-input placeholder="请输入关键字"  v-model="temp.Key"/>
        </el-form-item>
        <el-form-item label="回复" prop="Value">
          <el-input placeholder="请输入回复" type="textarea"  v-model="temp.Value"/>
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
import upfile from "@/utils/upload";
export default {
  name: "DrawPrize",
  data() {
    return {
      list: [], //列表
      listLoading: false, //列表加载
      dialogStatus:'',//弹框标题
      dialogFormVisible:false,//是否展示弹框
      iscreate:true,//是否是增加
      Dll:[],
      temp:{
        Id:0,
        Type:'',
        Key:'',
        Value:''
      }, 
      rules:{  
        Type: [
          { required: true, message: "请选择类型！", trigger: "blur" }
        ],
        Value:[
          { required: true, message: "请填写回复", trigger: "blur" }
        ],
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    keysget(item){
      for(let i in this.Dll){
        if(this.Dll[i].Value==item.Type){
          return this.Dll[i].Text
        }
      }
    },
    getList(){
      this.listLoading = true;
      request({
        url: "SuctionPowder/Reply/GetReplyList",
        method: "get",
        params: {}
      }).then(response => {
        if (response.Status == 1) {
          this.list=response.List;
          this.Dll=response.Dll;
          this.listLoading = false;
        }
      });
    },
    handleadd(title,creat){
      this.temp.Id=0;
      this.temp.Type='';
      this.temp.Key='';
      this.temp.Value='';
      this.dialogStatus = title;
      this.dialogFormVisible = true;
      this.iscreate = creat;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },   
    handleditor(row, title, creat) {
      this.temp.Id=row.Id;
      this.temp.Type=row.Type.toString();
      this.temp.Key=row.Key;
      this.temp.Value=row.Value;
      this.dialogStatus = title;
      this.dialogFormVisible = true;
      this.iscreate = creat;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    createData(){
      this.$refs["dataForm"].validate(valid => {
        if (valid) { 
          var param={
              Id:this.temp.Id,
              Type:this.temp.Type,
              Key:this.temp.Key,
              Value:this.temp.Value
          };     
          var data = this.$qs.stringify(param);
          request({
            url: "SuctionPowder/Reply/SetReply",
            method: "post",
            data
          }).then(response => {
            if (response.Status==1) {              
              this.getList();                  
              this.dialogFormVisible = false;
              this.$message({
                message: response.Msg,
                type: "success"
              });
            }
          });
        }
      });
    },    
    handledel(row) {
      var data = this.$qs.stringify({ Id: row.Id });
      this.$confirm("确定要删除关键字吗？", "提示", {
        dangerouslyUseHTMLString: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(() => {
          request({
            url: "SuctionPowder/Reply/DelReply",
            method: "post",
            data
          }).then(response => {
            if (response.Status==1) {
              this.$message({
                message: response.Msg,
                type: "success"
              });
              const index = this.list.indexOf(row);
              this.list.splice(index, 1);
            }
          });
        })
        .catch(() => {});
    },
  }
};
</script>
<style lang="scss" rel="stylesheet/scss">
.DrawPrize {
  .PrizeImg{width:40px; height:40px;}
  .title{margin:  20px 0;}
}
</style>
