import { Component, OnInit } from '@angular/core';
import { RepositoryService } from 'src/app/services/repository.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {

  private _toggleState: boolean = false;

  constructor(
    private _repService : RepositoryService
  ) {}

  ngOnInit() {
    this.smartToggle();

  }


  onToggle(index: number){
    this.onSelectToggle(index);
  }

  onActive(el: string) {
    switch (el) {
      case 'rebar':
        document.getElementById("rebar").classList.remove("deactive");
        document.getElementById("rebar").classList.add("active");
        break;

      case 'team':
        document.getElementById('team').classList.remove('deactive');
        document.getElementById('team').classList.add('active');

    }
  }

  onClose(rebar: string) {
    switch (rebar) {
      case 'rebar':
        document.getElementById("rebar").classList.remove("active");
        document.getElementById("rebar").classList.add("deactive");
        break;
      case 'team':
        document.getElementById('team').classList.remove('active');
        document.getElementById('team').classList.add('deactive');
    }
  }

  /*********** ***********/
  //  Private Methods   //
  /*********** ***********/
  private onSelectToggle(elInd?:number){
    var dom = document.getElementsByClassName("des-box");
    var tDom = document.getElementsByClassName("diamond");
    for (var i = 0; i < dom.length; i++) {
      dom[i].classList.remove("toggle-show");
      dom[i].classList.remove("toggle-hide");
      dom[i].classList.add("toggle-hide");
      tDom[i].classList.remove("st-btn");
      tDom[i].classList.remove("un-btn");
      tDom[i].classList.add("un-btn");
    }
    if (elInd == dom.length - 1) {
      dom[0].classList.remove("toggle-hide");
      dom[0].classList.add("toggle-show");
      tDom[0].classList.remove("un-btn");
      tDom[0].classList.add('st-btn');
    } else {
      dom[elInd + 1].classList.remove("toggle-hide");
      dom[elInd + 1].classList.add("toggle-show");
      tDom[elInd + 1].classList.remove('un-btn');
      tDom[elInd + 1].classList.add('st-btn');
    }
    this._toggleState = true;
  }

  private smartToggle(elInd?: number) {
    if (elInd == undefined) {
      setInterval(() => {
        var dom = document.getElementsByClassName("des-box");
        var tDom = document.getElementsByClassName("diamond");
        for (var i = 0; i < dom.length; i++) {
          if (dom[i].classList[1] == "toggle-show" && !this._toggleState) {
            if (i == dom.length - 1) {
              dom[i].classList.remove("toggle-show");
              tDom[i].classList.remove("st-btn");
              dom[i].classList.add("toggle-hide");
              tDom[i].classList.add("un-btn")
              dom[0].classList.remove("toggle-hide");
              tDom[0].classList.remove("un-btn");
              dom[0].classList.add("toggle-show");
              tDom[0].classList.add("st-btn");
              this._toggleState = true;
            } else {
              dom[i].classList.remove("toggle-show");
              tDom[i].classList.remove("st-btn");
              dom[i].classList.add("toggle-hide");
              tDom[i].classList.add("un-btn");
              dom[i + 1].classList.remove("toggle-hide");
              tDom[i + 1].classList.remove("un-btn");
              dom[i + 1].classList.add("toggle-show");
              tDom[i + 1].classList.add("st-btn");
              this._toggleState = true;
            }

          }
          if (i == dom.length - 1) {
            this._toggleState = false;
          }
        }
      }, 7000);
    } else {
      var dom = document.getElementsByClassName("des-box");
      var tDom = document.getElementsByClassName("diamond");
      for (var i = 0; i < dom.length; i++) {
        dom[i].classList.remove("toggle-show");
        dom[i].classList.remove("toggle-hide");
        dom[i].classList.add("toggle-hide");
        tDom[i].classList.remove("st-btn");
        tDom[i].classList.remove("un-btn");
        tDom[i].classList.add("un-btn");
      }
      if (elInd == dom.length - 1) {
        dom[0].classList.remove("toggle-hide");
        dom[0].classList.add("toggle-show");
        tDom[0].classList.remove("un-btn");
        tDom[0].classList.add('st-btn');
      } else {
        dom[elInd + 1].classList.remove("toggle-hide");
        dom[elInd + 1].classList.add("toggle-show");
        tDom[elInd + 1].classList.remove('un-btn');
        tDom[elInd + 1].classList.add('st-btn');
      }

      this._toggleState = true;

    }
  }

}
