import { NgModule } from '@angular/core';
// import dirictive and  pipes la such as NgIf, NgFor, DecimalPipe

import { CommonModule } from '@angular/common';
// CreateEmployeeComponent uses ReactiveFormsModule directives such as
// formGroup so ReactiveFormsModule needs to be imported into this Module
// An alternative approach would be to create a Shared module and export
// the ReactiveFormsModule from it, so any other module that needs
// ReactiveFormsModule can import it from the SharedModule.
import { ReactiveFormsModule } from '@angular/forms';

// Import and declare the components that belong to this Employee Module
import { CreateEmployeeComponent } from './create-employee.component';
import { ListEmployeesComponent } from './list-employees.component';
import { EmployeeRoutingModule } from './employee-routing.module';

@NgModule({
  declarations: [
    CreateEmployeeComponent,
    ListEmployeesComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    EmployeeRoutingModule
  ]
  //Nếu bạn muốn các thành phần thuộc về mô-đun này, có sẵn cho // các mô-đun khác,
  // nhập mô-đun này, sau đó bao gồm tất cả các mô-đun // các thành phần trong mảng xuất khẩu.
  // Tương tự, bạn cũng có thể xuất // Mô-đun góc nhập khẩu
  // exports: [
  //   CreateEmployeeComponent,
  //   ReactiveFormsModule
  // ]
})
export class EmployeeModule { }
