<template>
<Layout>
  <div style="min-height: 600px">
    <el-card shadow="never" style="min-height: 400px">
      <div slot="header">
        <el-row>
          <el-col :span="12">
            <span>{{ blog.title }}</span>
          </el-col>
          <el-col :span="12">
            <div style="text-align: right">
              <el-button
                @click="$share()"
                style="padding: 3px 0"
                type="text"
                icon="el-icon-share"
                >分享</el-button
              >
              <el-button
                @click="edit"
                style="padding: 3px 0"
                type="text"
                icon="el-icon-edit"
                v-if="token"
                >编辑</el-button
              >
              <el-button
                style="padding: 3px 0"
                type="text"
                icon="el-icon-more-outline"
                @click="more"
                >更多博客</el-button
              >
            </div>
          </el-col>
        </el-row>
      </div>
      <div style="font-size: 0.9rem; line-height: 1.5; color: #606c71">
        发布 {{ blog.createTime }} <br />
        更新 {{ blog.updateTime }}
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
        <pre style="font-family: '微软雅黑'">{{ blog.description }}</pre>
      </div>
      <div
        v-html="content"
        class="markdown-body"
        style="padding-top: 20px"
      ></div>
    </el-card>
  </div>
  </Layout> 
</template>

<page-query>
query ($id: ID!){
  blogData(id: $id){
    id
    title
    url{
      filename
      type
      language
      raw_url
      size
    }
    description
    createTime
    updateTime
    hide
    path
  }
}
</page-query>

<script>
import markdownIt from 'markdown-it'
const markdown = new markdownIt();
import store from "./../store/index";
import { single, edit } from "./../api/gist";
export default {
  name: "blogDeails",
  data() {
    return {
      content: '  '
    };
  },
  computed: {
    blog() {
      return this.$page.blogData;
    },
    token() {
      return store.state.token;
    },
  },
  mounted() {
    single(this.blog.id).then((response) => {
      let result = response.data;
      for (let key in result.files) {
        this["content"] =  markdown.render(result.files[key]["content"]);
        break;
      }
    });
  },
  methods: {
    edit() {
      if (!this.token) {
        this.$message({
          message: "请绑定有效的Token",
          type: "warning",
        });
        return;
      }
      this.$router.push("/edit/?id=" + this.blog.id);
    },
    more() {
      this.$router.push("/blog");
    },
  },
};
</script>

<style>
</style>