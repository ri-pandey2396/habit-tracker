import { Injectable } from '@angular/core';
2
import { Router, CanActivate } from '@angular/router';
import { AuthService } from './auth.service';
@Injectable({
    providedIn: 'root'
})
export class AuthGuardService implements CanActivate {
    public check = true;
    constructor(public authService: AuthService, public router: Router) { }
    async canActivate() {
        if (this.check) {
            await this.router.navigate(['login']);
            return false;
        }
        return true;
    }
}