import { messagePipeline } from './core/MessagePipeline';
import GameMaster from './GameMaster';

const BattleMaster = cc.Class({
  extends: cc.Component,

  properties: {
    playerName: cc.Label,
    enemyName: cc.Label,
    playerStats: cc.Label,
    enemyStats: cc.Label,
    playerSprite: cc.Sprite,
    enemySprite: cc.Sprite,
    firstIcon: cc.Node,
    secondIcon: cc.Node,
    playerDamage: cc.Label,
    enemyDamage: cc.Label
  },
  
  statics: {
    instance: null,
  },

  // use this for initialization
  onLoad: function () {
    BattleMaster.instance = this;
    this.node.setScale(0);

    this.actionAttack = cc.sequence(cc.scaleTo(0.25, 1.2), cc.scaleTo(0.25, 1.0));
    this.actionDamage = cc.blink(0.25, 2);
    this.actionDamageLabel = cc.sequence(cc.spawn(cc.scaleTo(0, 1), cc.moveTo(0, 0, 0)), cc.moveTo(1, 0, 20), cc.scaleTo(0, 0));

    this.damageForEnemy = 0;
    this.damageForPlayer = 0;

    this.anim = this.node.getComponent(cc.Animation);
    this.anim.on('finished', this.animTurnEnd, this);

    this._playerUnit = null;
    this._enemyUnit = null;
    this._playerFirst = false;
  },

  battleStart(playerFirst) {
    this.node.setScale(1);
    let playerUnit = GameMaster.instance.getPlayerUnit();
    let enemyUnit = GameMaster.instance.getEnemyUnit();
    if (playerFirst) {
      this.firstIcon.x = 200;
      this.secondIcon.x = -200;
    } else {
      this.firstIcon.x = -200;
      this.secondIcon.x = 200;
    }
    this.playerSprite.spriteFrame = playerUnit.sushiSprite.spriteFrame;
    this.enemySprite.spriteFrame = enemyUnit.sushiSprite.spriteFrame;
    this.playerSprite.node.scaleY = 1;
    this.enemySprite.node.scaleY = 1;

    this.playerName.string = playerUnit.name;
    this.enemyName.string = enemyUnit.name;
    this.playerStats.string = `体:${playerUnit.hp}\n攻:${playerUnit.attack}`;
    this.enemyStats.string = `体:${enemyUnit.hp}\n攻:${enemyUnit.attack}`;

    this.damageForEnemy = playerUnit.attack;
    this.damageForPlayer = enemyUnit.attack;
    if (playerFirst) {
      this.damageForEnemy = Math.floor(this.damageForEnemy * 1.5);
    } else {
      this.damageForPlayer = Math.floor(this.damageForPlayer * 1.5);
    }
    this.enemyDamage.string = `-${this.damageForEnemy}`;
    this.playerDamage.string  = `-${this.damageForPlayer}`;
    this.enemyDamage.node.setScale(0);
    this.playerDamage.node.setScale(0);

    this._playerUnit = playerUnit;
    this._enemyUnit = enemyUnit;

    this._playerFirst = playerFirst;
    this._enemyDie = false;
    this._playerDie = false;

    this.anim.play('BattleStart');
  },

  $damageToEnemy() {
    this._enemyUnit.hp = Math.max(0, this._enemyUnit.hp - this.damageForEnemy);
    this.enemyStats.string = `体:${this._enemyUnit.hp}\n攻:${this._enemyUnit.attack}`;
    if (this._enemyUnit.hp <= 0) {
      this._enemyDie = true;
      this.enemySprite.node.scaleY = 0;
    }
  },

  $damageToPlayer() {
    this._playerUnit.hp = Math.max(0, this._playerUnit.hp - this.damageForPlayer);
    this.playerStats.string = `体:${this._playerUnit.hp}\n攻:${this._playerUnit.attack}`;
    if (this._playerUnit.hp <= 0) {
      this._playerDie = true;
      this.playerSprite.node.scaleY = 0;
    }
  },

  animTurnEnd(event) {
    if (event.detail.name === 'BattleStart' && this._playerFirst) {
      this.anim.play('PlayerAttack');
    } else if (event.detail.name === 'BattleStart' && !this._playerFirst) {
      this.anim.play('EnemyAttack');
    } else if (event.detail.name === 'PlayerAttack' && !this._enemyDie && this._playerFirst) {
      this.anim.play('EnemyAttack');
    } else if (event.detail.name === 'EnemyAttack' && !this._playerDie && !this._playerFirst) {
      this.anim.play('PlayerAttack');
    } else if (event.detail.name === 'BattleEnd') {
      this.node.setScale(0);
      // GameMaster.instance.setMode('playerTurn');
      messagePipeline.sendMessage('onBattleEnd', {
        enemyDie: this._enemyDie,
        playerDie: this._playerDie,
        playerFirst: this._playerFirst
      });
    } else {
      // battle end
      this.anim.play('BattleEnd');
    }
  }
  // called every frame, uncomment this function to activate update callback
  // update: function (dt) {

  // },
});

export default BattleMaster;