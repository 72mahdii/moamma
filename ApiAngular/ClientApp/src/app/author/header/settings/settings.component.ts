import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/authentication.service';
import { Router } from '@angular/router';
import { MessageService } from 'src/app/services/message.service';
import { Message } from 'src/app/models/message.model';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  constructor(
    private _authServcie : AuthService,
    private _router : Router,
    private _messageService : MessageService
  ) { }

  ngOnInit() {
  }

  onExit(){
    let confirm = [
      ['انصراف', ()=>{}],
      ['بله', () => {
        this._authServcie.signOut();
        this._router.navigate(['']);
      }]
    ]
    this._messageService.currentMessage.next(
      new Message(
      "از ناحیه کاربری خارج می شوید؟",
      confirm
    ));
  }

}
