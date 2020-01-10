export interface VehicleType {
  IsPrimary: boolean;
  Name: string;
}

export interface Manufacturer {
  Country: string;
  Mfr_CommonName: string;
  Mfr_ID: number;
  Mfr_Name: string;
  VehicleTypes: VehicleType[];
}

export interface ManufacturersResponse {
  Count: number;
  Message: string;
  SearchCriteria?: any;
  Results: Manufacturer[];
}

export interface Make {
  Make_ID: number;
  Make_Name: string;
  Mfr_Name: string;
}

export interface MakesResponse {
  Count: number;
  Message: string;
  SearchCriteria: string;
  Results: Make[];
}

export interface Model {
  Make_ID: number;
  Make_Name: string;
  Model_ID: number;
  Model_Name: string;
}

export interface ModelsResponse {
  Count: number;
  Message: string;
  SearchCriteria: string;
  Results: Model[];
}





