import { Routes, RouterModule } from "@angular/router";
import { IndexComponent } from '../god/index/index.component';
import { GodGuard } from '../guards/god.guard';

const routes : Routes = [
  { path:"_god_77_10_01/index", component : IndexComponent, canActivate:[GodGuard] }
]

export const GodRoutes = RouterModule.forRoot(routes);
