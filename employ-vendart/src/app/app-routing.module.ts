import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListEmployeesComponent } from './employee/list-employees.component';
import { CreateEmployeeComponent } from './employee/create-employee.component';

const routes: Routes = [
  { path: 'list', component: ListEmployeesComponent },
//  { path: 'create', component: CreateEmployeeComponent },
//  { path: 'edit/:id', component: CreateEmployeeComponent },
{ path: 'employees', loadChildren: './employee/employee.module#EmployeeModule' },
  { path: '', redirectTo: '/list', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
