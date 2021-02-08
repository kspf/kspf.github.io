<template>
  <div style="min-height: 600px">
    <el-card shadow="never" style="margin-bottom: 20px">
      <el-input
        placeholder="请输入关键字"
        v-model="searchKey"
        clearable
        style="width: 300px"
      ></el-input>
      <el-button
        @click="search"
        icon="el-icon-search"
        style="margin-left: 10px"
        circle
        plain
      ></el-button>
      <el-button
        @click="$share()"
        style="margin-left: 10px"
        icon="el-icon-share"
        type="warning"
        plain
        circle
      ></el-button>
      <el-button
        type="primary"
        icon="el-icon-edit"
        round
        plain
        style="float: right"
        @click="goAdd"
        >写博文</el-button
      >
    </el-card>

    <div v-if="blogs && blogs.length > 0">
      <el-card
        shadow="hover"
        v-for="(item, index) in blogs"
        :key="'p' + index"
        style="margin-bottom: 20px"
        v-show="!item.node.hide"
      >
        <div slot="header">
          <el-row>
            <el-col :span="16">
              <span>
                <g-link
                  style="text-decoration: none; cursor: pointer"
                  :to="`/details/${item.node.id}`"
                >
                  <i class="el-icon-edit-outline"></i>&nbsp;&nbsp;
                  {{ item.node.title }}
                </g-link>
              </span>
            </el-col>
            <el-col :span="8">
              <div style="text-align: right">
                <el-button
                  @click="$share('/user/blog/details/' + item.node.id)"
                  style="padding: 3px 0"
                  type="text"
                  icon="el-icon-share"
                ></el-button>
                <el-button
                  @click="editBlog(index)"
                  style="padding: 3px 0"
                  type="text"
                  icon="el-icon-edit"
                  v-if="token"
                ></el-button>
                <el-button
                  @click="deleteBlog(index)"
                  style="padding: 3px 0"
                  type="text"
                  icon="el-icon-delete"
                  v-if="token"
                ></el-button>
              </div>
            </el-col>
          </el-row>
        </div>
        <div style="font-size: 0.9rem; line-height: 1.5; color: #606c71">
          最近更新 {{ item.node.updateTime | formatTime }}
        </div>
        <div
          style="
            font-size: 1.1rem;
            line-height: 1.5;
            color: #303133;
            padding: 10px 0px 0px 0px;
          "
        >
          {{ item.description }}
        </div>
      </el-card>
      <div style="text-align: center">
        <Pager
          class="el-pagination is-background"
          :info="$page.allBlogData.pageInfo"
          nav-class="navigation"
          link-class="page-link page-item"
          activeLink-class="active"
        />
      </div>
    </div>

    <el-card
      shadow="never"
      style="
        margin-bottom: 20px;
        padding: 20px 0px 20px 0px;
        text-align: center;
      "
      v-if="!blogs || blogs.length == 0"
    >
      <font style="font-size: 30px; color: #dddddd">
        <b>还没有博客 (╯°Д°)╯︵ ┻━┻</b>
      </font>
    </el-card>
  </div>
</template>



<page-query>
 query ($page: Int){
  
  allBlogData(perPage: 3, page: $page) @paginate {
    pageInfo {
      totalPages
      currentPage
    }
    edges{
      node{
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
      }
    }
  }
 }
</page-query>

<script>
import { Pager } from "gridsome";
import store from  "./../store/index"
import { adelete } from "./../api/gist"
export default {
  name: "blogPage",
  data() {
    return {
      searchKey: "",
    };
  },
  computed: {
    blogs() {
      return this.$page.allBlogData.edges;
    },
    token(){
      return store.state.token
    }
  },
  components: {
    Pager,
  },
  methods: {
    list() {
      this.blogs = [];
      this.loading = true;
      GistApi.list(this.query)
        .then((response) => {
          let result = response.data;
          let pageNumber = this.$util.parseHeaders(response.headers);
          if (pageNumber) {
            this.query.pageNumber = pageNumber;
          }
          for (let i = 0; i < result.length; i++) {
            for (let key in result[i].files) {
              let data = {};
              data["title"] = key;
              data["url"] = result[i].files[key];
              data["description"] = result[i]["description"];
              data["id"] = result[i]["id"];
              data["createTime"] = this.$util.utcToLocal(
                result[i]["created_at"]
              );
              data["updateTime"] = this.$util.utcToLocal(
                result[i]["updated_at"]
              );
              data["hide"] = false;
              this.blogs.push(data);
              break;
            }
          }
        })
        .then(() => (this.loading = false));
    },
    search() {
      
    },
    editBlog(index) {
      if (!this.token) {
        this.$message({
          message: "请绑定有效的Token",
          type: "warning",
        });
        return;
      }
      this.$router.push("/edit/?id=" + this.blogs[index].node.id);
    },
    deleteBlog(index) {
      this.$confirm("是否永久删除该博客?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        let blog = this.blogs[index];
        adelete(blog.node.id).then((result) => {
          this.$message({
            message: "删除成功",
            type: "success",
          });
          this.blogs.splice(index, 1);
        });
      });
    },
    goAdd() {
      if (!this.token) {
        this.$message({
          message: "请绑定有效的Token",
          type: "warning",
        });
        return;
      }
      this.$router.push("/add");
    },
  },
};
</script>

<style>
.page-link.page-item {
  width: 28px;
  height: 28px;
  display: inline-block;
  background-color: #f4f4f5;
  color: #606266;
  line-height: 28px;
  font-size: 13px;
  margin: 0 5px;
}

.active.page-link.page-item{
  width: 28px;
  height: 28px;
  background-color: #409eff;
  color: #fff;
}
</style>