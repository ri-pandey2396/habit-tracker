import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import { IUser } from '../models/user.interface';
@Injectable({
    providedIn: 'root'
})
export class AuthService {
    // public token = '';
    public currentUser = new BehaviorSubject<IUser>({});

    constructor(public jwtHelper: JwtHelperService) {
    }

    private hasExpiredToken(): void {
        if (this.jwtHelper.isTokenExpired(localStorage.getItem('authToken'))) {
            localStorage.clear();
        }
    }

    public setCurrentUser(user: IUser): void {
        this.currentUser.next(user);
    }

    public setToken(token: string): void {
        localStorage.setItem('authToken', token);
    }

    public getUserAuthToken(): string {
        this.hasExpiredToken();
        let token: any = null;
        if (localStorage.getItem('authToken') !== undefined && localStorage.getItem('authToken') !== null &&
            localStorage.getItem('authToken') !== '') {
            token = localStorage.getItem('authToken')
        }

        return token
    }
}