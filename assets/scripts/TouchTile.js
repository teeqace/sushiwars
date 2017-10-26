import { messagePipeline } from './core/MessagePipeline';
import FieldGrid from './FieldGrid';

cc.Class({
  extends: cc.Component,

  properties: {
  },
  
  // use this for initialization
  onLoad() {
    let splitIndex = this.node.name.indexOf('y');
    this.x = Number(this.node.name.substring(1, splitIndex));
    this.y = Number(this.node.name.slice(splitIndex + 1));
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
  },

  // events
  _onTouchBegan(event) {
    FieldGrid.instance.tileSelect(this.x, this.y);
    this.node.on(cc.Node.EventType.TOUCH_MOVE, this._onTouchMove, this)
  },

  _finishTouch(event) {
    if (!this._touched) {
      return
    }
    this.node.off(cc.Node.EventType.TOUCH_MOVE, this._onTouchMove, this)
  },

  _onTouchEnded(event) {
    this._finishTouch(event)
  },

  _onTouchCancel(event) {
    this._finishTouch(event)
  },

  _onTouchMove(event) {
  }

})