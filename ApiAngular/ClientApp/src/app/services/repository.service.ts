import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Author } from '../models/authors/author.model';
import { Article } from '../models/articles/article.model';
import { Subject } from 'rxjs';
import { SendComment } from '../models/comments/sendComment.model';
import { MessageService } from './message.service';
import { Message } from '../models/message.model';
import { GetData } from '../models/getData.model';
import { RemoveAuthor } from '../models/authors/removeAuthor.model';
import { Search } from '../models/search.model';


@Injectable()
export class RepositoryService {

  /*___Properties___*/
  public articles : Article[] = [];
  public authors : Author[] = [];

  public dataLoader = new Subject<any>();
  public onLoad  = false;

  /*___Constructor and ngOnInit___*/
  constructor(
    private _httpClient : HttpClient,
    private _messageService : MessageService
  ){
  }

  ngOnInit(){}

  /*___Methods___*/
  public Search(word: string, cat:string){
    return this._httpClient.post("api/Repository/Search", new Search(word, cat));
  }

  /*___Get Articles___*/
  public GetArticle(id : string) : Article{
    if(this.onLoad){
      for(let i=0; i<this.articles.length; i++){
        if(this.articles[i].id == +id){
          return this.articles[i];
        }
      }
    }else {
      this.GetData();
      this.dataLoader.subscribe(r => {
        this.onLoad = true;
        for (let i = 0; i < this.articles.length; i++) {
          if (this.articles[i].id == +id) {
            return this.articles[i];
          }
        }
      })
    }
  }

  /*___Get Data___*/
  public GetData(){
    this._httpClient.get<GetData>("api/Repository/GetData")
      .subscribe(l => {
        this.articles = l.articles;
        this.authors = l.authors;
        this.dataLoader.next(l);
      });
  }

  /*___Send Comment___*/
  public SendComment(cmt : SendComment){
    this._httpClient.post("api/repository/sendcomment", cmt)
    .subscribe( r => {
            if(r=="ok"){
              let ok:[[string, ()=>void]]= [['بستن', ()=>{}]];
              this._messageService.currentMessage.next(
                new Message(
                  "نظر شما پس از تایید نویسنده نمایش داده خواهد شد",
                  ok));
            }
    });
  }

}
