export class CommentManager {
  constructor(
    public cmdChecked : string[],
    public cmdUnChecked: string[],
    public cmdDeleted: string[],
    public replyDeleted: string[]
  ){}
}
