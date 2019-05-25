import { Injectable} from "@angular/core";
import { Subject } from 'rxjs';

@Injectable()
export class FooterService {
  state: Subject<boolean> = new Subject<boolean>();
}
