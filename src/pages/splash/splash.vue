<template>
  <view class="splash">
    <view class="glow g1" />
    <view class="glow g2" />

    <view class="top">
      <view class="logo">
        <text class="logo-emoji">🌱</text>
      </view>
      <text class="app-name">农汇</text>
      <text class="slogan">产地直采 · 新鲜到家</text>
    </view>

    <view class="bottom">
      <view class="dots">
        <view v-for="i in 3" :key="i" class="dot" :style="{ animationDelay: i * 0.16 + 's' }" />
      </view>
      <text class="tip">让每一份新鲜，都来自看得见的地头</text>
    </view>

    <view class="copy">© 农汇 · 农产品直采平台</view>
  </view>
</template>

<script setup>
import { onMounted } from 'vue'

onMounted(() => {
  setTimeout(() => {
    const onboarded = uni.getStorageSync('nh_onboarded')
    const token = uni.getStorageSync('nh_token')
    if (onboarded && token) {
      uni.switchTab({ url: '/pages/tabbar/home/home' })
    } else if (onboarded) {
      uni.redirectTo({ url: '/pages/login/login' })
    } else {
      uni.redirectTo({ url: '/pages/onboarding/onboarding' })
    }
  }, 1500)
})
</script>

<style scoped>
.splash {
  position: relative;
  min-height: 100vh;
  background: linear-gradient(170deg, #f2fbf6 0%, #e6f9ef 45%, #d8f5e7 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
.glow {
  position: absolute;
  border-radius: 50%;
  filter: blur(60rpx);
  opacity: 0.55;
}
.g1 {
  width: 620rpx;
  height: 620rpx;
  background: #9fe8c4;
  top: -180rpx;
  right: -160rpx;
}
.g2 {
  width: 520rpx;
  height: 520rpx;
  background: #b9f0d3;
  bottom: -140rpx;
  left: -120rpx;
}
.top {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 120rpx;
}
.logo {
  width: 200rpx;
  height: 200rpx;
  border-radius: 56rpx;
  background: linear-gradient(140deg, #17d488, #06a96a);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 24rpx 60rpx rgba(10, 172, 106, 0.35);
}
.logo-emoji {
  font-size: 110rpx;
  line-height: 1;
}
.app-name {
  margin-top: 44rpx;
  font-size: 60rpx;
  font-weight: 800;
  letter-spacing: 12rpx;
  color: #0b3b28;
}
.slogan {
  margin-top: 16rpx;
  font-size: 26rpx;
  color: #4d7d68;
  letter-spacing: 3rpx;
}
.bottom {
  position: absolute;
  bottom: 180rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.dots {
  display: flex;
  gap: 12rpx;
  margin-bottom: 26rpx;
}
.dot {
  width: 12rpx;
  height: 12rpx;
  border-radius: 50%;
  background: #0fc97a;
  animation: bounce 1s infinite ease-in-out;
}
@keyframes bounce {
  0%, 100% { transform: translateY(0); opacity: 0.35; }
  50% { transform: translateY(-10rpx); opacity: 1; }
}
.tip {
  font-size: 22rpx;
  color: #6f9b86;
}
.copy {
  position: absolute;
  bottom: 60rpx;
  font-size: 20rpx;
  color: #9dbbab;
}
</style>
