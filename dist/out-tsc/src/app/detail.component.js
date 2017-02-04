var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, Input, ViewChild } from "@angular/core";
import { ModalDirective } from "ng2-bootstrap/ng2-bootstrap";
export var DetailComponent = (function () {
    function DetailComponent() {
    }
    //ダイアログを開く
    DetailComponent.prototype.openDialog = function () {
        this.modalRef.config.backdrop = false; // workaround
        this.modalRef.show();
    };
    __decorate([
        Input(), 
        __metadata('design:type', Object)
    ], DetailComponent.prototype, "tourData", void 0);
    __decorate([
        //親コンポーネントから受取る属性
        ViewChild("lgModal"), 
        __metadata('design:type', ModalDirective)
    ], DetailComponent.prototype, "modalRef", void 0);
    DetailComponent = __decorate([
        Component({
            selector: "detail-dialog",
            templateUrl: "./detail.component.html",
            styleUrls: ["./detail.component.css"],
        }), 
        __metadata('design:paramtypes', [])
    ], DetailComponent);
    return DetailComponent;
}());
//# sourceMappingURL=/Applications/MAMP/htdocs/eventSearch/src/src/app/detail.component.js.map