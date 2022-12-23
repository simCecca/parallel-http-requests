import { RequestsOptions } from "./interfaces/interfaces";

export * from "./interfaces/interfaces";

class ParallelHttpRequests {
  private threads: Array<Worker>;
  private isPerforming: boolean;
  constructor(threadNumber?: number) {
    this.threads = [];
    this.isPerforming = false;
    this.generateThreads(threadNumber || navigator.hardwareConcurrency || 2);
  }

  performRequests = (requestsOptions: RequestsOptions) => {
    // thread.postMessage() thread.onmessage(result)
    const { threadNumber, requests } = requestsOptions;
    const tNumber = threadNumber ?? this.threads.length;
    if (this.threads.length < threadNumber) {
      this.generateThreads(threadNumber);
    }

    const requestsOffset = Math.ceil(requests.length / tNumber);
    const results: Array<Promise<any>> = [];
    this.threads.forEach((thread, index) => {
      const low = requestsOffset * index;
      const up = requestsOffset * (index + 1);
      if (low > requests.length) {
        // if this.threads > threadNumber
        return;
      }
      thread.postMessage({ requests: requests.slice(low, up) });
      results.push(
        new Promise((resolve) => {
          thread.onmessage = (resp) => {
            resolve(resp.data.results);
          };
        })
      );
    });
    return Promise.all(results);
  };

  updateThreads = (threadNumber: number) => {
    this.generateThreads(threadNumber);
  };

  private generateThreads = (threadNumber: number) => {
    for (let i = this.threads.length; i < threadNumber; i++) {
      this.threads.push(
        new Worker(new URL("./files/parallelRequests.js", import.meta.url))
      );
    }
  };
}

export default ParallelHttpRequests;
