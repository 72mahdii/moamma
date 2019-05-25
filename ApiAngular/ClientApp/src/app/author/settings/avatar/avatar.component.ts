    /*           */
   /* Imports  */
  /*         */
 //#region */
import { Component, OnInit } from '@angular/core';
import * as $ from "jquery";
import { AuthorPanelService } from 'src/app/services/author.service';
import { MessageService } from 'src/app/services/message.service';
import { Message} from 'src/app/models/message.model';
import { Router } from '@angular/router';
//#endregion
/*_______*/


@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss']
})


export class AvatarComponent implements OnInit {

    /*                       */
   /* Properties and Fields */
  /*                       */
 //#region                */

  public imageSrc : any;
  public uploadedImage : File = null;

//#endregion
/*_______________________*/

    /*                          */
   /* Constructor and ngOnInit */
  /*                          */
 //#region                   */
  constructor(
    private _authorPanel : AuthorPanelService,
    private _messageService : MessageService,
    private _router : Router
    ) { }

  ngOnInit() {
  }
  //#endregion
/*_______________________   */


    /*                    */
   /* Methods and Events */
  /*                    */
 //#region             */
  onUploadMyImg(event) {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];

      const reader = new FileReader();
      reader.onload = e => this.imageSrc = reader.result;

      reader.readAsDataURL(file);
      this.uploadedImage = file;
    }
  }
  onSubmit(){
    let ok = [['بستن', ()=>{}]];
    let confirm = [
      ['انصراف', ()=>{}],
      ['بله', ()=> {
        if (this.uploadedImage != null) {
          document.getElementById('wait').classList.remove('hide');
          this._authorPanel.changeAvatar(this.uploadedImage).subscribe(rs => {
            if (rs == "ok") {
              this._authorPanel.FetchAuthor();
              document.getElementById('wait').classList.add('hide');
              this._messageService.currentMessage.next(
                new Message(
                  "آواتار با موفقیت بروز شد.",
                  ok
                ));
              this._router.navigate(['authors', 'index', 'repository'])
            } else {
              document.getElementById('wait').classList.add('hide');
              this._messageService.currentMessage.next(
                new Message(
                  'خطا در بروزرسانی آواتار',
                  ok
                ));
              this._router.navigate(['authors', 'index', 'repository']);

            }
          }, error => {
              document.getElementById('wait').classList.add('hide');
              this._messageService.currentMessage.next(
                new Message(
                  'خطا در برقراری ارتباط با سرور',
                  ok
                ));
              this._router.navigate(['authors', 'index', 'repository']);

          });
        }
      }]
    ];
    this._messageService.currentMessage.next(
      new Message(
        "آواتار بروز رسانی شود؟",
        confirm
      ));

  }
  //#endregion
/*____________________*/


}
