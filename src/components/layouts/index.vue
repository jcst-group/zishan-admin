<template>
  <a-layout id="components-layout-demo-custom-trigger" >
    <a-layout-sider
      :trigger="null"
      collapsible
      v-model="collapsed"
      :style='{minHeight: selectHeight}'
    >
    <div class="logo" style="height:50px;background-color:transparent;">
      <span style="font-size:16px;color:#fff;margin-left:10px;margin-top:20px;display:block" v-if="!collapsed">{{platObj.name}}</span>
    </div>
    <side-menu
      @addTab='addTab'
      :menus="menus"
      :curRoute='curRoute'
    >
    </side-menu>
    </a-layout-sider>
    <a-layout style="overflow:auto;">
      <a-layout-header style="background: #fff; padding: 0; min-width:1200px">  
        <a-icon
          class="trigger"
          :type="collapsed ? 'menu-unfold' : 'menu-fold'"
          @click="()=> collapsed = !collapsed"
        />
        <a-button type="primary" icon="poweroff" @click="logout" style="float:right;margin:16px;">退出</a-button>
        <!-- <a-popover v-if="weatherObj.areaCode">
          <template slot="content">
            <p>Content</p>
          </template>
          <div class="weather-wrapper">
            <div>
              <span class="area-wrapper">{{weatherObj.areaName}}：</span>
              <div style="display:inline-block;margin-right:8px">
                <span>天气：{{weatherObj.now.weather}}</span>
                <img :src="require(`../../../public/icon/day/${weatherObj.now.weatherCode}.png`)" width="30" height="30" alt="">
              </div>
              <span>温度：{{weatherObj.now.airTem}}℃</span>
              <span>空气指数：{{weatherObj.now.aqi}}</span>
            </div>
          </div>
        </a-popover> -->
      </a-layout-header>
      <a-layout-header style="background: #fff; padding: 0; margin-top: 10px;boxShadow: 'rgba(0, 0, 0, 0.1) 0px 0px 5px';boxShadow: rgba(0, 0, 0, 0.1) 0px 0px 5px; min-width: 1200px" :style="{maxWidth: curWdith}">
        <a-tabs v-model="curKey" type='editable-card' @change='selectTab' @edit='editTab' :hideAdd='true'>
          <a-tab-pane :closable="item.id !== '0'" :tab="item.tabName" :key="item.id" v-for="item in routeArr"></a-tab-pane>
        </a-tabs>
      </a-layout-header>
      <a-layout-content style="box-sizing: border-box" :style="{minWidth: '1200px',padding: '0 20px',background: '#fff', transform: 'translate:(-50%, -50%)' }">
        <keep-alive :include="curRouteArr">
          <router-view></router-view>
        </keep-alive>
        <!-- <router-view></router-view> -->
      </a-layout-content>
      <a-layout-footer style="padding: 0px">
        <global-footer />
      </a-layout-footer>
    </a-layout>
  </a-layout>
</template>
<script>
 import SideMenu from '@/components/layouts/SideMenu'
 import GlobalFooter from '@/components/layouts/GlobalFooter'
 import {mapActions} from 'vuex'
 import {filterNoChild} from '@/utils/TreeDataUtil'
 import {getWeather} from '@/api/allapi'
 import {
    getPlatInfo
  } from '@/api/permissonApi'
  export default {
    name: "GlobalLayout",
    components: {
      SideMenu,
      GlobalFooter
    },
    data(){
      return {
        collapsed: false,
        routeArr: [],
        curKey: '0',
        curRoute: '',
        weatherObj: {},
        imgUrl: null,
        platObj: {}
      }
    },
    created() {
      getPlatInfo({
        type: 2
      }).then(res => {
        this.platObj = res.result ? res.result : {}
      })
    },
    methods: {
      ...mapActions({
        logout:'user/logout'
      }),
      editTab(index) {
        let activeKey = this.curKey
        let lastIndex
        this.routeArr.forEach((pane, i) => {
          if (pane.id === index) {
            lastIndex = i - 1
          }
        })
        const routeArr = this.routeArr.filter(pane => pane.id !== index)
        if (lastIndex >= 0 && activeKey === index) {
          activeKey = routeArr[lastIndex].id
          this.$router.push({
            path: routeArr[lastIndex].route
          })
        }
        this.routeArr = routeArr
        this.curKey = activeKey
      },
      addTab(item) {
        let id = item.id + ''
        setTimeout(() => {
          if (!this.routeArr.some(ele => ele.id === id)) {
            this.routeArr.push({
              route: item.code,
              tabName: item.name,
              id: item.id + '',
              name: item.code
            })
          }
        }, 200)
        this.curKey = item.id + ''
      },
      selectTab(index) {
        let curRoute = ''
        for (let i = 0; i < this.routeArr.length; i++) {
          if (index === this.routeArr[i].id) {
            curRoute = this.routeArr[i].route
          }
        }
        this.$router.push({
          path: curRoute
        })
        this.curRoute = curRoute
      }
    },
    computed :{
      menus(){
        const filterMenus = filterNoChild(this.$store.state.user.menus);
        return this.$store.state.user.menus
      },
      curWdith() {
        return document.body.clientWidth - 200 + 'px'
      },
      selectHeight() {
        return document.body.clientHeight + 'px'
      },
      curRouteArr() {
        return this.routeArr.map(ele => ele.name)
      }
    },
    mounted() {
      // $.ajax({
      //     url:"https://api.map.baidu.com/location/ip?ak=HQi0eHpVOLlRuIFlsTZNGlYvqLO56un3&coor=bd09ll",
      //     type: 'POST', 
      //     dataType: 'JSONP',
      //     async: false, 
      //     cache: true, 
      //     success: function (data) { 
      //         console.log(data)
      //     },
      // });
      // getWeather().then(res => {
      //   if (res.success) {
      //     this.weatherObj = res.result
      //     this.imgUrl = `../../../public/icon/day/${this.weatherObj.now.weatherCode}.png`
      //   }
      // })
      this.$store.dispatch("user/queryMenus");
      this.$router.push({
        path: '/nxhome'
      })
      this.routeArr.push({
        route: '/nxhome',
        tabName: '首页',
        id: '0',
        name: 'nxhome'
      })
    }
  }
</script>
<style lang='stylus'>
.ant-layout-header{
  text-align: left;
}
.ant-layout-content{
  text-align: left;
  padding: 0;
}
#components-layout-demo-custom-trigger {
  height:100%
}
#components-layout-demo-custom-trigger .trigger {
  font-size: 18px;
  line-height: 64px;
  padding: 0 24px;
  cursor: pointer;
  transition: color .3s;
}

#components-layout-demo-custom-trigger .trigger:hover {
  color: #1890ff;
}

#components-layout-demo-custom-trigger .logo {
  height: 32px;
  background: rgba(255,255,255,.2);
  margin: 16px;
}

#components-layout-demo-custom-trigger
  .weather-wrapper
    float right
    display flex
    .area-wrapper
      margin-right 0px
      color blue
    span
      margin-right 10px
      font-size 14px
      vertical-align top
</style>
