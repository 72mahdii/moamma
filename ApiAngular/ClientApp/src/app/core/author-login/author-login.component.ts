import { Component, OnInit } from '@angular/core';
import { FooterService } from 'src/app/services/footer.service';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-author-login',
  templateUrl: './author-login.component.html',
  styleUrls: ['./author-login.component.scss']
})
export class AuthorLoginComponent implements OnInit {

  constructor(
    private footerService : FooterService,
    private authService : AuthService) {
    this.footerService.state.next(false);
    this.authService.login();
   }

  ngOnInit() {
  }

}
