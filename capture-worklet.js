// 在音频线程里把麦克风数据攒成 2048 个采样一块，发回主线程。
class Capture extends AudioWorkletProcessor {
  constructor() {
    super();
    this.buf = new Float32Array(2048);
    this.n = 0;
  }
  process(inputs) {
    const ch = inputs[0] && inputs[0][0];
    if (ch) {
      for (let i = 0; i < ch.length; i++) {
        this.buf[this.n++] = ch[i];
        if (this.n === this.buf.length) {
          this.port.postMessage(this.buf.slice());
          this.n = 0;
        }
      }
    }
    return true;
  }
}
registerProcessor("capture", Capture);
