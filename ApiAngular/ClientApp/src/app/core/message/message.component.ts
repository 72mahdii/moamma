import { Component, OnInit } from '@angular/core';
import { Message } from 'src/app/models/message.model';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit {


 public message : Message = new Message();
 public msg : boolean = false;



  constructor(private messageServcie: MessageService) { }
  ngOnInit() {
    this.messageServcie.currentMessage.subscribe((msg : Message) => {
      this.message = msg;
      this.msg = true;
    })

  }

  onPushBtn(rsp){
    rsp[1]();
    this.msg = false;
  }
}
