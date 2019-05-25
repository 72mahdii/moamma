    /*---------*/
  /* Imports */
/*---------*/
//#region
import { Component, OnInit } from '@angular/core';
import { AuthorPanelService } from 'src/app/services/author.service';
import { Article } from 'src/app/models/articles/article.model';
import { MessageService } from 'src/app/services/message.service';
import { Message } from 'src/app/models/message.model';
import { ActivatedRoute } from '@angular/router';
//#endregion


@Component({
  selector: 'app-articles-list',
  templateUrl: './articles-list.component.html',
  styleUrls: ['./articles-list.component.scss']
})
export class ArticlesListComponent implements OnInit {

    /*------------------------*/
   /* Properties and Fields */
  /*----------------------*/
  public articlesList : Article[] =[];


    /*---------------------------*/
   /* Constructor and ngOnInit */
  /*-------------------------*/
  //#region Constructor and ngOnInit
  constructor(
    private _authorPanel: AuthorPanelService,
    private _messageService : MessageService,
    private _route : ActivatedRoute
    ) { }

  ngOnInit() {
    window.scrollTo({ top: 0 });
    this.articlesList = this._authorPanel.articlesList;
    this._authorPanel.loadData.subscribe(rst => {
      this.articlesList = this._authorPanel.articlesList.sort();
      document.getElementById("login").classList.add('hide');
    });
  }
//#endregion


      /*--------------------*/
    /* Methods and Events */
  /*--------------------*/
  public onTrash(article : Article){
    let ok= [
      ['بستن', ()=>{}]
    ];
    let op = [
      ['انصراف', ()=>{}],
      ["بله", ()=> {
        this._authorPanel.TrashArticle(article).subscribe(r =>{
          if(r == "ok"){
            this._messageService.currentMessage.next(
              new Message(
                'مقاله مورد نظر به سطل زباله منتقل شد.',
                ok));
            this._authorPanel.FetchArticles();
            this._authorPanel.FetchTrashes();
          }else {
            this._messageService.currentMessage.next(
              new Message(
                "انتقال مقاله با خطا مواجه شد!!!",
                ok));
          }
        }, error => {
            this._messageService.currentMessage.next(
              new Message(
                "خطا در برقراری ارتباط با سرور...!",
                ok));
        });
      }]
    ];
    this._messageService.currentMessage.next(
      new Message(
        'مقاله به سطل زباله منتقل شود؟',
        op
      ));
  }
}
