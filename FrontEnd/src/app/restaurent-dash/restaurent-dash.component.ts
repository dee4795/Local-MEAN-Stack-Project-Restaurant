import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../shared/api.service';
import { RestaurentData } from './restaurent.model';

@Component({
  selector: 'app-restaurent-dash',
  templateUrl: './restaurent-dash.component.html',
  styleUrls: ['./restaurent-dash.component.css'],
  standalone: false
})
export class RestaurentDashComponent implements OnInit {
  formValue!: FormGroup;
  restaurentModelObj: RestaurentData = new RestaurentData;
  allRestaurentData: any;
  showAdd!: boolean;
  showBtn!: boolean;
  showPopup: boolean = false;
  showEmailPopup: boolean = false;

  constructor(private formbuilder: FormBuilder, private api: ApiService) { }

  ngOnInit(): void {
    this.formValue = this.formbuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      mobile: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      address: ['', Validators.required],
      services: ['', Validators.required],
    });
    this.getAllData();
  }

  clickAddResto() {
    this.formValue.reset();
    this.showAdd = true;
    this.showBtn = false;
  }

  addRestaurent() {
    if (this.formValue.invalid) {
      this.formValue.markAllAsTouched();
      if (!this.formValue.controls['mobile'].valid) {
        this.showPopup = true;
        setTimeout(() => this.showPopup = false, 3000);
      } else if (!this.formValue.controls['email'].valid) {
        this.showEmailPopup = true;
        setTimeout(() => this.showEmailPopup = false, 3000);
      } else {
        alert("Please fill all the required fields correctly before submitting");
      }
      return;
    }

    this.restaurentModelObj.name = this.formValue.value.name;
    this.restaurentModelObj.email = this.formValue.value.email;
    this.restaurentModelObj.mobile = this.formValue.value.mobile;
    this.restaurentModelObj.address = this.formValue.value.address;
    this.restaurentModelObj.services = this.formValue.value.services;

    this.api.postRestaurent(this.restaurentModelObj).subscribe({
      next: (res) => {
        console.log(res);
        alert("Restaurant Added Successfully");
        this.formValue.reset();
        let ref = document.getElementById('closeModal');
        ref?.click();
        this.getAllData();
      },
      error: (err) => {
        console.error('Error adding restaurant:', err);
        alert("Failed to add restaurant. Please try again.");
      }
    });
  }

  getAllData() {
    this.api.getRestaurent().subscribe({
      next: (res) => {
        this.allRestaurentData = res;
      },
      error: (err) => {
        console.error('Error fetching restaurants:', err);
        alert("Failed to load restaurants. Please try again later.");
      }
    });
  }

  deleteResto(data: any) {
    if (confirm('Are you sure you want to delete this restaurant?')) {
      this.api.deleteRestaurant(data._id).subscribe({  // Updated to use _id
        next: (res) => {
          alert("Restaurant Deleted Successfully");
          this.getAllData();
        },
        error: (err) => {
          console.error('Error deleting restaurant:', err);
          alert("Failed to delete restaurant. Please try again.");
        }
      });
    }
  }

  onEditResto(data: any) {
    this.showAdd = false;
    this.showBtn = true;
    this.restaurentModelObj._id = data._id;  // Updated to use _id
    this.formValue.patchValue({
      name: data.name,
      email: data.email,
      mobile: data.mobile,
      address: data.address,
      services: data.services
    });
  }

  updateResto() {
    if (this.formValue.invalid) {
      this.formValue.markAllAsTouched();
      if (!this.formValue.controls['mobile'].valid) {
        this.showPopup = true;
        setTimeout(() => this.showPopup = false, 3000);
      } else if (!this.formValue.controls['email'].valid) {
        this.showEmailPopup = true;
        setTimeout(() => this.showEmailPopup = false, 3000);
      } else {
        alert("Please fill all the required fields correctly before submitting");
      }
      return;
    }

    this.restaurentModelObj.name = this.formValue.value.name;
    this.restaurentModelObj.email = this.formValue.value.email;
    this.restaurentModelObj.mobile = this.formValue.value.mobile;
    this.restaurentModelObj.address = this.formValue.value.address;
    this.restaurentModelObj.services = this.formValue.value.services;

    this.api.updateRestaurant(this.restaurentModelObj._id, this.restaurentModelObj).subscribe({
      next: (res) => {
        alert("Restaurant Updated Successfully");
        this.formValue.reset();
        let ref = document.getElementById('closeModal');
        ref?.click();
        this.getAllData();
      },
      error: (err) => {
        console.error('Error updating restaurant:', err);
        alert("Failed to update restaurant. Please try again.");
      }
    });
  }
}