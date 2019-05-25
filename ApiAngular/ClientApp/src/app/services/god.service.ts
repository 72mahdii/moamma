import { Injectable } from "@angular/core";
import { UserManager, User, WebStorageStateStore, UserManagerSettings } from 'oidc-client';
import { BehaviorSubject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Password } from '../models/authors/password.model';


@Injectable()
export class GodService {

  private _manager = new UserManager(getClientSettings());
  private _user: User = null;
  private _authState = new BehaviorSubject<boolean>(false);
  public authState$ = this._authState.asObservable();

  constructor(private http: HttpClient) {
    this._manager.getUser().then(user => {
      this._user = user;
    })
  }

  public isAuth(): boolean {
    return this._user != null && !this._user.expired;
  }

  /*>>>> Login <<<<*/
  public login() {
    return this._manager.signinRedirect();
  }

  public signOut() {
    this._manager.signoutRedirectCallback("http://moammapey.ir");
    // this._manager.signoutRedirect();
  }

  public changePassword() {
    const header = this.headerMaker();
    this.http.post("http://moammapey.ir/api/god/ChangePassword", new Password("", ""), header)
      .subscribe(r => {
      });
  }

  /*>>>> Get Authorization Header <<<<*/
  get authorHeader() {
    return `${this._user.token_type} ${this._user.access_token}`;
  }

  /*>>>> Complete the Authentication <<<<*/
  async completeAuth() {
    this._user = await this._manager.signinRedirectCallback();
    this._authState.next(this.isAuth());
  }

  /*>>>> Checkout Authentication <<<<*/
  checkoutUser() {
    this._manager.getUser().then(user => {
      this._user = user;
      this._authState.next(this.isAuth());
    })
  }


  public headerMaker(contentType = undefined) {
    if (contentType != undefined) {
      return {
        headers: new HttpHeaders({
          'Content-Type': contentType,
          'Authorization': this.authorHeader
        })
      }
    } else {
      return {
        headers: new HttpHeaders({
          'Authorization': this.authorHeader
        })
      }
    }
  }

}


export function getClientSettings(): UserManagerSettings {
  return {
    authority: "http://authors.moammapey.ir",
    client_id: "god_spa",
    redirect_uri: 'http://moammapey.ir/god-back',
    post_logout_redirect_uri: 'http://moammapey.ir/index/',
    response_type: "id_token token",
    scope: "openid profile email api.read",
    filterProtocolClaims: true,
    userStore:
      new WebStorageStateStore({ store: window.localStorage }),
    loadUserInfo: true,
    automaticSilentRenew: true,
    silent_redirect_uri: "http://moammapey.ir/silent-refresh.html"
  };
}
