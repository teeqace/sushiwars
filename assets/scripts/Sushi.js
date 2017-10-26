import { messagePipeline } from './core/MessagePipeline';
import FieldGrid from './FieldGrid';
import GameMaster from './GameMaster';
import FrameMaster from './FrameMaster';
import SushiMaster from './SushiMaster';

const MOVE_TYPE = {
  'type0': [
    [0,-1]
  ],
  'type1': [
    [-1,-1],[0,-1],[1,-1],[-1,0],[1,0],[-1,1],[0,1],[1,1]
  ],
  'type2': [
    [-1,-2],[1,-2],[-2,-1],[2,-1],[-2,1],[2,1],[-1,2],[1,2]
  ],
  'type3': [
    'up','left','right','down'
  ],
  'type4': [
    'upleft','upright','downleft','downright'
  ]
}

cc.Class({
  extends: cc.Component,

  properties: {
    isEnemy: false,
    sushiSprite: cc.Sprite,
    sunglass: cc.Node,
    sushiSprites: {
      default: [],
      type: [cc.SpriteFrame]
    }
  },

  // use this for initialization
  onLoad: function () {
    this.x = -1;
    this.y = -1;
    this.beforeX = -1;
    this.beforeY = -1;
  },

  // called every frame, uncomment this function to activate update callback
  // update: function (dt) {
  // },

  init(data) {

    this.isEnemy = data.isEnemy;
    this.unitType = data.unitType;
    this.x = data.x;
    this.y = data.y;
    this.beforeX = data.x;
    this.beforeY = data.y;

    let unitInfo = SushiMaster.instance.getUnitInfo(this.unitType);
    this.moveType = MOVE_TYPE[unitInfo.moveType];
    this.name = unitInfo.name;
    this.hp = unitInfo.hp;
    this.attack = unitInfo.attack;

    this.sunglass.active = this.isEnemy;
    this.sushiSprite.spriteFrame = this.sushiSprites[unitInfo.spriteIndex];
    if (this.isEnemy) {
      this.node.scaleX = -1;
    }
    FieldGrid.instance.setNodeOnGrid(this.node, this.x, this.y);
  },

  move(x, y) {
    this.beforeX = this.x;
    this.beforeY = this.y;
    this.x = x;
    this.y = y;
    GameMaster.instance.setMode('UnitMoving');

    let actionMove = cc.moveTo(0.5, FieldGrid.instance.getTilePosition(x, y));
    let actionScale1 = cc.scaleTo(0.25, 1.5);
    let actionScale2 = cc.scaleTo(0.25, 1);
    let afterAction = cc.callFunc(() => {
      // GameMaster.instance.setMoveSelectUnit(null);
      // GameMaster.instance.setMode('playerTurn');
      messagePipeline.sendMessage('onSushiMoveEnd', !this.isEnemy);
    }, this);
    let action = cc.spawn(actionMove, cc.sequence(actionScale1, actionScale2));
    this.node.runAction(cc.sequence(action, afterAction));
    // FieldGrid.instance.setNodeOnGrid(this.node, this.x, this.y);
  },

  moveBack() {
    this.x = this.beforeX;
    this.y = this.beforeY;
    GameMaster.instance.setMode('UnitMoving');

    let actionMove = cc.moveTo(0.5, FieldGrid.instance.getTilePosition(this.x, this.y));
    let actionScale1 = cc.scaleTo(0.25, 1.5);
    let actionScale2 = cc.scaleTo(0.25, 1);
    let afterAction = cc.callFunc(() => {
      // GameMaster.instance.setMoveSelectUnit(null);
      // GameMaster.instance.setMode('playerTurn');
      GameMaster.instance.setPlayerUnit(null);
      GameMaster.instance.setEnemyUnit(null);
      messagePipeline.sendMessage('onSushiMoveEnd', !this.isEnemy);
    }, this);
    let action = cc.spawn(actionMove, cc.sequence(actionScale1, actionScale2));
    this.node.runAction(cc.sequence(action, afterAction));
    // FieldGrid.instance.setNodeOnGrid(this.node, this.x, this.y);
  }
});