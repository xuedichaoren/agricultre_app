<template>
  <view class="page od" v-if="order">
    <view class="head">
      <view class="status" :style="{ height: statusBar + 'px' }" />
      <view class="nav-row">
        <view class="n-btn" @tap="back">
          <icon-svg name="back" :size="32" color="#FFFFFF" :stroke="2" />
        </view>
        <text class="n-title">订单详情</text>
        <view class="n-btn" @tap="copy(order.id)">
          <icon-svg name="share" :size="30" color="#FFFFFF" :stroke="1.8" />
        </view>
      </view>

      <view class="h-body">
        <text class="h-status">{{ statusText(order.status) }}</text>
        <text class="h-tip">{{ statusTip }}</text>

        <view class="steps">
          <view v-for="(s, i) in steps" :key="i" class="step">
            <view class="step-dot" :class="{ on: i <= stepIndex }">
              <icon-svg v-if="i <= stepIndex" name="check" :size="18" color="#0FC97A" :stroke="3" />
            </view>
            <view v-if="i < steps.length - 1" class="step-line" :class="{ on: i < stepIndex }" />
            <text class="step-txt" :class="{ on: i <= stepIndex }">{{ s }}</text>
          </view>
        </view>
      </view>
    </view>

    <scroll-view scroll-y class="body no-scrollbar">
      <view class="card addr" @tap="toLogistics">
        <view class="a-ico">
          <icon-svg name="location" :size="30" color="#06A96A" :stroke="1.8" />
        </view>
        <view class="flex1">
          <view class="row">
            <text class="a-name">{{ address.name }}</text>
            <text class="a-phone">{{ address.phone }}</text>
          </view>
          <text class="a-detail">{{ address.region }} {{ address.detail }}</text>
        </view>
        <icon-svg name="right" :size="22" color="#C3CCC8" />
      </view>

      <view class="card goods">
        <view class="g-head">
          <text class="g-store">{{ farmName }}</text>
          <text class="g-tag">产地直发</text>
        </view>
        <view v-for="it in items" :key="it.pid" class="g-item" @tap="toProduct(it.pid)">
          <prod-img :emoji="it.product.emoji" :bg="it.product.bg" :h="140" :size="140" radius="18rpx" />
          <view class="flex1">
            <text class="g-name ellipsis-2">{{ it.product.name }}</text>
            <text class="g-spec">{{ it.product.spec }}</text>
            <view class="g-tags">
              <text class="g-tag2">7 天无理由</text>
              <text class="g-tag2">坏果包赔</text>
            </view>
          </view>
          <view class="g-right">
            <price-tag :price="it.product.price" :num-size="28" />
            <text class="g-qty">×{{ it.qty }}</text>
          </view>
        </view>

        <view class="g-money">
          <view class="m-row">
            <text class="m-label">商品金额</text>
            <text class="m-value">¥{{ money(amount.goods) }}</text>
          </view>
          <view class="m-row">
            <text class="m-label">配送费</text>
            <text class="m-value">{{ amount.freight ? '¥' + money(amount.freight) : '¥0' }}</text>
          </view>
          <view class="m-row">
            <text class="m-label">优惠</text>
            <text class="m-value minus">-¥{{ money(amount.discount) }}</text>
          </view>
          <view class="m-row total">
            <text class="m-label">实付款</text>
            <price-tag :price="amount.total" :num-size="36" />
          </view>
        </view>
      </view>

      <view class="card info">
        <view class="i-row">
          <text class="i-label">订单编号</text>
          <view class="row">
            <text class="i-value">{{ order.id }}</text>
            <text class="copy" @tap="copy(order.id)">复制</text>
          </view>
        </view>
        <view class="i-row">
          <text class="i-label">下单时间</text>
          <text class="i-value">{{ order.createdAt }}</text>
        </view>
        <view class="i-row" v-if="order.payAt">
          <text class="i-label">支付时间</text>
          <text class="i-value">{{ order.payAt }}</text>
        </view>
        <view class="i-row">
          <text class="i-label">配送方式</text>
          <text class="i-value">顺丰冷链 · 次日达</text>
        </view>
        <view class="i-row" v-if="order.remark">
          <text class="i-label">订单备注</text>
          <text class="i-value">{{ order.remark }}</text>
        </view>
      </view>

      <view class="card service">
        <view class="s-item" @tap="go('/pages/message/chat?id=m1')">
          <icon-svg name="comment" :size="30" color="#3D4A45" :stroke="1.7" />
          <text class="s-txt">联系农场主</text>
        </view>
        <view class="s-item" @tap="toast('客服电话：400-800-1234')">
          <icon-svg name="phone" :size="30" color="#3D4A45" :stroke="1.7" />
          <text class="s-txt">联系客服</text>
        </view>
      </view>
      <view style="height: 190rpx" />
    </scroll-view>

    <view class="bar safe-bottom">
      <template v-if="order.status === 'unpaid'">
        <view class="btn btn-line b1" @tap="cancel">取消订单</view>
        <view class="btn btn-primary b2" @tap="pay">立即支付</view>
      </template>
      <template v-else-if="order.status === 'unshipped'">
        <view class="btn btn-line b1" @tap="toast('已提醒农场主发货')">提醒发货</view>
        <view class="btn btn-primary b2" @tap="toLogistics">查看物流</view>
      </template>
      <template v-else-if="order.status === 'shipping' || order.status === 'unreceipted'">
        <view class="btn btn-line b1" @tap="toLogistics">查看物流</view>
        <view class="btn btn-primary b2" @tap="receive">确认收货</view>
      </template>
      <template v-else>
        <view class="btn btn-line b1" @tap="again">再来一单</view>
        <view class="btn btn-primary b2" @tap="toast('评价功能演示')">去评价</view>
      </template>
    </view>
  </view>
</template>

<script setup>
import { computed, ref } from 'vue'
import { findFarm, findProduct } from '@/common/data.js'
import {
  cancelOrder,
  confirmReceipt,
  orderAmount,
  orderItems,
  payOrder,
  store
} from '@/store/index.js'
import { copyText, money, statusText, toast } from '@/common/utils.js'

const statusBar = ref(20)
try {
  const info = uni.getStorageSync('sys_info')
  if (info && info.statusBarHeight) statusBar.value = info.statusBarHeight
} catch (e) {}

const oid = ref('')
try {
  const pages = getCurrentPages()
  const cur = pages[pages.length - 1]
  if (cur && cur.options && cur.options.id) oid.value = cur.options.id
} catch (e) {}

const order = computed(() => store.orders.find((o) => o.id === oid.value) || store.orders[0])
const items = computed(() => (order.value ? orderItems(order.value) : []))
const amount = computed(() => (order.value ? orderAmount(order.value) : { goods: 0, freight: 0, discount: 0, total: 0 }))
const address = computed(
  () => store.addresses.find((a) => a.id === order.value?.addressId) || store.addresses[0] || {}
)
const farmName = computed(() => (items.value[0] ? (findFarm(items.value[0].product.farm) || {}).name : ''))

const steps = ['已下单', '已发货', '运输中', '已送达']
const stepIndex = computed(() => {
  const s = order.value?.status
  if (s === 'unpaid') return 0
  if (s === 'unshipped') return 0
  if (s === 'shipping') return 2
  if (s === 'unreceipted') return 3
  return 4
})

const statusTip = computed(() => {
  const s = order.value?.status
  return {
    unpaid: '请在 30 分钟内完成支付，超时订单将自动取消',
    unshipped: '农场主正在地里采摘，预计 2 小时内发出',
    shipping: '顺丰冷链运输中，预计今晚 19:00 前送达',
    unreceipted: '包裹已到自提点，请及时取件',
    done: '订单已完成，感谢支持助农'
  }[s] || ''
})

function back() {
  uni.navigateBack()
}
function copy(t) {
  copyText(t)
}
function toLogistics() {
  uni.navigateTo({ url: `/pages/order/logistics?id=${order.value.id}` })
}
function toProduct(id) {
  uni.navigateTo({ url: `/pages/product/detail?id=${id}` })
}
function go(url) {
  uni.navigateTo({ url })
}
function pay() {
  uni.showLoading({ title: '支付中', mask: true })
  setTimeout(() => {
    payOrder(order.value.id)
    uni.hideLoading()
    toast('支付成功')
  }, 700)
}
function cancel() {
  uni.showModal({
    title: '取消订单',
    content: '确定取消这笔订单吗？',
    confirmColor: '#0FC97A',
    success: (r) => {
      if (r.confirm) {
        cancelOrder(order.value.id)
        setTimeout(() => uni.navigateBack(), 400)
      }
    }
  })
}
function receive() {
  uni.showModal({
    title: '确认收货',
    content: '确认已收到商品？',
    confirmColor: '#0FC97A',
    success: (r) => {
      if (r.confirm) {
        confirmReceipt(order.value.id)
        toast('已确认收货')
      }
    }
  })
}
function again() {
  uni.switchTab({ url: '/pages/tabbar/cart/cart' })
}
</script>

<style scoped>
.od {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}
.head {
  background: linear-gradient(160deg, #14d183, #0aa868);
  border-radius: 0 0 34rpx 34rpx;
  padding: 0 24rpx 30rpx;
}
.nav-row {
  height: 88rpx;
  display: flex;
  align-items: center;
}
.n-btn {
  width: 60rpx;
  height: 60rpx;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.18);
  display: flex;
  align-items: center;
  justify-content: center;
}
.n-title {
  flex: 1;
  text-align: center;
  font-size: 30rpx;
  font-weight: 600;
  color: #fff;
}
.h-status {
  display: block;
  font-size: 44rpx;
  font-weight: 800;
  color: #fff;
  margin-top: 10rpx;
}
.h-tip {
  display: block;
  font-size: 22rpx;
  color: rgba(255, 255, 255, 0.85);
  margin-top: 10rpx;
}
.steps {
  display: flex;
  margin-top: 32rpx;
}
.step {
  flex: 1;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10rpx;
}
.step-dot {
  width: 34rpx;
  height: 34rpx;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
}
.step-dot.on {
  background: #fff;
}
.step-line {
  position: absolute;
  top: 16rpx;
  left: 50%;
  width: 100%;
  height: 3rpx;
  background: rgba(255, 255, 255, 0.3);
}
.step-line.on {
  background: #fff;
}
.step-txt {
  font-size: 19rpx;
  color: rgba(255, 255, 255, 0.65);
}
.step-txt.on {
  color: #fff;
}
.body {
  flex: 1;
  height: 0;
  padding: 18rpx 24rpx 0;
}
.card {
  margin-bottom: 18rpx;
}
.addr {
  padding: 22rpx;
  display: flex;
  align-items: center;
  gap: 16rpx;
}
.a-ico {
  width: 62rpx;
  height: 62rpx;
  border-radius: 50%;
  background: #e9faf2;
  display: flex;
  align-items: center;
  justify-content: center;
}
.a-name {
  font-size: 27rpx;
  font-weight: 700;
  margin-right: 12rpx;
}
.a-phone {
  font-size: 23rpx;
  color: #7c8a84;
}
.a-detail {
  display: block;
  font-size: 23rpx;
  color: #3d4a45;
  margin-top: 8rpx;
  line-height: 1.5;
}
.goods {
  padding: 24rpx;
}
.g-head {
  display: flex;
  align-items: center;
  gap: 10rpx;
  margin-bottom: 18rpx;
}
.g-store {
  font-size: 26rpx;
  font-weight: 700;
}
.g-tag {
  font-size: 18rpx;
  color: #06a96a;
  background: #e9faf2;
  padding: 2rpx 10rpx;
  border-radius: 6rpx;
}
.g-item {
  display: flex;
  gap: 18rpx;
  padding: 14rpx 0;
}
.g-name {
  font-size: 26rpx;
  font-weight: 600;
  line-height: 1.4;
}
.g-spec {
  display: block;
  font-size: 21rpx;
  color: #9aa7a1;
  margin-top: 6rpx;
}
.g-tags {
  display: flex;
  gap: 8rpx;
  margin-top: 10rpx;
}
.g-tag2 {
  font-size: 18rpx;
  color: #7c8a84;
  border: 2rpx solid #eef2f0;
  padding: 2rpx 8rpx;
  border-radius: 6rpx;
}
.g-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8rpx;
}
.g-qty {
  font-size: 21rpx;
  color: #9aa7a1;
}
.g-money {
  border-top: 2rpx solid #f6f9f7;
  margin-top: 8rpx;
  padding-top: 8rpx;
}
.m-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 70rpx;
}
.m-label {
  font-size: 23rpx;
  color: #7c8a84;
}
.m-value {
  font-size: 24rpx;
  color: #263330;
}
.m-value.minus {
  color: #ff4b3a;
}
.total .m-label {
  font-size: 25rpx;
  color: #14201b;
  font-weight: 600;
}
.info {
  padding: 8rpx 24rpx;
}
.i-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 80rpx;
  border-bottom: 2rpx solid #f6f9f7;
}
.i-row:last-child {
  border-bottom: none;
}
.i-label {
  font-size: 23rpx;
  color: #7c8a84;
}
.i-value {
  font-size: 23rpx;
  color: #263330;
}
.copy {
  margin-left: 14rpx;
  font-size: 20rpx;
  color: #06a96a;
  border: 2rpx solid #cdeee0;
  padding: 2rpx 12rpx;
  border-radius: 20rpx;
}
.service {
  display: flex;
  padding: 24rpx;
  gap: 40rpx;
}
.s-item {
  display: flex;
  align-items: center;
  gap: 8rpx;
}
.s-txt {
  font-size: 24rpx;
  color: #3d4a45;
}
.bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  background: #fff;
  padding: 16rpx 24rpx;
  display: flex;
  gap: 16rpx;
  box-shadow: 0 -8rpx 30rpx rgba(22, 60, 45, 0.08);
}
.b1 {
  flex: 1;
}
.b2 {
  flex: 1.4;
}
</style>
