import { Injectable } from "@angular/core";
import { Message } from '../models/message.model';
import { Subject } from 'rxjs';

@Injectable()

export class MessageService {

  public currentMessage = new Subject<Message>();

}
