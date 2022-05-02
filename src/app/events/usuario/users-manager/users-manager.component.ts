import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {UserService} from "@app/_services";
import Swal from 'sweetalert2';
import {Alerts} from "@app/_helpers/alerts";

@Component({
  selector: 'app-users-manager',
  templateUrl: './users-manager.component.html',
  styleUrls: ['./users-manager.component.sass']
})
export class UsersManagerComponent implements OnInit {
  dataForm: FormGroup;
  submitted = false;
  error = '';
  editing = false;
  isLoading = false;
  entityName = "usuario"
  @Output() hide = new EventEmitter<string>();
  inputFoto: any = ""

  constructor(
    private formBuilder: FormBuilder,
    private service: UserService,
    private alerts:Alerts
  ) {


  }

  ngOnInit(): void {
    this.dataForm = this.formBuilder.group({
      usuario: ["", Validators.required],
      nombre: ["", Validators.required],
      apellido: ["", Validators.required],
      email: ["", [Validators.required,Validators.email]],
      role: ["administrador", Validators.required],
    })

    this.service.dataManager.subscribe(ok => {
      this.limpiar()
      if (ok) {
        this.editing = true;
        this.f.usuario.disable()
        this.inputFoto = ok.foto

        for (let u of Object.keys(ok)) {
          if (this.dataForm.controls[u]) {
            this.dataForm.controls[u].setValue(ok[u])
          }
        }
      }
    })


  }

  get f() {
    return this.dataForm.controls;
  }

  handleUpload(event) {
    const file = event.target.files[0]
    if (file.size > 3072000) {
      alert("too big")
    }
    console.log(file.size);
    console.log(file);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.inputFoto = reader.result.toString()/*.split("base64,")[1]*/
      console.log(this.inputFoto);
    };
  }


  limpiar() {
    this.editing = false
    this.dataForm.reset()
    this.f.role.setValue("administrador")
    this.f.usuario.enable(

    )
  }

  onSubmit() {
    this.isLoading = true

    if (this.editing) {
      this.alerts.editAlert(this.entityName).then((result) => {
        if (result.isConfirmed) {
          console.log("editando");
          let data = {
            username: this.f.usuario.value,
            role: this.f.role.value,
            firstName: this.f.nombre.value,
            email: this.f.email.value,
            apellido: this.f.apellido.value,
            foto: this.inputFoto

          }
          this.service.update(data).subscribe(ok => {
            setTimeout(() => {
              this.service.refreshDataTable().then(okk => {
                console.log(okk);
                console.log(ok);
                this.isLoading = false
                this.hide.emit("ocultar");

              })
            }, 500)

          }, error => {
            console.log(error.error);
            this.alerts.errorAlert(error)
            this.isLoading = false

          })
        } else {
          this.isLoading = false

        }
      })

    } else {

      let data = {
        username: this.f.usuario.value,
        lastName: this.f.role.value,
        firstName: this.f.nombre.value,
        email: this.f.email.value,
        apellido: this.f.apellido.value,
        foto: this.inputFoto
      }
      console.log(data);

      this.service.create(data).subscribe(ok => {
        this.service.refreshDataTable().then(okk => {
          console.log(okk);
          console.log(ok);
          this.isLoading = false
          this.hide.emit("ocultar");

        })
      }, error => {
        console.log(error.error);
        this.alerts.errorAlert(error)
        this.isLoading = false

      })
    }


  }
}
