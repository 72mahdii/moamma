/*__Imports___*/
//#region
import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Article } from "../models/articles/article.model";
import { Profile } from "../models/authors/profile.model";
import { AuthService } from "./authentication.service";
import { SendReply } from "../models/comments/sendReply.model";
import { CommentManager } from "../models/comments/commentManager.model";
import { Trash } from "../models/articles/trash.model";
import { Password } from "../models/authors/password.model";
import { Comment } from "../models/comments/comment.model";
//#endregion

@Injectable()
export class AuthorPanelService {

      /*                       */
    /* Properties and Fields */
  /*                       */
  //#region
  private _apiUrl = "http://moammapey.ir/api/administration/";
  private _apiUrlA = "http://moammapey.ir/api/articles/";

  public loadData: Subject<boolean> = new Subject<boolean>();
  public loadTrash : Subject<boolean> = new Subject<boolean>();
  public loadAuthor : Subject<boolean> = new Subject<boolean>();
  public loadComment : Subject<boolean> = new Subject<boolean>();

  public articlesList : Article[]=[];
  public trashesList : Trash[] = [];
  public archiveCounter : number =0;
  public loginAuthor : Profile;
  //#endregion

      /*                          */
    /* Constructor and ngOnInit */
  /*                          */
  //#region
  constructor(
    private _authService : AuthService,
    private _httpClient : HttpClient,
    private _messageService : MessageService
  ){}
  //#endregion


      /*            */
    /* Send Reply */
  /*            */
  public SendReply(rp : SendReply){
    const header = this.headerMaker(this._authService.authorHeader);
    return this._httpClient.post(this._apiUrlA + "SendReply", rp, header);
  }

      /*                       */
    /* Fetch Unread Comments */
  /*                       */
  public get UnreadComments() {
    var comments : Comment[] = [];
    this.articlesList.forEach(a => {
      if(a.comments.length >0){
        a.comments.forEach(c => {
          if(!c.approved){
            if(c.replyComments != null){
              comments.push(c);
            }else {
              c.replyComments = [];
              comments.push(c);
            }
          }
        })
      }
    });

    return comments;
  }

      /*                         */
    /* UnCheck Comment Manager */
  /*                         */
  public UnCheckCommentManager(cmd : CommentManager){
    const header = this.headerMaker(this._authService.authorHeader);
    return this._httpClient.post<any>(this._apiUrlA +
      "UnCheckCommentManager", cmd, header);
  }

      /*                */
    /* Return Article */
  /*                */
  public ReturnArticle(id: string) {
    return this.articlesList.find(key => key.id == Number(id));
  }

      /*              */
    /* Fetch Author */
  /*              */
  public FetchAuthor(){
    var header =this.headerMaker(this._authService.authorHeader);
    this._httpClient.get<any>(this._apiUrl + "FetchAuthor", header)
      .subscribe(author => {
        if(author != null){
          this.loginAuthor = author;
          this.loadAuthor.next(true);
        }
      });
  }

      /*                */
    /* Fetch Articles */
  /*                */
  public FetchArticles() {
    var header = this.headerMaker(this._authService.authorHeader);
    this._httpClient.get<any>(
      this._apiUrlA + "FetchArticles",header).subscribe(articles => {
        if(articles != null){
          this.articlesList = articles;
          this.archiveCounter =0;
          this.articlesList.forEach(article => {
            if(article.archive){
              this.archiveCounter +=1;
            }
          });
          this.loadData.next(true);
          this.loadComment.next(true);
        }
      }, error => {
        let ok = [['بستن', ()=>{}]];
        this._messageService.currentMessage.next(
          new Message(
            "خطا در برقراری ارتباط با سرور",
            ok
          ));
      });
  }

      /*                */
    /* Fetch Trashes */
  /*                */
  public FetchTrashes(){
    const header = this.headerMaker(this._authService.authorHeader);
    this._httpClient.get<any>(this._apiUrlA +
      "FetchTrashes", header).subscribe(tr => {
      this.trashesList = tr;
      this.loadTrash.next(true);
    });
  }

      /*                */
    /* Create Article */
  /*                */
  public CreateArticle(article : Article){
    const header =this.headerMaker(this._authService.authorHeader);
    return this._httpClient.post(this._apiUrlA +
      "CreateArticle", article, header);
  }


      /*              */
    /* Edit Article */
  /*              */
  public EditArticle(article : Article){
    const header = this.headerMaker(this._authService.authorHeader);
    return this._httpClient.post(this._apiUrlA +
      "EditArticle", article, header);
  }

      /*               */
    /* Trash Article */
  /*               */
  public TrashArticle(article: Article) {
    const header = this.headerMaker(this._authService.authorHeader);
    return this._httpClient.post<any>(this._apiUrlA +
      "TrashArticle", article, header);
  }

      /*                 */
    /* Restore Article */
  /*                 */
  public RetArticle(trash : Trash){
    const header = this.headerMaker(this._authService.authorHeader);
    return this._httpClient.post<any>(this._apiUrlA +
      "RetArticle", trash, header);
  }

      /*               */
    /* Erase Article */
  /*               */
  public EraseArticle(id:string){
    let ok = [['بستن', () => { }]];
    const header = this.headerMaker(this._authService.authorHeader);
    this._httpClient.post(this._apiUrlA +
      "EraseArticle", id, header)
      .subscribe(r => {
        if(r=="ok"){
          document.getElementById('wait').classList.add('hide');
          this._messageService.currentMessage.next(
            new Message(
              "مقاله به طور کامل از بانک اطلاعاتی حذف شد.",
              ok
            ));
          this.FetchArticles();
          this.FetchTrashes();
        }
      }, error => {
          document.getElementById('wait').classList.add('hide');
          this._messageService.currentMessage.next(
            new Message(
              "خطا در برقراری ارتباط با سرور...!",
              ok
            ));
      })

  }

      /*               */
    /* Change Avatar */
  /*               */
  public changeAvatar(file: File){
    const header = this.headerMaker(this._authService.authorHeader);
    var formData = new FormData();
    formData.append(file.name, file);
    return this._httpClient.post(
      this._apiUrl + "uploadimage", formData, header);
  }

    /*                 */
  /* Change Password */
/*                 */
  public ChangePassowrd(password: Password){
    const header = this.headerMaker(this._authService.authorHeader);
    return this._httpClient.post(
      this._apiUrl + "changepassword",
      password,
      header
      );
  }

    /*               */
  /* ChangeProfile */
/*               */
  public ChangeProfile(profile : Profile){
    const header = this.headerMaker(this._authService.authorHeader);
    return this._httpClient.post(this._apiUrl +
      "changeprofile", profile, header);
  }

    /*               */
  /* Header Maker  */
/*               */
  private headerMaker(authorizaion, contentType=undefined){
    if(contentType !=undefined){
      return {
        headers: new HttpHeaders({
          'Content-Type': contentType,
          'Authorization': this._authService.authorHeader
        })
      }
    }else {
      return{
        headers: new HttpHeaders({
          'Authorization': this._authService.authorHeader
        })
      }
    }
  }
}
