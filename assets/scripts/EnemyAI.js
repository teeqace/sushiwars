import SushiMaster from './SushiMaster';

cc.Class({
  extends: cc.Component,

  properties: {
  },

  // use this for initialization
  onLoad: function () {
  },

  enemyTurn() {
    let enemyUnits = SushiMaster.instance.getEnemyUnits();

    let moveUnit = this._pickupUnit();
    
  },

  _pickupUnit() {

    // pick up movable units
    // if no, pass the turn

    // pick up attackable
    // if no, select most bottom unit

    // pick up who can win
    // if no, highest hp, strongest attack

    return null;
  },

  _moveToTile() {

    // pick up movable tiles

    // 

  }


  // called every frame, uncomment this function to activate update callback
  // update: function (dt) {

  // },

});
