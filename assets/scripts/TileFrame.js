const COLORS = {
  'WHITE': '#ffffff',
  'SELECT': '#ffff00',
  'MOVERANGE': '#00ff00',
  'MOVERANGEENEMY': '#ff0000',
  'MOVERANGENG': '#7f7f7f'
};

cc.Class({
  extends: cc.Component,

  properties: {
  },

  // use this for initialization
  onLoad: function () {
  },

  reuse(param) {
    this.type = param.type;
    this.node.color = cc.hexToColor(COLORS[this.type]);
  },

  setPool(pool) {
    this._pool = pool;
  },
  
  _backToPool(){
    if (this._pool) {
      this._pool.put(this.node);
    }
  }
  // called every frame, uncomment this function to activate update callback
  // update: function (dt) {

  // },
});
