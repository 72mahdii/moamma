import { Comment } from "../comments/comment.model";

export class Article {
  constructor(
    public title:string,
    public category: string,
    public tag: string,
    public summary :string,
    public content: string,
    public archive: boolean,
    public id?: number,
    public comments?: Comment[],
    public authorId?:string,
    public likes? : number,
    public crtDate? : string
  ){
    comments = null;
  }
}

export class ArticleModel {
  constructor(
    public title: string,
    public category: string,
    public tag: string,
    public summary: string,
    public content: string,
    public archive: boolean
  ){}
}
