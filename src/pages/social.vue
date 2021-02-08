<!--
 * @Descripttion: 
 * @version: 
 * @Author: 马琳峰
 * @Date: 2021-02-04 16:29:14
 * @LastEditors: 马琳峰
 * @LastEditTime: 2021-02-04 17:08:20
-->
<template>
  <div>
    <el-card
      shadow="never"
      style="min-height: 400px; margin-bottom: 20px; padding: 0px 0px 20px 0px"
    >
      <el-tabs v-model="activeTab" type="card" @tab-click="onSelect">
        <el-tab-pane
          :label="'粉丝 ' + followers.followersTotal"
          name="followers"
          style="padding: 5px"
        >
          <div>
            <div v-if="followers.followers.length">
              <el-row style="min-height: 200px">
                <el-col
                  :span="8"
                  v-for="(item, index) in followers.followers"
                  :key="'followers' + index"
                  style="padding: 10px"
                >
                  <el-card
                    shadow="hover"
                    style="font-size: 13px; color: #606266; line-height: 20px"
                  >
                    <i class="el-icon-star-off"></i>&emsp;
                    <a
                      @click="$router.push(`/user/social/details/${item.login}`)"
                      style="text-decoration: none; cursor: pointer"
                      >{{ item.login }}</a
                    >
                    <br />
                    <i class="el-icon-message"></i>&emsp;
                    <a
                      :href="item.html_url"
                      target="_blank"
                      style="text-decoration: none; cursor: pointer"
                      >TA的主页</a
                    >
                    <br />
                    <img
                      :src="item.avatar_url"
                      style="width: 100%; border-radius: 5px; margin-top: 5px"
                    />
                  </el-card>
                </el-col>
              </el-row>
              <div style="text-align: center; margin-top: 10px"></div>
            </div>
            <div
              style="
                min-height: 300px;
                margin-bottom: 20px;
                padding: 20px 0px 20px 0px;
                text-align: center;
              "
              v-else
            >
              <font style="font-size: 30px; color: #dddddd">
                <b>(￢_￢) 没有一个粉丝</b>
              </font>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane
          :label="'关注 ' + allFollowing.followingTotal"
          name="following"
          style="padding: 5px"
        >
          <div>
            <div v-if="allFollowing.following.length">
              <el-row style="min-height: 200px">
                <el-col
                  :span="8"
                  v-for="(item, index) in allFollowing.following"
                  :key="'following' + index"
                  style="padding: 10px"
                >
                  <el-card
                    shadow="hover"
                    style="font-size: 13px; color: #606266; line-height: 20px"
                  >
                    <i class="el-icon-star-off"></i>&emsp;
                    <a
                      @click="$router.push(`/user/social/details/${item.login}`)"
                      style="text-decoration: none; cursor: pointer"
                      >{{ item.login }}</a
                    >
                    <br />
                    <i class="el-icon-message"></i>&emsp;
                    <a
                      :href="item.html_url"
                      target="_blank"
                      style="text-decoration: none; cursor: pointer"
                      >TA的主页</a
                    >
                    <br />
                    <img
                      :src="item.avatar_url"
                      style="width: 100%; border-radius: 5px; margin-top: 5px"
                    />
                  </el-card>
                </el-col>
              </el-row>
              <div style="text-align: center; margin-top: 10px"></div>
            </div>
            <div
              style="
                min-height: 300px;
                margin-bottom: 20px;
                padding: 20px 0px 20px 0px;
                text-align: center;
              "
              v-else
            >
              <font style="font-size: 30px; color: #dddddd">
                <b>(￢_￢) 还没有关注一个人</b>
              </font>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<page-query>
query{
  allFollowers{
    edges{
      node{
        followers{
          login
          avatar_url
          html_url
        }
        followersTotal
      }
    }
  }
  allFollowing{
    edges{
      node{
        following{
          login
          avatar_url
          html_url
        }
        followingTotal
      }
    }
  }
}
</page-query>


<script>
export default {
  name: "socialPage",
  data() {
    return {
      activeTab: "followers",
      following: false,
    };
  },
  computed: {
    followers() {
      return this.$page.allFollowers.edges[0].node;
    },
    allFollowing() {
      return this.$page.allFollowing.edges[0].node;
    },
  },
  methods: {
    onSelect() {},
    listFollowers() {},
    listFollowing() {},
  },
};
</script>

<style>
</style>