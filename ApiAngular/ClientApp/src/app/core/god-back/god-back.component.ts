import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { GodService } from 'src/app/services/god.service';
import { FooterService } from 'src/app/services/footer.service';

@Component({
  selector: 'app-god-back',
  templateUrl: './god-back.component.html',
  styleUrls: ['./god-back.component.scss']
})
export class GodBackComponent implements OnInit {

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private godService: GodService,
    private _footerService: FooterService,

  ) { }

  async ngOnInit() {
    this._footerService.state.next(false);
    if (this.route.snapshot.fragment.indexOf('error') >= 0) {
      // do something later
    }
    await this.godService.completeAuth();
    this.router.navigate(['_god_77_10_01','index']);

  }


}
