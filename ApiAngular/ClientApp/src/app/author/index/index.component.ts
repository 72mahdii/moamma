    /*---------*/
  /* Imports */
/*---------*/
//#region
import { Component, OnInit } from '@angular/core';
import { FooterService } from 'src/app/services/footer.service';
import { AuthorPanelService } from 'src/app/services/author.service';
import { MessageService } from 'src/app/services/message.service';
import { Router } from '@angular/router';
//#endregion


@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})

export class IndexComponent implements OnInit {

    /*-------------------------*/
   /* Construct and ngOnInit */
  /*-----------------------*/
  //#region
  constructor(
    private _footerService: FooterService,
    private _authorPanel : AuthorPanelService,
    private _messageService: MessageService,
    private _router : Router
    ) { }

  ngOnInit() {
    this._footerService.state.next(false);
    this._authorPanel.FetchArticles();
    document.getElementById('pop').classList.remove('hide');
    document.getElementById('pop').classList.add('show');
    if(this._authorPanel.articlesList.length >0){
      document.getElementById("login").classList.add('hide');
    }
    this._authorPanel.FetchAuthor();
    this._router.navigate(['authors','index','repository'])
    setTimeout(() => {
      document.getElementById('pop').classList.remove('show');
      document.getElementById('pop').classList.add('hide');
    }, 10000);

  }
  //#endregion

    /*---------------------*/
   /* Methods and Events */
  /*-------------------*/
  //#region
  onClose() {
    document.getElementById('pop').classList.add('hide');
    document.getElementById('pop').classList.remove('show');
  }
  //#endregion
}
