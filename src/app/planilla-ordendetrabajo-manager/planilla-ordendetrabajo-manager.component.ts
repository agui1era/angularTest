import { Component, OnInit } from '@angular/core';
import {UploadService} from "@app/_services/upload.service";
import {Alerts} from "@app/_helpers/alerts";
import {MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-planilla-subproduct-manager',
  templateUrl: './planilla-ordendetrabajo-manager.component.html',
  styleUrls: ['./planilla-ordendetrabajo-manager.component.sass']
})
export class PlanillaOrdendetrabajo implements OnInit {

  selectedFiles?: FileList;
  currentFile?: File;

  constructor(
    private uploadService: UploadService,
    private alerts: Alerts,
    private dialogRef: MatDialogRef<PlanillaOrdendetrabajo>,
  ) {
  }

  ngOnInit(): void {
  }

  selectFile(event: any): void {
    this.selectedFiles = event.target.files;
  }

  upload(): void {

    if (this.selectedFiles) {
      const file: File | null = this.selectedFiles.item(0);

      if (file) {
        this.currentFile = file;

        this.uploadService.uploadOT(this.currentFile).subscribe(ok => {
          console.log(ok);

          this.alerts
            .successFullAlert("Operacion realizada exitosamente").then(ok => {
            this.dialogRef.close()

          })
        })

      }

      this.selectedFiles = undefined;
    }
  }

}
