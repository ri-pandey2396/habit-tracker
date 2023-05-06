import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MonthTaskComponent } from './app/month-task/month-task.component';
import { ThemesComponent } from './app/themes/themes.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'month-task', component: MonthTaskComponent },
  { path: 'progress', component: DashboardComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
