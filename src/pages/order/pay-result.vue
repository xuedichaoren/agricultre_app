<template>
  <view class="page result">
    <nav-bar title="支付结果" :back="false" />
    <view class="wrap">
      <view class="ok">
        <view class="ok-ring">
          <icon-svg name="check" :size="80" color="#FFFFFF" :stroke="3" />
        </view>
        <text class="ok-title">下单成功</text>
        <text class="ok-sub">我们已经通知农场主，菜摘好就出发 🚚</text>
        <view class="ok-amount">
          <text class="oa-label">实付</text>
          <price-tag :price="amount" :num-size="52" :sym-size="26" />
        </view>
      </view>

      <view class="card info">
        <view class="i-row">
          <text class="i-label">订单编号</text>
          <text class="i-value">{{ orderId }}</text>
        </view>
        <view class="i-row">
          <text class="i-label">支付方式</text>
          <text class="i-value">在线支付</text>
        </view>
        <view class="i-row">
          <text class="i-label">预计送达</text>
          <text class="i-value hl">今晚 19:00 - 21:00</text>
        </view>
      </view>

      <view class="btns">
        <view class="btn btn-primary" @tap="toDetail">查看订单</view>
        <view class="btn btn-line" @tap="home">继续逛逛</view>
      </view>

      <view class="sec">
        <text class="sec-title">猜你喜欢</text>
        <view class="grid">
          <view v-for="p in list" :key="p.id" class="grid-item">
            <product-card :product="p" mode="grid" @tap="toProduct(p.id)" />
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { PRODUCTS } from '@/common/data.js'

const orderId = ref('NH20261111001')
const amount = ref(0)
try {
  const pages = getCurrentPages()
  const cur = pages[pages.length - 1]
  if (cur && cur.options) {
    if (cur.options.id) orderId.value = cur.options.id
    if (cur.options.amount) amount.value = Number(cur.options.amount)
  }
} catch (e) {}

const list = ref(PRODUCTS.slice(4, 8))

function toDetail() {
  uni.redirectTo({ url: `/pages/order/detail?id=${orderId.value}` })
}
function home() {
  uni.switchTab({ url: '/pages/tabbar/home/home' })
}
function toProduct(id) {
  uni.navigateTo({ url: `/pages/product/detail?id=${id}` })
}
</script>

<style scoped>
.result {
  min-height: 100vh;
}
.wrap {
  padding: 20rpx 24rpx 60rpx;
}
.ok {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40rpx 0 50rpx;
}
.ok-ring {
  width: 160rpx;
  height: 160rpx;
  border-radius: 50%;
  background: linear-gradient(140deg, #17d488, #06a96a);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 16rpx 40rpx rgba(10, 172, 106, 0.3);
}
.ok-title {
  font-size: 40rpx;
  font-weight: 800;
  margin-top: 30rpx;
}
.ok-sub {
  font-size: 24rpx;
  color: #8b9791;
  margin-top: 12rpx;
}
.ok-amount {
  display: flex;
  align-items: baseline;
  gap: 10rpx;
  margin-top: 26rpx;
}
.oa-label {
  font-size: 24rpx;
  color: #7c8a84;
}
.info {
  padding: 10rpx 24rpx;
}
.i-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 84rpx;
  border-bottom: 2rpx solid #f6f9f7;
}
.i-row:last-child {
  border-bottom: none;
}
.i-label {
  font-size: 24rpx;
  color: #7c8a84;
}
.i-value {
  font-size: 24rpx;
  color: #263330;
}
.i-value.hl {
  color: #06a96a;
  font-weight: 600;
}
.btns {
  display: flex;
  gap: 18rpx;
  margin-top: 34rpx;
}
.btns .btn {
  flex: 1;
}
.sec {
  margin-top: 50rpx;
}
.sec-title {
  font-size: 32rpx;
  font-weight: 800;
  display: block;
  margin-bottom: 20rpx;
}
.grid {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
}
.grid-item {
  width: calc(50% - 8rpx);
}
</style>
