<template>
  <div class="sidebar">
    <el-menu class="sidebar-el-menu"
             :default-active="onRoutes"
             :collapse="collapse"
             background-color="#324157"
             text-color="#bfcbd9"
             active-text-color="#20a0ff"
             unique-opened
             router>
      <template v-for="item in items">
        <template v-if="item.subs && item.roles.includes(role)">
          <el-submenu :index="item.index"
                      :key="item.index">
            <template slot="title">
              <i :class="item.icon"></i>
              <span slot="title">{{ item.title }}</span>
            </template>
            <template v-for="subItem in item.subs">
              <el-submenu v-if="subItem.subs && subItem.roles.includes(role)"
                          :index="subItem.index"
                          :key="subItem.index">
                <template slot="title">{{ subItem.title }}</template>
                <el-menu-item v-for="(threeItem, i) in subItem.subs"
                              :key="i"
                              :index="threeItem.index">{{
                                    threeItem.title
                                }}</el-menu-item>
              </el-submenu>
              <el-menu-item v-if="!subItem.subs && subItem.roles.includes(role)"
                            :index="subItem.index"
                            :key="subItem.index">{{ subItem.title }}</el-menu-item>
            </template>
          </el-submenu>
        </template>
        <template v-if="!item.subs && item.roles.includes(role)">
          <el-menu-item :index="item.index"
                        :key="item.index">
            <i :class="item.icon"></i>
            <span slot="title">{{ item.title }}</span>
          </el-menu-item>
        </template>
      </template>
    </el-menu>
  </div>
</template>

<script>
import bus from '../common/bus';
export default {
  data () {
    return {
      collapse: false,
      role: JSON.parse(localStorage.getItem('userInfo')).roleType,
      items: [
        {
          icon: 'el-icon-lx-home',
          index: 'dashboard',
          title: '首页',
          roles: [1, 2, 3]
        },
        {
          icon: 'el-icon-s-platform',
          index: '2',
          title: '系统',
          roles: [1, 2, 3],
          subs: [
            {
              index: 'account',
              title: '账户信息',
              roles: [1, 2, 3]
            },
            {
              index: 'users',
              title: '用户管理',
              roles: [1, 2]
            }
          ]
        },
        {
          icon: 'el-icon-phone-outline',
          index: '3',
          title: '电销',
          roles: [1, 2, 3],
          subs: [
            {
              index: 'assess',
              title: '考核查询',
              roles: [1, 2]
            },
            {
              index: 'admincall',
              title: '外呼名单管理',
              roles: [1, 2]
            },
            {
              index: 'calllist',
              title: '外呼名单',
              roles: [3]
            },
            {
              index: 'callkey',
              title: '记录码管理',
              roles: [1, 2]
            },
            {
              index: 'perform',
              title: '今日表现',
              roles: [3]
            }
          ]
        }
      ]
    };
  },
  computed: {
    onRoutes () {
      return this.$route.path.replace('/', '');
    }
  },
  created () {
    // 通过 Event Bus 进行组件间通信，来折叠侧边栏
    bus.$on('collapse', msg => {
      this.collapse = msg;
      bus.$emit('collapse-content', msg);
    });
  }
};
</script>

<style scoped>
.sidebar {
    display: block;
    position: absolute;
    left: 0;
    top: 70px;
    bottom: 0;
    overflow-y: scroll;
}
.sidebar::-webkit-scrollbar {
    width: 0;
}
.sidebar-el-menu:not(.el-menu--collapse) {
    width: 250px;
}
.sidebar > ul {
    height: 100%;
}
</style>
