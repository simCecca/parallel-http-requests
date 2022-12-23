self.onmessage = (e) => {
    const requests = e.data.requests;
    const responses = [];
    requests.forEach((request) => {
        responses.push(fetch(request.url, Object.assign({}, request)).then((resp) => resp.json()));
    });
    Promise.allSettled(responses).then((values) => {
        const results = values.map((result) => {
            if (result.status === "fulfilled") {
                return result.value.data;
            }
            else {
                return result.reason;
            }
        });
        self.postMessage(results);
    });
};
export {};
