import { Injectable } from "@angular/core";
import {
  Router,
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
} from "@angular/router";
import { AuthService } from "../services/authentication.service";

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router,
    private authService: AuthService
  ) { }


  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (this.authService.isAuth()) { return true; }
    this.router.navigate(
      ["/_72_11_01"],
      { queryParams: { redirect: state.url }, replaceUrl: true });
    return false;
  }
}
