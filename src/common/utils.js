export function money(n) {
  const v = Number(n || 0)
  return v.toFixed(2).replace(/\.00$/, '').replace(/(\.\d)0$/, '$1')
}

export function maskPhone(p) {
  if (!p) return ''
  return String(p).replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
}

export function todayStr() {
  const d = new Date()
  const p = (n) => (n < 10 ? '0' + n : '' + n)
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`
}

export function nowHM() {
  const d = new Date()
  const p = (n) => (n < 10 ? '0' + n : '' + n)
  return `${p(d.getHours())}:${p(d.getMinutes())}`
}

export function toast(title, icon = 'none') {
  uni.showToast({ title, icon, duration: 1600 })
}

export function go(url) {
  uni.navigateTo({ url })
}

export function tab(url) {
  uni.switchTab({ url })
}

export function back() {
  const pages = getCurrentPages()
  if (pages.length > 1) uni.navigateBack()
  else uni.switchTab({ url: '/pages/tabbar/home/home' })
}

export function statusText(s) {
  return (
    {
      unpaid: '待付款',
      unshipped: '待发货',
      shipping: '待收货',
      unreceipted: '待收货',
      done: '已完成',
      refund: '退款/售后'
    }[s] || '进行中'
  )
}

export function copyText(t) {
  uni.setClipboardData({ data: String(t), success: () => toast('已复制') })
}
