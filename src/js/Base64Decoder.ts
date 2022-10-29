export default class Base64Decoder {
  private readonly pattern =
    /^([A-Za-z0-9+\/]{4})*([A-Za-z0-9+\/]{3}=|[A-Za-z0-9+\/]{2}==)?$/;

  isBase64(maybeBase64: string) {
    return this.pattern.test(maybeBase64);
  }

  decode(base64String: string) {
    return atob(base64String);
  }
}
