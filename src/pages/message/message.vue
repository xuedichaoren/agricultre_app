<template>
  <view class="page msg-page">
    <nav-bar title="消息" />
    <scroll-view scroll-y class="body no-scrollbar">
      <view class="entries">
        <view v-for="e in entries" :key="e.name" class="entry" @tap="onEntry(e)">
          <view class="e-icon" :style="{ background: e.bg }">
            <text class="e-emoji">{{ e.emoji }}</text>
            <view v-if="e.badge" class="e-badge">{{ e.badge }}</view>
          </view>
          <text class="e-name">{{ e.name }}</text>
        </view>
      </view>

      <view class="list">
        <view v-for="m in list" :key="m.id" class="chat-item" @tap="openChat(m)">
          <view class="c-avatar" :style="{ background: m.type === 'system' ? '#eaf9f1' : m.type === 'notice' ? '#eaf3ff' : '#f2fbf6' }">
            {{ m.avatar }}
          </view>
          <view class="flex1">
            <view class="c-top">
              <text class="c-name">{{ m.name }}</text>
              <text class="c-time">{{ m.time }}</text>
            </view>
            <view class="c-bottom">
              <text class="c-last ellipsis">{{ m.last }}</text>
              <view v-if="m.unread" class="c-dot">{{ m.unread }}</view>
            </view>
          </view>
        </view>
      </view>

      <view class="end-tip">— 只显示最近 30 天的消息 —</view>
      <view style="height: 40rpx" />
    </scroll-view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { MESSAGES } from '@/common/data.js'
import { store } from '@/store/index.js'
import { toast } from '@/common/utils.js'

const list = ref(MESSAGES)
const entries = [
  { name: '订单通知', emoji: '📦', bg: '#eaf9f1', badge: 1, path: '/pages/order/list?tab=shipping' },
  { name: '物流助手', emoji: '🚚', bg: '#eaf3ff', badge: 0, path: '/pages/order/logistics?id=NH20261109008' },
  { name: '优惠活动', emoji: '🎁', bg: '#fff4e4', badge: 2, path: '/pages/profile/coupon' },
  { name: '农友互动', emoji: '💬', bg: '#f1eeff', badge: 0, path: '/pages/tabbar/community/community' }
]

function onEntry(e) {
  if (e.path.startsWith('/pages/tabbar')) return uni.switchTab({ url: e.path })
  uni.navigateTo({ url: e.path })
}

function openChat(m) {
  if (m.type === 'system') {
    if (m.name.includes('订单')) return uni.navigateTo({ url: '/pages/order/list?tab=all' })
    return toast('系统通知详情（演示）')
  }
  if (m.type === 'notice') {
    return uni.navigateTo({ url: '/pages/post/detail?id=o2' })
  }
  uni.navigateTo({ url: `/pages/message/chat?id=${m.id}` })
}
</script>

<style scoped>
.msg-page {
  min-height: 100vh;
}
.body {
  padding: 18rpx 24rpx 0;
  height: calc(100vh - 90rpx);
}
.entries {
  display: flex;
  background: #fff;
  border-radius: 26rpx;
  padding: 26rpx 0;
}
.entry {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10rpx;
}
.e-icon {
  width: 92rpx;
  height: 92rpx;
  border-radius: 28rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}
.e-emoji {
  font-size: 44rpx;
}
.e-badge {
  position: absolute;
  top: -6rpx;
  right: -6rpx;
  min-width: 30rpx;
  height: 30rpx;
  border-radius: 30rpx;
  background: #ff5a4e;
  color: #fff;
  font-size: 18rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 6rpx;
  border: 3rpx solid #fff;
}
.e-name {
  font-size: 21rpx;
  color: #3d4a45;
}
.list {
  background: #fff;
  border-radius: 26rpx;
  margin-top: 20rpx;
  padding: 0 24rpx;
}
.chat-item {
  display: flex;
  gap: 18rpx;
  padding: 24rpx 0;
  border-bottom: 2rpx solid #f6f9f7;
}
.chat-item:last-child {
  border-bottom: none;
}
.c-avatar {
  width: 92rpx;
  height: 92rpx;
  border-radius: 26rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 46rpx;
  flex-shrink: 0;
}
.c-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.c-name {
  font-size: 27rpx;
  font-weight: 700;
}
.c-time {
  font-size: 20rpx;
  color: #b3bfba;
}
.c-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 10rpx;
  gap: 16rpx;
}
.c-last {
  flex: 1;
  font-size: 23rpx;
  color: #9aa7a1;
}
.c-dot {
  min-width: 34rpx;
  height: 34rpx;
  border-radius: 34rpx;
  background: #ff5a4e;
  color: #fff;
  font-size: 18rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 8rpx;
}
.end-tip {
  text-align: center;
  font-size: 20rpx;
  color: #c3ccc8;
  padding: 30rpx 0;
}
</style>
