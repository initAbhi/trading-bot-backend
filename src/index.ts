import SwaggerClient from 'swagger-client';
import { DeltaAPIKeyAuthorization } from './lib/DeltaAPIKeyAuthorization';
import { SwaggerClient as SwaggerClientType } from './types';

const SWAGGER_URL = 'https://docs.delta.exchange/api/swagger_v2.json';

export default function DeltaRestClient(api_key: string, api_secret: string): Promise<SwaggerClientType> {
  const authorization = new DeltaAPIKeyAuthorization(api_key, api_secret);

  return SwaggerClient({
    url: SWAGGER_URL,
    requestInterceptor(req: any) {
      if (!req.method) {
        req.method = 'GET';
      }

      if (typeof authorization !== 'undefined') {
        authorization.apply(req);
      }
    }
  })
  .then((client: any) => {
    return Promise.resolve(client);
  })
  .catch(function(e: Error) {
    console.error('Unable to connect: ', e);
    return Promise.reject(e);
  });
}
