import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthGuard } from './guard/auth.guard';
import { HttpClientModule } from '@angular/common/http';
import { CountriesService } from './services/countries.service';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [PageNotFoundComponent],
  imports: [CommonModule, HttpClientModule, RouterModule],
  providers: [AuthGuard, CountriesService],
})
export class SharedModule {}
