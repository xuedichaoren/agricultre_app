<template>
  <view class="page lg">
    <nav-bar title="物流详情" />
    <scroll-view scroll-y class="body no-scrollbar">
      <view class="card express">
        <view class="e-top">
          <view class="e-ico">
            <icon-svg name="truck" :size="36" color="#FFFFFF" :stroke="1.8" />
          </view>
          <view class="flex1">
            <text class="e-company">{{ order.express?.company || '顺丰冷链' }}</text>
            <text class="e-no">{{ order.express?.no || 'SF7234981220' }}</text>
          </view>
          <view class="e-copy" @tap="copy(order.express?.no || 'SF7234981220')">复制</view>
        </view>
        <view class="e-status">
          <text class="e-status-txt">运输中 · 预计今晚 19:00 前送达</text>
        </view>
      </view>

      <view class="card timeline">
        <view v-for="(n, i) in nodes" :key="i" class="node" :class="{ first: i === 0 }">
          <view class="n-left">
            <view class="n-dot" :class="{ on: i === 0 }" />
            <view v-if="i < nodes.length - 1" class="n-line" />
          </view>
          <view class="n-body">
            <text class="n-text" :class="{ on: i === 0 }">{{ n.text }}</text>
            <text class="n-time">{{ n.time }}</text>
          </view>
        </view>
      </view>

      <view class="card goods">
        <view class="g-head">
          <text class="g-store">本单商品</text>
          <text class="g-count">共 {{ qty }} 件</text>
        </view>
        <scroll-view scroll-x class="no-scrollbar">
          <view class="g-list">
            <view v-for="it in items" :key="it.pid" class="g-item">
              <prod-img :emoji="it.product.emoji" :bg="it.product.bg" :h="130" :size="130" radius="16rpx" />
              <text class="g-name ellipsis">{{ it.product.name }}</text>
              <text class="g-qty">×{{ it.qty }}</text>
            </view>
          </view>
        </scroll-view>
      </view>

      <view class="card contact" @tap="toast('客服电话：400-800-1234')">
        <icon-svg name="phone" :size="30" color="#3D4A45" :stroke="1.7" />
        <text class="c-txt">联系配送员 / 客服</text>
        <icon-svg name="right" :size="22" color="#C3CCC8" />
      </view>

      <view class="help">
        <text class="help-txt">配送遇到问题？坏果包赔，联系客服立即处理</text>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
import { computed, ref } from 'vue'
import { EXPRESS_NODES } from '@/common/data.js'
import { orderItems, store } from '@/store/index.js'
import { copyText, toast } from '@/common/utils.js'

const oid = ref('')
try {
  const pages = getCurrentPages()
  const cur = pages[pages.length - 1]
  if (cur && cur.options && cur.options.id) oid.value = cur.options.id
} catch (e) {}

const order = computed(() => store.orders.find((o) => o.id === oid.value) || store.orders[1] || store.orders[0])
const items = computed(() => (order.value ? orderItems(order.value) : []))
const qty = computed(() => (order.value ? order.value.items.reduce((s, i) => s + i.qty, 0) : 0))
const nodes = computed(() => EXPRESS_NODES)

function copy(t) {
  copyText(t)
}
</script>

<style scoped>
.lg {
  min-height: 100vh;
}
.body {
  padding: 18rpx 24rpx 60rpx;
}
.card {
  margin-bottom: 18rpx;
}
.express {
  padding: 24rpx;
}
.e-top {
  display: flex;
  align-items: center;
  gap: 18rpx;
}
.e-ico {
  width: 80rpx;
  height: 80rpx;
  border-radius: 24rpx;
  background: linear-gradient(140deg, #17d488, #06a96a);
  display: flex;
  align-items: center;
  justify-content: center;
}
.e-company {
  font-size: 28rpx;
  font-weight: 700;
}
.e-no {
  display: block;
  font-size: 22rpx;
  color: #9aa7a1;
  margin-top: 6rpx;
}
.e-copy {
  font-size: 21rpx;
  color: #06a96a;
  border: 2rpx solid #cdeee0;
  padding: 4rpx 18rpx;
  border-radius: 30rpx;
}
.e-status {
  margin-top: 20rpx;
  background: #f2fbf6;
  border-radius: 14rpx;
  padding: 14rpx 18rpx;
}
.e-status-txt {
  font-size: 22rpx;
  color: #0a8f5c;
  font-weight: 500;
}
.timeline {
  padding: 26rpx 24rpx 10rpx;
}
.node {
  display: flex;
  gap: 18rpx;
}
.n-left {
  width: 24rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.n-dot {
  width: 16rpx;
  height: 16rpx;
  border-radius: 50%;
  background: #dde5e1;
  margin-top: 8rpx;
}
.n-dot.on {
  background: #0fc97a;
  box-shadow: 0 0 0 8rpx rgba(15, 201, 122, 0.14);
}
.n-line {
  flex: 1;
  width: 3rpx;
  background: #eef2f0;
  margin: 6rpx 0;
}
.n-body {
  flex: 1;
  padding-bottom: 30rpx;
}
.n-text {
  font-size: 25rpx;
  color: #7c8a84;
  line-height: 1.5;
}
.n-text.on {
  color: #14201b;
  font-weight: 600;
}
.n-time {
  display: block;
  font-size: 20rpx;
  color: #b3bfba;
  margin-top: 8rpx;
}
.goods {
  padding: 24rpx;
}
.g-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16rpx;
}
.g-store {
  font-size: 26rpx;
  font-weight: 700;
}
.g-count {
  font-size: 21rpx;
  color: #9aa7a1;
}
.g-list {
  display: inline-flex;
  gap: 16rpx;
}
.g-item {
  width: 140rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.g-name {
  font-size: 20rpx;
  color: #3d4a45;
  margin-top: 8rpx;
  width: 140rpx;
  text-align: center;
}
.g-qty {
  font-size: 19rpx;
  color: #9aa7a1;
}
.contact {
  padding: 26rpx 24rpx;
  display: flex;
  align-items: center;
  gap: 16rpx;
}
.c-txt {
  flex: 1;
  font-size: 26rpx;
  color: #263330;
}
.help {
  text-align: center;
  padding: 20rpx;
}
.help-txt {
  font-size: 20rpx;
  color: #b3bfba;
}
</style>
