<template>
  <view class="page reviews-page">
    <nav-bar title="商品评价" />
    <scroll-view scroll-y class="body no-scrollbar">
      <view class="card summary">
        <view class="s-left">
          <text class="s-score">4.9</text>
          <view class="stars">
            <text v-for="i in 5" :key="i" class="star">★</text>
          </view>
          <text class="s-count">共 1286 条评价</text>
        </view>
        <view class="s-right">
          <view v-for="b in bars" :key="b.label" class="bar-row">
            <text class="bar-label">{{ b.label }}</text>
            <view class="bar-track">
              <view class="bar-fill" :style="{ width: b.pct + '%' }" />
            </view>
            <text class="bar-pct">{{ b.pct }}%</text>
          </view>
        </view>
      </view>

      <scroll-view scroll-x class="tags no-scrollbar">
        <view class="tags-inner">
          <view v-for="t in tagList" :key="t" class="tag-item" :class="{ on: activeTag === t }" @tap="activeTag = t">
            {{ t }}
          </view>
        </view>
      </scroll-view>

      <view class="list">
        <view v-for="r in reviews" :key="r.id" class="review card">
          <view class="r-top">
            <view class="r-avatar">{{ r.avatar }}</view>
            <view class="flex1">
              <view class="row">
                <text class="r-user">{{ r.user }}</text>
                <view class="r-level">Lv.{{ r.level }}</view>
              </view>
              <view class="stars small">
                <text v-for="i in 5" :key="i" class="star" :class="{ dim: i > r.stars }">★</text>
              </view>
            </view>
            <text class="r-time">{{ r.time }}</text>
          </view>
          <text class="r-text">{{ r.text }}</text>
          <view class="r-imgs">
            <view v-for="(e, i) in r.imgs" :key="i" class="r-img" :style="{ background: r.bg }">
              <text class="r-emoji">{{ e }}</text>
            </view>
          </view>
          <view class="r-foot">
            <text class="r-spec">{{ r.spec }}</text>
            <view class="r-like" @tap="toast('已点赞')">
              <icon-svg name="heart" :size="24" color="#9AA7A1" :stroke="1.8" />
              <text class="rl-num">{{ r.likes }}</text>
            </view>
          </view>
        </view>
      </view>
      <view class="end-tip">— 已经到底了 —</view>
      <view style="height: 40rpx" />
    </scroll-view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { toast } from '@/common/utils.js'

const bars = [
  { label: '新鲜度', pct: 99 },
  { label: '包装', pct: 96 },
  { label: '配送速度', pct: 94 }
]

const tagList = ['全部(1286)', '新鲜(1203)', '包装好(862)', '有图(415)', '次日达(678)']
const activeTag = ref('全部(1286)')

const reviews = ref([
  {
    id: 'r1', user: '阿杏', avatar: '👩', level: 3, stars: 5, time: '11-10',
    text: '第三次买了，叶子还是很嫩，晚上炒了一盘，孩子说比菜市场的香。包装里有冰袋，到的时候还是凉的。',
    imgs: ['🥬', '🍲'], bg: 'linear-gradient(150deg,#e9f9ef,#c9efd9)', spec: '300g／袋', likes: 42
  },
  {
    id: 'r2', user: '小城故事', avatar: '🧑‍💼', level: 2, stars: 5, time: '11-08',
    text: '顺丰次日到，很新鲜。唯一小建议：袋子可以少用一点。',
    imgs: ['🥬'], bg: 'linear-gradient(150deg,#eaf9ef,#cdefd8)', spec: '300g／袋', likes: 18
  },
  {
    id: 'r3', user: '种菜的小周', avatar: '🧑', level: 5, stars: 4, time: '11-06',
    text: '味道不错，就是这次的菜有点小，可能季节原因。客服补了两把，态度很好。',
    imgs: [], bg: '', spec: '300g／袋', likes: 9
  }
])
</script>

<style scoped>
.reviews-page {
  min-height: 100vh;
}
.body {
  padding: 18rpx 24rpx 0;
  height: calc(100vh - 90rpx);
}
.summary {
  padding: 26rpx;
  display: flex;
  gap: 30rpx;
}
.s-left {
  width: 200rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-right: 2rpx solid #f4f8f5;
}
.s-score {
  font-size: 64rpx;
  font-weight: 800;
  color: #0a8f5c;
  line-height: 1;
}
.stars {
  display: flex;
  gap: 3rpx;
  margin-top: 10rpx;
}
.stars.small .star {
  font-size: 20rpx;
}
.star {
  font-size: 24rpx;
  color: #ffb020;
}
.star.dim {
  color: #e2e8e5;
}
.s-count {
  font-size: 20rpx;
  color: #9aa7a1;
  margin-top: 10rpx;
}
.s-right {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 12rpx;
}
.bar-row {
  display: flex;
  align-items: center;
  gap: 12rpx;
}
.bar-label {
  font-size: 20rpx;
  color: #7c8a84;
  width: 100rpx;
}
.bar-track {
  flex: 1;
  height: 10rpx;
  border-radius: 10rpx;
  background: #f0f4f2;
  overflow: hidden;
}
.bar-fill {
  height: 100%;
  border-radius: 10rpx;
  background: linear-gradient(90deg, #35e39b, #0bbd72);
}
.bar-pct {
  font-size: 19rpx;
  color: #9aa7a1;
  width: 60rpx;
  text-align: right;
}
.tags {
  margin-top: 20rpx;
  white-space: nowrap;
}
.tags-inner {
  display: inline-flex;
  gap: 12rpx;
}
.tag-item {
  padding: 10rpx 24rpx;
  border-radius: 40rpx;
  background: #fff;
  font-size: 22rpx;
  color: #3d4a45;
}
.tag-item.on {
  background: #e9faf2;
  color: #06a96a;
  font-weight: 700;
}
.list {
  margin-top: 20rpx;
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
.review {
  padding: 24rpx;
}
.r-top {
  display: flex;
  gap: 16rpx;
  align-items: center;
}
.r-avatar {
  width: 72rpx;
  height: 72rpx;
  border-radius: 50%;
  background: #f4f8f5;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36rpx;
}
.r-user {
  font-size: 25rpx;
  font-weight: 600;
}
.r-level {
  margin-left: 8rpx;
  font-size: 17rpx;
  color: #ff8a3d;
  background: #fff4e4;
  padding: 2rpx 8rpx;
  border-radius: 6rpx;
}
.r-time {
  font-size: 20rpx;
  color: #b3bfba;
  margin-left: auto;
}
.r-text {
  display: block;
  font-size: 25rpx;
  color: #3d4a45;
  line-height: 1.7;
  margin-top: 16rpx;
}
.r-imgs {
  display: flex;
  gap: 10rpx;
  margin-top: 14rpx;
}
.r-img {
  width: 150rpx;
  height: 150rpx;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}
.r-emoji {
  font-size: 70rpx;
}
.r-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 16rpx;
}
.r-spec {
  font-size: 20rpx;
  color: #b3bfba;
}
.r-like {
  display: flex;
  align-items: center;
  gap: 6rpx;
}
.rl-num {
  font-size: 20rpx;
  color: #9aa7a1;
}
.end-tip {
  text-align: center;
  font-size: 20rpx;
  color: #c3ccc8;
  padding: 30rpx 0;
}
</style>
