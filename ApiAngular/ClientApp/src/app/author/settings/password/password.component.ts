import { Component, OnInit } from '@angular/core';
import { Password } from 'src/app/models/authors/password.model';
import { MessageService } from 'src/app/services/message.service';
import { Message } from 'src/app/models/message.model';
import { AuthorPanelService } from 'src/app/services/author.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.scss']
})
export class PasswordComponent implements OnInit {
    /*------------------------*/
   /* Properties and Fields */
  /*----------------------*/
  //#region
  public password : Password = new Password("","");
  public formValid :boolean = false;

  //#endregion

    /*-------------------------*/
   /* Construct and ngOnInit */
  /*-----------------------*/
  //#region
  constructor(
    private _messageService : MessageService,
    private _authorPanel : AuthorPanelService,
    private _router : Router
  ) { }

  ngOnInit() {
  }
//#endregion

  /*---------------------*/
 /* Methods and Events */
/*-------------------*/
//#region
  onChange(){
    if(this.password.newPass != this.password.repPass){
      this.formValid = false;
    }else {
      this.formValid = true;
    }
  }

  onSubmit(){
    let ok = [['بستن', ()=>{}]];
    let conf = [
      ['انصراف', ()=>{}],
      ['بله', ()=> {
        document.getElementById('wait').classList.remove('hide');
        this._authorPanel.ChangePassowrd(this.password).subscribe(rs => {
          if (rs == "ok") {
            document.getElementById('wait').classList.add('hide');
            this._messageService.currentMessage.next(
              new Message(
                "رمز عبور بروز رسانی شد.",
                ok
              ));
              this._router.navigate(['authors','index','repository']);
          } else {
            document.getElementById('wait').classList.add('hide');
            this._messageService.currentMessage.next(
              new Message(
                "خطا در بروزرسانی رمز عبور",
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
        "اعلام تغییرات رمزعبور؟",
        conf
      ));
  }
  //#endregion
}
