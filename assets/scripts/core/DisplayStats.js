cc.Class({
  extends: cc.Component,

  properties: {
    displayStats: true
  },

  // use this for initialization
  onLoad: function () {
    cc.director.setDisplayStats(this.displayStats)
  }
})
