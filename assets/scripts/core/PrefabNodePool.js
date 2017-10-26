export default class PrefabNodePool extends cc.NodePool{
  constructor(prefab, capacity, increase, handler){
    super(handler);
    this._handler = handler;
    this._prefab = prefab;
    this._capacity = capacity;
    this._increase = increase;
    this._peak = 0;
    this._toBePutBackToPool = [];
  }

  init(){
    for (let i = 0; i < this._capacity; i++) {
      let node = this._createNode();
      super.put(node);   
    }
  }

  _createNode(){
    let node = cc.instantiate(this._prefab);
    if (this._handler) {
      let poolHandler = node.getComponent(this._handler);
      if (poolHandler) {
        poolHandler.setPool(this);      
      }
    }
    return node;
  }

  get(param){
    if (this.size() === 0) {
      for (let i = 0; i < this._increase; i++) {
        let node = this._createNode();
        super.put(node);   
      }
      this._capacity += this._increase;
    }
    let instance = super.get(param);
    this._peak = Math.max(this.countInUse, this._peak);
    return instance;
  }

  put(node) {
    super.put(node);
    // this._toBePutBackToPool.push(node);
  }

  get countInUse(){
    return this._capacity - this.size();
  }

  get countPeak(){
    return this._peak; 
  }

  update(){
    // let length = this._toBePutBackToPool.length;
    // if (this._toBePutBackToPool.length) {
    //   let size = Math.min(10, length);
    //   for (let i = 0; i < size; i++){
    //     let node = this._toBePutBackToPool.pop();
    //     super.put(node);
    //   }
    // }
  }
}