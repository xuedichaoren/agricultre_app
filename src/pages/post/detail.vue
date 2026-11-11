<template>
  <view class="page post">
    <nav-bar title="动态详情" bg="#FFFFFF" />
    <scroll-view scroll-y class="body no-scrollbar">
      <view class="author">
        <view class="avatar" :style="{ background: `linear-gradient(150deg, ${post.bg[0]}, ${post.bg[1]})` }">
          {{ post.avatar }}
        </view>
        <view class="flex1">
          <view class="row">
            <text class="a-name">{{ post.user }}</text>
            <view class="a-role">{{ post.role }}</view>
          </view>
          <text class="a-time">{{ post.time }} · 杭州临安</text>
        </view>
        <view class="follow" @tap="toast('已关注')">关注</view>
      </view>

      <text class="p-text">{{ post.text }}</text>

      <view class="media-grid" :class="'n' + post.images.length">
        <view
          v-for="(m, i) in post.images"
          :key="i"
          class="media"
          :style="{ background: `linear-gradient(150deg, ${post.bg[0]}, ${post.bg[1]})` }"
        >
          <text class="m-emoji">{{ m }}</text>
        </view>
      </view>

      <view class="meta">
        <text class="meta-time">发布于 {{ post.time }}</text>
        <text class="meta-stat">{{ post.likes }} 次赞 · {{ post.comments }} 条评论</text>
      </view>

      <view class="goods-link card" @tap="toProduct">
        <prod-img emoji="🍅" :bg="['#FFECE9', '#FFC9C1']" :h="120" :size="120" radius="18rpx" />
        <view class="flex1">
          <text class="gl-name">老品种番茄 500g</text>
          <text class="gl-sub">李伯的菜园 · 今日现摘</text>
        </view>
        <view class="gl-right">
          <price-tag :price="8.8" :num-size="30" />
          <view class="gl-btn">去看看</view>
        </view>
      </view>

      <view class="comments">
        <view class="c-head">
          <text class="c-title">评论 {{ post.comments }}</text>
          <view class="row">
            <text class="c-sort">按热度</text>
            <icon-svg name="down" :size="18" color="#9AA7A1" :stroke="2.2" />
          </view>
        </view>

        <view v-for="c in comments" :key="c.id" class="comment">
          <view class="c-avatar">{{ c.avatar }}</view>
          <view class="flex1">
            <text class="c-user">{{ c.user }}</text>
            <text class="c-text">{{ c.text }}</text>
            <view class="c-foot">
              <text class="c-time">{{ c.time }}</text>
              <view class="c-like" @tap="toast('已点赞')">
                <icon-svg name="heart" :size="24" color="#9AA7A1" :stroke="1.8" />
                <text class="cl-num">{{ c.likes }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>
      <view style="height: 160rpx" />
    </scroll-view>

    <view class="bar safe-bottom">
      <view class="input-fake" @tap="focusInput">
        <icon-svg name="edit" :size="26" color="#9AA7A1" :stroke="1.7" />
        <text class="if-txt">{{ draft || '说点什么…' }}</text>
      </view>
      <view class="bar-act" @tap="like">
        <icon-svg name="heart" :size="32" :color="liked ? '#FF5A4E' : '#3D4A45'" :stroke="1.8" />
        <text class="ba-txt" :class="{ on: liked }">{{ post.likes + (liked ? 1 : 0) }}</text>
      </view>
      <view class="bar-act" @tap="toast('已收藏')">
        <icon-svg name="star" :size="32" color="#3D4A45" :stroke="1.8" />
        <text class="ba-txt">收藏</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { computed, ref } from 'vue'
import { COMMENTS, POSTS } from '@/common/data.js'
import { store, toggleLike } from '@/store/index.js'
import { toast } from '@/common/utils.js'

const oid = ref('o1')
try {
  const pages = getCurrentPages()
  const cur = pages[pages.length - 1]
  if (cur && cur.options && cur.options.id) oid.value = cur.options.id
} catch (e) {}

const post = computed(() => POSTS.find((p) => p.id === oid.value) || POSTS[0])
const comments = ref(COMMENTS)
const liked = computed(() => store.likedPosts.includes(post.value.id))
const draft = ref('')

function like() {
  const on = toggleLike(post.value.id)
  toast(on ? '已点赞' : '已取消')
}
function toProduct() {
  uni.navigateTo({ url: '/pages/product/detail?id=p4' })
}
function focusInput() {
  uni.showModal({
    title: '写评论',
    editable: true,
    placeholderText: '说点什么…',
    confirmColor: '#0FC97A',
    success: (r) => {
      if (r.confirm && r.content) {
        comments.value.unshift({
          id: 'c' + Date.now(),
          user: '陈晓',
          avatar: '🧑',
          text: r.content,
          time: '刚刚',
          likes: 0
        })
        toast('评论成功')
      }
    }
  })
}
</script>

<style scoped>
.post {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
  background: #fff;
}
.body {
  flex: 1;
  height: 0;
  padding: 10rpx 28rpx 0;
}
.author {
  display: flex;
  align-items: center;
  gap: 16rpx;
  padding: 16rpx 0;
}
.avatar {
  width: 84rpx;
  height: 84rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 44rpx;
}
.a-name {
  font-size: 28rpx;
  font-weight: 700;
}
.a-role {
  margin-left: 10rpx;
  font-size: 18rpx;
  color: #06a96a;
  background: #e9faf2;
  padding: 2rpx 10rpx;
  border-radius: 6rpx;
}
.a-time {
  display: block;
  font-size: 21rpx;
  color: #a8b3ae;
  margin-top: 6rpx;
}
.follow {
  padding: 10rpx 24rpx;
  border: 2rpx solid #0fc97a;
  color: #06a96a;
  font-size: 22rpx;
  font-weight: 600;
  border-radius: 40rpx;
}
.p-text {
  display: block;
  font-size: 29rpx;
  line-height: 1.75;
  color: #263330;
  margin: 10rpx 0 22rpx;
}
.media-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 10rpx;
}
.media {
  border-radius: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}
.media-grid.n1 .media {
  width: 100%;
  height: 460rpx;
}
.media-grid.n2 .media {
  width: calc(50% - 5rpx);
  height: 300rpx;
}
.media-grid.n3 .media {
  width: calc(33.33% - 7rpx);
  height: 220rpx;
}
.m-emoji {
  font-size: 150rpx;
}
.meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx 0;
}
.meta-time {
  font-size: 20rpx;
  color: #b3bfba;
}
.meta-stat {
  font-size: 20rpx;
  color: #b3bfba;
}
.goods-link {
  display: flex;
  align-items: center;
  gap: 16rpx;
  padding: 16rpx;
  background: #f7faf8;
  box-shadow: none;
  margin-bottom: 24rpx;
}
.gl-name {
  font-size: 25rpx;
  font-weight: 600;
}
.gl-sub {
  display: block;
  font-size: 20rpx;
  color: #9aa7a1;
  margin-top: 6rpx;
}
.gl-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8rpx;
}
.gl-btn {
  font-size: 20rpx;
  color: #fff;
  background: linear-gradient(135deg, #16d488, #0bbd72);
  padding: 6rpx 18rpx;
  border-radius: 30rpx;
}
.comments {
  border-top: 2rpx solid #f4f8f5;
  padding-top: 20rpx;
}
.c-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20rpx;
}
.c-title {
  font-size: 27rpx;
  font-weight: 700;
}
.c-sort {
  font-size: 21rpx;
  color: #9aa7a1;
}
.comment {
  display: flex;
  gap: 16rpx;
  padding: 16rpx 0;
}
.c-avatar {
  width: 64rpx;
  height: 64rpx;
  border-radius: 50%;
  background: #f4f8f5;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32rpx;
  flex-shrink: 0;
}
.c-user {
  font-size: 23rpx;
  color: #7c8a84;
  font-weight: 600;
}
.c-text {
  display: block;
  font-size: 26rpx;
  color: #263330;
  line-height: 1.6;
  margin-top: 8rpx;
}
.c-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 10rpx;
}
.c-time {
  font-size: 20rpx;
  color: #b3bfba;
}
.c-like {
  display: flex;
  align-items: center;
  gap: 6rpx;
}
.cl-num {
  font-size: 20rpx;
  color: #9aa7a1;
}
.bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  background: #fff;
  padding: 14rpx 24rpx;
  display: flex;
  align-items: center;
  gap: 22rpx;
  border-top: 2rpx solid #f4f8f5;
}
.input-fake {
  flex: 1;
  height: 72rpx;
  background: #f4f8f5;
  border-radius: 72rpx;
  display: flex;
  align-items: center;
  gap: 10rpx;
  padding: 0 22rpx;
}
.if-txt {
  font-size: 24rpx;
  color: #a8b3ae;
}
.bar-act {
  display: flex;
  align-items: center;
  gap: 6rpx;
}
.ba-txt {
  font-size: 22rpx;
  color: #7c8a84;
}
.ba-txt.on {
  color: #ff5a4e;
}
</style>
