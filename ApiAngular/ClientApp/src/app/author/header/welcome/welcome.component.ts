import { Component, OnInit } from '@angular/core';
import { AuthorPanelService } from 'src/app/services/author.service';
import { Author } from "src/app/models/authors/author.model"
import { Profile } from 'src/app/models/authors/profile.model';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {

  public author: Profile;

  constructor(
    private _authorPanel : AuthorPanelService
  ) { }

  ngOnInit() {
    this.author = this._authorPanel.loginAuthor;
    this._authorPanel.loadAuthor.subscribe(r => {
      if(r== true){
        this.author = this._authorPanel.loginAuthor;
      }
    })
  }

  onRefresh(){
    this._authorPanel.FetchArticles();
    this._authorPanel.FetchAuthor();
    this._authorPanel.FetchTrashes();
  }

}
