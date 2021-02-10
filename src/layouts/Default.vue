<template>
    <div id="app">
        <section
            class="page-header"
            :style="
                'background-image: linear-gradient(120deg, ' +
                configuration.backgroundColorLeft +
                ', ' +
                configuration.backgroundColorRight +
                ');color: ' +
                configuration.fontColor +
                ';'
            "
        >
            <div style="position: absolute; top: 20px; right: 20px; z-index: 2">
                <el-tooltip
                    effect="dark"
                    :content="fullButton.full ? '退出' : '全屏'"
                    placement="bottom-end"
                >
                    <el-button
                        @click="full"
                        :icon="
                            fullButton.full ? 'el-icon-close' : 'el-icon-rank'
                        "
                        circle
                    ></el-button>
                </el-tooltip>
            </div>
            <div
                v-for="(item, index) in randomIcon"
                :key="'ri' + index"
                :style="'position:absolute; top:' +item.top +'px; left:' +item.left +'px; z-index:1;'
                "
            >
                <font :style="'font-size: ' + item.size + 'px;color:#fff;'">
                    <b>♪</b>
                </font>
            </div>
            <h1 class="project-name">{{ configuration.blogTitle }}</h1>
            <h2 class="project-tagline">{{ configuration.blogDescribe }}</h2>
            <a
                :href="'https://github.com/' + configuration.githubUsername"
                class="btn"
                target="_blank"
                >GitHub主页</a
            >
            <a
                href="https://github.com/kspf/blog"
                class="btn"
                target="_blank"
                v-if="!configuration.mini"
            >
                博客源码
            </a>
        </section>
        <div
            style="position: relative;z-index: 2;margin: auto;margin-top: -30px;width: 64rem;"
        >
            <el-card shadow="never" :body-style="{ padding: '0px' }">
                <el-row>
                    <el-col :span="10">
                        <el-menu
                            @select="selectTopbar"
                            :default-active="topbar.active"
                            mode="horizontal"
                            menu-trigger="click"
                        >
                            <el-submenu index="#more">
                                <template slot="title">了解博主</template>
                                <el-menu-item index="#githubHome"
                                    >github主页</el-menu-item
                                >
                                <el-menu-item index="#blog"
                                    >其他博客</el-menu-item
                                >
                            </el-submenu>
                            <el-submenu
                                index="#webSites"
                                v-if="configuration.webSites.length > 0"
                            >
                                <template slot="title">其他网站</template>
                                <el-menu-item
                                    :index="'#webSites-' + index"
                                    v-for="(
                                        item, index
                                    ) in configuration.webSites"
                                    :key="'#webSites' + index"
                                    >{{ item.name }}</el-menu-item
                                >
                            </el-submenu>
                        </el-menu>
                    </el-col>
                    <el-col
                        :span="8"
                        style="text-align: center; padding: 12px 0px 0px 10px"
                    >
                        <el-row>
                            <el-col :span="4">
                                <el-popover placement="top" trigger="hover">
                                    <div style="text-align: center">
                                        <el-progress
                                            color="#67C23A"
                                            type="circle"
                                            :percentage="music.volume"
                                        ></el-progress>
                                        <br />
                                        <el-button
                                            @click="changeVolume(-10)"
                                            icon="el-icon-minus"
                                            circle
                                        ></el-button>
                                        <el-button
                                            @click="changeVolume(10)"
                                            icon="el-icon-plus"
                                            circle
                                        ></el-button>
                                    </div>

                                    <el-button
                                        @click="play"
                                        id="play"
                                        slot="reference"
                                        :icon="
                                            music.isPlay
                                                ? 'el-icon-refresh'
                                                : 'el-icon-caret-right'
                                        "
                                        circle
                                    ></el-button>
                                </el-popover>
                            </el-col>
                            <el-col :span="14" style="padding-left: 20px">
                                <el-slider
                                    @change="changeTime"
                                    :format-tooltip="$util.formatTime"
                                    :max="music.maxTime"
                                    v-model="music.currentTime"
                                    style="width: 100%"
                                ></el-slider>
                            </el-col>
                            <el-col
                                :span="6"
                                style="
                                    padding: 9px 0px 0px 10px;
                                    color: #909399;
                                    font-size: 13px;
                                "
                            >
                                {{ $util.formatTime(music.currentTime) }}/{{
                                    $util.formatTime(music.maxTime)
                                }}
                            </el-col>
                        </el-row>

                        <audio ref="music" loop autoplay v-if="audioAutoPlay">
                            <source
                                :src="configuration.audioUrl"
                                type="audio/mpeg"
                            />
                        </audio>
                        <audio ref="music" loop v-else>
                            <source
                                :src="configuration.audioUrl"
                                type="audio/mpeg"
                            />
                        </audio>
                    </el-col>
                    <el-col :span="4" style="text-align: right">
                        <div
                            style="
                                font-size: 20px;
                                color: #606266;
                                margin-top: 5px;
                            "
                        >
                            <b>{{ configuration.githubUsername }}</b>
                        </div>
                        <div style="color: #606266">
                            <i class="el-icon-location"></i>&nbsp;{{
                                configuration.location
                                    ? configuration.location
                                    : '未填写地址'
                            }}
                            <br />
                        </div>
                    </el-col>
                    <el-col :span="2" style="text-align: center">
                        <img
                            v-popover:bigAvatar
                            :src="configuration.avatar_url"
                            style="
                                margin-top: 4px;
                                margin-right: 10px;
                                width: 52px;
                                height: 52px;
                                border-radius: 5px;
                                border: 1px solid #ebeef5;
                            "
                        />
                        <el-popover
                            ref="bigAvatar"
                            placement="top-start"
                            :title="configuration.githubUsername"
                            width="200"
                            trigger="hover"
                        >
                            <i class="el-icon-star-on"></i>&emsp;{{
                                configuration.name
                            }}
                            <br />
                            <i class="el-icon-location"></i>&emsp;{{
                                configuration.location
                            }}
                            <br />
                            <img
                                :src="configuration.avatar_url"
                                style="width: 200px; height: 200px"
                            />
                        </el-popover>
                    </el-col>
                </el-row>
            </el-card>
        </div>
        <section class="main-content">
            <el-row>
                <el-col :span="6" style="padding-right: 10px">
                    <sidebar></sidebar>
                </el-col>
                <el-col :span="18" style="padding-left: 10px">
                    <section>
                        <slot></slot>
                    </section>
                </el-col>
            </el-row>
        </section>
        <section class="foot">
            <div
                style="
                    border-top: 1px #e1e4e8 solid !important;
                    padding: 45px 0px 45px 0px;
                "
            >
                <el-row>
                    <el-col :span="10">
                        <div>
                            © 2018 GitHub-Laziji&emsp;&emsp;
                            <a
                                href="https://github.com/GitHub-Laziji"
                                target="_blank"
                                >Profile</a
                            >&emsp;&emsp;
                            <a
                                href="https://github.com/GitHub-Laziji/vblog"
                                target="_blank"
                                >VBlog</a
                            >
                        </div>
                    </el-col>
                    <el-col :span="4">
                        <div style="text-align: center; font-size: 18px">
                            <i class="el-icon-location-outline"></i>
                        </div>
                    </el-col>
                    <el-col :span="10">
                        <div style="float: right">
                            <a
                                href="https://developer.github.com"
                                target="_blank"
                                >GitHub-API</a
                            >&emsp;&emsp;
                            <a href="https://cn.vuejs.org/" target="_blank"
                                >Vue.js</a
                            >&emsp;&emsp;
                            <a href="http://element.eleme.io/" target="_blank"
                                >Element</a
                            >
                        </div>
                    </el-col>
                </el-row>
            </div>
        </section>
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
  allUserInfo {
    edges { 
      node {
        id
        avatar_url
        name
        location
        blog
        followers
        following
      }
    }
  }
}
</static-query>

<script>
import appMin from './../components/AppMain';
import sidebar from './../components/Sidebar';
export default {
    data() {
        return {
            music: {
                isPlay: false,
                currentTime: 0,
                maxTime: 0,
                volume: 100,
            },
            fullButton: {
                full: false,
            },
            topbar: {
                active: '',
            },
            randomIcon: [],
            audioAutoPlay: true,
        };
    },
    components: {
        appMin,
        sidebar
    },
    computed: {
        configuration() {
            return Object.assign(
                this.$static.allConfiguration.edges[0].node,
                this.$static.allUserInfo.edges[0].node
            );
        },
    },
    mounted() {
        this.$nextTick(() => {
            setInterval(this.listenMusic, 1000);
        });
        let width = window.innerWidth;
        for (let i = 0; i < 12; i++) {
            let temp = {};
            let left = this.$util.randomInt(10, width - 310);
            if (left > width / 2 - 150) {
                left += 300;
            }
            temp['left'] = left;
            temp['top'] = this.$util.randomInt(20, 300);
            temp['size'] = this.$util.randomInt(20, 40);
            this.randomIcon.push(temp);
        }
    },
    methods: {
        full() {
            if (!this.fullButton.full) {
                this.$util.fullScreen();
                this.fullButton.full = true;
            } else {
                this.$util.fullExit();
                this.fullButton.full = false;
            }
        },
        selectTopbar(index) {
            //取消菜单选中状态
            this.topbar.active = this.topbar.active == '' ? ' ' : '';
            switch (index) {
                case '#githubHome':
                    window.open(
                        'https://github.com/' +
                            this.configuration.githubUsername
                    );
                    break;
                case '#blog':
                    if (this.blog) {
                        window.open(
                            (this.blog.match(/https?:\/\//i)
                                ? ''
                                : 'https://') + this.blog
                        );
                    } else {
                        this.$message({
                            message: '博主没有其他博客',
                            type: 'info',
                        });
                    }
                    break;
                default:
                    if (/#webSites-\d+/.test(index)) {
                        let i = parseInt(index.split('-')[1]);
                        let url = this.configuration.webSites[i].url;
                        window.open(
                            (url.match(/https?:\/\//i) ? '' : 'https://') + url
                        );
                    }
                    break;
            }
        },
        listenMusic() {
            if (!this.$refs.music) {
                return;
            }
            if (this.$refs.music.readyState) {
                this.music.maxTime = this.$refs.music.duration;
            }
            this.music.isPlay = !this.$refs.music.paused;
            this.music.currentTime = this.$refs.music.currentTime;
        },
        play() {
            if (this.$refs.music.paused) {
                this.$refs.music.play();
            } else {
                this.$refs.music.pause();
            }
            this.music.isPlay = !this.$refs.music.paused;
        },
        changeTime(time) {
            this.$refs.music.currentTime = time;
        },
        changeVolume(v) {
            this.music.volume += v;
            if (this.music.volume > 100) {
                this.music.volume = 100;
            }
            if (this.music.volume < 0) {
                this.music.volume = 0;
            }
            this.$refs.music.volume = this.music.volume / 100;
        },
    },
};
</script>


<style>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s;
}

.fade-enter,
.fade-leave-to {
    opacity: 0;
}
body,
html {
    margin: 0;
    padding: 0;
}
.page-header {
    padding: 5rem 6rem;
    color: #fff;
    text-align: center;
    background-color: #159957;
    background-image: linear-gradient(120deg, #155799, #159957);
}

.project-name {
    font-size: 3.25rem;
    margin-top: 0;
    margin-bottom: 0.1rem;
}

.project-tagline {
    font-size: 1.25rem;
    margin-bottom: 2rem;
    font-weight: normal;
    opacity: 0.7;
}

.btn:hover {
    color: rgba(255, 255, 255, 0.8);
    text-decoration: none;
    background-color: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.3);
}

a:hover {
    text-decoration: underline;
}

a:active,
a:hover {
    outline: 0;
}

.btn {
    padding: 0.75rem 1rem;
    display: inline-block;
    margin-bottom: 1rem;
    color: rgba(255, 255, 255, 0.7);
    background-color: rgba(255, 255, 255, 0.08);
    border-color: rgba(255, 255, 255, 0.2);
    border-style: solid;
    border-width: 1px;
    border-radius: 0.3rem;
    transition: color 0.2s, background-color 0.2s, border-color 0.2s;
}

a {
    color: #1e6bb8;
    text-decoration: none;
}

.btn + .btn {
    margin-left: 1rem;
}

.main-content {
    max-width: 64rem;
    padding: 30px 0px 30px 0px;
    margin: 0 auto;
    font-size: 1.1rem;
    word-wrap: break-word;
    min-height: 800px;
}

.foot {
    max-width: 67rem;
    margin: 0 auto;
    font-size: 12px !important;
    color: #586069 !important;
    word-wrap: break-word;
}
</style>