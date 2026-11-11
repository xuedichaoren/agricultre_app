<template>
  <view class="page coupon-page">
    <nav-bar title="优惠券" />
    <view class="tabs">
      <view v-for="t in tabs" :key="t.key" class="tab" :class="{ on: active === t.key }" @tap="active = t.key">
        <text class="tab-txt">{{ t.name }}</text>
        <view v-if="active === t.key" class="tab-line" />
      </view>
    </view>

    <scroll-view scroll-y class="body no-scrollbar">
      <view v-if="list.length" class="list">
        <view v-for="c in list" :key="c.id" class="coupon" :class="{ used: c.used, pick }" @tap="onPick(c)">
          <view class="left">
            <view class="c-amount">
              <text class="c-sym">¥</text>
              <text class="c-num">{{ c.amount }}</text>
            </view>
            <text class="c-min">满 {{ c.min }} 可用</text>
          </view>
          <view class="cut">
            <view class="cut-dot top" />
            <view class="cut-dot bottom" />
          </view>
          <view class="right">
            <text class="r-name">{{ c.name }}</text>
            <text class="r-scope">{{ c.scope }}</text>
            <text class="r-expire">有效期至 {{ c.expire }}</text>
          </view>
          <view class="r-act">
            <template v-if="c.used">
              <text class="used-txt">{{ expired(c) ? '已过期' : '已使用' }}</text>
            </template>
            <template v-else>
              <view class="use-btn">去使用</view>
            </template>
          </view>
        </view>

        <view class="rule card">
          <text class="rule-title">使用说明</text>
          <text class="rule-item">· 每笔订单限用一张优惠券，不与其他券叠加</text>
          <text class="rule-item">· 优惠券不可兑换现金，退款时按实付金额退回</text>
          <text class="rule-item">· 助农专享券仅限标注「助农」的商品使用</text>
        </view>
      </view>

      <empty-box v-else text="没有可用的优惠券" sub="关注农场主，常有专属券掉落" emoji="🎟️" />
      <view style="height: 40rpx" />
    </scroll-view>
  </view>
</template>

<script setup>
import { computed, ref } from 'vue'
import { store } from '@/store/index.js'
import { toast } from '@/common/utils.js'

const tabs = [
  { key: 'usable', name: '可用' },
  { key: 'used', name: '已用/过期' }
]
const active = ref('usable')
const pick = ref(false)
try {
  const pages = getCurrentPages()
  const cur = pages[pages.length - 1]
  if (cur && cur.options && cur.options.pick) pick.value = cur.options.pick === '1'
} catch (e) {}

const list = computed(() =>
  active.value === 'usable' ? store.coupons.filter((c) => !c.used) : store.coupons.filter((c) => c.used)
)

function expired(c) {
  return new Date(c.expire.replace(/-/g, '/')).getTime() < Date.now()
}

function onPick(c) {
  if (c.used) return toast('该券已使用或已过期')
  if (pick.value) {
    uni.$emit('coupon:pick', c)
    uni.navigateBack()
  } else {
    uni.switchTab({ url: '/pages/tabbar/home/home' })
  }
}
</script>

<style scoped>
.coupon-page {
  min-height: 100vh;
}
.tabs {
  display: flex;
  background: #fff;
  padding: 0 28rpx;
}
.tab {
  padding: 20rpx 34rpx 22rpx;
  position: relative;
}
.tab-txt {
  font-size: 27rpx;
  color: #7c8a84;
}
.tab.on .tab-txt {
  color: #14201b;
  font-weight: 700;
}
.tab-line {
  position: absolute;
  bottom: 8rpx;
  left: 50%;
  transform: translateX(-50%);
  width: 40rpx;
  height: 6rpx;
  border-radius: 6rpx;
  background: #0fc97a;
}
.body {
  padding: 20rpx 24rpx 0;
  height: calc(100vh - 180rpx);
}
.list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
.coupon {
  display: flex;
  align-items: center;
  background: #fff;
  border-radius: 22rpx;
  overflow: hidden;
  position: relative;
  box-shadow: 0 8rpx 24rpx rgba(22, 60, 45, 0.05);
}
.coupon.used {
  opacity: 0.55;
}
.left {
  width: 200rpx;
  padding: 26rpx 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: linear-gradient(135deg, #eafaf1, #d6f5e6);
}
.c-amount {
  display: flex;
  align-items: baseline;
  color: #06a96a;
}
.c-sym {
  font-size: 24rpx;
  font-weight: 700;
}
.c-num {
  font-size: 58rpx;
  font-weight: 800;
  line-height: 1;
}
.c-min {
  font-size: 20rpx;
  color: #3d8f6a;
  margin-top: 8rpx;
}
.cut {
  width: 3rpx;
  height: 160rpx;
  position: relative;
  background: repeating-linear-gradient(
    to bottom,
    #eef2f0 0,
    #eef2f0 8rpx,
    transparent 8rpx,
    transparent 16rpx
  );
}
.cut-dot {
  position: absolute;
  left: -14rpx;
  width: 28rpx;
  height: 28rpx;
  border-radius: 50%;
  background: #f4f8f5;
}
.cut-dot.top {
  top: -14rpx;
}
.cut-dot.bottom {
  bottom: -14rpx;
}
.right {
  flex: 1;
  padding: 22rpx 20rpx;
  display: flex;
  flex-direction: column;
  gap: 6rpx;
}
.r-name {
  font-size: 27rpx;
  font-weight: 700;
}
.r-scope {
  font-size: 21rpx;
  color: #7c8a84;
}
.r-expire {
  font-size: 20rpx;
  color: #b3bfba;
}
.r-act {
  padding-right: 22rpx;
}
.use-btn {
  padding: 10rpx 22rpx;
  border-radius: 40rpx;
  background: linear-gradient(135deg, #16d488, #0bbd72);
  color: #fff;
  font-size: 21rpx;
  font-weight: 600;
}
.used-txt {
  font-size: 21rpx;
  color: #b3bfba;
}
.rule {
  margin-top: 20rpx;
  padding: 24rpx;
}
.rule-title {
  font-size: 25rpx;
  font-weight: 700;
  display: block;
  margin-bottom: 12rpx;
}
.rule-item {
  display: block;
  font-size: 21rpx;
  color: #9aa7a1;
  line-height: 1.9;
}
</style>
