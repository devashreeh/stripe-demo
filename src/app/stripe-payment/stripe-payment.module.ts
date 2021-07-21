import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StripePaymentRoutingModule } from './stripe-payment-routing.module';
import { StripePaymentComponent } from './stripe-payment/stripe-payment.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
// import { NgxSpinnerModule } from "ngx-spinner";
import { ToastrModule } from 'ngx-toastr';
import { SubscriptionPlansComponent } from './subscription-plans/subscription-plans.component';

@NgModule({
  declarations: [
    StripePaymentComponent,
    SubscriptionPlansComponent
  ],
  imports: [
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    StripePaymentRoutingModule,
    // NgxSpinnerModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: "toast-bottom-right",
      preventDuplicates: true
    })
  ]
})
export class StripePaymentModule { }
