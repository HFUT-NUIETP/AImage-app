<template>
  <Layout>
    <Topbar>
      <template v-slot:left>
        <topbar-back></topbar-back>
      </template>
      <template v-slot:center>
        <view>设置</view>
      </template>
      <template v-slot:right>
        <view class="topbar-shortcut" @click="saveConfig">保存</view>
      </template>
    </Topbar>
    <view class="setting">
      <view class="setting-item">
        <view style="display: flex">
          <view style="flex-grow: 1">服务器选择</view>
          <picker class="server-picker" :range="serverList" range-key="name" :value="index"
                  @change="onPickerChange">
            <text>{{ serverList[index].name }}</text>
          </picker>
        </view>
        <view class="setting-item">
          <input class="setting-input" type="text" v-model:value="currServerUrl" :disabled="index === 0">
        </view>
      </view>
      <setting-item @click.native="testConn">
        <template v-slot:main>
          服务器连通性测试
        </template>
      </setting-item>
      <setting-item :arrow="false">
        <template v-slot:main>
          版本
        </template>
        <template v-slot:side>
          <text style="font-size: 16px">{{version}}</text>
        </template>
      </setting-item>
      <navigator open-type="navigate" url="/pages/setting/about">
        <setting-item>
          <template v-slot:main>
            关于
          </template>
        </setting-item>
      </navigator>
    </view>
  </Layout>
</template>

<script>
import Layout from "@/components/layout";
import Topbar from "@/components/topbar";
import TopbarBack from "@/components/topbar-back";
import SettingItem from "@/components/setting-item";

export default {
  name: "setting",
  components: {SettingItem, TopbarBack, Topbar, Layout},
  data() {
    return {
      serverList: [
        {
          name: "默认",
          value: "http://tencent.terrytengli.com:8002/"
        },
        {
          name: "自定义",
          value: ""
        }
      ],
      index: uni.getStorageSync('serverUrl') === "http://tencent.terrytengli.com:8002/" ? 0: 1,
      currServerUrl: uni.getStorageSync('serverUrl')
    }
  },
  methods: {
    testConn() {
      let url = this.currServerUrl;
      uni.request({
        url: url + "test",
        method: "GET",
        success: (res) => {
          if (res.data === 1) {
            uni.showToast({
              title: `${url}\n连接成功`,
              icon: "none",
              mask: false,
              duration: 2000
            });
          } else {
            uni.showToast({
              title: `${url}\n服务器返回无效`,
              icon: "none",
              mask: false,
              duration: 2000
            });
          }
        },
        fail: (res) => {
          uni.showToast({
            title: `${url}\n连接失败`,
            icon: "none",
            mask: false,
            duration: 2000
          });
        }
      })
    },
    saveConfig() {
      uni.setStorageSync('serverUrl', this.currServerUrl);
      console.log(uni.getStorageSync('serverUrl'))
      uni.navigateBack();
    },
    onPickerChange(e) {
      let value = e.target.value;
      this.index = value;
      this.currServerUrl = this.serverList[value].value;
    }
  }
}
</script>

<style scoped lang="scss">
@import "../../common";
.setting {
  background-color: white;
  flex-grow: 1;
  padding-left: 72rpx;
  padding-right: 72rpx;
  &-item {
    margin-top: 40rpx;
  }
  &-input {
    height: 82rpx;
    border: 2rpx solid #707070;
    border-radius: 14rpx;
    padding: 0 20rpx;
  }
}
</style>