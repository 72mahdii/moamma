export class AuthorLogin {
  constructor(
    public userName: string,
    public password: string,
    public rememberLogin: boolean,
    public returnUrl: string
  ) { }
}
