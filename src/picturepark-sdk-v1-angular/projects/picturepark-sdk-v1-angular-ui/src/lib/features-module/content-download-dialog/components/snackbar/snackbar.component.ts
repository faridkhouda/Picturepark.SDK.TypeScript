import { Component, Inject, OnInit } from '@angular/core';
import { MatSnackBarRef, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { SnackBarInput } from '../../interfaces/snackbar.interfaces';

@Component({
  selector: 'pp-snackbar',
  templateUrl: './snackbar.component.html',
  styleUrls: ['./snackbar.component.scss'],
})
export class SnackbarComponent implements OnInit {
  public displayText: string;
  public showLoader: boolean;

  constructor(
    public snackBarRef: MatSnackBarRef<SnackbarComponent>,
    @Inject(MAT_SNACK_BAR_DATA) public data: SnackBarInput
  ) {}

  ngOnInit() {
    this.displayText = this.data.displayText;
    this.showLoader = this.data.showLoader || false;
  }
}
