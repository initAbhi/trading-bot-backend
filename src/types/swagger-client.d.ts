declare module 'swagger-client' {
  interface SwaggerClientOptions {
    url: string;
    requestInterceptor?: (req: any) => void;
  }

  interface SwaggerClient {
    apis: any;
  }

  function SwaggerClient(options: SwaggerClientOptions): Promise<SwaggerClient>;
  
  export = SwaggerClient;
}
