<template>
  <view class="page fav-page">
    <nav-bar title="我的收藏" />
    <view class="tabs">
      <view v-for="t in tabs" :key="t.key" class="tab" :class="{ on: active === t.key }" @tap="active = t.key">
        <text class="tab-txt">{{ t.name }}</text>
        <view v-if="active === t.key" class="tab-line" />
      </view>
    </view>

    <scroll-view scroll-y class="body no-scrollbar">
      <view v-if="list.length" class="grid">
        <view v-for="p in list" :key="p.id" class="grid-item">
          <product-card :product="p" mode="grid" @tap="toDetail(p.id)" @add="onAdd" />
          <view v-if="active === 'fav'" class="remove" @tap="remove(p)">
            <icon-svg name="close" :size="20" color="#9AA7A1" :stroke="2.2" />
          </view>
        </view>
      </view>
      <empty-box
        v-else
        :text="active === 'fav' ? '还没有收藏的菜' : '还没有浏览足迹'"
        sub="看到喜欢的，点个爱心就收藏啦"
        emoji="💚"
        btn-text="去逛逛"
        @action="home"
      />
      <view style="height: 40rpx" />
    </scroll-view>
  </view>
</template>

<script setup>
import { computed, ref } from 'vue'
import { PRODUCTS } from '@/common/data.js'
import { addToCart, store, toggleFavorite } from '@/store/index.js'
import { toast } from '@/common/utils.js'

const tabs = [
  { key: 'fav', name: '商品收藏' },
  { key: 'foot', name: '浏览足迹' }
]
const active = ref('fav')
try {
  const pages = getCurrentPages()
  const cur = pages[pages.length - 1]
  if (cur && cur.options && cur.options.tab === 'foot') active.value = 'foot'
} catch (e) {}

const list = computed(() => {
  const ids = active.value === 'fav' ? store.favorites : store.footprint
  return ids.map((id) => PRODUCTS.find((p) => p.id === id)).filter(Boolean)
})

function remove(p) {
  toggleFavorite(p.id)
  toast('已取消收藏')
}
function toDetail(id) {
  uni.navigateTo({ url: `/pages/product/detail?id=${id}` })
}
function onAdd(p) {
  addToCart(p.id)
  toast('已加入菜篮子')
}
function home() {
  uni.switchTab({ url: '/pages/tabbar/home/home' })
}
</script>

<style scoped>
.fav-page {
  min-height: 100vh;
}
.tabs {
  display: flex;
  background: #fff;
  padding: 0 28rpx;
}
.tab {
  padding: 20rpx 30rpx 22rpx;
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
.grid {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
}
.grid-item {
  width: calc(50% - 8rpx);
  position: relative;
}
.remove {
  position: absolute;
  right: 18rpx;
  top: 24rpx;
  width: 44rpx;
  height: 44rpx;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.08);
}
</style>
