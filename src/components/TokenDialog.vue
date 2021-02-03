<!--
 * @Descripttion: 
 * @version: 
 * @Author: 马琳峰
 * @Date: 2021-02-03 17:58:47
 * @LastEditors: 马琳峰
 * @LastEditTime: 2021-02-03 17:59:30
-->
<template>
  <div>
    <el-dialog title="绑定Token" :visible.sync="show" width="500px">
      <el-form :model="tokenForm" ref="tokenForm" label-width="100px">
        <el-form-item label="GitHub">
          <el-tag>{{ configuration.githubUsername }}</el-tag>
        </el-form-item>
        <el-form-item
          prop="token"
          label="Token"
          :rules="[
            { required: true, message: '请输入accessToken', trigger: 'blur' },
          ]"
        >
          <el-input
            v-model="tokenForm.token"
            placeholder="请保管好Token"
          ></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="show = false">取 消</el-button>
        <el-button type="primary" @click="onSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<static-query>
query{
  allConfiguration{
    edges{
      node{
        id
				githubUsername
        blogTitle
        htmlTitle
        fontColor
        useBackgroundImage
        useBackgroundImage
        backgroundColorLeft
        blogDescribe
        backgroundColorRight
        audioUrl
        mini
        webSites{
          name
          url
        }
        
      }
    }
  }
}
</static-query>

<script>
export default {
  data() {
    return {
      show: false,
      handleClose: null,
      tokenForm: {
        token: "",
      },
    };
  },
  computed: {
    configuration() {
      return this.$static.allConfiguration.edges[0].node;
    },
  },
  methods: {
    open(handleClose) {
      this.handleClose = handleClose;
      this.show = true;
    },
    onSubmit() {
      this.$refs["tokenForm"].validate((valid) => {
        if (valid) {
          this.$store.dispatch("Authentication", this.tokenForm.token);
          if (typeof this.handleClose == "function") {
            this.handleClose();
          }
        }
      });
      this.show = false;
    },
  },
};
</script>