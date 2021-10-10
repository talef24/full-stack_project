const protocol = "http";
const serverHost = "localhost";
const serverPort = "3001";
const serverDomain = `${protocol}://${serverHost}:${serverPort}`;

async function reqToServer(relativePath, method, body) {
    const url = serverDomain + relativePath;
    const init = getRequestInit(method, body);
    const fetchResult = await fetch(url, init);
    const result = await handleResult(fetchResult);
    if(typeof(result) !== "undefined") {
        return result;
    }
}

async function handleResult(fetchResult) {
    switch(fetchResult.status) {
        case(401) : {
            const result = await parseResult(fetchResult);
            result.onError = "/activityExpired";
            return result;
        }
        case(403) : { //admin authenticate
            const result = await parseResult(fetchResult);
            result.onError = "/";
            return result;
        }
        case(404) : { //page not found
            const result = await parseResult(fetchResult);
            result.onError = "/pageNotFound";
            return result;
        }
        case(503) : { //Internal server error
            const result = await parseResult(fetchResult);
            result.onError = "/serviceUnavailable";
            return result;
        }
        default: {
            return await parseResult(fetchResult);
        }
    }
}

async function parseResult(fetchResult) {
    let result = {status: fetchResult.status, ok: fetchResult.ok};
    try {
        const resBody = await fetchResult.json();
        const isJSON = typeof(resBody) === "string" && resBody.startsWith("{");
        result.data = isJSON ? await JSON.parse(resBody) : resBody;
        return result;
    } catch(error) {
        result.data = 'No content';
        return result;
    }
}

function getRequestInit(method, body) {
    const httpMethod = method.toUpperCase();
    const init = {
        method: method,
        mode: 'cors',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
    }
    if(httpMethod !== "GET") {
        init.body = body instanceof Object ? JSON.stringify(body) : body;
    }

    return init;
}
export default reqToServer;

