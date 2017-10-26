class MessagePipeline extends cc.EventTarget {
  // constructor() {
  //   super()
  // }

  sendMessage(detail, params) {
    // cc.log(`dispatch system notification ${detail}`)
    this.emit(detail, params)
  }
}

export const messagePipeline = new MessagePipeline()
