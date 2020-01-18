import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { stringify } from 'querystring';

@Component({
  selector: 'user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent implements OnInit {
  checkoutForm;

  ngOnInit() {
  }

  constructor(
    private formBuilder: FormBuilder
  ) { 
    this.checkoutForm = this.formBuilder.group({
      text_msg: "",
    });
  }

  onSubmit(customerData) {
    // Process checkout data here
    console.warn('Transmitting text: ', customerData);
    window.alert(stringify(customerData));
    //this.checkoutForm.reset();
  }




}
