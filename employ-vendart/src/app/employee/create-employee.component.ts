import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl,FormBuilder, Validators, AbstractControl, FormArray  } from '@angular/forms';
import { CustomValidators } from '../shared/custom.validators';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { EmployeeService } from './employee.service';
import { IEmployee } from './IEmployee';
import { ISkill } from './ISkill';
@Component({
  selector: 'app-create-employee',
  templateUrl: './create-employee.component.html',
  styleUrls: ['./create-employee.component.css']
})



export class CreateEmployeeComponent implements OnInit {
  employeeForm: FormGroup;
  employee: IEmployee;
  pageTitle: string;

  formErrors = {
    'fullName': '',
    'email': '',
    'confirmEmail': '',
    'emailGroup': '',
    'phone':'',
    // 'skillName': '',
    // 'experienceInYears': '',
    // 'proficiency': ''
  };
  validationMessages = {
    'fullName': {
      'required': 'Full Name is required.',
      'minlength': 'Full Name must be greater than 2 characters.',
   //   'maxlength': 'Full Name must be less than 10 characters.'
    },
    'email': {
      'required': 'Email is required.',
      'emailDomain': 'Email domian should be dell.com'
    },
    'confirmEmail': {
      'required': 'Confirm Email is required.'
    },
    'emailGroup': {
      'emailMismatch': 'Email and Confirm Email do not match.'
    },
    'phone': {
      'required': 'Phone is required'
    }
    // 'skillName': {
    //   'required': 'Skill Name is required.',
    // },
    // 'experienceInYears': {
    //   'required': 'Experience is required.',
    // },
    // 'proficiency': {
    //   'required': 'Proficiency is required.',
    // },
  };
  constructor(
    private fb: FormBuilder,
            private route: ActivatedRoute,
            private employeeService: EmployeeService,
            private router: Router
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const empId = +params.get('id');
      if (empId) {
        this.pageTitle = 'Edit Employee';
        this.getEmployee(empId);
      } else {
        this.pageTitle = 'Create Employee';
        this.employee = {
          id: null,
          fullName: '',
      //    contactPreference: '',
          email: '',
          phone: null,
          skills: []
        };
      }
    });
    
    this.employeeForm = this.fb.group({
      fullName: ['',[Validators.required, Validators.minLength(2), ]],
      emailGroup: this.fb.group({
        email: ['', [Validators.required, CustomValidators.emailDomain('dell.com')]],
        confirmEmail: ['', [Validators.required]],
      }, { validator: matchEmails }),
      skills: this.fb.array([
       this.addSkillFormGroup()
      ]),
      phone:['',Validators.required]
    });

    this.employeeForm.valueChanges.subscribe((data) => {
      this.logValidationErrors(this.employeeForm);
    });

  }

  getEmployee(id: number) {
    this.employeeService.getEmployee(id)
      .subscribe(
        (employee: IEmployee) => {
          this.employee = employee;
          this.editEmployee(employee)
        },
        (err: any) => console.log(err)
      );
  }

  editEmployee(employee: IEmployee) {
    this.employeeForm.patchValue({
      fullName: employee.fullName,
    //  contactPreference: employee.contactPreference,
      emailGroup: {
        email: employee.email,
        confirmEmail: employee.email
      },
      phone: employee.phone
    });
    this.employeeForm.setControl('skills', this.setExistingSkills(employee.skills));
  }

  setExistingSkills(skillSets: ISkill[]): FormArray {
    const formArray = new FormArray([]);
    skillSets.forEach(s => {
      formArray.push(this.fb.group({
        skillName: s.skillName,
        experienceInYears: s.experienceInYears,
        proficiency: s.proficiency
      }));
    });
  
    return formArray;
  }


  // logValidationErrors(group: FormGroup = this.employeeForm){
  //   Object.keys(group.controls).forEach((key:string) =>{
  //   //  console.log(key);  // fullname,email,skill
  //     const abstractControl = group.get(key);  //FromControl
  //     if(abstractControl instanceof FormGroup){
  //       this.logValidationErrors(abstractControl);
  //     }else{
  //       this.formErrors[key] = '';
  //       if(abstractControl && !abstractControl.valid && (abstractControl.touched || abstractControl.dirty)){
  //       //  console.log(abstractControl.errors);
  //     //  console.log(this.validationMessages[key]); 
  //       // property khai báo bên trên của CreateComponet.validationMess  theo từng key

  //       const messages = this.validationMessages[key];
  //       for (const errorKey in abstractControl.errors) {
  //         if (errorKey) {
  //           this.formErrors[key] += messages[errorKey] + ' ';
  //           console.log(this.formErrors)
  //         }
  //       }
  //       }
  //     }

  //   })
  // }
  addSkillFormGroup(): FormGroup {
    return this.fb.group({
      skillName: ['', Validators.required],
      experienceInYears: ['', Validators.required],
      proficiency: ['', Validators.required]
    });
  }

  addSkillButtonClick(): void {
    (<FormArray>this.employeeForm.get('skills')).push(this.addSkillFormGroup());
  }
 removeSkillButtonClick(skillGroupIndex: number): void {
  const skillsFormArray = <FormArray>this.employeeForm.get('skills');
  skillsFormArray.removeAt(skillGroupIndex);
  skillsFormArray.markAsDirty();
  skillsFormArray.markAsTouched();
}

  logValidationErrors(group: FormGroup = this.employeeForm): void {
    Object.keys(group.controls).forEach((key: string) => {
      const abstractControl = group.get(key);
      this.formErrors[key] = '';
      // Loop through nested form groups and form controls to check
      // for validation errors. For the form groups and form controls
      // that have failed validation, retrieve the corresponding
      // validation message from validationMessages object and store
      // it in the formErrors object. The UI binds to the formErrors
      // object properties to display the validation errors.
      if (abstractControl && !abstractControl.valid
        && (abstractControl.touched || abstractControl.dirty)) {
        const messages = this.validationMessages[key];
        for (const errorKey in abstractControl.errors) {
          if (errorKey) {
            this.formErrors[key] += messages[errorKey] + ' ';
          }
        }
      }
  
      if (abstractControl instanceof FormGroup) {
        this.logValidationErrors(abstractControl);
      }
      // We need this additional check to get to the FormGroup
    // in the FormArray and then recursively call this
    // logValidationErrors() method to fix the broken validation
      // if (abstractControl instanceof FormArray) {
      //   for (const control of abstractControl.controls) {
      //     if (control instanceof FormGroup) {
      //       this.logValidationErrors(control);
      //     }
      //   }
      // }
    });
  }
  onSubmit(): void {
   
    this.mapFormValuesToEmployeeModel();
    if (this.employee.id) {
    
      this.employeeService.updateEmployee(this.employee).subscribe(
        () => this.router.navigate(['list']),
        (err: any) => console.log(err)
      );
    } else {
      this.employeeService.addEmployee(this.employee).subscribe(
        () => this.router.navigate(['list']),
        (err: any) => console.log(err)
      );
    }
  }
  mapFormValuesToEmployeeModel(){
  //  console.log(this.employee);
    this.employee.fullName = this.employeeForm.value.fullName;
  //  this.employee.contactPreference = this.employeeForm.value.contactPreference;
    this.employee.email = this.employeeForm.value.emailGroup.email;
    this.employee.phone = this.employeeForm.value.phone;
    this.employee.skills = this.employeeForm.value.skills;
  }
  onLoadData(){
    this.logValidationErrors(this.employeeForm);
  }

}

function matchEmails(group: AbstractControl): { [key: string]: any } | null {
  const emailControl = group.get('email');
  const confirmEmailControl = group.get('confirmEmail');

  if (emailControl.value === confirmEmailControl.value ||
     (confirmEmailControl.pristine && confirmEmailControl.value === '')) {
    return null;
  } else {
    return { 'emailMismatch': true };
  }
}

// loop qua từng form control để xem validation lỗi , có mảng thông báo là validationError