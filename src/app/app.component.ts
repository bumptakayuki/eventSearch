import {Component} from '@angular/core';
import {OnInit} from '@angular/core';
import {HttpService} from "./http.service";
//import {DetailComponent} from './detail.component';
import {ViewContainerRef, ViewChild} from '@angular/core';
import {HostListener} from '@angular/core';
import {Hero}    from './hero';
import {empty} from "rxjs/Observer";
import {isEmpty} from "rxjs/operator/isEmpty";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  //ツアー明細ダイアログの参照取得
  //@ViewChild("detailDialog") detailComponent: DetailComponent;

  //選択したイベント情報(１件分）
  eventObj;

  //選択したイベント情報
  selectedData;

  // イベント情報
  events;

  //ブックマーク
  bookmarks;

  //PCとモバイルの判定
  isMobile = false;

  //モバイル判定画面幅
  MOBILE_SCREEN_WIDTH = 768;

  // 開閉制御
  isCollapsed = false;

  myModel = '';

  isRunning=false;

  delay=true;

  results_returned;

  results_start;

  //３エリアの全データ
  areas = [
    {code: "BCH", name: "ビーチリゾート", data: null},
    // {code: "EUR", name: "ヨーロッパ", data: null},
    // {code: "DUS", name: "アメリカ", data: null},
    // {code: "BOOKMARK", name: "お気に入り", data: null},
  ];


  // デフォルト値
  places = ['東京都', '神奈川県', '群馬県', '福島県'];

  // デフォルト値
  model = new Hero(18, 'test', this.places[0],null,false,0, 'test');

  public existsFlg = true;

  submitted = false;

  // onSubmit() { this.submitted = true; }

  newHero() {
    this.model = new Hero(42, '','', null,false,0);
  }

  //modal 表示用
  viewContainerRef;

  /**
   * コンストラクタ
   *
   * @param httpService
   * @param viewContainerRef
   */
  public constructor(private httpService: HttpService, viewContainerRef: ViewContainerRef) {
    this.viewContainerRef = viewContainerRef;
  }

  /**
   * アプリ起動時の処理
   */
  public ngOnInit() {


    // 保存したブックマークの取得
    this.initBookmarks();

    // PCとモバイルデバイスの判定
    this.onScreenResize();
  }


  /**
   * エリアメニュー選択時
   *
   * @param index
   */
  private onAreaChange(index) {

    let area = this.areas[index];

    //ブックマーク選択時
    if (area.code === "BOOKMARK") {
      if (Object.keys(this.bookmarks).length === 0) {
        alert("ブックマークが登録されていません");
        return;
      }
      this.selectedData = Object.keys(this.bookmarks)
        .map(key => this.bookmarks[key]);
    } else {
      //エリア名選択時
      this.selectedData = area.data.data;
    }
    //スクロール位置をリセット(一部のブラウザはタイマーから呼び出しが必要）
    setTimeout(scroll(0, 0), 1);
  }

  /**
   * イベント検索実行
   *
   * @param index
   */
  onSubmit(page) {

    this.getEvent(this.model,page);

  }

  /**
   * イベント情報の取得
   */
  private getEvent(model,page) {

    this.selectedData = null;
    this.events = null;
    this.existsFlg = true;

    for (let i = 0; i < this.areas.length; i++) {

      let areaCode = this.areas[i].code;
      if (areaCode === "BOOKMARK") { //お気に入りはローカル保存のため受信不要
        continue;
      }

      this.model.spinner = true;

      this.httpService.getEventData(model,page).subscribe((result) =>{
          this.setEvent(result, i)
            model.requestCount++;
        },
        (err)=>alert("通信エラー\n" + err) ,
        ()=>{
          this.model.spinner = false;
        });

    }

  }

  /**
   * イベント情報を設定する
   *
   * @param result
   * @param i
   */
  private setEvent(result, i) {

    //Web APIデータ取得エラー発生時
    if (result.error) {
      alert("Web APIエラー\n" + result.message);
      return;
    }
    this.events = result.data.events;
    this.results_returned = result.data.results_returned;
    this.results_start = result.data.results_start;

    if(this.results_returned!=0){
      this.existsFlg = true;
    }else{
      this.existsFlg = false;
    }

    //Web APIデータ取得成功時
    // this.areas[i].data = result;
  }


  /**
   * 保存したブックマーク情報の読み取り
   */
  private initBookmarks() {
    let storeData = localStorage.getItem("bookmarks");
    if (storeData) {
      this.bookmarks = JSON.parse(storeData);
    } else {
      this.bookmarks = {};
    }
  }

  /**
   * ブックマークボタンのクリック時
   *
   * @param tourID
   * @param index
   */
  private onBookmarkClick(tourID, index) {
    //登録が無い場合はブックマーク情報に追加
    if (!this.isMarked(tourID)) {
      //登録件数の確認
      if (Object.keys(this.bookmarks).length === 10) {
        return alert("Bookmarkは最大10件です");
      }
      //登録
      this.bookmarks[tourID] = this.selectedData[index];
    } else {
      //登録済みの場合はブックマーク情報から削除
      delete this.bookmarks[tourID];
    }
    //更新されたブックマーク情報の保存
    localStorage.setItem(
      "bookmarks", JSON.stringify(this.bookmarks));
  }

  /**
   * ブックマーク登録済み確認
   *
   * @param tourID
   */
  private isMarked(tourID) {
    return this.bookmarks[tourID];
  }


  /**
   * ツアー詳細ボタンクリック時
   *
   * @param index
   */
  //private onDetailClick(index) {
  //  this.eventObj = this.selectedData[index];
  //  this.detailComponent.openDialog();
  //}

  /**
   * resizeイベント
   */
  @HostListener('window:resize')
  onScreenResize() {
    this.isMobile = (innerWidth < this.MOBILE_SCREEN_WIDTH);
  }

  public itemsPerPage: number = 3;
  public currentPage: number = 1;
  private _maxPage: number;

   range() {
     if(this.events == null){
       return;
     }

    //this._maxPage = Math.ceil(this.events.length/this.itemsPerPage);
    var ret = [];
    for (var i=1; i<=5; i++) {
      ret.push(i);
    }

    return ret;
  };

  setPage(n) {
    this.currentPage = n;
    this.onSubmit(this.currentPage);
  };

  prevPage() {
    if (this.currentPage > 1) {
      --this.currentPage;
    }
    this.onSubmit(this.currentPage);
  };

  nextPage() {
    if (this.currentPage < this._maxPage) {
      ++this.currentPage;
    }
    this.onSubmit(this.currentPage);
  };

  prevPageDisabled() {
    return this.currentPage === 1 ? "disabled" : "";
  };

  nextPageDisabled() {
    return this.currentPage === this._maxPage ? "disabled" : "";
  };

}
