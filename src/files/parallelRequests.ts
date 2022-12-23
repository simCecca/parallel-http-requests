import { RequestOptions } from "../interfaces/interfaces";
import { cloneDeep } from "lodash";

self.onmessage = (e) => {
  const requests: Array<RequestOptions> = e.data.requests;
  const responses = [];

  requests.forEach((request) => {
    responses.push(
      fetch(request.url, { ...request }).then((resp) => resp.json())
    );
  });

  Promise.allSettled(responses).then(
    (values: Array<PromiseSettledResult<any>>) => {
      const results = values.map((result) => {
        if (result.status === "fulfilled") {
          return result.value.data;
        } else {
          return result.reason;
        }
      });
      self.postMessage(results);
    }
  );
};
