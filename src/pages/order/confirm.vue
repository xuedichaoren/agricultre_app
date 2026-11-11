<template>
  <view class="page confirm">
    <nav-bar title="确认订单" />

    <scroll-view scroll-y class="body no-scrollbar">
      <!-- 地址 -->
      <view class="card addr" @tap="pickAddress">
        <template v-if="addr">
          <view class="a-top">
            <view class="a-ico">
              <icon-svg name="location" :size="32" color="#06A96A" :stroke="1.8" />
            </view>
            <view class="flex1">
              <view class="row">
                <text class="a-name">{{ addr.name }}</text>
                <text class="a-phone">{{ addr.phone }}</text>
                <view v-if="addr.tag" class="tag">{{ addr.tag }}</view>
              </view>
              <text class="a-detail">{{ addr.region }} {{ addr.detail }}</text>
            </view>
            <icon-svg name="right" :size="24" color="#C3CCC8" />
          </view>
          <view class="a-line" />
          <view class="a-tip">
            <icon-svg name="truck" :size="24" color="#0A8F5C" :stroke="1.8" />
            <text class="a-tip-txt">预计今晚 19:00 - 21:00 送达 · 全程冷链</text>
          </view>
        </template>
        <view v-else class="a-empty">
          <icon-svg name="plus" :size="30" color="#06A96A" :stroke="2.2" />
          <text class="a-empty-txt">请选择收货地址</text>
        </view>
      </view>

      <!-- 商品 -->
      <view class="card goods">
        <view class="g-head">
          <text class="g-store">{{ farmName }}</text>
          <text class="g-tag">产地直发</text>
        </view>
        <view v-for="it in items" :key="it.pid" class="g-item">
          <prod-img :emoji="it.product.emoji" :bg="it.product.bg" :h="140" :size="140" radius="18rpx" />
          <view class="flex1">
            <text class="g-name ellipsis-2">{{ it.product.name }}</text>
            <text class="g-spec">{{ it.product.spec }}</text>
          </view>
          <view class="g-right">
            <price-tag :price="it.product.price" :num-size="30" />
            <text class="g-qty">×{{ it.qty }}</text>
          </view>
        </view>

        <view class="g-row" @tap="pickTime">
          <text class="g-label">配送时间</text>
          <text class="g-value">{{ deliveryTime }}</text>
          <icon-svg name="right" :size="20" color="#C3CCC8" />
        </view>
        <view class="g-row" @tap="pickCoupon">
          <text class="g-label">优惠券</text>
          <text class="g-value" :class="{ hl: coupon }">
            {{ coupon ? `-¥${coupon.amount}（${coupon.name}）` : `${usableCoupons.length} 张可用` }}
          </text>
          <icon-svg name="right" :size="20" color="#C3CCC8" />
        </view>
        <view class="g-row">
          <text class="g-label">订单备注</text>
          <input v-model="remark" class="g-input" placeholder="选填，可备注放门口" placeholder-class="ph" />
        </view>
      </view>

      <!-- 金额 -->
      <view class="card money">
        <view class="m-row">
          <text class="m-label">商品金额</text>
          <text class="m-value">¥{{ money(goodsAmount) }}</text>
        </view>
        <view class="m-row">
          <text class="m-label">配送费</text>
          <text class="m-value">{{ freight ? '¥' + money(freight) : '免配送费' }}</text>
        </view>
        <view class="m-row">
          <text class="m-label">优惠</text>
          <text class="m-value minus">-¥{{ money(discount) }}</text>
        </view>
        <view class="m-row total">
          <text class="m-label">应付金额</text>
          <price-tag :price="payAmount" :num-size="40" />
        </view>
      </view>

      <view class="agree-row">
        <icon-svg name="checkCircle" :size="26" color="#0FC97A" :stroke="1.8" />
        <text class="agree-txt">提交订单即表示同意《农汇交易服务协议》，坏果包赔</text>
      </view>
      <view style="height: 200rpx" />
    </scroll-view>

    <view class="bar safe-bottom">
      <view class="bar-sum">
        <text class="bs-label">合计</text>
        <price-tag :price="payAmount" :num-size="42" />
        <text class="bs-tip">已优惠 ¥{{ money(discount) }}</text>
      </view>
      <view class="btn btn-primary submit" @tap="submit">提交订单</view>
    </view>

    <!-- 支付弹层 -->
    <view v-if="payOpen" class="mask" @tap="payOpen = false">
      <view class="pay-sheet" @tap.stop>
        <view class="pay-head">
          <text class="pay-title">选择支付方式</text>
          <view class="pay-close" @tap="payOpen = false">
            <icon-svg name="close" :size="28" color="#9AA7A1" :stroke="2" />
          </view>
        </view>
        <view class="pay-amount">
          <price-tag :price="payAmount" :num-size="64" :sym-size="30" />
        </view>
        <view v-for="m in payMethods" :key="m.key" class="pay-item" @tap="payMethod = m.key">
          <text class="pi-emoji">{{ m.emoji }}</text>
          <view class="flex1">
            <text class="pi-name">{{ m.name }}</text>
            <text v-if="m.tip" class="pi-tip">{{ m.tip }}</text>
          </view>
          <view class="radio" :class="{ on: payMethod === m.key }">
            <icon-svg v-if="payMethod === m.key" name="check" :size="20" color="#FFFFFF" :stroke="3" />
          </view>
        </view>
        <view class="btn btn-primary pay-btn" @tap="doPay">
          确认支付 ¥{{ money(payAmount) }}
        </view>
        <view class="safe-bottom" />
      </view>
    </view>
  </view>
</template>

<script setup>
import { computed, ref } from 'vue'
import { findFarm, findProduct } from '@/common/data.js'
import { createOrder, defaultAddress, payOrder, store } from '@/store/index.js'
import { money, toast } from '@/common/utils.js'

const from = ref('cart')
try {
  const pages = getCurrentPages()
  const cur = pages[pages.length - 1]
  if (cur && cur.options && cur.options.from) from.value = cur.options.from
} catch (e) {}

const addr = ref(defaultAddress())
const remark = ref('')
const couponId = ref('')
const deliveryTime = ref('今晚 19:00 - 21:00')
const payOpen = ref(false)
const payMethod = ref('wechat')

const payMethods = [
  { key: 'wechat', name: '微信支付', emoji: '💚', tip: '推荐使用' },
  { key: 'alipay', name: '支付宝', emoji: '🔵', tip: '' },
  { key: 'balance', name: '农汇余额', emoji: '💰', tip: '可用 ¥128.00' }
]

const sourceItems = computed(() => {
  if (from.value === 'buy' && store.checkout.items.length) return store.checkout.items
  return store.cart.filter((i) => i.checked).map((i) => ({ pid: i.pid, qty: i.qty }))
})

const items = computed(() =>
  sourceItems.value
    .map((i) => {
      const p = findProduct(i.pid)
      return p ? { pid: i.pid, qty: i.qty, product: p } : null
    })
    .filter(Boolean)
)

const farmName = computed(() => (items.value[0] ? findFarm(items.value[0].product.farm)?.name : '农汇严选'))

const goodsAmount = computed(() =>
  +items.value.reduce((s, i) => s + i.product.price * i.qty, 0).toFixed(2)
)

const freight = computed(() => (goodsAmount.value >= 39 ? 0 : 6))

const usableCoupons = computed(() =>
  store.coupons.filter((c) => !c.used && goodsAmount.value >= c.min)
)

const coupon = computed(() => store.coupons.find((c) => c.id === couponId.value) || null)
const discount = computed(() => (coupon.value ? coupon.value.amount : 0))
const payAmount = computed(() => Math.max(0, +(goodsAmount.value + freight.value - discount.value).toFixed(2)))

function pickAddress() {
  uni.$once('address:pick', (a) => {
    if (a) addr.value = a
  })
  uni.navigateTo({ url: '/pages/address/list?pick=1' })
}

function pickTime() {
  uni.showActionSheet({
    itemList: ['今晚 19:00 - 21:00', '明天 09:00 - 11:00', '明天 15:00 - 17:00', '后天 09:00 - 11:00'],
    success: (res) => {
      deliveryTime.value = ['今晚 19:00 - 21:00', '明天 09:00 - 11:00', '明天 15:00 - 17:00', '后天 09:00 - 11:00'][res.tapIndex]
    }
  })
}

function pickCoupon() {
  if (!usableCoupons.value.length) return toast('暂无可用优惠券')
  uni.$once('coupon:pick', (c) => {
    if (c) couponId.value = c.id
  })
  uni.navigateTo({ url: '/pages/profile/coupon?pick=1' })
}

function submit() {
  if (!addr.value) return toast('请先选择收货地址')
  payOpen.value = true
}

function doPay() {
  uni.showLoading({ title: '支付中', mask: true })
  setTimeout(() => {
    const order = createOrder({
      items: sourceItems.value,
      addressId: addr.value.id,
      freight: freight.value,
      discount: discount.value,
      remark: remark.value
    })
    payOrder(order.id)
    if (coupon.value) {
      const c = store.coupons.find((x) => x.id === coupon.value.id)
      if (c) c.used = true
    }
    // 清理已结算的购物车项
    if (from.value === 'cart') {
      store.cart = store.cart.filter((i) => !i.checked)
    }
    uni.hideLoading()
    payOpen.value = false
    uni.redirectTo({ url: `/pages/order/pay-result?id=${order.id}&amount=${payAmount.value}` })
  }, 900)
}
</script>

<style scoped>
.confirm {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}
.body {
  flex: 1;
  height: 0;
  padding: 16rpx 24rpx 0;
}
.card {
  margin-bottom: 18rpx;
}
.addr {
  padding: 24rpx;
}
.a-top {
  display: flex;
  align-items: flex-start;
  gap: 16rpx;
}
.a-ico {
  width: 64rpx;
  height: 64rpx;
  border-radius: 50%;
  background: #e9faf2;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.a-name {
  font-size: 29rpx;
  font-weight: 700;
  margin-right: 14rpx;
}
.a-phone {
  font-size: 24rpx;
  color: #7c8a84;
  margin-right: 12rpx;
}
.a-detail {
  display: block;
  font-size: 24rpx;
  color: #3d4a45;
  line-height: 1.5;
  margin-top: 10rpx;
}
.a-line {
  height: 2rpx;
  background: #f4f8f5;
  margin: 18rpx 0 14rpx;
}
.a-tip {
  display: flex;
  align-items: center;
  gap: 8rpx;
}
.a-tip-txt {
  font-size: 21rpx;
  color: #0a8f5c;
}
.a-empty {
  display: flex;
  align-items: center;
  gap: 12rpx;
  padding: 20rpx 0;
}
.a-empty-txt {
  font-size: 27rpx;
  color: #06a96a;
  font-weight: 600;
}
.goods {
  padding: 24rpx;
}
.g-head {
  display: flex;
  align-items: center;
  gap: 10rpx;
  margin-bottom: 20rpx;
}
.g-store {
  font-size: 27rpx;
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
  margin-top: 8rpx;
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
.g-row {
  display: flex;
  align-items: center;
  height: 88rpx;
  border-top: 2rpx solid #f6f9f7;
  gap: 16rpx;
}
.g-label {
  width: 140rpx;
  font-size: 24rpx;
  color: #7c8a84;
}
.g-value {
  flex: 1;
  font-size: 24rpx;
  color: #263330;
  text-align: right;
}
.g-value.hl {
  color: #ff4b3a;
  font-weight: 600;
}
.g-input {
  flex: 1;
  font-size: 24rpx;
  text-align: right;
}
.ph {
  color: #b9c4bf;
  font-size: 23rpx;
}
.money {
  padding: 10rpx 24rpx;
}
.m-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 78rpx;
}
.m-label {
  font-size: 24rpx;
  color: #7c8a84;
}
.m-value {
  font-size: 25rpx;
  color: #263330;
}
.m-value.minus {
  color: #ff4b3a;
}
.total {
  border-top: 2rpx solid #f6f9f7;
  margin-top: 4rpx;
}
.total .m-label {
  font-size: 26rpx;
  color: #14201b;
  font-weight: 600;
}
.agree-row {
  display: flex;
  align-items: flex-start;
  gap: 10rpx;
  padding: 6rpx 8rpx 0;
}
.agree-txt {
  font-size: 20rpx;
  color: #9aa7a1;
  line-height: 1.6;
}
.bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  background: #fff;
  padding: 16rpx 24rpx;
  display: flex;
  align-items: center;
  gap: 16rpx;
  box-shadow: 0 -8rpx 30rpx rgba(22, 60, 45, 0.08);
  z-index: 30;
}
.bar-sum {
  flex: 1;
  display: flex;
  align-items: baseline;
  gap: 8rpx;
  flex-wrap: wrap;
}
.bs-label {
  font-size: 23rpx;
  color: #3d4a45;
}
.bs-tip {
  font-size: 19rpx;
  color: #b3bfba;
}
.submit {
  width: 260rpx;
  height: 88rpx;
}
.mask {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: rgba(10, 20, 16, 0.45);
  z-index: 60;
  display: flex;
  align-items: flex-end;
}
.pay-sheet {
  width: 100%;
  background: #fff;
  border-radius: 34rpx 34rpx 0 0;
  padding: 30rpx 28rpx 30rpx;
  animation: up 0.24s ease-out;
}
@keyframes up {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}
.pay-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.pay-title {
  font-size: 30rpx;
  font-weight: 700;
}
.pay-amount {
  display: flex;
  justify-content: center;
  padding: 30rpx 0 40rpx;
}
.pay-item {
  display: flex;
  align-items: center;
  gap: 18rpx;
  height: 110rpx;
  border-top: 2rpx solid #f6f9f7;
}
.pi-emoji {
  font-size: 40rpx;
}
.pi-name {
  font-size: 27rpx;
  color: #263330;
}
.pi-tip {
  display: block;
  font-size: 20rpx;
  color: #9aa7a1;
  margin-top: 2rpx;
}
.radio {
  width: 38rpx;
  height: 38rpx;
  border-radius: 50%;
  border: 2rpx solid #d3ded9;
  display: flex;
  align-items: center;
  justify-content: center;
}
.radio.on {
  background: #0fc97a;
  border-color: #0fc97a;
}
.pay-btn {
  margin-top: 34rpx;
}
</style>
