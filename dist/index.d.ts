import { RequestsOptions } from "./interfaces/interfaces";
export * from "./interfaces/interfaces";
declare class ParallelHttpRequests {
    private threads;
    private isPerforming;
    constructor(threadNumber?: number);
    performRequests: (requestsOptions: RequestsOptions) => Promise<any[]>;
    updateThreads: (threadNumber: number) => void;
    private generateThreads;
}
export default ParallelHttpRequests;
