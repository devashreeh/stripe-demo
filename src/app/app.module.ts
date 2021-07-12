import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StripePaymentModule } from './stripe-payment/stripe-payment.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    StripePaymentModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
