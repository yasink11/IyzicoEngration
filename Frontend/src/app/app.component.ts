import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { SignalRService } from './signal-r.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h1>Iyzico pay</h1>
<div *ngIf="!isPaymentSuccess">
<button (click)="pay()">Pay</button>
    <br>
    <br>
    <iframe *ngIf="html" [src]="html"  width="500" height="500"></iframe>
</div>
<div *ngIf="isPaymentSuccess">
  <h1>{{success}}</h1>
</div>
  `
})
export class AppComponent {
  html: any;
  success: string = "Ödeme Başarılı";
  isPaymentSuccess: boolean = false;

  constructor(
    private http: HttpClient,
    private sanitizer: DomSanitizer,
    private srv: SignalRService
  ) {
    this.srv.startConnection();
    this.srv.paymentResult((data:any)=>{
      if(data.status === "success"){
        this.isPaymentSuccess=true
      }
      console.log(data)
    })
  }

  pay() {
    this.http.get("https://localhost:7008/api/Payments/Pay").subscribe((res: any) => {
      this.srv.registerTransactionId(res.conversationId);
      const blob = new Blob([res.content], { type: "text/html" });
      const obj = URL.createObjectURL(blob)
      this.html = this.sanitizer.bypassSecurityTrustResourceUrl(obj)
    })
  }

}
