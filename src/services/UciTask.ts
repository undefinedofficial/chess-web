import { ref } from "vue";

type Status = Partial<{
  loaded: boolean;
  ready: boolean;
  book: boolean;
}>;

type RemoveEventListenerHandler = () => void;

class UciTask {
  public log = ref<string[]>([]);
  private engine: Worker;
  private _status: Status = {};
  private _queueQueries: string[] = [];
  public get status() {
    return this._status;
  }

  constructor(path: string) {
    this.engine = new Worker(path);

    this.engine.addEventListener("message", (event) => {
      const line = event && typeof event === "object" ? event.data : event;

      this.log.value.push("Read: " + line);
      // console.log(line);
      if (line === "uciok") {
        this._status.loaded = true;
        /* Load debut book */
        // const bookRequest = new XMLHttpRequest();
        // bookRequest.open("GET", "/stockfish/book.bin", true);
        // bookRequest.responseType = "arraybuffer";
        // bookRequest.onload = () => {
        //   if (bookRequest.status == 200) {
        //     this.uciSend({ book: bookRequest.response });
        //     this._status.book = true;
        //   } else console.error("debute book not found!");
        // };
        // bookRequest.send();
      } else if (line === "readyok") {
        this._status.ready = true;
        if (this._queueQueries.length > 0) {
          while (this._queueQueries.length) {
            this.uciSend(this._queueQueries.shift());
          }
        }
      }
    });

    this.engine.addEventListener("messageerror", (event) => {
      console.warn("Stockfish: ", event.data);
    });
    this.engine.addEventListener("error", (event) => {
      console.warn("Stockfish: ", event.message);
    });

    this.engine.postMessage("uci");
    this.engine.postMessage("isready");
  }
  public terminate(): void {
    if (this.engine) {
      this.engine.terminate();
    }
    this._status = {};
  }

  public uciSet(name: string, value: string = ""): void {
    this.uciSend(`setoption name ${name} ${value}`);
  }
  public uciSend(message: string | any): void {
    if (this._status.ready) {
      this.log.value.push("write: " + message);
      // console.log("Send message", message);
      this.engine.postMessage(message);
    } else {
      this._queueQueries.push(message);
    }
  }
  public addEventListener<K extends keyof WorkerEventMap>(
    type: K,
    listener: (this: Worker, ev: WorkerEventMap[K]) => any,
    options?: boolean | AddEventListenerOptions
  ): RemoveEventListenerHandler {
    this.engine.addEventListener(type, listener, options);
    return () => this.engine.removeEventListener(type, listener, options);
  }
  public removeEventListener<K extends keyof WorkerEventMap>(
    type: K,
    listener: (this: Worker, ev: WorkerEventMap[K]) => any,
    options?: boolean | EventListenerOptions
  ) {
    return this.engine.removeEventListener(type, listener, options);
  }
}
export { UciTask };
