import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { throwError as observableThrowError, Observable } from 'rxjs';
import { tap ,  catchError ,  timeout } from 'rxjs/operators';

// @Injectable({
//   providedIn: 'root'

// })
@Injectable()
export class HttpService {

  constructor(private http:HttpClient ) { }

  serviceUrl = "http://localhost:9000/";

  public load(){
    return new Promise((resolve,reject)=>
      {
          this.http.get("assets/appconfig.json").subscribe((response:any)=>
          {
          this.serviceUrl=response.serviceUrl;
          resolve(true);
      }); 
      });
  }


  public post(method,param) {
    return this.http.post<any>(this.serviceUrl + method, { param });
  }

  public get(method,param?){
    return this.http.get(this.serviceUrl + method); 
  }

}
export function ConfigGlobal(config:HttpService){
  return ()=> config.load();
}