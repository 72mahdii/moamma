import { Component, OnInit } from '@angular/core';
import * as $ from "jquery";
import { Trash } from 'src/app/models/articles/trash.model';
import { AuthorPanelService } from 'src/app/services/author.service';
import { MessageService } from 'src/app/services/message.service';
import { Message } from 'src/app/models/message.model';
import { Article } from 'src/app/models/articles/article.model';

@Component({
  selector: 'app-trash',
  templateUrl: './trash.component.html',
  styleUrls: ['./trash.component.scss']
})
export class TrashComponent implements OnInit {

  public trashes : Trash[] = [];

  constructor(
    private _authorPanel : AuthorPanelService,
    private _messageService : MessageService
  ) { }

  ngOnInit() {
    this._authorPanel.FetchTrashes();
    this.trashes = this._authorPanel.trashesList;
    this._authorPanel.loadTrash.subscribe(rs => {
      this.trashes = this._authorPanel.trashesList;
    })
  }

  onUndo(trash : Trash){
    let ok=[["بستن", ()=> {}]];
    let undo =[
      ["انصراف", ()=>{}],
      ["بله", ()=> {
        document.getElementById('wait').classList.remove('hide');
        var article: Article = new Article(
          trash.title,
          trash.category,
          trash.tag,
          trash.summary,
          trash.content,
          true
        );
        this._authorPanel.RetArticle(trash).subscribe(r => {
          if (r == "ok") {
            document.getElementById('wait').classList.add('hide');
            this._messageService.currentMessage.next(
              new Message(
                "مقاله با موفقیت بازگردانی و در قسمت آرشیو ها ذخیره شد",
                ok));
            this._authorPanel.FetchArticles();
            this._authorPanel.FetchTrashes();
          } else {
            document.getElementById('wait').classList.add('hide');
            this._messageService.currentMessage.next(
              new Message(
                "خطا در عملیات بازگردانی",
                ok));
          }
        }, error =>{
          document.getElementById('wait').classList.add('hide');
          this._messageService.currentMessage.next(new Message("خطا در برقراری ارتباط با سرور...!", ok))
        });
      }]
    ]

    this._messageService.currentMessage.next(
      new Message(
        "مقاله بازگردانی شود؟",
        undo
      ));
  }

  onDelete(id){
    let ok = [['بستن', ()=>{}]];
    let erase   = [
      ['انصراف',()=>{}],
      ['بله', ()=> {
        document.getElementById('wait').classList.remove('hide');
        this._authorPanel.EraseArticle(id);
        this._messageService.currentMessage.next(
          new Message("مقاله باموفقیت حذف شد!", ok));
        this._authorPanel.FetchArticles();
        this._authorPanel.FetchTrashes();
      }]
    ];
    this._messageService.currentMessage.next(
      new Message("مقاله بطور کامل حذف گردد؟", erase)
    );

  }
}
