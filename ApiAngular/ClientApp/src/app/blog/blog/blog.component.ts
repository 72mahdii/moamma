import { Component, OnInit } from '@angular/core';
import { Article } from 'src/app/models/articles/article.model';
import { Author } from 'src/app/models/authors/author.model';
import { ActivatedRoute } from '@angular/router';
import { RepositoryService } from 'src/app/services/repository.service';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})
export class BlogComponent implements OnInit {

  /*___Properties___*/


  //__Loading_Message
  public msg : string ="در حال بارگزاری اطلاعات";
  //___Articles_Authors
  private _articles : Article[] = [];
  private _state : {art : boolean, auth:boolean } = {art : false, auth : false}
  public authors : Author[] = [];
  public articles : {art : Article, auth: Author}[] = [];
  public cat :string = "مقاله";
  //___Pagination
  public currentPage : number;
  public pages : number ;
  public lastIndex : number;
  public startIndex: number;
  public pagesNumber : number []=[];
  //___Description
  private _des : string[] = [];
  public des : string;
  //___Search
  public totalSearch : boolean = false ;
  public searchWords : string ;
  public foundArticle : Article[] =[];

  /*___Constructor and ngOnInt___*/
  constructor(
    private _route : ActivatedRoute,
    private _repService : RepositoryService
  ) {
    this._des.push("تمام تلاش مدیریت ساخت در حوزه ساخت بهینه سازی هزینه ‌های ساخت برای ذی نفعان یک پروژه می باشد. با توجه به اینکه هر پروژه ویژگی های منحصر به فرد خودش را دارد می بایست در راستای افزایش راندمان پروژه ها و حداکثر سازی سود با کمترین میزان هزینه در پروژه ها به بهینه ترین حالت یک سیستم در پروژه رسید. این امر میسر نمیشود مگر با تلاش همه ذی نفعان پروژه و در راستای اقداماتی که می تواند بر روی عملکرد یک پروژه تاثیر گذار باشد. در این راستا تلاش می کنیم تا با معرفی مناسب ترین مقالات و مرجع ها و روش های مفید در حوزه ساخت گامی موثر در حوزه ساخت در کشور عزیزمان برداریم. ");
    this._des.push("همه چیزهایی که در اطراف خودتان می بینید توسط خاک یا سنگ پشتیبانی می شوند، که مهندسان ژئوتکنیک در قبال آن ها مسئول هستند. هر چیزی که توسط خاک یا سنگ پشتیبانی نمی شود، چه شناور باشد ، چه در اوج پرواز باشد در نهایت سقوط خواهد کرد . در ژئوتکنیک، به توضیح مکانیک خاک و سنگ و کاربردهای آن در پیشرفت و توسعه زندگی انسان می پردازدیم. مهندسی ژئوتکنیک بدون هیچ محدودیتی شامل، تجزیه و تحلیل، طراحی و ساخت شالوده ها، شیب ها، سازه های نگهدارنده، دیوار های خاکی، جاده ها، تونل ها، بنادر و دیگر سیستم های ساخته شده توسط خاک یا سنگ می شود. ");
    this._des.push("مهندسی زلزله(Earthquake Engineering) زمینه‌ای ‌ست بسیار متنوع و وسیع شامل مجموعه‌ای بزرگ از دانش‌ها و فنونگوناگون که حول اهداف حیاتی مربوط به مطالعه، طراحی، اجراء، کنترل، و نگهداری انواع سازه‌ها و پروژه‌های عمرانی درمقابل تأثیرات نیروها و بارهای ناشی از وقوع زمین‌لرزه های احتمالی و حصول هرچه افزون‌تر اطمینان از حداقل بودنخسارات وارد آمده، با هم جمع آمده‌اند.هدف ما آشنایی و طراحی و اجرای تکنولوژی های نوین در صنعت ساخت و ساز و استفاده از مصالح جدید برای کارایی های بهترو موثرتر در باربری سازه و همچنین چشم انداز بهتر از نقطه نظر معماری می باشد. ");
  }

  //___On_Page_Load
  ngOnInit() {
    this._route.params.subscribe(p => {
      // Show Loading
      document.getElementById('loading').classList.remove('hide');
      // Fetch Data
      if(!this._repService.onLoad){
        this._repService.GetData();
        this._repService.dataLoader.subscribe(r => {
          this._articles = this._repService.articles;
          this.authors = this._repService.authors;
          this.fixTag();
          this.onRouteChange(p["cat"]);
          this._repService.onLoad = true;
          document.getElementById('loading').classList.add('hide');
        })
      }else {
        this._articles = this._repService.articles;
        this.authors = this._repService.authors;
        this.fixTag();
        this.onRouteChange(p["cat"]);
        document.getElementById('loading').classList.add('hide');
      }
    })
  }


  /*___Methods___*/

  //___Search_Submit
  onSearch(){
    var cat;
    if(this.totalSearch){
      cat = "all";
    }else {
      cat = this._route.snapshot.params['cat'];
    }
    this.msg = 'در حال جست و جو';
    document.getElementById('loading').classList.remove('hide');
    this._repService.Search(this.searchWords, cat)
      .subscribe((r : any) => {
        if(r != null){
          this.foundArticle = r;
          this.foundArticle.forEach(a => {
              a.category = this.fixCatFound(a.category);
          });
          document.getElementById('loading').classList.add('hide');
          document.getElementById("srch").classList.remove('hide');
        }else {
          this.foundArticle = [];
          document.getElementById('loading').classList.add('hide');
          document.getElementById("srch").classList.remove('hide');

        }
      })
  }

  //___Change_Page_Event
  onChangePage(page : number ){
    let p = this._route.snapshot.params["cat"];
    if(page == 1){ this.onRouteChange(p)}else {
      this.articles = [];
      this.runPage(page);
      switch (p) {
        case "geo":
          {
            this.cat = "ژئوتکنیک";
            let counter = 0;
            this._articles.forEach(a => {
              if (a.category == "geo"
                && counter < this.lastIndex && counter >= this.startIndex) {

                this.articles.push({
                  art: a,
                  auth: this.findAuthor(a.authorId)
                });
              }
              counter = counter + 1;
            });
            break;
          }
        case "mng":
          {
            this.cat = "مدیریت ساخت";
            let counter = 0;
            this._articles.forEach(a => {
              if (a.category == "mng" && counter <= this.lastIndex && counter >= this.startIndex) {
                this.articles.push({
                  art: a,
                  auth: this.findAuthor(a.authorId)
                });
              }
              counter = counter + 1;
            });
            break;
          }
        case "earth":
          {
            this.cat = "زلزله";
            let counter = 0;
            this._articles.forEach(a => {
              if (a.category == "earth" && counter < this.lastIndex && counter >= this.startIndex) {
                this.articles.push({
                  art: a,
                  auth: this.findAuthor(a.authorId)
                });
              }
              counter = counter + 1;
            });
            break;
          }
        default:
          this.cat = "مقالات";
          break;
      }
    }
  }

  //___Close_Search_Form
  onCloseSearch(){
    this.searchWords = "";
    document.getElementById("srch").classList.add('hide');
  }

  //___On_Change_Page_Handle
  private onRouteChange(p: string){
    this.articles = [];
    switch (p) {
      case "geo":
        {
          this.des = this._des[1];
          this.cat = "ژئوتکنیک";
          let counter = 0;
          this._articles.forEach(a => {
            if (a.category == "geo" && counter < 5) {
              this.articles.push({
                art: a,
                auth: this.findAuthor(a.authorId)
              });
              counter = counter + 1;
            }
          });
          this.setUpPag();
          break;
        }
      case "mng":
        {
          this.des = this._des[0];
          this.cat = "مدیریت ساخت";
          let counter = 0;
          this._articles.forEach(a => {

            if (a.category == "mng" && counter < 5) {
              this.articles.push({
                art: a,
                auth: this.findAuthor(a.authorId)
              });
              counter = counter + 1;
            }
          });
          this.setUpPag();
          break;
        }
      case "earth":
        {
          this.des = this._des[2];
          this.cat = "زلزله";
          let counter = 0;
          this._articles.forEach(a => {
            if (a.category == "earth" && counter < 5) {
              this.articles.push({
                art: a,
                auth: this.findAuthor(a.authorId)
              });
              counter = counter + 1;
            }
          });
          this.setUpPag();
          break;
        }
      default:
        this.cat = "مقالات";
        break;
    }
  }

  //___Find_Authors
  private findAuthor (id){
    for(let i=0; i< this.authors.length; i++){
      if(this.authors[i].id == id){
        return this.authors[i];
      }
    }
    return null;
  }

  //___Initial_Page_Values
  private setUpPag(){
    let aC = 0;
    this._articles.forEach(a => {
      if(a.category == this._route.snapshot.params["cat"]){
        aC = aC +1;
      }
    })
    this.currentPage = 1;
    this.pages = aC / 5;
    this.pagesNumber = [];
    for(let i=0; i<this.pages; i++){
      this.pagesNumber.push(i+1);
    }
  }

  //___On_Change_Page
  private runPage(page : number ){
    this.currentPage = page;
    this.lastIndex = (this.currentPage * 5);
    this.startIndex = (this.currentPage * 5) - 5;

  }

  //___Translate_Tag_Value
  private fixTag (){
    this._articles.forEach(a => {
      switch (a.tag) {
        case "els": a.tag = "ELSEVIER"; break;
        case "spr" : a.tag = "SPRINGER"; break;
        case "none": a.tag = "بدونه تگ"; break;
        default: a.tag = "بدونه تگ";
          break;
      }
    })
  }

  //___Fix_Category_Found_Article
  private fixCatFound(cat : string){
    switch (cat) {
      case 'geo': return "ژئوتکینک"; break;
      case 'earth': return "زلزله"; break;
      case 'mng': return "مدیریت ساخت"; break;
    }
  }
}
