<script>
export default {
  onLaunch() {
    // 应用启动：初始化本地缓存数据
    const sys = uni.getSystemInfoSync()
    uni.setStorageSync('sys_info', {
      statusBarHeight: sys.statusBarHeight || 0,
      safeBottom: (sys.safeAreaInsets && sys.safeAreaInsets.bottom) || 0,
      windowWidth: sys.windowWidth || 375
    })
    const seen = uni.getStorageSync('nh_onboarded')
    // 首次启动/已登录的跳转逻辑统一交给启动页处理
    void seen
  },
  onShow() {},
  onHide() {}
}
</script>

<style lang="scss">
/* ============ 设计变量 ============ */
page {
  --brand: #0fc97a;
  --brand-deep: #06a96a;
  --brand-soft: #e9faf2;
  --ink: #16201c;
  --ink-2: #3d4a45;
  --sub: #7c8a84;
  --line: #edf1ef;
  --bg: #f4f8f5;
  --price: #ff4b3a;
  --warn: #ff8a3d;
  background-color: #f4f8f5;
  color: #16201c;
  font-family: -apple-system, BlinkMacSystemFont, 'PingFang SC', 'Helvetica Neue',
    'Microsoft YaHei', sans-serif;
  font-size: 28rpx;
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
}

view,
text,
scroll-view,
image,
input,
textarea,
button {
  box-sizing: border-box;
}

/* ============ 基础布局 ============ */
.page {
  min-height: 100vh;
  background: var(--bg);
}
.page-white {
  min-height: 100vh;
  background: #fff;
}
.pad {
  padding: 0 28rpx;
}
.row {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.col {
  display: flex;
  flex-direction: column;
}
.between {
  justify-content: space-between;
}
.center {
  align-items: center;
  justify-content: center;
}
.flex1 {
  flex: 1;
  min-width: 0;
}
.wrap {
  flex-wrap: wrap;
}

/* ============ 文字 ============ */
.t-h1 {
  font-size: 40rpx;
  font-weight: 700;
  letter-spacing: -0.5rpx;
}
.t-h2 {
  font-size: 32rpx;
  font-weight: 700;
}
.t-h3 {
  font-size: 28rpx;
  font-weight: 600;
}
.t-body {
  font-size: 26rpx;
  color: var(--ink-2);
}
.t-sub {
  font-size: 24rpx;
  color: var(--sub);
}
.t-mini {
  font-size: 21rpx;
  color: var(--sub);
}
.t-brand {
  color: var(--brand-deep);
}
.ellipsis {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.ellipsis-2 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

/* ============ 卡片 ============ */
.card {
  background: #fff;
  border-radius: 28rpx;
  box-shadow: 0 8rpx 30rpx rgba(22, 60, 45, 0.05);
}
.card-flat {
  background: #fff;
  border-radius: 28rpx;
}

/* ============ 按钮 ============ */
.btn {
  height: 92rpx;
  border-radius: 92rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30rpx;
  font-weight: 600;
  transition: opacity 0.15s;
}
.btn:active {
  opacity: 0.86;
}
.btn-primary {
  background: linear-gradient(135deg, #16d488 0%, #0bbd72 100%);
  color: #fff;
  box-shadow: 0 12rpx 28rpx rgba(13, 190, 115, 0.28);
}
.btn-ghost {
  background: var(--brand-soft);
  color: var(--brand-deep);
}
.btn-line {
  border: 2rpx solid var(--line);
  color: var(--ink-2);
  background: #fff;
}
.btn-sm {
  height: 60rpx;
  padding: 0 26rpx;
  border-radius: 60rpx;
  font-size: 24rpx;
  font-weight: 500;
}
.btn-disabled {
  background: #d9e3de !important;
  color: #fff !important;
  box-shadow: none !important;
}

/* ============ 其他 ============ */
.divider {
  height: 2rpx;
  background: var(--line);
}
.tag {
  padding: 4rpx 12rpx;
  border-radius: 8rpx;
  font-size: 20rpx;
  background: var(--brand-soft);
  color: var(--brand-deep);
}
.price {
  color: var(--price);
  font-weight: 700;
}
.price .sym {
  font-size: 22rpx;
}
.price .num {
  font-size: 34rpx;
}
.safe-bottom {
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
}
.no-scrollbar::-webkit-scrollbar {
  display: none;
  width: 0;
  height: 0;
}
</style>
