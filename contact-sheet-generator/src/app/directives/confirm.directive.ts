import { Directive, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../components/confirm-dialog/confirm-dialog.component';

@Directive({
  selector: '[appConfirm]'
})
export class ConfirmDirective {

  @Input('appConfirm') confirm?: Function;

  constructor(public dialog: MatDialog) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {hasBackdrop: true, disableClose: true});
    dialogRef.afterClosed().subscribe(result => {
      let canContinue = result && result === 'yes';
      if (canContinue && this.confirm) {
        confirm();
      }
    });
  }

}
