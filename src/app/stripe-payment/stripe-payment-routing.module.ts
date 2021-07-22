import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SubscriptionPlansComponent } from './subscription-plans/subscription-plans.component';

const routes: Routes = [
    {
      path: '',
      component: SubscriptionPlansComponent, 
      data: {
        name: 'plans'
      },
      children : [
        {
          path: 'subscription-plans',
          component: SubscriptionPlansComponent, 
          data: {
            name: 'subscription-plans'
          },
        },
        {
          path: '',
          redirectTo: 'subscription-plans',
          pathMatch: 'full'
        }
      ]
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StripePaymentRoutingModule { }
