import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { StripeService } from 'src/app/services/stripe.service';
import { StripePaymentComponent } from '../stripe-payment/stripe-payment.component';

@Component({
  selector: 'app-subscription-plans',
  templateUrl: './subscription-plans.component.html',
  styleUrls: ['./subscription-plans.component.scss']
})
export class SubscriptionPlansComponent implements OnInit {

  stripePlans = [];

  constructor(
    private stripeService : StripeService,
    private modalService : NgbModal
  ) { }

  ngOnInit(): void {
    this.getStripePlans();
  }

  getStripePlans(){
    this.stripeService.getSubscriptionPlans().subscribe((resp:any)=>{
      if(resp.status_code == 200){
        this.stripePlans = resp.data;
        this.stripePlans = this.stripePlans.reverse();
      }
    });
  }

  proceedPayment(priceId : string,name: string){
    const modalRef = this.modalService.open(StripePaymentComponent, { centered: true, keyboard: false, windowClass: 'custom-class', size: 'md' ,  backdrop : 'static'});
    modalRef.componentInstance.type = 'test mode';
    modalRef.componentInstance.fromPayment  = 'subscription';
    modalRef.componentInstance.priceId = priceId;
    modalRef.componentInstance.planName = name;
    modalRef.result.then((result:any) => {
    }, (reason:any) => {
      console.log(reason);
    });
  }
}
