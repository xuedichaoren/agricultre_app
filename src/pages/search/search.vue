<template>
  <view class="page search-page">
    <view class="header">
      <view class="status" :style="{ height: statusBar + 'px' }" />
      <view class="h-row">
        <view class="back" @tap="back">
          <icon-svg name="back" :size="34" :stroke="2" />
        </view>
        <view class="box">
          <icon-svg name="search" :size="28" color="#9AA7A1" :stroke="2" />
          <input
            v-model="kw"
            class="input"
            :focus="true"
            confirm-type="search"
            placeholder="搜索农产品、农场"
            placeholder-class="ph"
            @confirm="doSearch"
          />
          <view v-if="kw" class="clear" @tap="kw = ''">
            <icon-svg name="close" :size="24" color="#B8C4BF" />
          </view>
        </view>
        <text class="do" @tap="doSearch">搜索</text>
      </view>
    </view>

    <scroll-view v-if="!searched" scroll-y class="body no-scrollbar">
      <view class="block">
        <view class="b-head">
          <text class="b-title">搜索历史</text>
          <view class="b-act" @tap="clearHistory">
            <icon-svg name="trash" :size="24" color="#9AA7A1" :stroke="1.7" />
          </view>
        </view>
        <view class="chips">
          <view v-for="h in history" :key="h" class="chip" @tap="quick(h)">{{ h }}</view>
          <text v-if="!history.length" class="empty-txt">还没有搜索记录</text>
        </view>
      </view>

      <view class="block">
        <view class="b-head">
          <text class="b-title">大家都在搜</text>
          <text class="b-sub">今日热度</text>
        </view>
        <view class="hot">
          <view v-for="(h, i) in hot" :key="h" class="hot-item" @tap="quick(h)">
            <text class="hot-rank" :class="{ top: i < 3 }">{{ i + 1 }}</text>
            <text class="hot-txt">{{ h }}</text>
            <view class="hot-tag" v-if="i < 2">热</view>
          </view>
        </view>
      </view>

      <view class="block">
        <view class="b-head">
          <text class="b-title">按农场找菜</text>
        </view>
        <view class="farms">
          <view v-for="f in FARMS" :key="f.id" class="farm" @tap="go('/pages/farm/home?id=' + f.id)">
            <view class="f-avatar" :style="{ background: `linear-gradient(150deg, ${f.cover[0]}, ${f.cover[1]})` }">
              {{ f.avatar }}
            </view>
            <view class="flex1">
              <text class="f-name">{{ f.name }}</text>
              <text class="f-desc ellipsis">{{ f.city }} · {{ f.fans }}人关注</text>
            </view>
            <icon-svg name="right" :size="22" color="#C3CCC8" />
          </view>
        </view>
      </view>
    </scroll-view>

    <view v-else class="result">
      <view class="sortbar">
        <view v-for="s in sorts" :key="s.key" class="sort-item" :class="{ on: sort === s.key }" @tap="onSort(s.key)">
          <text class="sort-txt">{{ s.name }}</text>
          <icon-svg
            v-if="s.key === 'price'"
            :name="priceAsc ? 'up' : 'down'"
            :size="18"
            :color="sort === 'price' ? '#0FC97A' : '#C3CCC8'"
            :stroke="2.4"
          />
        </view>
        <view class="count">{{ results.length }} 件</view>
      </view>

      <scroll-view scroll-y class="res-body no-scrollbar">
        <view v-if="results.length" class="list">
          <view v-for="p in results" :key="p.id">
            <product-card :product="p" mode="row" @tap="toDetail(p.id)" @add="onAdd" />
          </view>
          <view class="end-tip">— 共找到 {{ results.length }} 件商品 —</view>
        </view>
        <empty-box
          v-else
          :text="`没有找到「${kw}」`"
          sub="换个关键词试试，或者看看今日特价"
          emoji="🔍"
          btn-text="看看特价"
          @action="quick('特价')"
        />
      </scroll-view>
    </view>
  </view>
</template>

<script setup>
import { computed, ref } from 'vue'
import { FARMS, PRODUCTS } from '@/common/data.js'
import { addToCart } from '@/store/index.js'
import { toast } from '@/common/utils.js'

const statusBar = ref(20)
try {
  const info = uni.getStorageSync('sys_info')
  if (info && info.statusBarHeight) statusBar.value = info.statusBarHeight
} catch (e) {}

const kw = ref('')
const searched = ref(false)
const sort = ref('default')
const priceAsc = ref(true)
const history = ref(uni.getStorageSync('nh_search_history') || ['小油菜', '番茄', '沃柑'])
const hot = ['现摘草莓', '土鸡蛋', '五常大米', '春笋', '阳光玫瑰', '散养土鸡', '干香菇']

const sorts = [
  { key: 'default', name: '综合' },
  { key: 'sales', name: '销量' },
  { key: 'price', name: '价格' }
]

const baseResults = computed(() => {
  const k = kw.value.trim()
  if (!k) return []
  if (k === '特价') return PRODUCTS.filter((p) => p.origin > p.price)
  return PRODUCTS.filter(
    (p) => p.name.includes(k) || p.spec.includes(k) || p.desc.includes(k) || p.tags.join().includes(k)
  )
})

const results = computed(() => {
  const arr = [...baseResults.value]
  if (sort.value === 'sales') arr.sort((a, b) => b.sales - a.sales)
  if (sort.value === 'price') arr.sort((a, b) => (priceAsc.value ? a.price - b.price : b.price - a.price))
  return arr
})

function doSearch() {
  if (!kw.value.trim()) return toast('请输入关键词')
  searched.value = true
  const h = history.value.filter((x) => x !== kw.value)
  h.unshift(kw.value)
  history.value = h.slice(0, 10)
  uni.setStorageSync('nh_search_history', history.value)
}

function quick(w) {
  kw.value = w
  doSearch()
}

function clearHistory() {
  history.value = []
  uni.removeStorageSync('nh_search_history')
}

function back() {
  uni.navigateBack()
}
function go(url) {
  uni.navigateTo({ url })
}
function toDetail(id) {
  uni.navigateTo({ url: `/pages/product/detail?id=${id}` })
}
function onAdd(p) {
  addToCart(p.id)
  toast('已加入菜篮子')
}

// 价格排序点击时切换升降序
function onSort(key) {
  if (key === 'price' && sort.value === 'price') priceAsc.value = !priceAsc.value
  sort.value = key
}
</script>

<style scoped>
.search-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}
.header {
  background: #fff;
  padding: 0 24rpx;
}
.h-row {
  height: 88rpx;
  display: flex;
  align-items: center;
  gap: 16rpx;
}
.back {
  padding: 6rpx;
}
.box {
  flex: 1;
  height: 72rpx;
  background: #f4f8f5;
  border-radius: 72rpx;
  display: flex;
  align-items: center;
  gap: 12rpx;
  padding: 0 22rpx;
}
.input {
  flex: 1;
  font-size: 27rpx;
  height: 72rpx;
}
.ph {
  color: #b3bfba;
  font-size: 26rpx;
}
.do {
  font-size: 27rpx;
  color: #06a96a;
  font-weight: 600;
}
.body {
  flex: 1;
  height: 0;
}
.block {
  padding: 32rpx 28rpx 0;
}
.b-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 22rpx;
}
.b-title {
  font-size: 28rpx;
  font-weight: 700;
}
.b-sub {
  font-size: 21rpx;
  color: #b3bfba;
}
.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
}
.chip {
  padding: 12rpx 26rpx;
  background: #fff;
  border-radius: 40rpx;
  font-size: 24rpx;
  color: #3d4a45;
}
.empty-txt {
  font-size: 23rpx;
  color: #b3bfba;
}
.hot {
  background: #fff;
  border-radius: 24rpx;
  padding: 8rpx 24rpx;
}
.hot-item {
  display: flex;
  align-items: center;
  height: 84rpx;
  border-bottom: 2rpx solid #f6f9f7;
}
.hot-item:last-child {
  border-bottom: none;
}
.hot-rank {
  width: 44rpx;
  font-size: 24rpx;
  font-weight: 700;
  color: #c3ccc8;
}
.hot-rank.top {
  color: #ff8a3d;
}
.hot-txt {
  flex: 1;
  font-size: 26rpx;
  color: #263330;
}
.hot-tag {
  background: #ffefec;
  color: #ff5a4e;
  font-size: 18rpx;
  padding: 2rpx 10rpx;
  border-radius: 6rpx;
}
.farms {
  background: #fff;
  border-radius: 24rpx;
  padding: 6rpx 24rpx;
}
.farm {
  display: flex;
  align-items: center;
  gap: 18rpx;
  height: 120rpx;
  border-bottom: 2rpx solid #f6f9f7;
}
.farm:last-child {
  border-bottom: none;
}
.f-avatar {
  width: 76rpx;
  height: 76rpx;
  border-radius: 24rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40rpx;
}
.f-name {
  font-size: 27rpx;
  font-weight: 600;
}
.f-desc {
  display: block;
  font-size: 21rpx;
  color: #9aa7a1;
  margin-top: 4rpx;
}
.result {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 0;
}
.sortbar {
  display: flex;
  align-items: center;
  background: #fff;
  padding: 0 28rpx;
  height: 84rpx;
  gap: 44rpx;
  border-top: 2rpx solid #f4f8f5;
}
.sort-item {
  display: flex;
  align-items: center;
  gap: 4rpx;
}
.sort-txt {
  font-size: 25rpx;
  color: #7c8a84;
}
.sort-item.on .sort-txt {
  color: #06a96a;
  font-weight: 700;
}
.count {
  margin-left: auto;
  font-size: 21rpx;
  color: #b3bfba;
}
.res-body {
  flex: 1;
  height: 0;
  padding: 20rpx 24rpx 0;
}
.list {
  display: flex;
  flex-direction: column;
  gap: 18rpx;
}
.end-tip {
  text-align: center;
  font-size: 21rpx;
  color: #b3bfba;
  padding: 30rpx 0;
}
</style>
