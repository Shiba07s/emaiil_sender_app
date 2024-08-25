export class Logger {
  public log(message: string) {
    console.log(`[LOG]: ${message}`);
  }

  public error(message: string) {
    console.error(`[ERROR]: ${message}`);
  }
}
