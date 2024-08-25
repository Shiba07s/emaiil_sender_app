export class Queue {
  private emails: Set<string>;

  constructor() {
    this.emails = new Set();
  }

  public add(emailId: string): boolean {
    if (this.emails.has(emailId)) return false;
    this.emails.add(emailId);
    return true;
  }

  public remove(emailId: string): boolean {
    if (this.emails.has(emailId)) {
      this.emails.delete(emailId);
      return true;
    }
    return false;
  }
}
