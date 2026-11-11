<template>
  <view class="ob">
    <view class="skip" @tap="finish">跳过</view>

    <swiper
      class="swiper"
      :current="current"
      :indicator-dots="false"
      @change="onChange"
      :disable-touch="false"
    >
      <swiper-item v-for="(s, i) in slides" :key="i">
        <view class="slide">
          <view class="art" :style="{ background: `linear-gradient(150deg, ${s.bg[0]}, ${s.bg[1]})` }">
            <view class="art-ring" />
            <text class="art-main">{{ s.main }}</text>
            <text class="art-sub a1">{{ s.deco[0] }}</text>
            <text class="art-sub a2">{{ s.deco[1] }}</text>
            <text class="art-sub a3">{{ s.deco[2] }}</text>
          </view>

          <view class="txt">
            <text class="title">{{ s.title }}</text>
            <text class="sub">{{ s.sub }}</text>
          </view>
        </view>
      </swiper-item>
    </swiper>

    <view class="footer">
      <view class="dots">
        <view v-for="(s, i) in slides" :key="i" class="dot" :class="{ on: i === current }" />
      </view>
      <view class="btn btn-primary" @tap="next">
        {{ current === slides.length - 1 ? '立即体验' : '下一步' }}
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'

const current = ref(0)
const slides = [
  {
    title: '凌晨现摘，当日发出',
    sub: '对接 1200+ 家庭农场，下单后才去地里摘，从田间到餐桌最快 12 小时。',
    main: '🧑‍🌾',
    deco: ['🥕', '🥬', '🌽'],
    bg: ['#DFF6E8', '#B9ECD0']
  },
  {
    title: '产地直播，看得见的新鲜',
    sub: '每批货都能查到地块、采摘人和检测报告，扫码即可溯源。',
    main: '📦',
    deco: ['🍅', '🌱', '🥒'],
    bg: ['#E6F7DD', '#C8EDB7']
  },
  {
    title: '认养一块地，吃自己种的菜',
    sub: '在线认养菜地，实时查看长势，按周配送到家，随时可退。',
    main: '🪴',
    deco: ['🌿', '🍓', '🌻'],
    bg: ['#E3F6E6', '#BFEDC8']
  }
]

function onChange(e) {
  current.value = e.detail.current
}

function next() {
  if (current.value < slides.length - 1) current.value++
  else finish()
}

function finish() {
  uni.setStorageSync('nh_onboarded', true)
  if (uni.getStorageSync('nh_token')) {
    uni.switchTab({ url: '/pages/tabbar/home/home' })
  } else {
    uni.redirectTo({ url: '/pages/login/login' })
  }
}
</script>

<style scoped>
.ob {
  min-height: 100vh;
  background: #fff;
  display: flex;
  flex-direction: column;
  position: relative;
}
.skip {
  position: absolute;
  top: 100rpx;
  right: 40rpx;
  z-index: 10;
  font-size: 26rpx;
  color: #9aa7a1;
  padding: 10rpx 20rpx;
}
.swiper {
  flex: 1;
  height: 72vh;
}
.slide {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 120rpx 60rpx 0;
}
.art {
  width: 100%;
  height: 520rpx;
  border-radius: 48rpx;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
.art-ring {
  position: absolute;
  width: 380rpx;
  height: 380rpx;
  border-radius: 50%;
  border: 2rpx solid rgba(255, 255, 255, 0.55);
}
.art-main {
  font-size: 190rpx;
  line-height: 1;
  filter: drop-shadow(0 16rpx 24rpx rgba(30, 70, 50, 0.22));
}
.art-sub {
  position: absolute;
  filter: drop-shadow(0 6rpx 10rpx rgba(30, 70, 50, 0.15));
}
.a1 {
  font-size: 86rpx;
  left: 70rpx;
  top: 90rpx;
}
.a2 {
  font-size: 64rpx;
  right: 90rpx;
  top: 130rpx;
}
.a3 {
  font-size: 100rpx;
  right: 130rpx;
  bottom: 60rpx;
}
.txt {
  margin-top: 70rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.title {
  font-size: 42rpx;
  font-weight: 800;
  color: #14201b;
  letter-spacing: -0.5rpx;
}
.sub {
  margin-top: 22rpx;
  font-size: 26rpx;
  color: #7c8a84;
  text-align: center;
  line-height: 1.7;
}
.footer {
  padding: 0 60rpx 90rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.dots {
  display: flex;
  gap: 10rpx;
  margin-bottom: 44rpx;
}
.dot {
  width: 14rpx;
  height: 14rpx;
  border-radius: 20rpx;
  background: #dfe9e4;
  transition: all 0.25s;
}
.dot.on {
  width: 44rpx;
  background: #0fc97a;
}
.btn {
  width: 100%;
}
</style>
