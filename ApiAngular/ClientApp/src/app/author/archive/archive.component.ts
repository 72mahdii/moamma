/*--------------*/
  /* Imports */
/*------------*/
import { Component, OnInit } from '@angular/core';
import * as $ from "jquery";
import { Article } from 'src/app/models/articles/article.model';
import { AuthorPanelService } from 'src/app/services/author.service';
import { MessageService } from 'src/app/services/message.service';
import { Message } from 'src/app/models/message.model';

@Component({
  selector: 'app-archive',
  templateUrl: './archive.component.html',
  styleUrls: ['./archive.component.scss']
})
export class ArchiveComponent implements OnInit {

  public archive : Article[] = [];

  constructor(
    private _authroPanel : AuthorPanelService,
    private _messageService: MessageService,

  ) { }

  ngOnInit() {
    this._authroPanel.articlesList.forEach(article => {
      if(article.archive){
        this.archive.push(article);
      }
    });
    this._authroPanel.loadData.subscribe(articles => {
      this.archive = [];
      this._authroPanel.articlesList.forEach(article => {
        if (article.archive) {
          this.archive.push(article);
        }
      });
    })

  }

  /*--------------*/
    /* Methods */
  /*------------*/
  public onTrash(article : Article){
    /*___Define Message Buttons___*/

    let op= [
      ["بستن", () => { }]
    ];
    let rsp =[
      ["انصراف", ()=> {}],
      ["بله", () => {
        document.getElementById('wait').classList.remove('hide');
        this._authroPanel.TrashArticle(article).subscribe(r => {
          if(r == "ok"){
            document.getElementById('wait').classList.add('hide');
            this._messageService.currentMessage.next(
              new Message(
                "انتقال مقاله با موفقیت انجام شد.",
                op
                ));
            this._authroPanel.FetchArticles();
          }else {
            document.getElementById('wait').classList.add('hide');
            this._messageService.currentMessage.next(
              new Message(
                "عملیات انتقال با خطا مواجه شد!",
                op
              )
            )
          }
        }, error => {
          document.getElementById('wait').classList.add('hide');
          this._messageService.currentMessage.next(
            new Message(
              "خطا در ارتباط با سرور..!",
              op
            ));
        })
      } ]
    ];

    /*|||_Done Message Buttons Defination_|||*/


    this._messageService.currentMessage.next(
      new Message(
          "آیا از انتقال این مقاله به سطل زباله مطمئن هستید؟",
          rsp));


  }

  public onSend(article : Article){

    /*___Define Message Buttons___*/

    let op2 = [
      ['بستن', () => { }]
    ];
    let op= [
      ["انصراف", ()=>{}],
      [ "بله", ()=> {
        article.archive = false;
        /*___Try To Send Request___*/
        this._authroPanel.EditArticle(article).subscribe(r => {
          if(r == "ok"){
            this._authroPanel.FetchArticles();
            this._messageService.currentMessage.next(
              new Message(
                "ارسال مقاله بر روی بلاگ با موفقیت انجام شد.",
                op2
              ));
          }else {
            this._messageService.currentMessage.next(
              new Message(
                "ارسال مقاله بر روی بلاگ با خطا مواجه شد!!!",
                op2
              ));
          }
        }, error =>{
            this._messageService.currentMessage.next(
              new Message(
                "خطا در برقراری ارتباط با سرور...!!",
                op2
              ));
        })
      }]
    ];

    /*|||_Done Message Buttons Defination_|||*/

    this._messageService.currentMessage.next(
      new Message(
        "مقاله روی بلاگ ارسال شود؟",
        op
      ));
  }


}
