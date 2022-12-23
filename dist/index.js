export * from "./interfaces/interfaces";
class ParallelHttpRequests {
    constructor(threadNumber) {
        this.performRequests = (requestsOptions) => {
            // thread.postMessage() thread.onmessage(result)
            const { threadNumber, requests } = requestsOptions;
            const tNumber = threadNumber !== null && threadNumber !== void 0 ? threadNumber : this.threads.length;
            if (this.threads.length < threadNumber) {
                this.generateThreads(threadNumber);
            }
            const requestsOffset = Math.ceil(requests.length / tNumber);
            const results = [];
            this.threads.forEach((thread, index) => {
                const low = requestsOffset * index;
                const up = requestsOffset * (index + 1);
                if (low > requests.length) {
                    // if this.threads > threadNumber
                    return;
                }
                thread.postMessage({ requests: requests.slice(low, up) });
                results.push(new Promise((resolve) => {
                    thread.onmessage = (resp) => {
                        resolve(resp.data.results);
                    };
                }));
            });
            return Promise.all(results);
        };
        this.updateThreads = (threadNumber) => {
            this.generateThreads(threadNumber);
        };
        this.generateThreads = (threadNumber) => {
            for (let i = this.threads.length; i < threadNumber; i++) {
                this.threads.push(new Worker(new URL("./files/parallelRequests.js", import.meta.url)));
            }
        };
        this.threads = [];
        this.isPerforming = false;
        this.generateThreads(threadNumber || navigator.hardwareConcurrency || 2);
    }
}
export default ParallelHttpRequests;
