import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthGuard } from './guard/auth.guard';
import { CountriesService } from './services/countries.service';

@NgModule({
  declarations: [],
  imports: [CommonModule],
  providers: [AuthGuard, CountriesService],
})
export class SharedModule {}
