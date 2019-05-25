export class Profile {
  constructor(
    public userName: string,
    public email: string,
    public persianName: string,
    public category: string,
    public imageAddress?: string
  ) { }
}
