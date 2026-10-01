import { Component } from '@angular/core';
import { APP_NAME } from '@app/core/constants/app.constants';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer {
  protected readonly year = new Date().getFullYear();
  protected readonly appName = APP_NAME;
}