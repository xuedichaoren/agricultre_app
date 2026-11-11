<template>
  <view class="live">
    <view class="stage">
      <view class="stage-bg" />
      <text class="stage-emoji">🥬</text>
      <view class="vignette" />

      <!-- 顶部 -->
      <view class="top">
        <view class="status" :style="{ height: statusBar + 'px' }" />
        <view class="host">
          <view class="h-avatar">🧑‍🌾</view>
          <view class="h-info">
            <text class="h-name">李伯的菜园</text>
            <text class="h-fans">2.4 万人关注</text>
          </view>
          <view class="h-follow" :class="{ on: followed }" @tap="followed = !followed">
            {{ followed ? '已关注' : '关注' }}
          </view>
          <view class="h-close" @tap="close">
            <icon-svg name="close" :size="30" color="#FFFFFF" :stroke="2.2" />
          </view>
        </view>
        <view class="viewers">
          <view class="v-dot" />
          <text class="v-txt">1.2 万人在看</text>
          <text class="v-like">· 3.6 万赞</text>
        </view>
      </view>

      <!-- 商品卡 -->
      <view class="goods-float" @tap="toProduct">
        <prod-img emoji="🥬" :bg="['#E9F9EF', '#C9EFD9']" :h="120" :size="120" radius="14rpx" />
        <view class="gf-info">
          <text class="gf-name">有机小油菜 300g</text>
          <view class="row">
            <price-tag :price="5.8" :num-size="30" />
            <text class="gf-origin">¥6.9</text>
          </view>
        </view>
        <view class="gf-btn">抢购</view>
      </view>

      <!-- 聊天区 -->
      <view class="chat-area">
        <view class="sys-msg">欢迎来到直播间，下单前记得领券 🎁</view>
        <view v-for="(m, i) in messages" :key="i" class="msg">
          <text class="m-user">{{ m.user }}：</text>
          <text class="m-text">{{ m.text }}</text>
        </view>
      </view>

      <!-- 底部 -->
      <view class="bottom">
        <view class="input-row">
          <view class="chat-input" @tap="sendFake">说点什么…</view>
          <view class="cart-btn" @tap="toCart">
            <icon-svg name="cart" :size="30" color="#FFFFFF" :stroke="1.8" />
            <view class="cart-dot">3</view>
          </view>
          <view class="like-btn" @tap="like">
            <icon-svg name="heart" :size="34" color="#FF5A4E" :stroke="1.8" />
          </view>
        </view>
        <view class="safe-bottom" />
      </view>

      <!-- 飘心 -->
      <view class="hearts">
        <text v-for="(h, i) in hearts" :key="h.id" class="heart" :style="h.style">❤️</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { onUnmounted, ref } from 'vue'
import { toast } from '@/common/utils.js'

const statusBar = ref(20)
try {
  const info = uni.getStorageSync('sys_info')
  if (info && info.statusBarHeight) statusBar.value = info.statusBarHeight
} catch (e) {}

const followed = ref(false)
const messages = ref([
  { user: '阿杏', text: '这个油菜看着好嫩！' },
  { user: '小城故事', text: '能发上海吗' },
  { user: '李伯的菜园', text: '可以的，顺丰冷链次日达～' },
  { user: '种菜的小周', text: '刚下单了两份' }
])

const hearts = ref([])
let heartId = 0

function like() {
  const id = ++heartId
  const left = 40 + Math.random() * 60
  hearts.value.push({
    id,
    style: {
      left: left + '%',
      animationDuration: 2.4 + Math.random() + 's',
      fontSize: 30 + Math.random() * 20 + 'rpx'
    }
  })
  setTimeout(() => {
    hearts.value = hearts.value.filter((h) => h.id !== id)
  }, 3200)
}

function sendFake() {
  messages.value.push({ user: '我', text: '这个怎么保存呀？' })
  setTimeout(() => {
    messages.value.push({ user: '李伯的菜园', text: '冷藏能放 3 天，建议尽快吃～' })
  }, 900)
}

function close() {
  uni.navigateBack()
}
function toProduct() {
  uni.navigateTo({ url: '/pages/product/detail?id=p1' })
}
function toCart() {
  uni.switchTab({ url: '/pages/tabbar/cart/cart' })
}
</script>

<style scoped>
.live {
  min-height: 100vh;
  background: #0c1310;
}
.stage {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  overflow: hidden;
}
.stage-bg {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: radial-gradient(120% 80% at 50% 20%, #2b4a3c 0%, #16241e 55%, #0a100d 100%);
}
.stage-emoji {
  position: absolute;
  left: 50%;
  top: 42%;
  transform: translate(-50%, -50%);
  font-size: 460rpx;
  opacity: 0.95;
  filter: drop-shadow(0 30rpx 50rpx rgba(0, 0, 0, 0.5));
}
.vignette {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.55) 0%, rgba(0, 0, 0, 0) 28%, rgba(0, 0, 0, 0.2) 60%, rgba(0, 0, 0, 0.8) 100%);
}
.top {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  padding: 0 24rpx;
}
.host {
  display: flex;
  align-items: center;
  gap: 14rpx;
  margin-top: 10rpx;
}
.h-avatar {
  width: 76rpx;
  height: 76rpx;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40rpx;
}
.h-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}
.h-name {
  color: #fff;
  font-size: 26rpx;
  font-weight: 700;
}
.h-fans {
  color: rgba(255, 255, 255, 0.65);
  font-size: 19rpx;
  margin-top: 4rpx;
}
.h-follow {
  background: #ff5a4e;
  color: #fff;
  font-size: 21rpx;
  font-weight: 700;
  padding: 8rpx 22rpx;
  border-radius: 40rpx;
}
.h-follow.on {
  background: rgba(255, 255, 255, 0.2);
}
.h-close {
  width: 56rpx;
  height: 56rpx;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.16);
  display: flex;
  align-items: center;
  justify-content: center;
}
.viewers {
  display: flex;
  align-items: center;
  gap: 8rpx;
  margin-top: 16rpx;
}
.v-dot {
  width: 10rpx;
  height: 10rpx;
  border-radius: 50%;
  background: #ff5a4e;
}
.v-txt {
  color: #fff;
  font-size: 20rpx;
}
.v-like {
  color: rgba(255, 255, 255, 0.6);
  font-size: 19rpx;
}
.goods-float {
  position: absolute;
  right: 20rpx;
  top: 300rpx;
  width: 300rpx;
  background: rgba(255, 255, 255, 0.96);
  border-radius: 20rpx;
  padding: 12rpx;
  display: flex;
  flex-wrap: wrap;
  gap: 10rpx;
  box-shadow: 0 12rpx 30rpx rgba(0, 0, 0, 0.3);
}
.gf-info {
  flex: 1;
  min-width: 0;
  padding: 4rpx 0;
}
.gf-name {
  font-size: 21rpx;
  color: #16201c;
  font-weight: 600;
  display: block;
}
.gf-origin {
  font-size: 17rpx;
  color: #b3bfba;
  text-decoration: line-through;
  margin-left: 6rpx;
}
.gf-btn {
  width: 100%;
  height: 56rpx;
  border-radius: 56rpx;
  background: linear-gradient(135deg, #ff7a4a, #ff4b3a);
  color: #fff;
  font-size: 22rpx;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}
.chat-area {
  position: absolute;
  left: 20rpx;
  bottom: 200rpx;
  width: 460rpx;
  max-height: 420rpx;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  gap: 10rpx;
}
.sys-msg {
  align-self: flex-start;
  background: rgba(15, 201, 122, 0.22);
  border: 2rpx solid rgba(15, 201, 122, 0.4);
  color: #a8f5cf;
  font-size: 20rpx;
  padding: 8rpx 16rpx;
  border-radius: 12rpx;
}
.msg {
  background: rgba(0, 0, 0, 0.32);
  border-radius: 30rpx;
  padding: 8rpx 18rpx;
  align-self: flex-start;
  max-width: 100%;
}
.m-user {
  color: #8fe3ff;
  font-size: 20rpx;
}
.m-text {
  color: #fff;
  font-size: 20rpx;
}
.bottom {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 0 20rpx 10rpx;
}
.input-row {
  display: flex;
  align-items: center;
  gap: 14rpx;
}
.chat-input {
  flex: 1;
  height: 76rpx;
  border-radius: 76rpx;
  background: rgba(255, 255, 255, 0.18);
  border: 2rpx solid rgba(255, 255, 255, 0.22);
  display: flex;
  align-items: center;
  padding: 0 24rpx;
  color: rgba(255, 255, 255, 0.65);
  font-size: 23rpx;
}
.cart-btn {
  width: 76rpx;
  height: 76rpx;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.18);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}
.cart-dot {
  position: absolute;
  top: -2rpx;
  right: -2rpx;
  min-width: 30rpx;
  height: 30rpx;
  border-radius: 30rpx;
  background: #ff5a4e;
  color: #fff;
  font-size: 18rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}
.like-btn {
  width: 76rpx;
  height: 76rpx;
  border-radius: 50%;
  background: rgba(255, 90, 78, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
}
.hearts {
  position: absolute;
  right: 40rpx;
  bottom: 200rpx;
  width: 120rpx;
  height: 400rpx;
  pointer-events: none;
}
.heart {
  position: absolute;
  bottom: 0;
  animation: floatUp 3s ease-out forwards;
  opacity: 0.9;
}
@keyframes floatUp {
  0% { transform: translateY(0) scale(0.6); opacity: 0; }
  20% { opacity: 1; }
  100% { transform: translateY(-360rpx) scale(1.2); opacity: 0; }
}
</style>
