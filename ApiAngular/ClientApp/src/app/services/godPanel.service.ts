import { Injectable, OnInit } from "@angular/core";
import { GodService } from './god.service';
import { HttpClient } from '@angular/common/http';
import { ChangeProfG } from '../models/authors/changeProfile.model';
import { ChangePasswordG } from '../models/authors/changePassword.model';
import { CreateAuthor } from '../models/authors/createAuthor.model';
import { RemoveAuthor } from '../models/authors/removeAuthor.model';

@Injectable()
export class GodPanelService implements OnInit {
  private _url = "/api/god/";

  constructor(
    private _godService : GodService,
    private _http : HttpClient,
  ){}

  ngOnInit(){}

  /*___Remvoe Author___*/
  public RemoveAuthor(id:string){
    const header = this._godService.headerMaker();
    return this._http.post(this._url +
      "RemoveAuthor", new RemoveAuthor(id), header);
  }


  /*___Fetch Authors___*/
  public FetchAuthor() {
    var header = this._godService.headerMaker();
    return this._http.get<any>(this._url + "FetchAuthor", header);
  }


  /*___Create Author___*/
  public CreateAuthor(author : CreateAuthor){
    const header = this._godService.headerMaker();
    return this._http.post(this._url + "Create", author, header);
  }

  /*___Change Password__*/
  public ChangePassword(psw : ChangePasswordG){
    const header = this._godService.headerMaker();
    return this._http.post(this._url +
      "changepassword", psw, header);
  }



  /*___Change Username___*/
  public ChangeProfile(profile: ChangeProfG) {
    const header = this._godService.headerMaker();
    return this._http.post(this._url +
      "changeprofile", profile, header);
  }
}
