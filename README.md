# event-proxy

> Event agent processing library.

### Usage

```javascript
eventProxy('click', '.selector').on(function (e) {
    console.log('事件触发')
})

eventProxy('click', '.parent', '.selector').on(function (e) {
    console.log('事件代理')
})

eventProxy('click', '.parent', '.selector').use(function (e, next) {
    console.log('before middleware')
    next()
}).on(function (e) {
    console.log('中间件')
}).use(function (e, next) {
    console.log('after middleware')
    // 触发一次后关闭
    this.off()
    next()
})

eventProxy('click', '.parent', '.selector').one(function (e) {
    console.log('只触发一次事件')
})
```
