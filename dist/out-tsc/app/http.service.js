var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from "@angular/core";
import { RequestOptions, URLSearchParams, Jsonp } from "@angular/http";
import "rxjs/add/operator/map";
export var HttpService = (function () {
    function HttpService(jsonp) {
        this.jsonp = jsonp;
        //Web API URL
        this.WEB_API_URL = "https://connpass.com/api/v1/event/";
        this.CALLBACK = "JSONP_CALLBACK";
    }
    // APIからイベント情報取得
    HttpService.prototype.getEventData = function (model) {
        //接続設定
        var option = this.setParam(model);
        //データ取得
        return this.reqData(option);
    };
    //通信設定値作成
    HttpService.prototype.setParam = function (model) {
        //Urlパラメータオブジェクト作成
        var param = new URLSearchParams();
        param.set("keyword", model.name);
        param.set("format", "jsonp");
        param.set("callback", this.CALLBACK);
        //通信設定オブジェクト作成
        var options = {
            method: "get",
            url: this.WEB_API_URL,
            search: param
        };
        return new RequestOptions(options);
    };
    //HTTPリクエストとレスポンス処理
    HttpService.prototype.reqData = function (config) {
        return this.jsonp.request(config.url, config)
            .map(function (response) {
            var eventData;
            var obj = response.json();
            //Web APIリクエスト成功
            console.dir(obj);
            var dataObj = obj;
            eventData = {
                data: dataObj,
            };
            // }
            return eventData;
        });
    };
    ;
    HttpService = __decorate([
        Injectable(), 
        __metadata('design:paramtypes', [Jsonp])
    ], HttpService);
    return HttpService;
}());
//# sourceMappingURL=/Applications/MAMP/htdocs/eventSearch/src/app/http.service.js.map