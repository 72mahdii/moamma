import { Component, OnInit } from '@angular/core';
import { AuthorPanelService } from 'src/app/services/author.service';
import { MessageService } from 'src/app/services/message.service';
import { Comment } from '../../models/comments/comment.model';
import { CommentManager } from 'src/app/models/comments/commentManager.model';
import { Message } from 'src/app/models/message.model';
import { Router } from '@angular/router';
import { SendReply } from 'src/app/models/comments/sendReply.model';
import { Article } from 'src/app/models/articles/article.model';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit {

  private _checkedIds : string[] = [];
  private _deletedIds: string[]=[];
  private _deletedRIds: string[]=[];
  public comments : Comment[]=[];
  public articlesList : Article[] = [];
  public reply : string ;
  public tempId : string = null;

  constructor(
    private _authorPanel : AuthorPanelService,
    private _messageService : MessageService,
    private _router : Router
  ) { }

  ngOnInit() {
    this.comments = this._authorPanel.UnreadComments;
    this.articlesList = this._authorPanel.articlesList;
    this._authorPanel.loadComment.subscribe(r => {
      if(r){
        this.comments = this._authorPanel.UnreadComments;
      }
    });
    this._authorPanel.loadData.subscribe(rst => {
      this.articlesList = this._authorPanel.articlesList.sort();
    });
  }

  onCheck(id){
    if(!this._checkedIds.includes(id)){
      document.getElementById(id).classList.remove('uncheck');
      document.getElementById(id).classList.add('check');
      this._checkedIds.push(id);
      if(this._deletedIds.includes(id)){
        document.getElementById('d-' + id).classList.remove('ch');
        document.getElementById('d-' + id).classList.add('un');
        this._deletedIds.splice(this._deletedIds.indexOf(id), 1);
      }
    }else {
      document.getElementById(id).classList.add('uncheck');
      document.getElementById(id).classList.remove('check');
      this._checkedIds.splice(this._checkedIds.indexOf(id),1);
    }
  }

  onTrash(id){
    if(this._deletedIds.includes(id)){
      document.getElementById('d-'+id).classList.remove('ch');
      document.getElementById('d-' +id).classList.add('un');
      this._deletedIds.splice(this._deletedIds.indexOf(id), 1);
    }else {
      document.getElementById('d-' + id).classList.add('ch');
      document.getElementById('d-' + id).classList.remove('un');
      this._deletedIds.push(id);
      if (this._checkedIds.includes(id)) {
        this._checkedIds.splice(this._checkedIds.indexOf(id), 1);
        document.getElementById(id).classList.add('uncheck');
        document.getElementById(id).classList.remove('check');
      }
    }
  }

  onRTrash(id){
    if(this._deletedRIds.includes(id)){
      document.getElementById(id).classList.remove('ch');
      document.getElementById(id).classList.add('un');
      this._deletedRIds.splice(this._deletedRIds.indexOf(id), 1);
    }else {
      document.getElementById(id).classList.add('ch');
      document.getElementById(id).classList.remove('un');
      this._deletedRIds.push(id);
    }
  }
/*
  onReset(){
    var counter = document.getElementsByClassName('custom-btn').length;
    var counterC = document.getElementsByClassName('custom-btn-c').length;
    for(let i=0; i<counter; i++){
      document.getElementsByClassName('custom-btn')[i]
        .classList.remove('ch');
      document.getElementsByClassName('custom-btn')[i]
        .classList.add('un');
    }
    for(let j=0; j<counterC; j++){
      document.getElementsByClassName('custom-btn-c')[j]
        .classList.remove('check');
      document.getElementsByClassName('custom-btn-c')[j]
        .classList.add('uncheck');
    }
    let ok =[['بستن', ()=>{}]];
    this._messageService.currentMessage.next(
      new Message("تنظیمات به حالت اول بازگشت", ok));
  }
  */

  onSubmit(){
    let ok = [['بستن', () => { }]];
    let confirm = [
      ['انصراف', ()=>{}],
      ['بله', ()=> {
        let cmdManager = new CommentManager(
          this._checkedIds,
          [],
          this._deletedIds,
          this._deletedRIds
        );
        document.getElementById('wait').classList.remove('hide');
        this._authorPanel.UnCheckCommentManager(cmdManager)
          .subscribe(r => {
            if(r=="ok"){
              //hide waiting
              document.getElementById('wait').classList.add('hide');
              this._messageService.currentMessage.next(
                new Message("تنظیمات با موفقیت ثبت ذخیره شد!", ok));
              this._authorPanel.FetchArticles();
              this._authorPanel.loadComment.next();
              this._router.navigate(['authors','index','repository']);
            }else {
              document.getElementById('wait').classList.add('hide');
              this._messageService.currentMessage.next(
                new Message("خطا در ثبت تنظیمات!", ok));
              this._router.navigate(['authors', 'index', 'repository']);

            }
          }, error => {
              document.getElementById('wait').classList.add('hide');
              this._messageService.currentMessage.next(
                new Message("خطا در برقراری ارتباط با سرور", ok));

          });
      }]
    ];
    this._messageService.currentMessage.next(
        new Message("ثبت تغییرات؟", confirm));

  }
  onReply(id){
    this.tempId = id;
    document.getElementById('reply-box').classList.remove('off');
    document.getElementById('reply-box').classList.add('on');
  }

  onSend(){
    let ok = [['بستن', () => { }]];
    if(this.tempId != null){
      document.getElementById('reply-box').classList.remove('on');
      document.getElementById('reply-box').classList.add('off');
      document.getElementById('wait').classList.remove('hide');
      var id = this.tempId;
      var txt = this.reply;
      var rp : SendReply = new SendReply(id, txt);
      this._authorPanel.SendReply(rp).subscribe(r => {
        if(r == "ok"){
          document.getElementById('wait').classList.add('hide');
          this._authorPanel.FetchArticles();
          this._authorPanel.loadComment.next(true);
          this.reply = "";
          this.tempId = "";
        }else {
          document.getElementById('wait').classList.add('hide');
          this._messageService.currentMessage.next(
            new Message("خطا در ارسال پاسخ نظر!", ok));
        }
      }, error => {
          document.getElementById('wait').classList.add('hide');
          this._messageService.currentMessage.next(
            new Message("خطا در برقراری ارتباط با سرور", ok));
      })
    }
  }


  onClose(){
    this.tempId = null;
    this.reply = null;
    document.getElementById('reply-box').classList.remove('on');
    document.getElementById('reply-box').classList.add('off');
  }

}
