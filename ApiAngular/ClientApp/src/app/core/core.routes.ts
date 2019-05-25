import { Routes, RouterModule } from "@angular/router";
import { IndexComponent } from './index/index.component';
import { AuthorLoginComponent } from './author-login/author-login.component';
import { CallBackComponent } from './call-back/call-back.component';
import { GodBackComponent } from './god-back/god-back.component';
import { GodLoginComponent } from './god-login/god-login.component';
import { NotFoundComponent } from './not-found/not-found.component';
// import { SupportComponent } from './support/support.component';
// import { SupportGuard } from '../guards/support.guard';
import { JointComponent } from './joint/joint.component';

const routes: Routes = [
  { path: "", component: IndexComponent , pathMatch:"full" },
  { path: "index", redirectTo: "" },
  { path: "home", redirectTo: "" },
  { path: "joint", component : JointComponent },
  { path: "auth-callback", component: CallBackComponent },
  { path: "_72_11_01", component: AuthorLoginComponent },
  { path: "_god_77_10_01", component: GodLoginComponent },
  { path: "god-back", component: GodBackComponent },
  // { path: "support/:id", component: SupportComponent, canActivate:[SupportGuard] },
  { path: "**", component: NotFoundComponent }
]

export const CoreRoutes = RouterModule.forRoot(routes);
