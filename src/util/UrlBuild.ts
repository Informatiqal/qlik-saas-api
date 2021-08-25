export class URLBuild {
  private url: string;
  private params = [] as any;
  constructor(url: string) {
    this.url = url;
  }

  addParam(name: string, value: any) {
    if (value) this.params.push(`${name}=${encodeURIComponent(value)}`);
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
