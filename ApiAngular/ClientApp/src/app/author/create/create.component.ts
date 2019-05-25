  /*--------  */
 /* Imports */
/*--------*/
//#region
import { Component, OnInit } from '@angular/core';

import { Article, ArticleModel } from 'src/app/models/articles/article.model';
import { AuthService } from 'src/app/services/authentication.service';
import { AuthorPanelService } from 'src/app/services/author.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Message} from 'src/app/models/message.model';
import { MessageService } from 'src/app/services/message.service';
import { Router, ActivatedRoute } from '@angular/router';
//#endregion


@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {

    /*------------------------*/
   /* Properties and Fields */
  /*----------------------*/
  //#region
  public article : Article = new Article("", "", "", "", "", false) ;
  public articleForm: FormGroup ;
  private _editMode: boolean;
  /*_________Rich Text Config_________*/
  public onConfig = {
    height: "30rem",
    background: "#fff",
    uploadImagePath: 'http://localhost:5050/api/articles/EditorImage',
    toolbar: [
      ['misc', ['undo', 'redo']],
      ['font', ['bold', 'italic', 'underline', 'strikethrough', 'superscript', 'subscript', 'clear']],
      ['fontsize', ['fontname', 'fontsize', 'color']],
      ['insert', ['ltr', 'rtl']],
      ['para', ['paragraph', 'height', 'ul', 'ol', 'style']],
      ['insert', ['table', 'picture', 'link', 'video', 'hr']],
      ['imagesize', ['imageSize100', 'imageSize50', 'imageSize25']],
      ['float', ['floatLeft', 'floatRight', 'floatNone']],
      ['remove', ['removeMedia']],
      ['view', ['fullscreen', 'codeview']]
    ],
    fontSizes: ['8', '9', '12', '14', '16', '18', '20', '22', '24', '26', '28', '30', '32', '34', '36', '38', '40', '42', '44', '46', '48', '50', '52', '54', '56', '58', "72"],
    fontNames: [
                'B_Nazanin', 'B_Zar', 'B_Esfehan', 'B_Mitra',
                'B_Lotus', 'B_Titr', 'A_Dast_Nevis', 'B_Yas',
                'A_Mashin_Tahrir' , 'A_Hakim_Ghazali', 'Far_Cairo',
                'JMH_Typewriter', , 'Guardians'  ],
    fontNamesIgnoreCheck: [
                'B_Nazanin', 'B_Zar', 'B_Esfehan', 'B_Mitra',
                'B_Lotus', 'B_Titr', 'A_Dast_Nevis', 'B_Yas',
                'A_Mashin_Tahrir', 'A_Hakim_Ghazali', 'Far_Cairo',
                'JMH_Typewriter', , 'Guardians'],
  };
  public config_show = {
    height: "70rem",
    background: "#444",
    toolbar: [],
  }
  //#endregion

    /*---------------------------*/
   /* Constructor and ngOnInit */
  /*-------------------------*/
  //#region
  constructor(
    private _authService : AuthService,
    private _authorPanelService : AuthorPanelService,
    private _messageService : MessageService,
    private _router : Router,
    private _rotue : ActivatedRoute
  ) {

  }

  ngOnInit() {
    this._rotue.params.subscribe(pr => {
      if(pr['id']!="-"){
        this._editMode = true;
        this.article = this._authorPanelService.ReturnArticle(pr['id']);
        if(this.article !=null){
          this.articleForm = new FormGroup({
            "title": new FormControl(
              this.article.title,
              [
                Validators.required,
                Validators.minLength(5)
              ]),
            "tag": new FormControl(this.article.tag, [Validators.required]),
            "category": new FormControl(this.article.category, [Validators.required]),
            "summary": new FormControl(this.article.summary, [Validators.required]),
            "content": new FormControl(this.article.content, [Validators.required])
          });// End Of Form Group
        }else {
          let ok =[
            ['بستن', ()=>{}]
          ];
          this._messageService.currentMessage.next(
            new Message(
              "مقاله ای با این شناسه یافت نشد!",
              ok
            ));
          this._router.navigate(['authors','index','repository']);
        }
      }else {
        this._editMode = false;
        this.articleForm = new FormGroup({
          "title": new FormControl(
            null,
            [
              Validators.required,
              Validators.minLength(5)
            ]),
          "tag": new FormControl('تگ مقاله', [Validators.required]),
          "category": new FormControl('دسته بندی مقاله', [Validators.required]),
          "summary": new FormControl('', [Validators.required]),
          "content": new FormControl('', [Validators.required])
        });// End Of Form Group
      }
    })
  }
//#endregion

    /*---------------------*/
   /* Methods and Events */
  /*-------------------*/
  //#region
  public onSubmit(archive? : string){
    let ok=[
      ['بستن', ()=>{}]
    ];
    if(this._editMode){
      /*___Edit Message___*/
      let edit= [
        ['انصراف', ()=>{}],
        ['بله', ()=> {
          document.getElementById('wait').classList.remove('hide');
          this.article.title = this.articleForm.controls['title'].value;
          this.article.category = this.articleForm.controls['category'].value;
          this.article.tag = this.articleForm.controls['tag'].value;
          this.article.summary = this.articleForm.controls['summary'].value;
          this.article.content = this.articleForm.controls['content'].value;
          this.article.archive = archive == undefined ? false : true;
          this._authorPanelService.EditArticle(this.article)
            .subscribe(result => {
              if (result = "ok") {
                document.getElementById('wait').classList.add('hide');
                this._authorPanelService.FetchArticles();
                this._messageService.currentMessage.next(
                  new Message(
                    "مقاله با موفقیت ویرایش شد.",
                    ok
                  ));
                this._router.navigate(['authors', 'index', 'repository']);

              }
            }, error => {
              document.getElementById('wait').classList.add('hide');
              /*___Server Error Message___*/
              this._messageService.currentMessage.next(
                new Message(
                  "خطا در برقراری ارتباط با سرور...!",
                  ok
                ));
            });
        }]
      ]
      this._messageService.currentMessage.next(
        new Message(
          "ویرایش ذخیره شود؟",
          edit
        ));
    }else {
      /*___Creatation Message___*/
      let create=[
        ['انصراف', ()=>{}],
        ['بله', ()=> {
          document.getElementById('wait').classList.remove('hide');
          /*___Create Article___*/
          this.article = new ArticleModel(
            this.articleForm.controls['title'].value,
            this.articleForm.controls['category'].value,
            this.articleForm.controls['tag'].value,
            this.articleForm.controls['summary'].value,
            this.articleForm.controls['content'].value,
            archive == undefined ? false : true
          );
          /*___Send Article To Server___*/
          this._authorPanelService.CreateArticle(this.article)
            .subscribe(result => {
              if (result = "ok") {
                document.getElementById('wait').classList.add('hide');
                this._authorPanelService.FetchArticles();
                this._messageService.currentMessage.next(
                  new Message(
                    "مقاله جدید با موفقیت ایجاد شد.",
                    ok
                  ));
                this._router.navigate(['authors', 'index', 'repository']);
              }
            }, error => {
              document.getElementById('wait').classList.add('hide');
              /*___Server Error Message___*/
              this._messageService.currentMessage.next(
                new Message(
                  "خطا در برقراری ارتباط با سرور...!",
                  ok
                ));

            });
        }]
      ]
      this._messageService.currentMessage.next(
        new Message(
          "مقاله جدید ایجاد شود؟",
          create
        ));
    }
  }

  public onClosePreShow(){
    document.getElementById("home").classList.add("close-it");
    document.getElementById("home").classList.remove("show-it");
  }

  public onShowPreShow(){
    this.article = new ArticleModel(
      this.articleForm.controls['title'].value,
      this.articleForm.controls['category'].value,
      this.articleForm.controls['tag'].value,
      this.articleForm.controls['summary'].value,
      this.articleForm.controls['content'].value,
      false
    );
    document.getElementById("home").classList.remove("close-it");
    document.getElementById("home").classList.add("show-it");
  }
  //#endregion
}
