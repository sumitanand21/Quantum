import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { environment as env } from '@env/environment';
import { Observable } from 'rxjs';
import { ThemeService } from '@app/core';
import { DataCommunicationService } from '@app/core';
import { Router } from '@angular/router';
import { EnvService } from '@app/core/services/env.service';

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  @Output() changeTheme: EventEmitter<boolean> = new EventEmitter<boolean>();

  year = new Date().getFullYear();
  version = 2;
  envName = this.envr.envName;
  isDarkTheme: Observable<boolean>;

    constructor(private themeService: ThemeService,public service: DataCommunicationService,public router: Router,public envr : EnvService) { }

  ngOnInit(): void {
    this.isDarkTheme = this.themeService.isDarkTheme;
  }

  toggleDarkTheme(checked: boolean) {
    this.changeTheme.emit(checked);
  }
}
