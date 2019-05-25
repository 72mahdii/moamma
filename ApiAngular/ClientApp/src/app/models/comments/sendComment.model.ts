export class SendComment {
  constructor(
    public text: string,
    public name: string,
    public email: string,
    public articleId: number
  ) { }
}
