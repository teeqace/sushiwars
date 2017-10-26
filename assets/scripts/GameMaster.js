import SushiMaster from './SushiMaster';

const GameMaster = cc.Class({
  extends: cc.Component,

  properties: {
    // foo: {
    //    default: null,      // The default value will be used only when the component attaching
    //                           to a node for the first time
    //    url: cc.Texture2D,  // optional, default is typeof default
    //    serializable: true, // optional, default is true
    //    visible: true,      // optional, default is true
    //    displayName: 'Foo', // optional
    //    readonly: false,    // optional, default is false
    // },
    // ...
  },

  statics: {
    instance: null,
  },

  // use this for initialization
  onLoad: function () {
    GameMaster.instance = this;
    this._gamestart = false;
    this._mode = '';
    this._moveSelectUnit = null;
    this._battleEnemyUnit = null;
    this._playerTurn = true;
  },

  getMode() {
    return this._mode;
  },

  setMode(mode) {
    this._mode = mode;
  },

  getPlayerUnit() {
    return this._moveSelectUnit;
  },

  setPlayerUnit(moveSelectUnit) {
    this._moveSelectUnit = moveSelectUnit;
  },
  
  getEnemyUnit() {
    return this._battleEnemyUnit;
  },

  setEnemyUnit(battleEnemyUnit) {
    this._battleEnemyUnit = battleEnemyUnit;
  },

  isPlayerTurn() {
    return this._playerTurn;
  },

  nextTurn() {
    this._playerTurn = !this._playerTurn;

    if (this._playerTurn) {
      this.setMode('playerTurn');
    } else {
      this.setMode('enemyTurn');
    }
  },

  // called every frame, uncomment this function to activate update callback
  update: function (dt) {
    if (!this._gamestart) {
      SushiMaster.instance.init();
      this._gamestart = true;
      this._mode = 'playerTurn';
    }
  },
});

export default GameMaster;