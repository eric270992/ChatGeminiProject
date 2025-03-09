import { Injectable } from '@angular/core';
import configFile from '../../../config.json';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  constructor() { }

  public ObtenirBaseUrl(): string {
    return configFile.baseUrl;
  }
}
