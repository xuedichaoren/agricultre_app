<template>
  <view class="page orders-page">
    <nav-bar title="我的订单" />
    <view class="tabs">
      <scroll-view scroll-x class="no-scrollbar" :show-scrollbar="false">
        <view class="tabs-inner">
          <view v-for="t in tabs" :key="t.key" class="tab" :class="{ on: active === t.key }" @tap="switchTab(t.key)">
            <text class="tab-txt">{{ t.name }}</text>
            <text v-if="t.count" class="tab-count">{{ t.count }}</text>
            <view v-if="active === t.key" class="tab-line" />
          </view>
        </view>
      </scroll-view>
    </view>

    <scroll-view scroll-y class="body no-scrollbar" @scrolltolower="noop">
      <view v-if="orders.length" class="list">
        <view v-for="o in orders" :key="o.id" class="order card">
          <view class="o-head" @tap="toDetail(o.id)">
            <view class="row">
              <icon-svg name="shop" :size="28" color="#3D4A45" :stroke="1.7" />
              <text class="o-farm">{{ farmName(o) }}</text>
            </view>
            <text class="o-status" :class="o.status">{{ statusText(o.status) }}</text>
          </view>

          <view class="o-items" @tap="toDetail(o.id)">
            <view v-for="it in orderItems(o)" :key="it.pid" class="o-item">
              <prod-img :emoji="it.product.emoji" :bg="it.product.bg" :h="140" :size="140" radius="18rpx" />
              <view class="flex1">
                <text class="oi-name ellipsis-2">{{ it.product.name }}</text>
                <text class="oi-spec">{{ it.product.spec }}</text>
              </view>
              <view class="oi-right">
                <price-tag :price="it.product.price" :num-size="28" />
                <text class="oi-qty">×{{ it.qty }}</text>
              </view>
            </view>
          </view>

          <view class="o-total">
            <text class="ot-label">共 {{ totalQty(o) }} 件，实付</text>
            <price-tag :price="orderAmount(o).total" :num-size="32" />
          </view>

          <view class="o-actions">
            <template v-if="o.status === 'unpaid'">
              <view class="abtn" @tap="cancel(o)">取消订单</view>
              <view class="abtn primary" @tap="pay(o)">去支付</view>
            </template>
            <template v-else-if="o.status === 'unshipped'">
              <view class="abtn" @tap="remind(o)">提醒发货</view>
              <view class="abtn primary" @tap="toDetail(o.id)">查看详情</view>
            </template>
            <template v-else-if="o.status === 'shipping' || o.status === 'unreceipted'">
              <view class="abtn" @tap="toLogistics(o.id)">查看物流</view>
              <view class="abtn primary" @tap="receive(o)">确认收货</view>
            </template>
            <template v-else>
              <view class="abtn" @tap="again(o)">再来一单</view>
              <view class="abtn primary" @tap="toast('评价功能演示')">去评价</view>
            </template>
          </view>
        </view>
      </view>

      <empty-box
        v-else
        text="还没有相关订单"
        sub="今天的菜刚从地里摘下来，去看看？"
        emoji="📦"
        btn-text="去逛逛"
        @action="home"
      />
      <view style="height: 40rpx" />
    </scroll-view>
  </view>
</template>

<script setup>
import { computed, ref } from 'vue'
import { findFarm, findProduct } from '@/common/data.js'
import {
  addToCart,
  cancelOrder,
  confirmReceipt,
  countByStatus,
  orderAmount,
  orderItems,
  payOrder,
  store
} from '@/store/index.js'
import { statusText, toast } from '@/common/utils.js'

const active = ref('all')
try {
  const pages = getCurrentPages()
  const cur = pages[pages.length - 1]
  if (cur && cur.options && cur.options.tab) active.value = cur.options.tab
} catch (e) {}

const tabs = computed(() => [
  { key: 'all', name: '全部', count: 0 },
  { key: 'unpaid', name: '待付款', count: countByStatus('unpaid') },
  { key: 'unshipped', name: '待发货', count: countByStatus('unshipped') },
  { key: 'shipping', name: '待收货', count: countByStatus('shipping') + countByStatus('unreceipted') },
  { key: 'done', name: '已完成', count: 0 }
])

const orders = computed(() => {
  const arr = active.value === 'all' ? store.orders : store.orders.filter((o) => o.status === active.value || (active.value === 'shipping' && o.status === 'unreceipted'))
  return [...arr]
})

function farmName(o) {
  const it = orderItems(o)[0]
  return it ? (findFarm(it.product.farm) || {}).name : '农汇严选'
}
function totalQty(o) {
  return o.items.reduce((s, i) => s + i.qty, 0)
}
function switchTab(k) {
  active.value = k
}
function toDetail(id) {
  uni.navigateTo({ url: `/pages/order/detail?id=${id}` })
}
function toLogistics(id) {
  uni.navigateTo({ url: `/pages/order/logistics?id=${id}` })
}
function pay(o) {
  uni.showLoading({ title: '支付中', mask: true })
  setTimeout(() => {
    payOrder(o.id)
    uni.hideLoading()
    toast('支付成功')
  }, 700)
}
function cancel(o) {
  uni.showModal({
    title: '取消订单',
    content: '确定要取消这笔订单吗？',
    confirmColor: '#0FC97A',
    success: (res) => {
      if (res.confirm) {
        cancelOrder(o.id)
        toast('已取消')
      }
    }
  })
}
function receive(o) {
  uni.showModal({
    title: '确认收货',
    content: '确认已经收到新鲜蔬菜了吗？',
    confirmColor: '#0FC97A',
    success: (res) => {
      if (res.confirm) {
        confirmReceipt(o.id)
        toast('已确认收货')
      }
    }
  })
}
function remind(o) {
  toast('已提醒农场主尽快发货')
}
function again(o) {
  o.items.forEach((i) => addToCart(i.pid, i.qty))
  toast('已加入菜篮子')
  setTimeout(() => uni.switchTab({ url: '/pages/tabbar/cart/cart' }), 600)
}
function home() {
  uni.switchTab({ url: '/pages/tabbar/home/home' })
}
function noop() {}
</script>

<style scoped>
.orders-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}
.tabs {
  background: #fff;
  white-space: nowrap;
  border-bottom: 2rpx solid #f4f8f5;
}
.tabs-inner {
  display: inline-flex;
  padding: 0 20rpx;
  gap: 8rpx;
}
.tab {
  position: relative;
  padding: 18rpx 22rpx 20rpx;
  display: flex;
  align-items: center;
  gap: 4rpx;
}
.tab-txt {
  font-size: 27rpx;
  color: #7c8a84;
}
.tab.on .tab-txt {
  color: #14201b;
  font-weight: 700;
}
.tab-count {
  font-size: 18rpx;
  color: #ff5a4e;
  background: #ffefec;
  padding: 0 8rpx;
  border-radius: 20rpx;
}
.tab-line {
  position: absolute;
  bottom: 6rpx;
  left: 50%;
  transform: translateX(-50%);
  width: 40rpx;
  height: 6rpx;
  border-radius: 6rpx;
  background: #0fc97a;
}
.body {
  flex: 1;
  height: 0;
}
.list {
  padding: 20rpx 24rpx;
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}
.order {
  padding: 24rpx;
}
.o-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.o-farm {
  font-size: 26rpx;
  font-weight: 700;
  margin-left: 8rpx;
}
.o-status {
  font-size: 24rpx;
  color: #06a96a;
  font-weight: 600;
}
.o-status.done {
  color: #9aa7a1;
}
.o-status.unpaid {
  color: #ff8a3d;
}
.o-items {
  margin-top: 18rpx;
  display: flex;
  flex-direction: column;
  gap: 14rpx;
}
.o-item {
  display: flex;
  gap: 18rpx;
}
.oi-name {
  font-size: 26rpx;
  font-weight: 600;
  line-height: 1.4;
}
.oi-spec {
  display: block;
  font-size: 21rpx;
  color: #9aa7a1;
  margin-top: 8rpx;
}
.oi-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8rpx;
}
.oi-qty {
  font-size: 21rpx;
  color: #9aa7a1;
}
.o-total {
  display: flex;
  align-items: baseline;
  justify-content: flex-end;
  gap: 8rpx;
  margin-top: 18rpx;
  padding-top: 16rpx;
  border-top: 2rpx solid #f6f9f7;
}
.ot-label {
  font-size: 22rpx;
  color: #7c8a84;
}
.o-actions {
  display: flex;
  justify-content: flex-end;
  gap: 14rpx;
  margin-top: 18rpx;
}
.abtn {
  padding: 12rpx 30rpx;
  border-radius: 40rpx;
  border: 2rpx solid #e5ece8;
  font-size: 23rpx;
  color: #3d4a45;
}
.abtn.primary {
  background: linear-gradient(135deg, #16d488, #0bbd72);
  color: #fff;
  border-color: transparent;
  font-weight: 600;
}
</style>
