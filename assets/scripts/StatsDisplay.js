cc.Class({
  extends: cc.Component,

  properties: {
    statsLabel: cc.Label,
    unitSprite: cc.Sprite
  },

  // use this for initialization
  onLoad: function () {
  },

  displayOn(unit) {
    this.node.scaleY = 1;
    this.statsLabel.string = `${unit.name}\n体:${unit.hp}\n攻:${unit.attack}`;
    this.unitSprite.spriteFrame = unit.sushiSprite.spriteFrame;
  },

  displayOff() {
    this.node.scaleY = 0;
  }
  // called every frame, uncomment this function to activate update callback
  // update: function (dt) {

  // },
});
