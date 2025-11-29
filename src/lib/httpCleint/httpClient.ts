import { IHttpClient } from "./types";

export class HttpClient implements IHttpClient {
  constructor(private readonly timeout: number = 10_000) {}

  async fetch(url: string): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      return await fetch(url, { signal: controller.signal });
    } finally {
      clearTimeout(timeoutId);
    }
  }
}
