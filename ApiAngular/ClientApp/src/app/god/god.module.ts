import { NgModule } from "@angular/core";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { IndexComponent } from './index/index.component';
import { GodRoutes } from './god.routes';
import { GodService } from '../services/god.service';
import { GodGuard } from '../guards/god.guard';
import { GodPanelService } from '../services/godPanel.service';


@NgModule({
  imports:[
    CommonModule,
    FormsModule,
    BrowserModule,
    HttpClientModule,
    GodRoutes
  ],
  providers: [GodService, GodGuard, GodPanelService],
  declarations:[IndexComponent],
})
export class GodModule {}
