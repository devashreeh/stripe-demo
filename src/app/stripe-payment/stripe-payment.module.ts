import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StripePaymentRoutingModule } from './stripe-payment-routing.module';
import { StripePaymentComponent } from './stripe-payment/stripe-payment.component';


@NgModule({
  declarations: [
    StripePaymentComponent
  ],
  imports: [
    CommonModule,
    StripePaymentRoutingModule
  ]
})
export class StripePaymentModule { }
