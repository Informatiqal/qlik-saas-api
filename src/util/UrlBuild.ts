export class URLBuild {
  private url: string;
  private params = [] as any;
  constructor(url: string) {
    this.url = url;
  }

  addParam(name: string, value: any, encode?: boolean) {
    if (value)
      this.params.push(`${name}=${encode ? encodeURIComponent(value) : value}`);
  }

  private getParams() {
    return this.params.join("&");
  }

  getUrl() {
    if (this.params.length == 0) return this.url;

    this.url += `?${this.getParams()}`;
    return this.url;
  }
}
