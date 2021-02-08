<!--
 * @Descripttion: 
 * @version: 
 * @Author: 马琳峰
 * @Date: 2021-02-03 17:55:48
 * @LastEditors: 马琳峰
 * @LastEditTime: 2021-02-03 18:06:45
-->
<template>
  <div>
    <el-card shadow="never">
      <el-menu :default-active="active"  @select="onSelect">
        <g-link
          v-for="(item) in constantRouterMap"
          :key="item.path"
          :index="item.path"  
          :to="item.path"
        >
          <el-menu-item :index="item.path">
            <i :class="item.icon"></i>
            <span slot="title">{{ item.title }}</span>
          </el-menu-item>
        </g-link>
      </el-menu>
    </el-card>

    <el-card shadow="never" style="margin-top: 20px; text-align: center">
      <div
        v-if="!token"
        style="font-size: 0.9rem; line-height: 1.5; color: #606c71"
      >
        <el-tag type="danger" size="small">&nbsp;</el-tag>&nbsp;&nbsp;
        Token未绑定&nbsp;&nbsp;
        <el-button type="text" @click="openTokenDialog">绑定</el-button>
      </div>
      <div
        v-if="token"
        style="font-size: 0.9rem; line-height: 1.5; color: #303133"
      >
        <el-tag type="success" size="small">&nbsp;</el-tag>&nbsp;&nbsp;
        Token已绑定&nbsp;&nbsp;
        <el-button type="text" @click="cancellation">注销</el-button>
      </div>
      <div style="margin-top: 10px; text-align: left">
        <el-alert
          title="Token获取"
          type="info"
          description="在 github-> settings-> developerSettings-> personalAccessTokens 勾选gist权限,获取Token. 详情参考README.md"
          :closable="false"
        >
        </el-alert>
      </div>
    </el-card>
    <token-dialog ref="tokenDialog"></token-dialog>
  </div>
</template>


<static-query>
query{
  allMenu{
    edges{
      node{
      	id
        menu{
          title
          icon
          path
        }
      }
    }
  }
}
</static-query>

<script>
import TokenDialog from "./TokenDialog";
import store from  "./../store/index"
export default {
  name: "sidebar",
  components: {
    TokenDialog,
  },
  data() {
    return {
      active: "",
      parentUrl: "",
    };
  },
  mounted(){
    this.active = this.$route.path
  },
  computed: {
    constantRouterMap() {
      return this.$static.allMenu.edges[0].node.menu;
    },
    token(){
      return store.state.token
    }
  },
  methods: {
    openTokenDialog() {
      this.$refs.tokenDialog.open(() => {});
    },
    cancellation() {
      store.dispatch("Cancellation");
    },
    onSelect(index){
      this.active = index
    }
  },
};
</script>