import { NgModule } from "@angular/core";
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { CoreRoutes } from './core.routes';
import { IndexComponent } from './index/index.component';
import { AuthorLoginComponent } from './author-login/author-login.component';
import { CallBackComponent } from './call-back/call-back.component';
import { GodBackComponent } from './god-back/god-back.component';
import { GodLoginComponent } from './god-login/god-login.component';
import { GodService } from '../services/god.service';
import { NotFoundComponent } from './not-found/not-found.component';
import { FormsModule } from '@angular/forms';
import { JointComponent } from './joint/joint.component';
import { AuthModule } from '../author/author.module';


@NgModule({
  declarations:[
    IndexComponent,
    AuthorLoginComponent,
    CallBackComponent,
    GodBackComponent,
    GodLoginComponent,
    NotFoundComponent,
    JointComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    CoreRoutes,
    AuthModule
  ],
  providers: [GodService],
})
export class CoreModule{}
