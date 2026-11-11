<template>
  <view class="page cart-page">
    <view class="header">
      <view class="status" :style="{ height: statusBar + 'px' }" />
      <view class="h-row">
        <text class="h-title">菜篮子</text>
        <text class="manage" @tap="editing = !editing">{{ editing ? '完成' : '管理' }}</text>
      </view>
      <view class="h-tip">
        <icon-svg name="truck" :size="26" color="#06A96A" :stroke="1.8" />
        <text class="tip-txt">满 39 元免配送费，今日 21:00 前下单当晚送达</text>
      </view>
    </view>

    <scroll-view scroll-y class="body no-scrollbar">
      <view v-if="list.length" class="list">
        <view v-for="item in list" :key="item.pid" class="item card">
          <view class="check" :class="{ on: item.checked }" @tap="toggleCheck(item.pid)">
            <icon-svg v-if="item.checked" name="check" :size="20" color="#FFFFFF" :stroke="3" />
          </view>
          <prod-img :emoji="item.product.emoji" :bg="item.product.bg" :h="150" :size="150" radius="20rpx" />
          <view class="info">
            <text class="name ellipsis-2">{{ item.product.name }}</text>
            <text class="spec">{{ item.product.spec }}</text>
            <view class="row between mt8">
              <price-tag :price="item.product.price" :num-size="32" />
              <view class="stepper">
                <view class="st-btn" @tap="dec(item)">
                  <icon-svg name="minus" :size="22" color="#3D4A45" :stroke="2.2" />
                </view>
                <text class="st-num">{{ item.qty }}</text>
                <view class="st-btn" @tap="inc(item)">
                  <icon-svg name="plus" :size="22" color="#3D4A45" :stroke="2.2" />
                </view>
              </view>
            </view>
          </view>
          <view v-if="editing" class="del" @tap="del(item)">
            <icon-svg name="trash" :size="30" color="#FF5A4E" :stroke="1.7" />
          </view>
        </view>

        <view class="like card">
          <view class="like-head">
            <text class="like-title">常买的菜</text>
            <text class="like-sub">一键加回篮子</text>
          </view>
          <scroll-view scroll-x class="no-scrollbar">
            <view class="like-inner">
              <view v-for="p in recommend" :key="p.id" class="like-item" @tap="add(p)">
                <prod-img :emoji="p.emoji" :bg="p.bg" :h="110" :size="110" radius="16rpx" />
                <text class="like-name ellipsis">{{ p.name }}</text>
                <text class="like-price">¥{{ p.price }}</text>
              </view>
            </view>
          </scroll-view>
        </view>
      </view>

      <empty-box
        v-else
        text="菜篮子还是空的"
        sub="去逛逛，今天的菜刚从地里摘下来"
        emoji="🧺"
        btn-text="去挑菜"
        @action="goHome"
      />
      <view style="height: 220rpx" />
    </scroll-view>

    <view v-if="list.length" class="bar safe-bottom">
      <view class="all" @tap="all">
        <view class="check" :class="{ on: allChecked }">
          <icon-svg v-if="allChecked" name="check" :size="20" color="#FFFFFF" :stroke="3" />
        </view>
        <text class="all-txt">全选</text>
      </view>
      <view class="sum">
        <view class="row">
          <text class="sum-label">合计</text>
          <price-tag :price="total" :num-size="40" />
        </view>
        <text class="sum-tip">已减 ¥{{ saved }} · 不含配送费</text>
      </view>
      <view
        class="btn btn-primary pay"
        :class="{ 'btn-disabled': !checkedCount }"
        @tap="checkout"
      >
        去结算{{ checkedCount ? '(' + checkedCount + ')' : '' }}
      </view>
    </view>
  </view>
</template>

<script setup>
import { computed, ref } from 'vue'
import {
  cartList,
  checkedItems,
  cartTotal,
  setQty,
  removeFromCart,
  toggleCheck,
  toggleAll,
  addToCart,
  store
} from '@/store/index.js'
import { PRODUCTS } from '@/common/data.js'
import { toast } from '@/common/utils.js'

const statusBar = ref(20)
try {
  const info = uni.getStorageSync('sys_info')
  if (info && info.statusBarHeight) statusBar.value = info.statusBarHeight
} catch (e) {}

const editing = ref(false)
const list = cartList
const checkedCount = computed(() => checkedItems.value.reduce((s, i) => s + i.qty, 0))
const total = computed(() => +cartTotal.value.toFixed(2))
const allChecked = computed(() => list.value.length > 0 && list.value.every((i) => i.checked))
const saved = computed(() =>
  checkedItems.value.reduce((s, i) => s + (i.product.origin - i.product.price) * i.qty, 0).toFixed(0)
)
const recommend = computed(() => PRODUCTS.filter((p) => !store.cart.find((c) => c.pid === p.id)).slice(0, 6))

function inc(item) {
  setQty(item.pid, item.qty + 1)
}
function dec(item) {
  if (item.qty <= 1) return del(item)
  setQty(item.pid, item.qty - 1)
}
function del(item) {
  uni.showModal({
    title: '移除商品',
    content: `确定把「${item.product.name}」移出菜篮子吗？`,
    confirmColor: '#0FC97A',
    success: (res) => {
      if (res.confirm) {
        removeFromCart(item.pid)
        toast('已移除')
      }
    }
  })
}
function all() {
  toggleAll(!allChecked.value)
}
function add(p) {
  addToCart(p.id)
  toast('已加入菜篮子')
}
function checkout() {
  if (!checkedCount.value) return toast('请先选择要结算的商品')
  uni.navigateTo({ url: '/pages/order/confirm?from=cart' })
}
function goHome() {
  uni.switchTab({ url: '/pages/tabbar/home/home' })
}
</script>

<style scoped>
.cart-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}
.header {
  background: #fff;
  padding: 0 28rpx 22rpx;
}
.h-row {
  height: 88rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.h-title {
  font-size: 38rpx;
  font-weight: 800;
}
.manage {
  font-size: 25rpx;
  color: #7c8a84;
}
.h-tip {
  height: 64rpx;
  background: #eefaf3;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  gap: 10rpx;
  padding: 0 18rpx;
}
.tip-txt {
  font-size: 21rpx;
  color: #0a8f5c;
}
.body {
  flex: 1;
  height: 0;
}
.list {
  padding: 22rpx 24rpx;
  display: flex;
  flex-direction: column;
  gap: 18rpx;
}
.item {
  display: flex;
  align-items: center;
  padding: 20rpx;
  gap: 16rpx;
  position: relative;
}
.check {
  width: 38rpx;
  height: 38rpx;
  border-radius: 50%;
  border: 2rpx solid #d3ded9;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.check.on {
  background: #0fc97a;
  border-color: #0fc97a;
}
.info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}
.name {
  font-size: 27rpx;
  font-weight: 600;
  line-height: 1.35;
}
.spec {
  font-size: 21rpx;
  color: #9aa7a1;
  margin-top: 8rpx;
}
.mt8 {
  margin-top: 12rpx;
}
.stepper {
  display: flex;
  align-items: center;
  background: #f4f8f5;
  border-radius: 40rpx;
  padding: 4rpx;
  gap: 4rpx;
}
.st-btn {
  width: 46rpx;
  height: 46rpx;
  border-radius: 50%;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
}
.st-num {
  min-width: 48rpx;
  text-align: center;
  font-size: 25rpx;
  font-weight: 600;
}
.del {
  position: absolute;
  right: 18rpx;
  top: 18rpx;
  padding: 6rpx;
}
.like {
  padding: 24rpx 20rpx;
  margin-top: 10rpx;
}
.like-head {
  display: flex;
  align-items: baseline;
  gap: 12rpx;
  margin-bottom: 18rpx;
  padding-left: 4rpx;
}
.like-title {
  font-size: 28rpx;
  font-weight: 700;
}
.like-sub {
  font-size: 21rpx;
  color: #9aa7a1;
}
.like-inner {
  display: inline-flex;
  gap: 18rpx;
}
.like-item {
  width: 110rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.like-name {
  font-size: 20rpx;
  color: #3d4a45;
  margin-top: 8rpx;
  width: 110rpx;
  text-align: center;
}
.like-price {
  font-size: 20rpx;
  color: #ff4b3a;
  font-weight: 700;
}
.bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  background: #fff;
  padding: 18rpx 24rpx;
  display: flex;
  align-items: center;
  gap: 16rpx;
  box-shadow: 0 -8rpx 30rpx rgba(22, 60, 45, 0.07);
  z-index: 30;
  padding-bottom: calc(18rpx + constant(safe-area-inset-bottom));
  padding-bottom: calc(18rpx + env(safe-area-inset-bottom));
}
.all {
  display: flex;
  align-items: center;
  gap: 10rpx;
}
.all-txt {
  font-size: 24rpx;
  color: #3d4a45;
}
.sum {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  padding-right: 6rpx;
}
.sum-label {
  font-size: 23rpx;
  color: #3d4a45;
  margin-right: 6rpx;
}
.sum-tip {
  font-size: 19rpx;
  color: #b3bfba;
  margin-top: 4rpx;
}
.pay {
  width: 220rpx;
  height: 84rpx;
  font-size: 28rpx;
}
</style>
