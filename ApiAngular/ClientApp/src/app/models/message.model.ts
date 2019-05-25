export class Message {
  public text: string;
  public responses?: any;

  constructor(text?: string, responses?: any) {
    this.text = text;
    this.responses = responses;
  }
}
