import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { VehicleService } from '../vehicle.service';
import {Make, Manufacturer, Model} from '../interfaces';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-vehicle-selector',
  templateUrl: './vehicle-selector.component.html',
  styleUrls: ['./vehicle-selector.component.css']
})
export class VehicleSelectorComponent implements OnInit {

  form: FormGroup;
  manOptions: Manufacturer[];
  makesOptions: Make[];
  modelsOptions: Model[];
  filteredManOptions: Observable<Manufacturer[]>;
  filteredMakesOptions: Observable<Make[]>;
  filteredModelsOptions: Observable<Model[]>;

  constructor(
    private vehicleSelectorService: VehicleService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.buildFormGroup();
    this.form.get('manufacturersControl').disable();
    this.form.get('makesControl').disable();
    this.form.get('modelsControl').disable();
    this.getManufacturers();
  }

  displayManufacturerFn(manufacturer?: Manufacturer): string | undefined {
    return manufacturer ? `${manufacturer.Mfr_Name}, ${manufacturer.Country}` : undefined;
  }

  displayMakesFn(make?: Make): string | undefined {
    return make ? `${make.Make_Name}` : undefined;
  }

  displayModelsFn(model?: Model): string | undefined {
    return model ? `${model.Model_Name}` : undefined;
  }

  onManufacturerSelected(man: Manufacturer) {
    // this.form.get('makesControl').reset();
    // this.form.get('makesControl').disable();
    // this.form.get('modelsControl').reset();
    // this.form.get('modelsControl').disable();
    this.getMakesForManufacturer(man.Mfr_ID);
  }

  onMakerSelected(make: Make) {
    // this.form.get('modelsControl').reset();
    // this.form.get('modelsControl').disable();
    this.getModelsForMake(make.Make_ID);
  }

  onSubmit() {
    console.log(this.form.value, this.form.valid);
    this.openSnackBar('Thank you for submitting the data!', 'close');
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

  private buildFormGroup() {
    this.form = new FormGroup(
      {
        manufacturersControl: new FormControl('', Validators.required),
        makesControl: new FormControl('', Validators.required),
        modelsControl: new FormControl('', Validators.required)
      }
    );
  }

  private getManufacturers() {
    this.vehicleSelectorService.getManufacturers()
      .subscribe( manufacturers => {
        this.manOptions = manufacturers;
        this.form.get('manufacturersControl').enable();

        this.filteredManOptions = this.form.get('manufacturersControl').valueChanges
          .pipe(
            startWith(''),
            map(value => typeof value === 'string' ? value : value.Mfr_Name),
            map(name => name ? this.filterManufacturer(name) : this.manOptions.slice())
          );
      });
  }

  private getMakesForManufacturer(manufacturerId: number) {
    this.vehicleSelectorService.getMakesForManufacturer(manufacturerId)
      .subscribe( makes => {
        this.makesOptions = makes;
        this.form.get('makesControl').enable();

        this.filteredMakesOptions = this.form.get('makesControl').valueChanges
          .pipe(
            startWith(''),
            map(value => typeof value === 'string' ? value : value.Make_Name),
            map(name => name ? this.filterMakes(name) : this.makesOptions.slice())
          );
      });
  }

  private getModelsForMake(makeId: number) {
    this.vehicleSelectorService.getModelsForMake(makeId)
      .subscribe( models => {
        this.modelsOptions = models;
        this.form.get('modelsControl').enable();

        this.filteredModelsOptions = this.form.get('modelsControl').valueChanges
          .pipe(
            startWith(''),
            map(value => typeof value === 'string' ? value : value.Model_Name),
            map(name => name ? this.filterModels(name) : this.modelsOptions.slice())
          );
      });
  }

  private filterManufacturer(name: string): Manufacturer[] {
    const filterValue = name.toLowerCase();
    return this.manOptions.filter(option => option.Mfr_Name.toLowerCase().indexOf(filterValue) === 0);
  }

  private filterMakes(name: string): Make[] {
    const filterValue = name.toLowerCase();
    return this.makesOptions.filter(option => option.Make_Name.toLowerCase().indexOf(filterValue) === 0);
  }

  private filterModels(name: string): Model[] {
    const filterValue = name.toLowerCase();
    return this.modelsOptions.filter(option => option.Model_Name.toLowerCase().indexOf(filterValue) === 0);
  }


}
