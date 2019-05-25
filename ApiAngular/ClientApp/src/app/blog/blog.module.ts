import { NgModule } from "@angular/core";
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BlogRoutes } from './blog.routes';

import { BlogComponent } from './blog/blog.component';
import { ArticleComponent } from './article/article.component';
import { NgxSummernoteModule } from 'ngx-summernote';

@NgModule({
  declarations:[
    BlogComponent,
    ArticleComponent,
  ],
  imports:[
    CommonModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    BlogRoutes,
    NgxSummernoteModule

  ],
  providers:[]
})
export class BlogModule{}
