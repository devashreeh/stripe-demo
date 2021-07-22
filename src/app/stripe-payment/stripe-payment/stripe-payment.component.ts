import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, OnInit } from '@angular/core';
import { loadStripe } from "@stripe/stripe-js";
import { environment } from 'src/environments/environment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StripeService } from 'src/app/services/stripe.service';
import { countries } from '../../../assets/countries.json';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-stripe-payment',
  templateUrl: './stripe-payment.component.html',
  styleUrls: ['./stripe-payment.component.scss']
})
export class StripePaymentComponent implements OnInit {

  public card: any;
  public stripe: any;
  public cardElement : any;
  public zipCode : any;
  public countryList = countries;
  public customerForm: FormGroup | any;
  public stripePlans = [];
  public fromPayment : any;
  public stripePlanId :any;
  public step1 : boolean = true;
  public step2 : boolean = false;
  public accountId : any;
  public waiting = false;
  public priceId : any;
  public planName : any;
  public paymentSuccess = false;

  constructor(
    public modal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private stripeService : StripeService,
    private toastr: ToastrService
  ) { }

  ngOnInit(){
    this.customerForm = this.formBuilder.group({
      name: ["", Validators.required],
      email: ["", Validators.required],
      country: ["", Validators.required],
      amount :[""] 
    });
    this.customerForm.patchValue({
      country : "US"
    });
  }

  ngAfterViewInit() {
    this.initStripe();
  }

  /*******************************************************************
   * @description Function to load stripe and set card elements
   *
   * @author-Devashree hingne
   * @created_date - 16/07/2021
   ******************************************************************/

  async initStripe() {

    const stripe : any = await loadStripe(environment.stripeKey);

    const elements = stripe.elements({});

    var style = {
      base: {
        color: "#828282",
        fontSize: "16px",
        "::placeholder": {
          color: "#828282",
          opacity: 1,
        },
        fontFamily: 'Sans-serif',
      },
      invalid: {
        color: "#fa755a",
        iconColor: "#fa755a",
      },
    };

    var card = elements.create("card", { style: style });
    card.mount("#card-element");
    this.cardElement = card;
    // Handle real-time validation errors from the card Element.
    card.on("change", (event:any) => {
      this.zipCode = event.value.postalCode;
      var displayError = <HTMLElement>document.getElementById("card-errors");
      if (event.error) {
        displayError.textContent = event.error.message;
      } else {
        displayError.textContent = "";
      }
    });

    this.stripe = stripe;
    this.card = card;
  }

 
  payNow(){
    
    if (this.customerForm.invalid || (this.fromPayment == 'onetime' && !this.customerForm.value.amount)) {
      return;
    } else {
      this.waiting = true;
      const ownerInfo = {
        name: this.customerForm.value.name,
        address_zip: this.zipCode,
        email: this.customerForm.value.email,
      };

      // stripe creates token to send card details on backend side
      new Promise((resolve, reject) => {
        this.stripe.createToken(this.card, ownerInfo).then(
          async (result:any) => {
            if (result.error) {
              this.waiting = false;
              var errorElement : any = document.getElementById("card-errors");
              errorElement.textContent = result.error.message;
              console.log("token error", result.error);
              this.toastr.error(result.error.message);
              reject(result.error);
            } else {
              resolve(result.token.id);
            }
          },
          (err:any) => {
            console.error(err);
            this.waiting = false;
            this.toastr.error(
              "Failed while processing payment. Please try again!"
            );
            reject(err);
          }
        );
      }).then((token) => {
        this.createStripeCustomer(token);
      });
    }
  }


  createStripeCustomer(token:any){
    let obj = {
      email: this.customerForm.value.email,
      token: token
    };
    this.stripeService.createCustomer(obj).subscribe((res: any) => {
      if(res.status_code == 200){
        let stripe_customer_id = res.data.customer;
        sessionStorage.setItem("customerId",stripe_customer_id);
        sessionStorage.setItem("emailId",this.customerForm.value.email);
        if(this.fromPayment == "onetime"){
          this.makePayment(stripe_customer_id);
        }else{
          this.createSubscription(stripe_customer_id);
        }
      }
    })
  }

  makePayment(stripe_customer_id: any){
    let obj = {
      "customer_id":stripe_customer_id,
      "amount": this.customerForm.value.amount * 100
    }
    this.stripeService.makePayment(obj).subscribe((resp:any)=>{
      if(resp.status_code == 200){
        this.waiting = false;
        this.paymentSuccess = true;
      }
    },(err)=>{
      console.log(err);
      this.waiting = false;
    })
  }

  attachCard(stripe_customer_id:any){
    let data = {
      "customer_id": stripe_customer_id
    }
    this.stripeService.attachCard(data).subscribe((resp:any)=>{
      if(resp.status_code == 200){
        this.makePayment(stripe_customer_id);
      }
    })
  }

  stripePlan(planId :any){ 
    this.stripePlanId = planId;
  }


  createSubscription(stripe_customer_id: any){
    let obj = {
      "price_id": this.priceId,
      "customer_id":stripe_customer_id
    }
    this.stripeService.createSubscription(obj).subscribe((resp:any)=>{
      if(resp.status_code == 200){
        this.paymentSuccess = true;
        localStorage.setItem("plan",this.planName);
      } 
    },(err)=>{
      console.log(err);
    })
  }

  createAccount(){
    this.waiting = true;
    this.stripeService.createConnectedAccount().subscribe((resp:any)=>{
      if(resp){
        this.waiting = false;
        this.step1 = false;
        this.step2 = true;
        this.accountId = resp.data.id;
      }else{
        this.waiting = false;
      }
    })
  }

  generateLink(){
    this.waiting = true;
    let obj = {
      "account_id": this.accountId,
      "url":"http://localhost:4200/"
    }
    this.stripeService.generateLink(obj).subscribe((resp:any)=>{
      if(resp.status_code == 200)
      {
        this.modal.close();
        this.waiting = false;
        window.open(resp.data.url,"_blank");
      }
    })
  }

  close(){
    this.modal.close();
  }

}
