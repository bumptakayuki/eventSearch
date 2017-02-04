//ｰｰｰｰｰｰｰ-------------------
// 通信処理
//ｰｰｰｰｰｰｰ-------------------
import {Injectable} from "@angular/core";
import {RequestOptions, URLSearchParams, Jsonp, Response, RequestOptionsArgs} from "@angular/http";
import {Observable} from  "rxjs/Observable";
import "rxjs/add/operator/map";

@Injectable()
export class HttpService {

    //Web API URL
    // WEB_API_URL: string = "https://connpass.com/api/v1/event/";
    //
    WEB_API_URL:string = "http://localhost:8888/eventSearch/src/php/api.php";
    CALLBACK = "JSONP_CALLBACK";

    constructor(private jsonp:Jsonp) {
    }

    // APIからイベント情報取得
    getEventData(model,page):Observable<any> {

        //接続設定
        let option = this.setParam(model,page);

        //データ取得
        return this.reqData(option);
    }

    //通信設定値作成
    setParam(model,page):RequestOptions {

        //Urlパラメータオブジェクト作成
        let param = new URLSearchParams();
        param.set("keyword", model.name);
        let date = model.date.formatted.replace(/-/, '');
        let date2 = date.replace(/-/, '');
        param.set("ymd", date2);
        param.set("place", model.place);
        param.set("format", "jsonp");
        param.set("start", page);

        param.set("callback", this.CALLBACK);

        //通信設定オブジェクト作成
        let options:RequestOptionsArgs = {
            method: "get",
            url: this.WEB_API_URL,
            search: param,

        };
        return new RequestOptions(options);
    }

    //HTTPリクエストとレスポンス処理
    reqData(config:RequestOptions):Observable<any> {
        return this.jsonp.request(config.url, config)
            .map((response) => {

                    let eventData;
                    let obj = response.json();

                    //Web APIリクエスト成功
                    let dataObj = obj;
                    eventData = {
                        data: dataObj,
                    };
                    // }
                    return eventData;
                }
            );
    };
}

