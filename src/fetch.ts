import http, { IncomingHttpHeaders } from 'http';
import https from 'https';

export type Method = 'GET' | 'POST' | 'PATCH';

export default class Fetch {
  private family: 6 | 4 = 6;

  private headers: Record<string, string> = {};

  private responseHeaders?: IncomingHttpHeaders;

  private data: string = '';

  private statusCodeReceived?: number;

  private method: Method = 'GET';

  private parsedURL?: URL;

  constructor(private url: string) {
    this.parsedURL = new URL(url);
  }

  setHeader(name: string, value: string): Fetch {
    this.headers[name.toLowerCase()] = value;
    return this;
  }

  setMethod(method: Method): Fetch {
    this.method = method;
    return this;
  }

  setFamily(family: 6 | 4): Fetch {
    this.family = family;
    return this;
  }

  async ok(): Promise<boolean> {
    const tryFetch = async () => {
      this.data = '';

      if (!this.parsedURL) {
        throw new Error('URL was not parsed. This is a bug.');
      }

      const proto = this.parsedURL.protocol === 'https:' ? https : http;

      const options = {
        agent: false,
        defaultPort: proto === https ? 443 : 80,
        headers: this.headers,
        host: this.parsedURL.host,
        hostname: this.parsedURL.hostname,
        insecureHTTPParser: false,
        method: this.method,
        path: this.parsedURL.pathname,
        protocol: this.parsedURL.protocol,
        timeout: 30000,
        family: this.family,
      };

      await new Promise(
        (resolve, reject) => {
          if (!this.parsedURL) {
            throw new Error('Missing URL for API call');
          }

          proto.request(options, (res) => {
            this.statusCodeReceived = res.statusCode;
            this.responseHeaders = res.headers;
            res.on('data', (chunk) => `${this.data}${chunk}`);
            res.on('end', resolve);
            res.on('error', reject);
          }).end();
        },
      );

      if (this.responseHeaders?.redirect) {
        const { redirect } = this.responseHeaders;
        if (Array.isArray(redirect)) {
          [this.url] = redirect;
        } else {
          this.url = redirect;
        }
        this.parsedURL = new URL(this.url);
        await tryFetch();
      }
    };

    await tryFetch();

    if (!this.statusCodeReceived) {
      return false;
    }

    if (this.statusCodeReceived >= 200 && this.statusCodeReceived < 400) {
      return true;
    }

    return false;
  }

  statusCode(): number {
    if (!this.statusCodeReceived) {
      throw new Error('No Status Code received: was the query run?');
    }

    return this.statusCodeReceived;
  }

  text(): string {
    if (!this.statusCodeReceived) {
      throw new Error('No Status Code received: was the query run?');
    }

    return this.data;
  }

  json(): unknown {
    if (!this.statusCodeReceived) {
      throw new Error('No Status Code received: was the query run?');
    }

    if (!this.headers) {
      throw new Error('No Response headers.');
    }

    if (this.headers['Content-Type'] === 'application/json') {
      return JSON.parse(this.data);
    }

    throw new Error('"Content-Type: application/json" header not found.');
  }
}
