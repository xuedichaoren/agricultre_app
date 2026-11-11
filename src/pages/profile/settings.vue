<template>
  <view class="page settings">
    <nav-bar title="设置" />
    <scroll-view scroll-y class="body no-scrollbar">
      <view class="card group">
        <view class="row-item" @tap="go('/pages/address/list')">
          <icon-svg name="location" :size="32" color="#3D4A45" :stroke="1.7" />
          <text class="r-name">收货地址</text>
          <text class="r-value">{{ store.addresses.length }} 个</text>
          <icon-svg name="right" :size="22" color="#C3CCC8" />
        </view>
        <view class="row-item" @tap="toast('已是最新版本')">
          <icon-svg name="refresh" :size="32" color="#3D4A45" :stroke="1.7" />
          <text class="r-name">检查更新</text>
          <text class="r-value">v1.0.0</text>
          <icon-svg name="right" :size="22" color="#C3CCC8" />
        </view>
      </view>

      <view class="card group">
        <view class="row-item">
          <icon-svg name="bell" :size="32" color="#3D4A45" :stroke="1.7" />
          <text class="r-name">消息通知</text>
          <view class="switch" :class="{ on: notify }" @tap="notify = !notify">
            <view class="knob" />
          </view>
        </view>
        <view class="row-item">
          <icon-svg name="truck" :size="32" color="#3D4A45" :stroke="1.7" />
          <text class="r-name">物流提醒</text>
          <view class="switch" :class="{ on: logistics }" @tap="logistics = !logistics">
            <view class="knob" />
          </view>
        </view>
        <view class="row-item">
          <icon-svg name="eye" :size="32" color="#3D4A45" :stroke="1.7" />
          <text class="r-name">个性化推荐</text>
          <view class="switch" :class="{ on: recommend }" @tap="recommend = !recommend">
            <view class="knob" />
          </view>
        </view>
      </view>

      <view class="card group">
        <view class="row-item" @tap="clearCache">
          <icon-svg name="trash" :size="32" color="#3D4A45" :stroke="1.7" />
          <text class="r-name">清除缓存</text>
          <text class="r-value">{{ cacheSize }}</text>
          <icon-svg name="right" :size="22" color="#C3CCC8" />
        </view>
        <view class="row-item" @tap="toast('隐私政策（演示）')">
          <icon-svg name="order" :size="32" color="#3D4A45" :stroke="1.7" />
          <text class="r-name">隐私政策</text>
          <icon-svg name="right" :size="22" color="#C3CCC8" />
        </view>
        <view class="row-item" @tap="toast('用户协议（演示）')">
          <icon-svg name="leaf" :size="32" color="#3D4A45" :stroke="1.7" />
          <text class="r-name">用户协议</text>
          <icon-svg name="right" :size="22" color="#C3CCC8" />
        </view>
      </view>

      <view class="logout" @tap="doLogout">退出登录</view>

      <view class="about">
        <text class="about-txt">农汇 v1.0.0 · 产地直采，新鲜到家</text>
        <text class="about-sub">杭州农汇网络科技有限公司</text>
      </view>
      <view style="height: 40rpx" />
    </scroll-view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { logout, store } from '@/store/index.js'
import { toast } from '@/common/utils.js'

const notify = ref(true)
const logistics = ref(true)
const recommend = ref(true)
const cacheSize = ref('12.6 MB')

function clearCache() {
  uni.showLoading({ title: '清理中' })
  setTimeout(() => {
    uni.hideLoading()
    cacheSize.value = '0 MB'
    toast('缓存已清除')
  }, 600)
}

function go(url) {
  uni.navigateTo({ url })
}

function doLogout() {
  uni.showModal({
    title: '退出登录',
    content: '退出后需要重新验证手机号才能登录',
    confirmColor: '#FF5A4E',
    success: (r) => {
      if (r.confirm) {
        logout()
        uni.reLaunch({ url: '/pages/login/login' })
      }
    }
  })
}
</script>

<style scoped>
.settings {
  min-height: 100vh;
}
.body {
  padding: 18rpx 24rpx 0;
  height: calc(100vh - 90rpx);
}
.group {
  padding: 0 24rpx;
  margin-bottom: 18rpx;
}
.row-item {
  display: flex;
  align-items: center;
  gap: 18rpx;
  height: 108rpx;
  border-bottom: 2rpx solid #f6f9f7;
}
.row-item:last-child {
  border-bottom: none;
}
.r-name {
  flex: 1;
  font-size: 27rpx;
  color: #263330;
}
.r-value {
  font-size: 22rpx;
  color: #a8b3ae;
  margin-right: 4rpx;
}
.switch {
  width: 88rpx;
  height: 50rpx;
  border-radius: 50rpx;
  background: #e6ece9;
  padding: 4rpx;
  display: flex;
  transition: background 0.2s;
}
.switch.on {
  background: #0fc97a;
}
.knob {
  width: 42rpx;
  height: 42rpx;
  border-radius: 50%;
  background: #fff;
  transition: transform 0.2s;
  box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.12);
}
.switch.on .knob {
  transform: translateX(38rpx);
}
.logout {
  margin-top: 30rpx;
  height: 100rpx;
  background: #fff;
  border-radius: 24rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28rpx;
  color: #ff5a4e;
  font-weight: 600;
}
.about {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8rpx;
  padding: 50rpx 0 20rpx;
}
.about-txt {
  font-size: 21rpx;
  color: #b3bfba;
}
.about-sub {
  font-size: 19rpx;
  color: #c9d2ce;
}
</style>
