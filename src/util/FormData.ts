export class FormDataCustom {
  private boundary: string;
  headers: string;
  private streams: any[];
  data: string;
  constructor() {
    this.streams = [];
    this.generateBoundary();
    this.generateHeaders();
  }

  private generateBoundary(): void {
    // This generates a 50 character boundary similar to those used by Firefox.
    // They are optimized for boyer-moore parsing.
    let boundary = "--------------------------";
    for (let i = 0; i < 24; i++) {
      boundary += Math.floor(Math.random() * 10).toString(16);
    }

    this.boundary = boundary;
  }

  private generateHeaders(): void {
    this.headers = "multipart/form-data; boundary=" + this.boundary;
  }

  append(field: string, data: any, fileName?: string) {
    if (field == "data")
      this.streams.push(
        `--${this.boundary}\r\nContent-Disposition: form-data; name="data"\r\n\r\n`
      );

    if (field == "file")
      this.streams.push(
        `--${this.boundary}\r\nContent-Disposition: form-data; name="file"; filename="${fileName}"\r\nContent-Type: application/x-zip-compressed\r\n\r\n`
      );

    this.streams.push(data);
  }

  getData(): Buffer {
    this.streams.push(`--${this.boundary}--\r\n`);

    var dataBuffer = Buffer.alloc(0);

    // Create the form content. Add Line breaks to the end of data.
    for (var i = 0, len = this.streams.length; i < len; i++) {
      if (Buffer.isBuffer(this.streams[i])) {
        dataBuffer = Buffer.concat([dataBuffer, this.streams[i]]);
      } else {
        dataBuffer = Buffer.concat([dataBuffer, Buffer.from(this.streams[i])]);
      }

      // Add break after content.
      if (
        typeof this.streams[i] !== "string" ||
        this.streams[i].substring(2, this.boundary.length + 2) !== this.boundary
      ) {
        dataBuffer = Buffer.concat([dataBuffer, Buffer.from("\r\n")]);
      }
    }
    return dataBuffer;
  }
}
