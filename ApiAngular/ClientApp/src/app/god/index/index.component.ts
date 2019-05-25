import { Component, OnInit } from '@angular/core';
import { GodService } from 'src/app/services/god.service';
import { Author } from 'src/app/models/authors/author.model';
import { GodPanelService } from 'src/app/services/godPanel.service';
import { ChangePasswordG } from 'src/app/models/authors/changePassword.model';
import { ChangeProfG } from 'src/app/models/authors/changeProfile.model';
import { CreateAuthor } from 'src/app/models/authors/createAuthor.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {

  public authors : Author[] = [];
  public userName : ChangeProfG = new ChangeProfG("","");
  public password : ChangePasswordG = new ChangePasswordG("","");
  public createAuthor = new CreateAuthor("","","","","");
  constructor(
    private _godService : GodService,
    private _godPanel : GodPanelService,
    private _router : Router
  ) { }

  ngOnInit() {
    this._godPanel.FetchAuthor().subscribe(
      r => {if(r !=null){this.authors = r;}},
      error =>
      {
        if(error.status == 403){
          document.getElementById("fr").classList.remove('hide');
        }
      });
  }


  /*___Remove User Event___*/
  onRemove(id){
    this._godPanel.RemoveAuthor(id)
      .subscribe(r => {
        if(r == "ok") {
          this._godPanel.FetchAuthor()
            .subscribe(r => this.authors = r);
        }
      });
  }

  /*___Show Create Form___*/
  onShowCreate(id){
    document.getElementById('create').classList.remove('hide');
  }

  /*___Show Password Change Form___*/
  onShowPass(id){
    this.password.id = id;
    document.getElementById("password").classList.remove('hide');
  }

  /*___Show Username Change Form___*/
  onShowUsername(id){
    this.userName.id = id;
    document.getElementById("username").classList.remove('hide');

  }

  /*___Close Button___*/
  onClose(id){
    document.getElementById(id).classList.add('hide');
  }

  /*___Create Event___*/
  onSubmitCreate(){
    this._godPanel.CreateAuthor(this.createAuthor).subscribe(r => {
      if(r == "ok"){
        this._godPanel.FetchAuthor().subscribe(
          r => {
            if (r != null) {
              this.authors = r;
            }})
        document.getElementById('create').classList.add('hide');
      }
    })
  }

  /*___Exit User___*/
  onExit(){
    this._godService.signOut();
    this._router.navigate(['index']);

  }

  /*___Exit Forbiden User___*/
  onOut(){
    this._godService.signOut();
    this._router.navigate(['index']);
  }

  /*___Change Pass Event___*/
  onSubmitPass(){
    this._godPanel.ChangePassword(this.password).subscribe(
      r => {
        if(r =="ok"){
          this.password = new ChangePasswordG("","");
          document.getElementById('password').classList.add('hide');
        }
      }
    )
  }

  /*___Change Username Event___*/
  onSubmitUsername(){
    this._godPanel.ChangeProfile(this.userName).subscribe(r => {
      if(r=="ok"){
        this._godPanel.FetchAuthor().subscribe(
          r => {
            if (r != null) {
              this.authors = r;
              this.userName = new ChangeProfG("","");
              document.getElementById('username').classList.add('hide');
            }
          }
        );
      }
    });
  }


}
