import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/authentication.service';
import { FooterService } from 'src/app/services/footer.service';

@Component({
  selector: 'app-call-back',
  templateUrl: './call-back.component.html',
  styleUrls: ['./call-back.component.scss']
})
export class CallBackComponent implements OnInit {

  constructor(
    private router : Router,
    private route : ActivatedRoute,
    private authService : AuthService,
    private _footerService: FooterService,

  ) { }

  async ngOnInit() {
    this._footerService.state.next(false);
    if(this.route.snapshot.fragment.indexOf('error')>=0){
      // do something later
    }
    await this.authService.completeAuth();
    this.router.navigate(['/authors', 'index']);

  }

}
