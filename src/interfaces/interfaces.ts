export interface RequestOptions extends RequestInit {
  id: string;
  url: string;
}

export interface RequestsOptions {
  requests: Array<RequestOptions>;
  threadNumber?: number;
  bucket?: {
    size?: number;
    timeout?: number;
    returnAtTheEnd?: boolean;
  };
}
