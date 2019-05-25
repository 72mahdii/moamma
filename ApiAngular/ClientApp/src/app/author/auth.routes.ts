import { Routes, RouterModule } from "@angular/router";
import { IndexComponent } from './index/index.component';
import { ArticlesListComponent } from './articles-list/articles-list.component';
import { ArchiveComponent } from './archive/archive.component';
import { TrashComponent } from './trash/trash.component';
import { AuthGuard } from '../guards/authentication.guard';
import { AvatarComponent } from './settings/avatar/avatar.component';
import { PasswordComponent } from './settings/password/password.component';
import { ProfileComponent } from './settings/profile/profile.component';
import { CreateComponent } from './create/create.component';
import { CommentComponent } from './comment/comment.component';
import { ArticleCommentsComponent } from './article-comments/article-comments.component';

const children: Routes =[
  { path: "repository", component: ArticlesListComponent },
  { path: "archive", component: ArchiveComponent },
  { path: "trash", component: TrashComponent},
  { path: "comment-manager", component: CommentComponent } ,
  { path: "article-comments/:id", component: ArticleCommentsComponent },
  { path: "avatar-setting", component: AvatarComponent },
  { path: "change-password", component: PasswordComponent },
  { path: "change-profile", component: ProfileComponent },
  { path: "create-article/:id", component: CreateComponent }
];

const routes : Routes =[
  { path: "authors/index", component: IndexComponent, children: children
  , canActivate: [AuthGuard] },
];

export const AuthRoutes = RouterModule.forRoot(routes);
