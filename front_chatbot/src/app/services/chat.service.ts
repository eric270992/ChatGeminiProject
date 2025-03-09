import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from './config.service';
import { lastValueFrom } from 'rxjs';
import { Wrapper } from '../models/wrapper';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  baseUrl = "";
  constructor(private httpClient:HttpClient, private configService:ConfigService) { }

  public async sendMessage(message:string):Promise<Wrapper>{
    const response = await lastValueFrom(this.httpClient.get<Wrapper>(`${this.configService.ObtenirBaseUrl()}/api/Chat/${message}`));
    return response;
  }
}
