import { Component, OnInit } from '@angular/core';
import { FooterService } from 'src/app/services/footer.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  private _footerState: boolean = true;
  constructor(private footerService: FooterService) {

  }

  ngOnInit() {
    this.footerService.state.subscribe(result => {
      this._footerState = result;
    })
  }

}
