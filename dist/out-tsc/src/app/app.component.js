var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component } from '@angular/core';
import { HttpService } from "./http.service";
import { DetailComponent } from './detail.component';
import { ViewContainerRef, ViewChild } from '@angular/core';
import { HostListener } from '@angular/core';
import { Hero } from './hero';
export var AppComponent = (function () {
    /**
     * コンストラクタ
     *
     * @param httpService
     * @param viewContainerRef
     */
    function AppComponent(httpService, viewContainerRef) {
        this.httpService = httpService;
        //PCとモバイルの判定
        this.isMobile = false;
        //モバイル判定画面幅
        this.MOBILE_SCREEN_WIDTH = 768;
        // 開閉制御
        this.isCollapsed = false;
        this.myModel = '';
        this.isRunning = false;
        this.delay = true;
        //３エリアの全データ
        this.areas = [
            { code: "BCH", name: "ビーチリゾート", data: null },
        ];
        // デフォルト値
        this.powers = ['PHP', 'Java', 'Ruby', 'JavaScript'];
        // デフォルト値
        this.model = new Hero(18, 'test', this.powers[0], '', false, 'test');
        this.submitted = false;
        this.viewContainerRef = viewContainerRef;
    }
    // onSubmit() { this.submitted = true; }
    AppComponent.prototype.newHero = function () {
        this.model = new Hero(42, '', '', '', false);
    };
    /**
     * アプリ起動時の処理
     */
    AppComponent.prototype.ngOnInit = function () {
        // 保存したブックマークの取得
        this.initBookmarks();
        // PCとモバイルデバイスの判定
        this.onScreenResize();
    };
    /**
     * エリアメニュー選択時
     *
     * @param index
     */
    AppComponent.prototype.onAreaChange = function (index) {
        var _this = this;
        var area = this.areas[index];
        //ブックマーク選択時
        if (area.code === "BOOKMARK") {
            if (Object.keys(this.bookmarks).length === 0) {
                alert("ブックマークが登録されていません");
                return;
            }
            this.selectedData = Object.keys(this.bookmarks)
                .map(function (key) { return _this.bookmarks[key]; });
        }
        else {
            //エリア名選択時
            this.selectedData = area.data.data;
        }
        //スクロール位置をリセット(一部のブラウザはタイマーから呼び出しが必要）
        setTimeout(scroll(0, 0), 1);
    };
    /**
     * イベント検索実行
     *
     * @param index
     */
    AppComponent.prototype.onSubmit = function () {
        console.log(this.model);
        this.getEvent(this.model);
    };
    /**
     * イベント情報の取得
     */
    AppComponent.prototype.getEvent = function (model) {
        var _this = this;
        this.selectedData = null;
        this.events = null;
        var _loop_1 = function(i) {
            var areaCode = this_1.areas[i].code;
            if (areaCode === "BOOKMARK") {
                return "continue";
            }
            // this.httpService.getEventData(model).subscribe(
            //   result => this.setEvent(result, i), //通信成功時の処理
            //
            //   error => alert("通信エラー\n" + error) //通信失敗時の処理
            //
            // );
            this_1.model.spinner = true;
            this_1.httpService.getEventData(model).subscribe(function (result) {
                _this.setEvent(result, i);
            }, function (err) { return alert("通信エラー\n" + err); }, function () {
                console.log("Done");
                _this.model.spinner = false;
            });
        };
        var this_1 = this;
        for (var i = 0; i < this.areas.length; i++) {
            _loop_1(i);
        }
    };
    /**
     * イベント情報を設定する
     *
     * @param result
     * @param i
     */
    AppComponent.prototype.setEvent = function (result, i) {
        console.log(result);
        //Web APIデータ取得エラー発生時
        if (result.error) {
            alert("Web APIエラー\n" + result.message);
            return;
        }
        this.events = result.data.events;
        //Web APIデータ取得成功時
        // this.areas[i].data = result;
    };
    /**
     * 保存したブックマーク情報の読み取り
     */
    AppComponent.prototype.initBookmarks = function () {
        var storeData = localStorage.getItem("bookmarks");
        if (storeData) {
            this.bookmarks = JSON.parse(storeData);
        }
        else {
            this.bookmarks = {};
        }
    };
    /**
     * ブックマークボタンのクリック時
     *
     * @param tourID
     * @param index
     */
    AppComponent.prototype.onBookmarkClick = function (tourID, index) {
        //登録が無い場合はブックマーク情報に追加
        if (!this.isMarked(tourID)) {
            //登録件数の確認
            if (Object.keys(this.bookmarks).length === 10) {
                return alert("Bookmarkは最大10件です");
            }
            //登録
            this.bookmarks[tourID] = this.selectedData[index];
        }
        else {
            //登録済みの場合はブックマーク情報から削除
            delete this.bookmarks[tourID];
        }
        //更新されたブックマーク情報の保存
        localStorage.setItem("bookmarks", JSON.stringify(this.bookmarks));
    };
    /**
     * ブックマーク登録済み確認
     *
     * @param tourID
     */
    AppComponent.prototype.isMarked = function (tourID) {
        return this.bookmarks[tourID];
    };
    /**
     * ツアー詳細ボタンクリック時
     *
     * @param index
     */
    AppComponent.prototype.onDetailClick = function (index) {
        this.eventObj = this.selectedData[index];
        this.detailComponent.openDialog();
    };
    /**
     * resizeイベント
     */
    AppComponent.prototype.onScreenResize = function () {
        this.isMobile = (innerWidth < this.MOBILE_SCREEN_WIDTH);
    };
    __decorate([
        ViewChild("detailDialog"), 
        __metadata('design:type', DetailComponent)
    ], AppComponent.prototype, "detailComponent", void 0);
    __decorate([
        HostListener('window:resize'), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', []), 
        __metadata('design:returntype', void 0)
    ], AppComponent.prototype, "onScreenResize", null);
    AppComponent = __decorate([
        Component({
            selector: 'app-root',
            templateUrl: './app.component.html',
            styleUrls: ['./app.component.css']
        }), 
        __metadata('design:paramtypes', [HttpService, ViewContainerRef])
    ], AppComponent);
    return AppComponent;
}());
//# sourceMappingURL=/Applications/MAMP/htdocs/eventSearch/src/src/app/app.component.js.map