<template>
  <view class="login">
    <view class="bg-deco d1" />
    <view class="bg-deco d2" />

    <nav-bar :back="false" :transparent="true" />

    <view class="head">
      <view class="logo">
        <text class="logo-emoji">🌱</text>
      </view>
      <text class="h1">欢迎回来</text>
      <text class="h2">登录后查看订单、农事记录与专属优惠</text>
    </view>

    <view class="form">
      <view class="field">
        <text class="prefix">+86</text>
        <input
          v-model="phone"
          class="input"
          type="number"
          maxlength="11"
          placeholder="请输入手机号"
          placeholder-class="ph"
        />
        <view v-if="phone" class="clear" @tap="phone = ''">
          <icon-svg name="close" :size="26" color="#B8C4BF" />
        </view>
      </view>

      <view class="field">
        <icon-svg name="checkCircle" :size="32" color="#9AA7A1" />
        <input
          v-model="code"
          class="input"
          type="number"
          maxlength="6"
          placeholder="请输入验证码"
          placeholder-class="ph"
        />
        <view
          class="code-btn"
          :class="{ disabled: countdown > 0 }"
          @tap="sendCode"
        >
          {{ countdown > 0 ? countdown + 's 后重发' : '获取验证码' }}
        </view>
      </view>

      <view class="agree" @tap="agreed = !agreed">
        <view class="check" :class="{ on: agreed }">
          <icon-svg v-if="agreed" name="check" :size="20" color="#FFFFFF" :stroke="3" />
        </view>
        <text class="agree-txt">
          我已阅读并同意
          <text class="link">《用户协议》</text>
          和
          <text class="link">《隐私政策》</text>
        </text>
      </view>

      <view class="btn btn-primary" :class="{ 'btn-disabled': !canSubmit }" @tap="submit">
        {{ isRegister ? '注册并登录' : '登 录' }}
      </view>

      <view class="switch-mode" @tap="isRegister = !isRegister">
        {{ isRegister ? '已有账号？直接登录' : '新用户？一键注册' }}
      </view>
    </view>

    <view class="other">
      <view class="line" />
      <text class="other-txt">其他登录方式</text>
      <view class="line" />
    </view>

    <view class="socials">
      <view class="social" @tap="thirdParty('微信')">
        <text class="social-emoji">💬</text>
      </view>
      <view class="social" @tap="thirdParty('Apple')">
        <text class="social-emoji">🍎</text>
      </view>
      <view class="social" @tap="thirdParty('游客')">
        <icon-svg name="user" :size="34" color="#3D4A45" />
      </view>
    </view>

    <view class="footer">
      <text class="footer-txt">登录即代表你同意我们为你提供农产品配送服务</text>
    </view>
  </view>
</template>

<script setup>
import { computed, ref } from 'vue'
import { login } from '@/store/index.js'
import { toast } from '@/common/utils.js'

const phone = ref('13812346620')
const code = ref('')
const agreed = ref(false)
const isRegister = ref(false)
const countdown = ref(0)
let timer = null

const canSubmit = computed(() => phone.value.length === 11 && code.value.length >= 4 && agreed.value)

function sendCode() {
  if (countdown.value > 0) return
  if (phone.value.length !== 11) return toast('请输入正确的手机号')
  countdown.value = 60
  timer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) clearInterval(timer)
  }, 1000)
  toast('验证码已发送：1234')
  setTimeout(() => {
    code.value = '1234'
  }, 700)
}

function submit() {
  if (!canSubmit.value) {
    if (phone.value.length !== 11) return toast('请输入正确的手机号')
    if (code.value.length < 4) return toast('请输入验证码')
    return toast('请先同意用户协议')
  }
  uni.showLoading({ title: '登录中', mask: true })
  setTimeout(() => {
    uni.hideLoading()
    login(phone.value)
    toast('登录成功')
    setTimeout(() => uni.switchTab({ url: '/pages/tabbar/home/home' }), 500)
  }, 600)
}

function thirdParty(name) {
  uni.showLoading({ title: '授权中' })
  setTimeout(() => {
    uni.hideLoading()
    login('13812346620')
    toast(name === '游客' ? '已进入游客模式' : `${name}授权成功`)
    setTimeout(() => uni.switchTab({ url: '/pages/tabbar/home/home' }), 500)
  }, 700)
}
</script>

<style scoped>
.login {
  min-height: 100vh;
  background: #fff;
  position: relative;
  overflow: hidden;
  padding: 0 56rpx;
  display: flex;
  flex-direction: column;
}
.bg-deco {
  position: absolute;
  border-radius: 50%;
  filter: blur(50rpx);
  opacity: 0.5;
}
.d1 {
  width: 460rpx;
  height: 460rpx;
  background: #c9f2dd;
  top: -160rpx;
  right: -140rpx;
}
.d2 {
  width: 380rpx;
  height: 380rpx;
  background: #e2f7ea;
  top: 300rpx;
  left: -180rpx;
}
.head {
  padding: 40rpx 0 50rpx;
  position: relative;
  z-index: 2;
}
.logo {
  width: 112rpx;
  height: 112rpx;
  border-radius: 32rpx;
  background: linear-gradient(140deg, #17d488, #06a96a);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 14rpx 30rpx rgba(10, 172, 106, 0.28);
  margin-bottom: 36rpx;
}
.logo-emoji {
  font-size: 60rpx;
}
.h1 {
  display: block;
  font-size: 52rpx;
  font-weight: 800;
  color: #14201b;
  letter-spacing: -1rpx;
}
.h2 {
  display: block;
  margin-top: 16rpx;
  font-size: 25rpx;
  color: #8b9791;
  line-height: 1.6;
}
.form {
  position: relative;
  z-index: 2;
}
.field {
  height: 100rpx;
  background: #f5f8f6;
  border-radius: 26rpx;
  display: flex;
  align-items: center;
  padding: 0 28rpx;
  margin-bottom: 22rpx;
  border: 2rpx solid transparent;
}
.field:focus-within {
  border-color: #0fc97a;
  background: #fff;
}
.prefix {
  font-size: 28rpx;
  color: #3d4a45;
  font-weight: 600;
  margin-right: 22rpx;
  padding-right: 22rpx;
  border-right: 2rpx solid #e3ebe7;
}
.input {
  flex: 1;
  font-size: 30rpx;
  color: #16201c;
  height: 100rpx;
}
.ph {
  color: #b3bfba;
  font-size: 28rpx;
}
.clear {
  padding: 10rpx;
}
.code-btn {
  font-size: 25rpx;
  color: #06a96a;
  font-weight: 600;
  padding-left: 20rpx;
}
.code-btn.disabled {
  color: #b3bfba;
  font-weight: 400;
}
.agree {
  display: flex;
  align-items: flex-start;
  margin: 30rpx 4rpx 40rpx;
}
.check {
  width: 34rpx;
  height: 34rpx;
  border-radius: 10rpx;
  border: 2rpx solid #d3ded9;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 14rpx;
  margin-top: 4rpx;
  flex-shrink: 0;
}
.check.on {
  background: #0fc97a;
  border-color: #0fc97a;
}
.agree-txt {
  font-size: 22rpx;
  color: #8b9791;
  line-height: 1.6;
}
.link {
  color: #06a96a;
}
.switch-mode {
  text-align: center;
  margin-top: 32rpx;
  font-size: 25rpx;
  color: #7c8a84;
}
.other {
  display: flex;
  align-items: center;
  gap: 24rpx;
  margin-top: 80rpx;
  position: relative;
  z-index: 2;
}
.line {
  flex: 1;
  height: 2rpx;
  background: #eef2f0;
}
.other-txt {
  font-size: 22rpx;
  color: #b3bfba;
}
.socials {
  display: flex;
  justify-content: center;
  gap: 44rpx;
  margin-top: 44rpx;
}
.social {
  width: 96rpx;
  height: 96rpx;
  border-radius: 50%;
  background: #f5f8f6;
  display: flex;
  align-items: center;
  justify-content: center;
}
.social:active {
  background: #e9f1ed;
}
.social-emoji {
  font-size: 42rpx;
}
.footer {
  margin-top: auto;
  padding-bottom: 60rpx;
  text-align: center;
}
.footer-txt {
  font-size: 20rpx;
  color: #c3ccc8;
}
</style>
