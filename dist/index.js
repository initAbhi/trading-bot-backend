"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = DeltaRestClient;
const swagger_client_1 = __importDefault(require("swagger-client"));
const DeltaAPIKeyAuthorization_1 = require("./lib/DeltaAPIKeyAuthorization");
const SWAGGER_URL = 'https://docs.delta.exchange/api/swagger_v2.json';
function DeltaRestClient(api_key, api_secret) {
    const authorization = new DeltaAPIKeyAuthorization_1.DeltaAPIKeyAuthorization(api_key, api_secret);
    return (0, swagger_client_1.default)({
        url: SWAGGER_URL,
        requestInterceptor(req) {
            if (!req.method) {
                req.method = 'GET';
            }
            if (typeof authorization !== 'undefined') {
                authorization.apply(req);
            }
        }
    })
        .then((client) => {
        return Promise.resolve(client);
    })
        .catch(function (e) {
        console.error('Unable to connect: ', e);
        return Promise.reject(e);
    });
}
//# sourceMappingURL=index.js.map