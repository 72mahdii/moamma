export class CreateAuthor {
  constructor(
    public userName: string,
    public email: string,
    public password: string,
    public nameInPersian: string,
    public category: string,
  ) { }
}
