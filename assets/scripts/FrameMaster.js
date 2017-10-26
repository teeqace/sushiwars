import PrefabNodePool from './core/PrefabNodePool';
import FieldGrid from './FieldGrid';
import SushiMaster from './SushiMaster';

const MOVERANGE_VEC = {
  'up'       :[0,-1],
  'left'     :[-1,0],
  'right'    :[1,0],
  'down'     :[0,1],
  'upleft'   :[-1,-1],
  'upright'  :[1,-1],
  'downleft' :[-1,1],
  'downright':[1,1]
};

const FrameMaster = cc.Class({
  extends: cc.Component,

  properties: {
    framePrefab: cc.Prefab
  },
  
  statics: {
    instance: null,
  },

  // use this for initialization
  onLoad: function () {
    FrameMaster.instance = this;
    this.framePool = new PrefabNodePool(this.framePrefab, 20, 10, 'TileFrame');
    this._moveRange = [];
    this._moveRangeTiles = {};
  },

  // called every frame, uncomment this function to activate update callback
  // update: function (dt) {

  // },
  clear() {
    // NG
    // this.node.children.forEach(function(frame) {
    //   this.framePool.put(frame);
    // }, this);
    
    // NG
    // let frames = this.node.children;
    // let len = frames.length;
    // for (let i = 0; i < len; i++) {
    //   this.framePool.put(frames[i]);
    // }
    while (this.node.children.length > 0) {
      this.framePool.put(this.node.children[0]);
    }
  },

  putFrame(type, x, y) {
    let frame = this.framePool.get({
      type: type
    });
    frame.parent = this.node;
    FieldGrid.instance.setNodeOnGrid(frame, x, y);
    let key = `x${x}y${y}`;
    this._moveRange.push(key);
    this._moveRangeTiles[key] = frame.getComponent('TileFrame');
  },

  setMoveRange(x, y, moveType, isEnemy) {
    this._moveRange = [];
    this._moveRangeTiles = {};
    for (let i = 0; i < moveType.length; i++) {
      let moveVec = MOVERANGE_VEC[moveType[i]];
      if (moveVec) {
        let hitEnemy = false;
        for (let j = 1; j < 5; j++) {
          let newXY = this._getNewXY(x, y, moveVec[0] * j, moveVec[1] * j, isEnemy);
          if (newXY === null) {
            break;
          }
          let type = this._getMoveToType(newXY, isEnemy);
          if (hitEnemy) {
            type = 'MOVERANGENG';
          }
          this.putFrame(type, newXY[0], newXY[1]);
          if (!hitEnemy && type === 'MOVERANGEENEMY') {
            hitEnemy = true;
          }
        }
      } else {
        let newXY = this._getNewXY(x, y, moveType[i][0], moveType[i][1], isEnemy);
        if (newXY === null) {
          continue;
        }
        let type = this._getMoveToType(newXY, isEnemy);
        this.putFrame(type, newXY[0], newXY[1]);
      }
    }
  },

  _getNewXY(x, y, moveX, moveY, isEnemy) {
    let newX = x + moveX;
    let newY = 0;
    if (isEnemy) {
      newY = y - moveY;
    } else {
      newY = y + moveY;
    }
    if (newX < 0 || newX >= 5 ||
        newY < 0 || newY >= 5) {
      return null;
    }
    return [newX, newY];
  },

  _getMoveToType(newXY, isEnemy) {
    let type = 'MOVERANGE';
    let sushiUnit = SushiMaster.instance.getUnit(newXY[0], newXY[1]);
    if (sushiUnit) {
      if (isEnemy && sushiUnit.isEnemy || !isEnemy && !sushiUnit.isEnemy) {
        type = 'MOVERANGENG';
      } else {
        type = 'MOVERANGEENEMY';
      }
    }
    return type;
  },

  isMoveRange(x, y) {
    let key = `x${x}y${y}`;
    return this._moveRange.indexOf(key) >= 0;
  },
  
  isMovable(x, y) {
    let key = `x${x}y${y}`;
    let tile = this._moveRangeTiles[key];
    if (tile) {
      return tile.type !== 'MOVERANGENG';
    } else {
      return false;
    }
  }
});

export default FrameMaster;