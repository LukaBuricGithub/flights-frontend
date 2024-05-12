import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Location } from 'src/app/models/Location';
import { Flight } from 'src/app/models/Flight';


@Injectable({
  providedIn: 'root'
})
export class FlightService {

  constructor(private http:HttpClient) { }


  getIATACode(location:string)
  {
    return this.http.get<Location[]>(" https://localhost:7216/api/Flight/GetIATACode?location="+location);
  }



  GetFlightOffers(originLocationCode:string,destinationLocationCode:string,departureDate:string,currencyCode:string,passengers:string,returnDate:string) 
  {
    if(returnDate != "")
    {
      return this.http.get<Flight[]>("https://localhost:7216/api/Flight/GetFlightOffers?originLocationCode="+originLocationCode+"&destinationLocationCode="+destinationLocationCode+"&departureDate="+departureDate+"&currencyCode="+currencyCode+"&passengers="+passengers+"&returnDate="+returnDate);
    }
    else 
    {
      return this.http.get<Flight[]>("https://localhost:7216/api/Flight/GetFlightOffers?originLocationCode="+originLocationCode+"&destinationLocationCode="+destinationLocationCode+"&departureDate="+departureDate+"&currencyCode="+currencyCode+"&passengers="+passengers);
    } 
  }
}
