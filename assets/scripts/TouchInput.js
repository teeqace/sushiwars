cc.Class({
  extends: cc.Component,

  properties: {
  },

  _onTouchBegan(event) {
    let location = event.getLocation()

    this.node.on(cc.Node.EventType.TOUCH_MOVE, this._onTouchMove, this)
    this._touched = true
  },

  _finishTouch(event) {
    if (!this._touched) {
      return
    }
    this.node.off(cc.Node.EventType.TOUCH_MOVE, this._onTouchMove, this)
    this._touched = false

    let location = event.getLocation()

  },

  _onTouchEnded(event) {
    this._finishTouch(event)
  },

  _onTouchCancel(event) {
    this._finishTouch(event)
  },

  _onTouchMove(event) {
    let location = event.getLocation()
  },

  // use this for initialization
  onLoad() {
    this._touched = false
    this._registerEvent()
  },

  onDestroy() {
    this._unregisterEvent()
  },

  _registerEvent() {
    this.node.on(cc.Node.EventType.TOUCH_START, this._onTouchBegan, this)
    this.node.on(cc.Node.EventType.TOUCH_END, this._onTouchEnded, this)
    this.node.on(cc.Node.EventType.TOUCH_CANCEL, this._onTouchCancel, this)
  },

  _unregisterEvent() {
    this.node.off(cc.Node.EventType.TOUCH_START, this._onTouchBegan, this)
    this.node.off(cc.Node.EventType.TOUCH_END, this._onTouchEnded, this)
    this.node.off(cc.Node.EventType.TOUCH_CANCEL, this._onTouchCancel, this)
  }

})