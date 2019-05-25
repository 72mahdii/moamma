import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { CommonModule } from '@angular/common';
import { CoreModule } from './core/core.module';
import { FooterService } from './services/footer.service';
import { MessageService } from './services/message.service';
import { RepositoryService } from './services/repository.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    CoreModule,

  ],
  providers: [FooterService, MessageService, RepositoryService],
  bootstrap: [AppComponent]
})
export class AppModule { }
