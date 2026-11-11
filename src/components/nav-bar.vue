<template>
  <view class="nav-wrap" :style="{ background: bgStyle }">
    <view class="status-bar" :style="{ height: barHeight + 'px' }" />
    <view class="nav-body">
      <view class="nav-left" @tap="onBack">
        <view v-if="back" class="back-btn" :class="{ 'back-btn--light': light }">
          <icon-svg name="back" :size="34" :color="iconColor" :stroke="2" />
        </view>
      </view>
      <view class="nav-title" :style="{ color: titleColor }">
        <slot name="title">{{ title }}</slot>
      </view>
      <view class="nav-right">
        <slot name="right" />
      </view>
    </view>
  </view>
</template>

<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  title: { type: String, default: '' },
  back: { type: Boolean, default: true },
  light: { type: Boolean, default: false }, // 深色背景上使用
  transparent: { type: Boolean, default: false },
  bg: { type: String, default: '#FFFFFF' }
})

const barHeight = ref(20)
try {
  const info = uni.getStorageSync('sys_info')
  if (info && info.statusBarHeight) barHeight.value = info.statusBarHeight
} catch (e) {}

const bgStyle = computed(() =>
  props.transparent ? 'transparent' : props.bg
)
const titleColor = computed(() => (props.light ? '#FFFFFF' : '#16201C'))
const iconColor = computed(() => (props.light ? '#FFFFFF' : '#16201C'))

function onBack() {
  if (!props.back) return
  const pages = getCurrentPages()
  if (pages.length > 1) uni.navigateBack()
  else uni.switchTab({ url: '/pages/tabbar/home/home' })
}
</script>

<style scoped>
.nav-wrap {
  position: relative;
  z-index: 20;
  width: 100%;
}
.nav-body {
  height: 88rpx;
  display: flex;
  align-items: center;
  padding: 0 20rpx;
}
.nav-left {
  width: 120rpx;
  display: flex;
  align-items: center;
}
.back-btn {
  width: 64rpx;
  height: 64rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.back-btn:active {
  background: rgba(0, 0, 0, 0.05);
}
.back-btn--light {
  background: rgba(0, 0, 0, 0.28);
  backdrop-filter: blur(6px);
}
.nav-title {
  flex: 1;
  text-align: center;
  font-size: 32rpx;
  font-weight: 600;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.nav-right {
  width: 120rpx;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
</style>
