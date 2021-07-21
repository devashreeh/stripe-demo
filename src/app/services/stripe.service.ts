import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StripeService {

  constructor(
    private http : HttpClient
  ) { }

  createCustomer(data:any){
    return this.http.post(environment.url + "/payments/createUser/",data);
  }

  attachCard(data:any){
    return this.http.post(environment.url + "/payments/attachPaymentMethod/",data);
  }

  makePayment(data:any){
    return this.http.post(environment.url + "/payments/createOneTimePayment/",data);
  }

  createSubscription(data:any){
    return this.http.post(environment.url + "/payments/createSubscription/",data);
  }

  generateLink(data:any){
    return this.http.post(environment.url + "/payments/generateLink/",data);
  }

  createConnectedAccount(){
    return this.http.post(environment.url + "/payments/createConnectedAccount/",{});
  }

  getSubscriptionPlans(){
    return this.http.get(environment.url + "/payments/getListOfSubscriptionPlan/")
  }

  captureFunds(data:any){
    return this.http.post(environment.url + "/payments/captureFunds/",data);
  }

  placeHoldOnCard(data:any){
    return this.http.post(environment.url + "/payments/placeHoldOnCard/",data);
  }

}
