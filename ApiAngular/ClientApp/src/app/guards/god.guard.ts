import { Injectable } from "@angular/core";
import {
  Router,
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
} from "@angular/router";
import { GodService } from '../services/god.service';

@Injectable()
export class GodGuard implements CanActivate {

  constructor(
    private router: Router,
    private godService: GodService
  ) { }


  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (this.godService.isAuth()) { return true; }
    this.router.navigate(
      ["/_god_77_10_01"],
      { queryParams: { redirect: state.url }, replaceUrl: true });
    return false;
  }
}
