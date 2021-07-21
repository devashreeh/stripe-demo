import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
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
    public modal: NgbActiveModal,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.getStripePlans();
  }

  getStripePlans(){
    this.stripeService.getSubscriptionPlans().subscribe((resp:any)=>{
      if(resp.status_code == 200){
        this.stripePlans = resp.data.data;
      }
    });
  }

  close(){
    this.modal.close();
  }

  proceedPayment(){
    this.modal.close();
    const modalRef = this.modalService.open(StripePaymentComponent, { centered: true, keyboard: false, windowClass: 'custom-class', size: 'md' ,  backdrop : 'static'});
    modalRef.componentInstance.type = 'test mode';
    modalRef.componentInstance.fromPayment  = 'subscription';
    modalRef.componentInstance.priceId = 'price_1JD6w5SIFEgGtsdxnj15jLq2';
    modalRef.result.then((result:any) => {
    }, (reason:any) => {
      console.log(reason);
    });
  }
}
