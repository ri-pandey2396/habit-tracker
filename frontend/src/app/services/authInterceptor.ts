import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse } from '@angular/common/http';
import { environment } from '../../environments/environment.dev';
import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
// import { Crypto } from './crypto';
// import { cognitoObjectPROD, cognitoObjectDEV } from '../shared/enums';
// import { AuthenticationService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(/*private authService: AuthenticationService*/
        private router: Router,
        // private crypto: Crypto,
        private auth: AuthService) { } // circular dependency error on importing AuthenticationService
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // tslint:disable-next-line: max-line-length
        if (req.url === environment.BASE_URL + 'api/master/user/authenticate' || req.url.includes('.s3.') || req.url.includes('/assets/i18n/')) {
            return next.handle(req);
        }
        if (req.url === environment.BASE_URL + 'api/master/user/forgot_password' || req.url.includes('.s3.') || req.url.includes('/assets/i18n/')) {
            return next.handle(req);
        }
        const token = localStorage.getItem('authToken');
        const modifiedReq = req.clone({ headers: req.headers.append('Authorization', 'Bearer ' + token) });
        // return next.handle(modifiedReq);
        return next.handle(modifiedReq).pipe(map(event => {
            if (event instanceof HttpResponse && event.body) {
                if (event.body.status === 2 && event.body.description === 'Could not verify authorization') {
                    if (this.auth.getUserAuthToken() !== null || this.auth.getUserAuthToken() !== undefined ||
                        this.auth.getUserAuthToken() !== '') {
                        localStorage.removeItem('authToken');
                    }
                    this.router.navigate(['login']);
                    // if (environment.production) {
                    //   window.location.href = cognitoObjectPROD.loginUrl;
                    // }
                    // else {
                    //   window.location.href = cognitoObjectDEV.loginUrl;
                    // }
                    // this.alertConfirm.alertConfirm(
                    //   {
                    //     title: 'Login Alert',
                    //     message: 'Your application session has been on for too long. Please login again to continue working.',
                    //     labelConfirm: 'Ok'
                    //   }, '650px');
                    return event;
                }
            }
            return event;
        }));
    }
}
