import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { Route, RouterModule } from '@angular/router';
import { UserRegistrationModule } from '../user-registration/user-registration.module';
import { UserListComponent } from './components/user-list/user-list.component';
import { DeleteModalComponent } from './components/delete-modal/delete-modal.component';
export const  routes: Route[] = [
  {
    path: '',
    component: DashboardComponent
  }
]


@NgModule({
  declarations: [DashboardComponent, UserListComponent, DeleteModalComponent],
  imports: [
    CommonModule,
    UserRegistrationModule,
    RouterModule.forChild([])
  ],
  exports: [
    DashboardComponent
  ]
})
export class DashboardModule { }
