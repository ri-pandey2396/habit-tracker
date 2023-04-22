import { HttpClient, HttpErrorResponse, HttpEvent, HttpParams, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment as env } from '../../../environments/environment.dev';
import { IResponse } from '../models/server-data-response';

@Injectable({
    providedIn: 'root'
})
export class WebService {
    BASE_URL = env.BASE_URL;

    constructor(private http: HttpClient) { }

    handleError(error: HttpErrorResponse) {
        let errorMessage = 'Unknown error!';
        if (error.error instanceof ErrorEvent) {
            // Client-side errors
            errorMessage = `Error: ${error.error.message}`;
        } else {
            // Server-side errors
            errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
        }
        window.alert(errorMessage);
        return Error(errorMessage);
    }

    public post(url: string, input: any = {}): any {
        console.log(this.BASE_URL + url)
        return this.http.post(this.BASE_URL + url, input, { observe: 'body', responseType: 'json' });
    }

    public get(url: string) {
        console.log(url);
        return this.http.get(this.BASE_URL + url);
    }

    public put(url: string, file: File, contentType: string) {
        return this.http.put(url, file, {
            headers: {
                'Content-Type': contentType
            },
            reportProgress: true,
            observe: 'events'
        });
    }

    public delete(url: string, input: any = {}) {
        return this.http.delete(this.BASE_URL + url, input);
    }

    public getFile(url: string, data: any) {
        const httpParams = new HttpParams().set('data', JSON.stringify(data));
        return this.http.get(this.BASE_URL + url, { responseType: 'blob', params: httpParams });
    }

    public upload(url: string, file: File, input: any) {
        const formData: FormData = new FormData();
        formData.append('file', file);
        formData.append('data', input);
        input.file = formData;
        const httpParams = new HttpParams().set('data', JSON.stringify(input));
        return this.http.post(this.BASE_URL + url + '/', formData, { params: httpParams, responseType: 'text', reportProgress: true, observe: 'events' });
    }

    // public uploadMultipleFile(url: string, files: string | any[], input: any) {

    //     try {
    //         const frmData = new FormData();
    //         for (let i = 0; i < files.length; i++) {
    //             frmData.append(`file${i}`, files[i]);
    //         }
    //         frmData.append('data', JSON.stringify(input));
    //         const httpParams = new HttpParams().set('data', JSON.stringify(input));
    //         return this.http.post(this.BASE_URL + url + '/', frmData, { params: httpParams, responseType: 'text' });
    //     }
    //     catch (error) {
    //         console.log(error);
    //     }
    // }
}