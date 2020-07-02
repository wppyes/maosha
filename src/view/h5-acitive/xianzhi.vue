<template>
  <div class="addproduct boxright">
    <el-form
      ref="dataForm"
      :rules="rules"
      :model="temp"
      label-position="left"
      label-width="150px"
      style="width: 1300px; margin-left:20px;"
    > 
        <el-form-item label="限制：" prop="list">
            <div class="inpput-out" v-for="(item,index) in temp.list">
                <el-input style="width: 130px"  v-model="temp.list[index]" @change="set(index,item)" placeholder="请填写限制" />
                <i class="el-icon-delete" @click="del(index,item)" v-if="temp.list.length>1"></i>
            </div>              
            <el-button type="text" @click="add">增加</el-button>
        </el-form-item>
    </el-form>
    <el-button type="primary" style="margin-left:170px" @click="createData">确定</el-button>
  </div>
</template>
<script>
import request from "@/utils/request";

export default {
  name: "addproduct",
  data() {
    return {
      temp: {
        list: []
      },
      rules: {
        list: [{ required: true, message: "输入限制！", trigger: "blur" }]
      },
    };
  },
  created() {
    this.getdata();
  },
  methods: {
    set(index,item){
      var count=0;
      for (var i in this.temp.list) {
          if (this.temp.list[i] == item) {
              count++;              
          }
      };
       if (count > 1) {
            this.$message({
              message: '不能输入重复的属性！',
              type: "error"
            });
            return;
        }
    },
    del(index,id){
      this.temp.list.splice(index,1);
    },    
    add(){
      this.temp.list.push('');      
    },
    getdata() {
      request({
        url: "Vote/GetVote",
        method: "get",
        params: {}
      }).then(response => {
        if (response.Status == 1) {
            if(response.List){
                this.temp.list = response.List;
            }
          
        }
      });
    },
    createData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          var data = this.$qs.stringify(this.temp);
          request({
            url: "Vote/SetVote",
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
        }
      });
    },
  }
};
</script>
<style lang="scss" rel="stylesheet/scss">
.addproduct {
  .el-icon-delete{position:absolute; right: -5px; top: -5px; cursor: pointer; color: #f00;} 
  .inpput-out{display: inline-block; margin: 0 10px 10px 0; position: relative;}
  .guige .el-icon-delete{position:absolute; right: -5px; top: -5px; cursor: pointer; color: #f00;} 
}
</style>
