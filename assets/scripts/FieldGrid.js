import { messagePipeline } from './core/MessagePipeline';
import GameMaster from './GameMaster';
import SushiMaster from './SushiMaster';
import FrameMaster from './FrameMaster';
import BattleMaster from './BattleMaster';
import StatsDisplay from './StatsDisplay';

const FieldGrid = cc.Class({
  extends: cc.Component,

  properties: {
    handNode: cc.Node,
    playerStats: StatsDisplay,
    enemyStats: StatsDisplay
  },
  
  statics: {
    instance: null
  },

  // use this for initialization
  onLoad: function () {
    FieldGrid.instance = this;

    this._tilesPosition = {};
    this.node.children.forEach(function(element) {
      this._tilesPosition[element.name] = element.position;
    }, this);

    this.playerStats.displayOff();
    this.enemyStats.displayOff();
    
    messagePipeline.on('onSushiMoveEnd', this._onSushiMoveEnd, this);
    messagePipeline.on('onBattleEnd', this._onBattleEnd, this);
    
  },

  setNodeOnGrid(node, x, y) {
    let key = `x${x}y${y}`
    node.position = this._tilesPosition[key];
  },

  getTilePosition(x, y) {
    let key = `x${x}y${y}`
    return this._tilesPosition[key];
  },
  
  tileSelect(x, y) {
    let mode = GameMaster.instance.getMode();
    if (mode === 'playerTurn') {
      let sushiUnit = SushiMaster.instance.getUnit(x, y);
      if (!sushiUnit) {
        return;
      }
      FrameMaster.instance.clear();
      FrameMaster.instance.putFrame('SELECT', x, y);
      if (!sushiUnit.isEnemy) {
        GameMaster.instance.setMode('playerSelectMove');
        GameMaster.instance.setPlayerUnit(sushiUnit);
        this.playerStats.displayOn(sushiUnit);
        this.enemyStats.displayOff();
      } else {
        GameMaster.instance.setMode('enemySelect');
        this.playerStats.displayOff();
        this.enemyStats.displayOn(sushiUnit);
      }
      FrameMaster.instance.setMoveRange(x, y, sushiUnit.moveType, sushiUnit.isEnemy);

    } else if (mode === 'enemySelect') {
      let sushiUnit = SushiMaster.instance.getUnit(x, y);
      if (sushiUnit && sushiUnit.isEnemy) {
        FrameMaster.instance.clear();
        FrameMaster.instance.putFrame('SELECT', x, y);
        GameMaster.instance.setMode('enemySelect');
        this.playerStats.displayOff();
        this.enemyStats.displayOn(sushiUnit);
        FrameMaster.instance.setMoveRange(x, y, sushiUnit.moveType, sushiUnit.isEnemy);        
      } else {
        GameMaster.instance.setMode('playerTurn');
        this.enemyStats.displayOff();
        FrameMaster.instance.clear();
      }

    } else if (mode === 'playerSelectMove') {
      let moveUnit = GameMaster.instance.getPlayerUnit();
      // tap self, and move mode will end
      // if enemy, move mode will end
      if (moveUnit.x === x && moveUnit.y === y
        || moveUnit.isEnemy) {
        GameMaster.instance.setPlayerUnit(null);
        GameMaster.instance.setMode('playerTurn');
        this.playerStats.displayOff();
        FrameMaster.instance.clear();
        return;
      }
      // out of movable range
      if (!FrameMaster.instance.isMoveRange(x, y)) {
        return;
      }
      if (!FrameMaster.instance.isMovable(x, y)) {
        return;
      }
      // other unit exists
      let sushiUnit = SushiMaster.instance.getUnit(x, y);
      if (sushiUnit) {
        if (!sushiUnit.isEnemy) {
          return;
        } else {
          this._isBattleStart = true;
          GameMaster.instance.setEnemyUnit(sushiUnit);
        }
      }
      this.handNode.parent = moveUnit.node;
      this.handNode.position = cc.p(0, 0);
      moveUnit.move(x, y);
      FrameMaster.instance.clear();
    }
    
  },

  _onSushiMoveEnd(event) {
    this.enemyStats.displayOff();
    this.playerStats.displayOff();
    if (!this._isBattleStart) {
      this._turnEnd();
      return;
    }
    let playerFirst = event.getUserData();
    BattleMaster.instance.battleStart(playerFirst);
  },

  _onBattleEnd(event) {
    this._isBattleStart = false;
    let battleResult = event.getUserData();
    if (!battleResult.enemyDie && !battleResult.playerDie) {
      if (battleResult.playerFirst) {
        let playerUnit = GameMaster.instance.getPlayerUnit();
        playerUnit.moveBack();
      } else {
        let enemyUnit = GameMaster.instance.getEnemyUnit();
        enemyUnit.moveBack();
      }
    } else if (battleResult.enemyDie) {
      let enemyUnit = GameMaster.instance.getEnemyUnit();
      SushiMaster.instance.lostUnit(enemyUnit.x, enemyUnit.y, true);
      this._turnEnd();
    } else if (battleResult.playerDie) {
      let playerUnit = GameMaster.instance.getPlayerUnit();
      SushiMaster.instance.lostUnit(playerUnit.x, playerUnit.y, false);
      this._turnEnd();
    }
  },

  _turnEnd() {
    this._releaseHand();

    GameMaster.instance.setMode('playerTurn');
    // GameMaster.instance.nextTurn();
  },
  
  _releaseHand() {
    this.handNode.parent = this.node.parent;
    this.handNode.position = cc.p(-1000, -1000);
  },

  // called every frame, uncomment this function to activate update callback
  // update: function (dt) {

  // },

});

export default FieldGrid;