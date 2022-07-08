function MiddlewareNode(callback) {
  this.nextNode = null
  this.callback = callback
}

MiddlewareNode.prototype.next = function (e) {
  if (this.callback) {
    if (this.nextNode) {
      this.callback(e, () => this.nextNode.next(e))
    } else {
      this.callback(e)
    }
  }
}

/**
 * 事件代理对象
 * @param event - DOM事件
 * @param proxySelector - 代理事件的DOM节点选择器，不填或者null默认事件绑定到body
 * @param targetSelector - 触发事件的DOM节点的选择器
 * @constructor
 */
function EventProxy(event, proxySelector, targetSelector) {
  if (!targetSelector) {
    targetSelector = proxySelector
    proxySelector = null
  }

  this._event = event

  this.headNode = new MiddlewareNode()
  this._nextNode = this.headNode

  let that = this
  this._callback = function (e) {
    let triggerDom = e.target
    while (triggerDom !== this) {
      if (triggerDom.matches(targetSelector)) {
        e.proxyDom = this
        e.triggerDom = triggerDom
        that.headNode.next(e)
      }
      triggerDom = triggerDom.parentElement
    }
  }

  if (proxySelector) {
    this._dom = document.querySelector(proxySelector)
  } else {
    this._dom = document.body
  }
}

/**
 * 事件中间件拦截处理，支持on之前或者之后注册
 * @param callback - 中间件拦截函数
 */
EventProxy.prototype.use = function (callback) {
  this._nextNode.callback = callback
  this._nextNode.nextNode = new MiddlewareNode()
  this._nextNode = this._nextNode.nextNode
  return this
}

/**
 * 开始监听事件
 * @param callback - 事件触发回调函数
 */
EventProxy.prototype.on = function (callback) {
  this.use(function (e, next) {
    callback(e)
    next()
  })
  this._dom.addEventListener(this._event, this._callback, true)
  return this
}

/**
 * 该事件函数触发完一次后自动销毁
 * @param callback
 */
EventProxy.prototype.one = function (callback) {
  this.on(callback)
  this.use(() => this.off())
  this._dom.addEventListener(this._event, this._callback)
}

/**
 * 结束监听事件
 */
EventProxy.prototype.off = function () {
  this._dom.removeEventListener(this._event, this._callback, true)
}

/**
 * 销毁对象释放内存
 */
EventProxy.prototype.destroy = function () {
  this.off()
  this.headNode = null
  this._nextNode = null
  this._callback = null
}

export default function $e(event, proxySelector, targetSelector) {
  return new EventProxy(event, proxySelector, targetSelector)
}
