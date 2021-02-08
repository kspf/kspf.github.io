<template>
  <div style="min-height: 600px" v-loading="loading">
    <el-card shadow="never" style="min-height: 400px" v-if="gists.id">
      <div slot="header">
        <span>{{ gists.title }}</span>
      </div>
      <div style="font-size: 0.9rem; line-height: 1.5; color: #606c71">
        发布 {{ gists.createTime | formatTime}} <br />
        更新 {{ gists.updateTime | formatTime}}
      </div>
      <div
        style="
          font-size: 1.1rem;
          line-height: 1.5;
          color: #303133;
          border-bottom: 1px solid #e4e7ed;
          padding: 5px 0px 5px 0px;
        "
      >
        <pre style="font-family: '微软雅黑'">{{ gists.description }}</pre>
      </div>
      <div
        v-html="gists.content"
        class="markdown-body"
        style="padding-top: 20px"
      ></div>
    </el-card>
    <el-card
      shadow="never"
      style="
        margin-bottom: 20px;
        padding: 20px 0px 20px 0px;
        text-align: center;
      "
      v-if="!gists.id"
    >
      <font style="font-size: 30px; color: #dddddd">
        <b>没有更新 ╮(๑•́ ₃•̀๑)╭</b>
      </font>
    </el-card>
  </div>
</template>

<page-query>
query{
  allGists{
    edges{
      node{
        id
        description
        content
        title
        createTime
        updateTime
      }
    }
  }
}
</page-query>

<script>
export default {
  name: "newPage",
  data(){
    return {
      loading: true,
    }
  },
  computed:{
    gists(){
      this.loading = false;
      return this.$page.allGists.edges[0].node
    }
  }
};
</script>

<style>
</style>