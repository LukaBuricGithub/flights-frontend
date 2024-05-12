import { Component, OnInit } from '@angular/core';

import { Location } from 'src/app/models/Location';
import { FlightService } from 'src/services/flight.service';

import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

import {formatDate} from '@angular/common';



import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Flight } from 'src/app/models/Flight';


@Component({
  selector: 'app-table-view',
  templateUrl: './table-view.component.html',
  styleUrls: ['./table-view.component.scss']
})

export class TableViewComponent implements OnInit {

  iataSearchForm!: FormGroup;

  iataLocations: Location[] = [];

  locationsDisplayedColumns: string[] = ['name', 'detailedName', 'iataCode'];


  flightOffersDisplayedColumns : string [] = ['departureCode', 'arrivalCode', 'numberOfPassengers', 'departureDate', 'departureTransfers', 'returnDate', 'returnTransfers', 'price'];


  flightSearchForm!: FormGroup;

  flightOffers: Flight[] = [];


  constructor(private fb: FormBuilder, private service: FlightService) { }

  ngOnInit() {

    this.iataSearchForm = this.fb.group({
      location: ['', [Validators.required]],
    });

    this.flightSearchForm = this.fb.group({
      departure: ['', [Validators.required]],
      destination: ['', [Validators.required]],
      passengers: ['', [Validators.required, Validators.min(1), Validators.max(9)]],
      currency: ['EUR', [Validators.required]],
      departureDate: ['', [Validators.required, this.validateDepartureDate]],
      returnDate: ['', [this.validateReturnDate]],
    });
  }

  validateDepartureDate(control: FormControl): { [key: string]: any } | null {
    const selectedDate = new Date(control.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      return { pastDate: true };
    }
    return null;
  }



  validateReturnDate(control: FormControl): { [key: string]: any } | null {
    
    if(control.value != '' && control.value != null){
      const selectedDate = new Date(control.value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        return { badDate: true };
      }
    }
    return null;
  }





  
  searchLocationsIATACode() {
    if (this.iataSearchForm.valid) {
      this.service.getIATACode(this.iataSearchForm.value.location).subscribe((x: Location[]) => {
        this.iataLocations = x;
        console.log(this.iataLocations);
      });
    }
  }

  searchFlights(){
    if (this.flightSearchForm.valid)
    {

      let originLocationCode : string  =  this.flightSearchForm.value.departure;
      let destinationLocationCode : string = this.flightSearchForm.value.destination;
      let departureDate : string = formatDate(this.flightSearchForm.value.departureDate,'yyyy-MM-dd', 'en-US');    
      let currencyCode : string = this.flightSearchForm.value.currency; 
      let passengers : string = this.flightSearchForm.value.passengers;
      let returnDate : string; 
      
      if (this.flightSearchForm.value.returnDate == "" || this.flightSearchForm.value.returnDate == null)
      {
        returnDate = "";
      }
      else 
      {
        returnDate = formatDate(this.flightSearchForm.value.returnDate,'yyyy-MM-dd', 'en-US');
      }

      console.log(originLocationCode);
      console.log(destinationLocationCode);
      console.log(departureDate);
      console.log(currencyCode);
      console.log(passengers);
      console.log(returnDate);
    
    
      this.service.GetFlightOffers(originLocationCode,destinationLocationCode,departureDate,currencyCode,passengers,returnDate).subscribe((x:Flight[]) => {
        this.flightOffers = x;
        console.log(this.flightOffers);
      });
    }
  }

  /*
  fixDateFromDatepicker(date:Date)
  {
    let d=date;
    d.setHours(d.getHours() + 2);
    return new Date(d)
  }
  */


  /*
  public submitData()
  {
    if(this.loginForm.valid)
    {

      this.service.loginUser(this.loginForm.value.email,this.loginForm.value.password).subscribe((x:User) =>{
        this.loggedUser=x;
        if(this.loggedUser==null)
        {
        }
        else
        {
          const active="1";
          sessionStorage.setItem('isActive',active);

          let admin:string;
          if(this.loggedUser.isAdmin)
          {
            admin="1";
          }
          else
          {
            admin="0"
          }
          sessionStorage.setItem('isAdmin',admin);

          let userID:string;
          userID=this.loggedUser.userID.toString();
          sessionStorage.setItem('userId',userID);
        }
      })
    }
  }*/


  public enableIATASubmitBtn(): boolean {
    let enable: boolean = false;
    if (this.iataSearchForm.valid) {
      enable = true;
    }
    else {
      enable: false;
    }
    return enable;
  }

  public enableFlightsSubmitBtn(): boolean {
    let enable: boolean = false;
    if (this.flightSearchForm.valid) {
      enable = true;
    }
    else {
      enable: false;
    }
    return enable;
  }


}
