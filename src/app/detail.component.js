"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require("@angular/core");
var DetailComponent = (function () {
    function DetailComponent() {
    }
    //ダイアログを開く
    DetailComponent.prototype.openDialog = function () {
        this.modalRef.config.backdrop = false; // workaround
        this.modalRef.show();
    };
    __decorate([
        core_1.Input()
    ], DetailComponent.prototype, "tourData", void 0);
    __decorate([
        //親コンポーネントから受取る属性
        core_1.ViewChild("lgModal")
    ], DetailComponent.prototype, "modalRef", void 0);
    DetailComponent = __decorate([
        core_1.Component({
            selector: "detail-dialog",
            templateUrl: "./detail.component.html",
            styleUrls: ["./detail.component.css"],
        })
    ], DetailComponent);
    return DetailComponent;
}());
exports.DetailComponent = DetailComponent;
