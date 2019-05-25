import { Component, OnInit } from '@angular/core';
import { FooterService } from 'src/app/services/footer.service';
import { GodService } from 'src/app/services/god.service';

@Component({
  selector: 'app-god-login',
  templateUrl: './god-login.component.html',
  styleUrls: ['./god-login.component.scss']
})
export class GodLoginComponent implements OnInit {

  constructor(
    private footerService: FooterService,
    private godService: GodService) {
    this.footerService.state.next(false);
    this.godService.login();
 }

  ngOnInit() {
  }

}
