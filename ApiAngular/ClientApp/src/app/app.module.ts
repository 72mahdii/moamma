import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { CommonModule } from '@angular/common';
import { CoreModule } from './core/core.module';
import { FooterService } from './services/footer.service';
import { MessageService } from './services/message.service';
import { RepositoryService } from './services/repository.service';
import { FooterComponent } from './core/footer/footer.component';
import { MessageComponent } from './core/message/message.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    MessageComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule,
    CoreModule,

  ],
  providers: [FooterService, MessageService, RepositoryService],
  bootstrap: [AppComponent]
})
export class AppModule { }
