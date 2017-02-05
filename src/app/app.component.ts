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

    isRunning = false;

    delay = true;

    results_returned;

    results_start;


    // デフォルト値
    places = [
        '東京都', '神奈川県', '茨城県', '栃木県', '群馬県', '埼玉県', '千葉県',
        '北海道', '青森県', '岩手県', '宮城県', '秋田県', '山形県', '福島県',
        '新潟県', '富山県', '石川県', '福井県', '山梨県', '長野県', '岐阜県',
        '静岡県', '愛知県', '三重県', '滋賀県', '京都府', '大阪府', '兵庫県',
        '奈良県', '和歌山県', '鳥取県', '島根県', '岡山県', '広島県', '山口県',
        '徳島県', '香川県', '愛媛県', '高知県', '福岡県', '佐賀県', '長崎県',
        '熊本県', '大分県', '宮崎県', '鹿児島県', '沖縄県'
    ];

    // デフォルト値
    model = new Hero(18, 'test', this.places[0], null, false, 0, 'test');

    public existsFlg = true;

    submitted = false;

    // onSubmit() { this.submitted = true; }

    newHero() {
        this.model = new Hero(42, '', '', null, false, 0);
    }

    //modal 表示用
    viewContainerRef;

    /**
     * コンストラクタ
     *
     * @param httpService
     * @param viewContainerRef
     */
    public constructor(private httpService:HttpService, viewContainerRef:ViewContainerRef) {
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
     * イベント検索実行
     *
     * @param index
     */
    onSubmit(page) {

        this.getEvent(this.model, page);

    }

    /**
     * イベント情報の取得
     */
    private getEvent(model, page) {

        this.selectedData = null;
        this.events = null;
        this.existsFlg = true;

        this.model.spinner = true;

        this.httpService.getEventData(model, page).subscribe((result) => {
                this.setEvent(result);
                model.requestCount++;
            },
            (err)=>alert("通信エラー\n" + err),
            ()=> {
                this.model.spinner = false;
            });
    }

    /**
     * イベント情報を設定する
     *
     * @param result
     * @param i
     */
    private setEvent(result) {

        //Web APIデータ取得エラー発生時
        if (result.error) {
            alert("Web APIエラー\n" + result.message);
            return;
        }
        this.events = result.data.events;
        this.results_returned = result.data.results_returned;
        this.results_start = result.data.results_start;

        if (this.results_returned != 0) {
            this.existsFlg = true;
        } else {
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

    public itemsPerPage:number = 3;
    public currentPage:number = 1;
    private _maxPage:number;

    range() {
        if (this.events == null) {
            return;
        }

        //this._maxPage = Math.ceil(this.events.length/this.itemsPerPage);
        var ret = [];
        for (var i = 1; i <= 5; i++) {
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
