import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ManufacturersResponse, Manufacturer, MakesResponse, Make, ModelsResponse, Model } from './interfaces';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {

  constructor(private http: HttpClient) {}

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }

  getManufacturers(): Observable<Manufacturer[]> {
    const manufacturerUrl = `https://vpic.nhtsa.dot.gov/api/vehicles/GetAllManufacturers/?format=json`;
    return this.http.get<ManufacturersResponse>(manufacturerUrl)
      .pipe(
        map((data: ManufacturersResponse) => data.Results,
        catchError(this.handleError<Manufacturer[]>('getManufacturers', []))
      ));
  }

  getMakesForManufacturer(manufacturerId: number): Observable<Make[]> {
    const makesUrl = `https://vpic.nhtsa.dot.gov/api/vehicles/GetMakeForManufacturer/${manufacturerId}?format=json`;
    return this.http.get<MakesResponse>(makesUrl)
      .pipe(
        map((data: MakesResponse) =>  data.Results,
        catchError(this.handleError<Make[]>('getMakesForManufacturer', []))
      ));
  }

  getModelsForMake(makeId: number): Observable<Model[]> {
    const modelsUrl = `https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMakeId/${makeId}?format=json`;
    return this.http.get<ModelsResponse>(modelsUrl)
      .pipe(
        map((data: ModelsResponse) => data.Results,
        catchError(this.handleError<Model[]>('getModelsForMake', []))
      ));
  }




}
