import { messagePipeline } from './core/MessagePipeline';
const UNIT_INFO = {
  "SHARI"  : {"spriteIndex": 0, "name":"シャリ", "moveType": "type0", "hp":30, "attack":8},
  "TORO"   : {"spriteIndex": 1, "name":"トロ"  , "moveType": "type1", "hp":40, "attack":12},
  "EGG"    : {"spriteIndex": 2, "name":"玉子"  , "moveType": "type2", "hp":50, "attack":10},
  "SHRIMP" : {"spriteIndex": 3, "name":"海老"  , "moveType": "type3", "hp":35, "attack":10},
  "IKURA"  : {"spriteIndex": 4, "name":"イクラ", "moveType": "type4", "hp":30, "attack":12}
}
const TEST = [
  {"isEnemy": false, "unitType": "SHRIMP", x: 1, y: 4},
  {"isEnemy": false, "unitType": "TORO",   x: 2, y: 4},
  {"isEnemy": false, "unitType": "EGG",    x: 3, y: 4},
  {"isEnemy": false, "unitType": "IKURA",  x: 4, y: 4},
  {"isEnemy": false, "unitType": "SHARI",  x: 1, y: 3},
  {"isEnemy": false, "unitType": "SHARI",  x: 2, y: 3},
  {"isEnemy": false, "unitType": "SHARI",  x: 3, y: 3},
  {"isEnemy": true,  "unitType": "IKURA",  x: 0, y: 0},
  {"isEnemy": true,  "unitType": "EGG",    x: 1, y: 0},
  {"isEnemy": true,  "unitType": "TORO",   x: 2, y: 0},
  {"isEnemy": true,  "unitType": "SHRIMP", x: 3, y: 0},
  {"isEnemy": true,  "unitType": "SHARI",  x: 1, y: 1},
  {"isEnemy": true,  "unitType": "SHARI",  x: 2, y: 1},
  {"isEnemy": true,  "unitType": "SHARI",  x: 3, y: 1}
];

const SushiMaster = cc.Class({
  extends: cc.Component,

  properties: {
    sushiUnitPrefab: cc.Prefab
  },

  statics: {
    instance: null,
  },

  // use this for initialization
  onLoad: function () {
    SushiMaster.instance = this;

    this._sushiUnits = [];
  },

  init() {
    this._sushiUnits = [];
    for (let i = 0; i < TEST.length; i++) {
      let instance = cc.instantiate(this.sushiUnitPrefab);
      instance.parent = this.node;

      let sushiUnit = instance.getComponent('Sushi');
      sushiUnit.init(TEST[i]);
      this._sushiUnits.push(sushiUnit);
    }
  },

  getUnit(x, y) {
    for (let i = 0; i < this._sushiUnits.length; i++) {
      if (this._sushiUnits[i].x === x && this._sushiUnits[i].y === y) {
        return this._sushiUnits[i];
      }
    }
    return null;
  },

  lostUnit(x, y, isEnemy) {
    for (let i = 0; i < this._sushiUnits.length; i++) {
      if (this._sushiUnits[i].x === x && this._sushiUnits[i].y === y && this._sushiUnits[i].isEnemy === isEnemy) {
        this._sushiUnits[i].node.destroy();
        this._sushiUnits.splice(i, 1);
        return;
      }
    }
  },

  // called every frame, uncomment this function to activate update callback
  update: function (dt) {
  },

  getUnitInfo(unitType) {
    return UNIT_INFO[unitType];
  },

  getEnemyUnits() {
    let units = [];
    for (let i = 0; i < this._sushiUnits.length; i++) {
      if (this._sushiUnits[i].isEnemy) {
        units.push(this._sushiUnits[i]);
      }
    }
    return units;
  }
});

export default SushiMaster;