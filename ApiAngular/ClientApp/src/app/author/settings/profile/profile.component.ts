    /*---------*/
  /* Imports */
/*---------*/
//#region
import { Component, OnInit } from '@angular/core';
import { Profile } from 'src/app/models/authors/profile.model';
import { Message } from 'src/app/models/message.model';
import { MessageService } from 'src/app/services/message.service';
import { AuthorPanelService } from 'src/app/services/author.service';
import { Router } from '@angular/router';
//#endregion


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})

export class ProfileComponent implements OnInit {

  public profile : Profile  = new Profile("","","", "");
  public categoryLabel:string;
      /*------------------------*/
    /* Construct and ngOnInit */
  /*------------------------*/
  //#region
  constructor(
    private _messageService : MessageService,
    private _authorPanel : AuthorPanelService,
    private _router : Router
  ) { }

  ngOnInit() {
    var author = this._authorPanel.loginAuthor;
    this.profile.email = author.email;
    this.profile.persianName = author.persianName;
    this.profile.userName = author.userName;
    this.profile.imageAddress = author.imageAddress;
    switch (author.category) {
      case "geo": this.categoryLabel = "ژئوتکنیک"; break;
      case "earth": this.categoryLabel = "زلزله"; break;
      case "mng": this.categoryLabel = "مدیریت ساخت"; break;
      default: this.categoryLabel = "---"; break;
    }
    this.profile.category = author.category;
  }
  //#endregion

    /*--------------------*/
  /* Methods and Events */
/*--------------------*/
//#region
  onSubmit(){

    let ok = [['بستن', ()=>{}]];
    let conf = [
      ['انصراف', ()=>{}],
      ['بله', ()=>{
        document.getElementById('wait').classList.remove('hide');
        this._authorPanel.ChangeProfile(this.profile)
          .subscribe(rs => {
            if (rs == "ok") {
              document.getElementById('wait').classList.add('hide');
              this._messageService.currentMessage.next(
                new Message(
                  "تغییرات پروفایل با موفقیت انجام شد.",
                  ok
                ));
                this._authorPanel.FetchAuthor();
                this._router.navigate(['authors','index','repository']);
            } else {
              document.getElementById('wait').classList.add('hide');
              this._messageService.currentMessage.next(
                new Message(
                  "خطا در عملیات بروز رسانی پروفایل",
                  ok
                ));
              this._router.navigate(['authors', 'index', 'repository']);

            }
          }, error => {
            document.getElementById('wait').classList.add('hide');
            this._messageService.currentMessage.next(
                new Message(
                  "خطا در برقراری ارتباط با سرور",
                  ok
                ));
              this._router.navigate(['authors', 'index', 'repository']);

          });
      }]
    ];
    this._messageService.currentMessage.next(
      new Message(
        "اعمال تغییرات پروفایل؟",
        conf
      ));
  }
  //#endregion

}
