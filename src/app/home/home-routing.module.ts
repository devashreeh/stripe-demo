import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';

const routes: Routes =[
  {
    path: '',
    component: HomeComponent, 
    data: {
      name: 'home'
    },
    children : [
      {
        path: 'stripe-demo',
        component: HomeComponent, 
        data: {
          name: 'home'
        },
      },
      {
        path: '',
        redirectTo: 'stripe-demo',
        pathMatch: 'full'
      }
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
