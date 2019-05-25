/*___Imports___*/
//#region
import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import {
  UserManager,
  UserManagerSettings,
  User,
  WebStorageStateStore,
} from "oidc-client";
import { BehaviorSubject } from 'rxjs';
//#endregion


@Injectable()
export class AuthService {

  /*                       */
  /*  Property and Fields  */
  /*                       */
  //#region
  private _manager = new UserManager(getClientSettings());
  private _user: User = null;
  private _authState = new BehaviorSubject<boolean>(false);
  public authState$ = this._authState.asObservable();
  //#endregion


  /*               */
  /*  Constructor  */
  /*               */
  //#region
  constructor(private http: HttpClient) {
    this._manager.getUser().then(user => {
      this._user = user;
      this._authState.next(this.isAuth());
    })
  }
  //#endregion


  /*___Methods___*/
  //#region

  /*___Checkout Authentication___*/
  public isAuth(): boolean {
    return this._user != null && !this._user.expired;
  }

  /*___Login___*/
  public login() {
    return this._manager.signinRedirect();
  }

  /*___Registration___*/
  public register() { }

  /*___Sign Out___*/
  public signOut() {
    this._manager.signoutRedirectCallback("http://moammapey.ir/");
  }

  /*___Get Authorization Header___*/
  get authorHeader() {
    return `${this._user.token_type} ${this._user.access_token}`;
  }

  /*___Complete the Authentication___*/
  async completeAuth() {
    this._user = await this._manager.signinRedirectCallback();
    this._authState.next(this.isAuth());
  }

  /*___Checkout Authentication___*/
  checkoutUser() {
    this._manager.getUser().then(user => {
      this._user = user;
      this._authState.next(this.isAuth());
    })
  }

  //#endregion

}

export function getClientSettings(): UserManagerSettings {
  return {
    authority: "http://authors.moammapey.ir",
    client_id: "moamma_spa",
    redirect_uri: 'http://moammapey.ir/auth-callback',
    post_logout_redirect_uri: 'http://moammapey.ir/authors/index/',
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
