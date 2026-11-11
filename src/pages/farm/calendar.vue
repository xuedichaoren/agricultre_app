<template>
  <view class="page cal-page">
    <view class="head">
      <view class="status" :style="{ height: statusBar + 'px' }" />
      <view class="nav-row">
        <view class="n-btn" @tap="back">
          <icon-svg name="back" :size="32" color="#16201C" :stroke="2" />
        </view>
        <text class="n-title">农事日历</text>
        <view class="n-btn" @tap="go('/pages/farm/record')">
          <icon-svg name="plus" :size="30" color="#16201C" :stroke="2.2" />
        </view>
      </view>

      <view class="month-bar">
        <view class="mb-btn" @tap="changeMonth(-1)">
          <icon-svg name="back" :size="26" color="#3D4A45" :stroke="2" />
        </view>
        <text class="month">{{ year }} 年 {{ month }} 月</text>
        <view class="mb-btn" @tap="changeMonth(1)">
          <icon-svg name="right" :size="26" color="#3D4A45" :stroke="2" />
        </view>
        <view class="today-btn" @tap="toToday">回到今天</view>
      </view>

      <view class="week-row">
        <text v-for="w in weekNames" :key="w" class="week">{{ w }}</text>
      </view>

      <view class="grid">
        <view
          v-for="(d, i) in days"
          :key="i"
          class="cell"
          :class="{ empty: !d.day, sel: d.date === selected, today: d.date === todayKey }"
          @tap="d.day && (selected = d.date)"
        >
          <template v-if="d.day">
            <text class="d-num">{{ d.day }}</text>
            <view v-if="d.hasTask" class="dots">
              <view v-for="n in Math.min(d.taskCount, 3)" :key="n" class="dot" />
            </view>
          </template>
        </view>
      </view>

      <view class="legend">
        <view class="lg"><view class="lg-dot harvest" /><text class="lg-txt">采收</text></view>
        <view class="lg"><view class="lg-dot care" /><text class="lg-txt">管护</text></view>
        <view class="lg"><view class="lg-dot fertilize" /><text class="lg-txt">施肥</text></view>
      </view>
    </view>

    <scroll-view scroll-y class="body no-scrollbar">
      <view class="day-head">
        <text class="dh-title">{{ selectedLabel }}</text>
        <text class="dh-count">{{ dayTasks.length }} 项农事</text>
      </view>

      <view v-if="dayTasks.length" class="tasks">
        <view v-for="t in dayTasks" :key="t.id" class="task card" @tap="toggleTask(t)">
          <view class="t-check" :class="{ on: t.done }">
            <icon-svg v-if="t.done" name="check" :size="20" color="#FFFFFF" :stroke="3" />
          </view>
          <view class="flex1">
            <view class="row">
              <text class="t-title" :class="{ done: t.done }">{{ t.title }}</text>
              <view class="t-type" :class="t.type">{{ typeName(t.type) }}</view>
            </view>
            <text class="t-sub">{{ t.farm }} · {{ t.time }}</text>
          </view>
          <icon-svg name="right" :size="22" color="#C3CCC8" />
        </view>
      </view>

      <view v-else class="no-task">
        <text class="nt-emoji">🌤️</text>
        <text class="nt-title">这一天没有安排农事</text>
        <text class="nt-sub">让土地也休息一下，或添加一条记录</text>
        <view class="btn btn-ghost btn-sm nt-btn" @tap="go('/pages/farm/record')">添加农事记录</view>
      </view>

      <view class="section">
        <text class="sec-title">本月概览</text>
        <view class="overview">
          <view class="ov-item">
            <text class="ov-num">{{ totalTasks }}</text>
            <text class="ov-label">总农事</text>
          </view>
          <view class="ov-item">
            <text class="ov-num">{{ doneTasks }}</text>
            <text class="ov-label">已完成</text>
          </view>
          <view class="ov-item">
            <text class="ov-num">{{ totalTasks - doneTasks }}</text>
            <text class="ov-label">待处理</text>
          </view>
          <view class="ov-item">
            <text class="ov-num">46天</text>
            <text class="ov-label">在田时长</text>
          </view>
        </view>
      </view>

      <view class="section">
        <text class="sec-title">我的地块</text>
        <view class="plots">
          <view v-for="p in plots" :key="p.id" class="plot card" @tap="go('/pages/farm/home?id=' + p.id)">
            <view class="p-emoji" :style="{ background: p.bg }">{{ p.emoji }}</view>
            <view class="flex1">
              <text class="p-name">{{ p.name }}</text>
              <text class="p-sub">{{ p.crop }}</text>
            </view>
            <view class="p-status" :class="{ warn: p.warn }">{{ p.status }}</view>
          </view>
        </view>
      </view>
      <view style="height: 60rpx" />
    </scroll-view>
  </view>
</template>

<script setup>
import { computed, ref } from 'vue'
import { FARM_TASKS } from '@/common/data.js'
import { toast } from '@/common/utils.js'

const statusBar = ref(20)
try {
  const info = uni.getStorageSync('sys_info')
  if (info && info.statusBarHeight) statusBar.value = info.statusBarHeight
} catch (e) {}

const todayKey = '2026-11-11'
const year = ref(2026)
const month = ref(11)
const selected = ref(todayKey)
const weekNames = ['一', '二', '三', '四', '五', '六', '日']

const tasks = ref(JSON.parse(JSON.stringify(FARM_TASKS)))

const days = computed(() => {
  const first = new Date(year.value, month.value - 1, 1)
  const firstWeekday = (first.getDay() + 6) % 7 // 周一为 0
  const total = new Date(year.value, month.value, 0).getDate()
  const arr = []
  for (let i = 0; i < firstWeekday; i++) arr.push({ day: 0 })
  for (let d = 1; d <= total; d++) {
    const key = `${year.value}-${String(month.value).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    const list = tasks.value[key] || []
    arr.push({ day: d, date: key, hasTask: list.length > 0, taskCount: list.length })
  }
  return arr
})

const dayTasks = computed(() => tasks.value[selected.value] || [])

const selectedLabel = computed(() => {
  const [y, m, d] = selected.value.split('-')
  return `${+m} 月 ${+d} 日 · 农事安排`
})

const totalTasks = computed(() => Object.values(tasks.value).reduce((s, a) => s + a.length, 0))
const doneTasks = computed(() =>
  Object.values(tasks.value).reduce((s, a) => s + a.filter((t) => t.done).length, 0)
)

const plots = [
  { id: 'f1', name: 'A3 号地块 · 小油菜', crop: '李伯的菜园 · 第 46 天', status: '可采收', emoji: '🥬', bg: 'linear-gradient(150deg,#e9f9ef,#c9efd9)' },
  { id: 'f2', name: 'B1 号地块 · 番茄', crop: '李伯的菜园 · 第 32 天', status: '管护中', emoji: '🍅', bg: 'linear-gradient(150deg,#ffece9,#ffc9c1)' },
  { id: 'f3', name: '果园区 · 沃柑', crop: '山里红果园 · 第 210 天', status: '7 天后采', warn: true, emoji: '🍊', bg: 'linear-gradient(150deg,#fff1e0,#ffd3a6)' }
]

function typeName(t) {
  return { harvest: '采收', care: '管护', fertilize: '施肥' }[t] || '农事'
}

function changeMonth(n) {
  let m = month.value + n
  let y = year.value
  if (m < 1) {
    m = 12
    y -= 1
  }
  if (m > 12) {
    m = 1
    y += 1
  }
  month.value = m
  year.value = y
}

function toToday() {
  year.value = 2026
  month.value = 11
  selected.value = todayKey
}

function toggleTask(t) {
  t.done = !t.done
  toast(t.done ? '已标记完成' : '已取消完成')
}

function back() {
  uni.navigateBack()
}
function go(url) {
  uni.navigateTo({ url })
}
</script>

<style scoped>
.cal-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}
.head {
  background: #fff;
  padding: 0 24rpx 18rpx;
  border-radius: 0 0 30rpx 30rpx;
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
  background: #f4f8f5;
  display: flex;
  align-items: center;
  justify-content: center;
}
.n-title {
  flex: 1;
  text-align: center;
  font-size: 30rpx;
  font-weight: 700;
}
.month-bar {
  display: flex;
  align-items: center;
  gap: 12rpx;
  padding: 6rpx 0 18rpx;
}
.mb-btn {
  width: 48rpx;
  height: 48rpx;
  border-radius: 50%;
  background: #f4f8f5;
  display: flex;
  align-items: center;
  justify-content: center;
}
.month {
  font-size: 30rpx;
  font-weight: 800;
  margin: 0 6rpx;
}
.today-btn {
  margin-left: auto;
  font-size: 21rpx;
  color: #06a96a;
  background: #e9faf2;
  padding: 8rpx 20rpx;
  border-radius: 30rpx;
}
.week-row {
  display: flex;
  padding: 6rpx 0;
}
.week {
  flex: 1;
  text-align: center;
  font-size: 20rpx;
  color: #9aa7a1;
}
.grid {
  display: flex;
  flex-wrap: wrap;
}
.cell {
  width: 14.28%;
  height: 92rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  border-radius: 18rpx;
}
.cell.empty {
  opacity: 0;
}
.d-num {
  font-size: 26rpx;
  color: #263330;
  font-weight: 500;
}
.cell.today .d-num {
  color: #06a96a;
  font-weight: 800;
}
.cell.sel {
  background: #0fc97a;
}
.cell.sel .d-num {
  color: #fff;
  font-weight: 800;
}
.dots {
  display: flex;
  gap: 4rpx;
  margin-top: 6rpx;
}
.dot {
  width: 6rpx;
  height: 6rpx;
  border-radius: 50%;
  background: #0fc97a;
}
.cell.sel .dot {
  background: rgba(255, 255, 255, 0.9);
}
.legend {
  display: flex;
  gap: 30rpx;
  justify-content: center;
  padding-top: 14rpx;
}
.lg {
  display: flex;
  align-items: center;
  gap: 6rpx;
}
.lg-dot {
  width: 12rpx;
  height: 12rpx;
  border-radius: 50%;
}
.lg-dot.harvest {
  background: #0fc97a;
}
.lg-dot.care {
  background: #4a8cff;
}
.lg-dot.fertilize {
  background: #ff8a3d;
}
.lg-txt {
  font-size: 19rpx;
  color: #9aa7a1;
}
.body {
  flex: 1;
  height: 0;
  padding: 20rpx 24rpx 0;
}
.day-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 16rpx;
}
.dh-title {
  font-size: 28rpx;
  font-weight: 700;
}
.dh-count {
  font-size: 21rpx;
  color: #9aa7a1;
}
.tasks {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
.task {
  padding: 22rpx;
  display: flex;
  align-items: center;
  gap: 18rpx;
}
.t-check {
  width: 40rpx;
  height: 40rpx;
  border-radius: 50%;
  border: 2rpx solid #d3ded9;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.t-check.on {
  background: #0fc97a;
  border-color: #0fc97a;
}
.t-title {
  font-size: 27rpx;
  font-weight: 600;
  margin-right: 10rpx;
}
.t-title.done {
  color: #b3bfba;
  text-decoration: line-through;
}
.t-type {
  font-size: 18rpx;
  padding: 2rpx 10rpx;
  border-radius: 6rpx;
}
.t-type.harvest {
  background: #e9faf2;
  color: #06a96a;
}
.t-type.care {
  background: #eaf3ff;
  color: #4a8cff;
}
.t-type.fertilize {
  background: #fff4e4;
  color: #ff8a3d;
}
.t-sub {
  display: block;
  font-size: 21rpx;
  color: #9aa7a1;
  margin-top: 8rpx;
}
.no-task {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60rpx 0;
}
.nt-emoji {
  font-size: 80rpx;
}
.nt-title {
  font-size: 26rpx;
  color: #3d4a45;
  font-weight: 600;
  margin-top: 16rpx;
}
.nt-sub {
  font-size: 21rpx;
  color: #9aa7a1;
  margin-top: 8rpx;
}
.nt-btn {
  margin-top: 24rpx;
  padding: 0 36rpx;
}
.section {
  margin-top: 34rpx;
}
.sec-title {
  font-size: 28rpx;
  font-weight: 700;
  display: block;
  margin-bottom: 16rpx;
}
.overview {
  display: flex;
  background: #fff;
  border-radius: 24rpx;
  padding: 24rpx 0;
}
.ov-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4rpx;
}
.ov-num {
  font-size: 32rpx;
  font-weight: 800;
  color: #0a8f5c;
}
.ov-label {
  font-size: 19rpx;
  color: #9aa7a1;
}
.plots {
  display: flex;
  flex-direction: column;
  gap: 14rpx;
}
.plot {
  display: flex;
  align-items: center;
  gap: 18rpx;
  padding: 20rpx;
}
.p-emoji {
  width: 80rpx;
  height: 80rpx;
  border-radius: 22rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40rpx;
}
.p-name {
  font-size: 26rpx;
  font-weight: 600;
}
.p-sub {
  display: block;
  font-size: 21rpx;
  color: #9aa7a1;
  margin-top: 6rpx;
}
.p-status {
  font-size: 21rpx;
  color: #06a96a;
  background: #e9faf2;
  padding: 6rpx 16rpx;
  border-radius: 30rpx;
}
.p-status.warn {
  color: #ff8a3d;
  background: #fff4e4;
}
</style>
