import { Component, OnInit } from '@angular/core';
import { RepositoryService } from 'src/app/services/repository.service';
import { ActivatedRoute } from '@angular/router';
import { Article } from 'src/app/models/articles/article.model';
import { Author } from 'src/app/models/authors/author.model';
import { SendComment } from 'src/app/models/comments/sendComment.model';
import { MessageService } from 'src/app/services/message.service';
import { Message } from 'src/app/models/message.model';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss']
})
export class ArticleComponent implements OnInit {

  public article : Article = new Article("","","","","",false,0) ;
  public author : Author = new Author("","","","","");
  public comment : SendComment = new SendComment("","","",0);
  public msg: string = "در حال بارگزاری اطلاعات";
  public cat : string ="مقاله";
  public config_show = {
    height: "auto",
    background: "#444",
    toolbar: [],
  }

  constructor(
    private _route : ActivatedRoute,
    private _repService : RepositoryService,
    private _messageService : MessageService
  ) {
    this._repService.GetData();

  }

  ngOnInit() {
    this._route.params.subscribe(p => {
      //Show loading
      document.getElementById("loading").classList.remove('hide');
      this.GetCategory(p["cat"]);
      if(this._repService.onLoad){
        this.GetArticle(p["id"]);
        //hide loading
        document.getElementById("loading").classList.add('hide');
        window.scrollTo({ top: 0 });

      }else {
        //showloading
        this.GetCategory(p["cat"]);
        this._repService.GetData();
        this._repService.dataLoader.subscribe(r => {
          this.GetArticle(p["id"]);
        document.getElementById("loading").classList.add('hide');
          window.scrollTo({ top: 0 });

        })
        //hide loading

      }
    })
  }
  public onSend() {
    let ok: [[string, () => void]] = [['بستن', () => { }]];
    if (this.comment.name.length < 3
      || this.comment.email.length < 5
      || this.comment.text.length == 0) {
      this._messageService.currentMessage.next(
        new Message("تمامی فیلد های مورد نظر را پر کنید",
          ok
        ));
    } else {
      this.comment.articleId = this.article.id;
      this._repService.SendComment(this.comment);
      this.comment = new SendComment("","","",0);
    }
  }

  private GetArticle(id : number){
    for (let i = 0; i < this._repService.articles.length; i++) {
      if (this._repService.articles[i].id == id) {
        this.article = this._repService.articles[i];
        this.GetAuthor(this._repService.articles[i].authorId);
      }
    }
  }

  private GetCategory(cat : string){
    switch (cat) {
      case "geo": this.cat = "ژئوتکنیک"; break;
      case "mng": this.cat = "مدیریت ساخت"; break;
      case "earth": this.cat = "زلزله"; break;
    }
  }
  private GetAuthor(id:string){
    for(let i=0; i< this._repService.authors.length; i++){
      if(this._repService.authors[i].id == id){
        this.author = this._repService.authors[i];
      }
    }
  }

}
