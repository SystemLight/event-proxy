function MiddlewareNode(callback) {
  this.nextNode = null
  this.callback = callback
}

MiddlewareNode.prototype.next = function (e, proxyThis) {
  if (!proxyThis) {
    proxyThis = this
  }
  if (this.callback) {
    if (this.nextNode) {
      this.callback.call(proxyThis, e, () => this.nextNode.next(e))
    } else {
      this.callback.call(proxyThis, e)
    }
  }
}

/**
 * 事件代理对象
 * @param eventName - DOM事件
 * @param proxySelector - 代理事件的DOM节点选择器，不填或者null默认事件绑定到body
 * @param targetSelector - 触发事件的DOM节点的选择器
 * @constructor
 */
function EventProxy(eventName, proxySelector, targetSelector) {
  if (!targetSelector) {
    targetSelector = proxySelector
    proxySelector = null
  }

  this.eventName = eventName
  this.proxySelector = proxySelector
  this.targetSelector = targetSelector

  this.headNode = new MiddlewareNode()
  this._nextNode = this.headNode

  let that = this
  this._callback = function (e) {
    let triggerDom = e.target
    while (triggerDom !== this) {
      if (triggerDom.matches(that.targetSelector)) {
        e.proxyDom = this
        e.triggerDom = triggerDom
        that.headNode.next(e, that)
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
  this.off()
  this.use(function (e, next) {
    callback(e)
    next()
  })
  this._dom.addEventListener(this.eventName, this._callback, true)
  return this
}

/**
 * 该事件函数触发完一次后自动销毁
 * @param callback
 */
EventProxy.prototype.one = function (callback) {
  this.on(callback)
  this.use(() => this.off())
}

/**
 * 结束监听事件
 */
EventProxy.prototype.off = function () {
  this._dom.removeEventListener(this.eventName, this._callback, true)
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

/**
 *
 * @param {string} eventName
 * @param {String?} proxySelector
 * @param {String?} targetSelector
 * @return {EventProxy}
 */
const $e = function (eventName, proxySelector, targetSelector) {
  return new EventProxy(eventName, proxySelector, targetSelector)
}

$e.removeActiveMiddleware = function (e, next) {
  document.querySelectorAll(this.targetSelector).forEach((el) => {
    el.classList.remove('active')
  })
  next()
}

/**
 * 节流中间件
 * @param delay
 * @return {callback}
 */
$e.throttleMiddleware = function (delay = 500) {
  let flags = true
  return function (e, next) {
    if (flags) {
      flags = false
      setTimeout(function () {
        flags = true
        next(e)
      }, delay)
    }
  }
}

/**
 * 防抖中间件
 * @param delay
 * @return {callback}
 */
$e.debounceMiddleware = function (delay = 500) {
  let timer = null
  return function (e, next) {
    clearTimeout(timer)
    timer = setTimeout(function () {
      next(e)
    }, delay)
  }
}

export default $e
