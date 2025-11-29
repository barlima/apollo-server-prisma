export interface IHttpClient {
  fetch(url: string): Promise<Response>;
}
