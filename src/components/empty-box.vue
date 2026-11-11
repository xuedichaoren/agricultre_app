<template>
  <view class="empty">
    <view class="art">
      <view class="art-circle" />
      <text class="art-emoji">{{ emoji }}</text>
    </view>
    <text class="title">{{ text }}</text>
    <text v-if="sub" class="sub">{{ sub }}</text>
    <view v-if="btnText" class="btn btn-ghost btn-sm act" @tap="$emit('action')">
      {{ btnText }}
    </view>
  </view>
</template>

<script setup>
defineProps({
  text: { type: String, default: '这里还空空的' },
  sub: { type: String, default: '' },
  emoji: { type: String, default: '🧺' },
  btnText: { type: String, default: '' }
})
defineEmits(['action'])
</script>

<style scoped>
.empty {
  padding: 120rpx 60rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.art {
  width: 220rpx;
  height: 220rpx;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 30rpx;
}
.art-circle {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  border-radius: 50%;
  background: linear-gradient(150deg, #eafaf1, #d3f2e2);
}
.art-emoji {
  font-size: 96rpx;
  filter: drop-shadow(0 8rpx 14rpx rgba(30, 70, 50, 0.15));
}
.title {
  font-size: 28rpx;
  color: #3d4a45;
  font-weight: 600;
}
.sub {
  margin-top: 12rpx;
  font-size: 24rpx;
  color: #9aa7a1;
  text-align: center;
}
.act {
  margin-top: 40rpx;
  padding: 0 44rpx;
}
</style>
