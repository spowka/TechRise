import { NgModule } from '@angular/core';
import { AuthGuard } from './shared/guard/auth.guard';
import { LoginComponent } from './core/components/login/login.component';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { SignUpComponent } from './core/components/sign-up/sign-up.component';
import { PageNotFoundComponent } from './shared/components/page-not-found/page-not-found.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {
    path: 'user-profile',
    loadChildren: () =>
      import('./user-profile/user-profile.module').then(
        (m) => m.UserProfileModule
      ),
    canActivate: [AuthGuard],
  },
  { path: 'sign-up', component: SignUpComponent },
  { path: 'login', component: LoginComponent },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
