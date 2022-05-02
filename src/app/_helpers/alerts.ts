import Swal from "sweetalert2";


export class Alerts {

  successFullAlert(text) {
    return Swal.fire({
      icon: 'success',
      text

    })
  }


  editAlert(entity) {
    return Swal.fire({
      title: '¿Editar ' + entity + '?',
      text: `Estas a punto de editar ${entity.slice(-1) == "a" ? 'una' : 'un'} ${entity}, ¿deseas continuar?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Editar',
      cancelButtonText: 'No,  Cancelar'
    })
  }

  deleteAlert(entity) {
    return Swal.fire({
      title: '¿Eliminar ' + entity + '?',
      text: `Estas a punto de eliminar ${entity.slice(-1) == "a" ? 'una' : 'un'} ${entity}, ¿deseas continuar?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar',
      cancelButtonText: 'Cancelar'
    })
  }

  generic(title, text, btn = true, txt = null) {
    return Swal.fire({
      title,
      text,
      icon: 'warning',
      showCancelButton: btn,
      showConfirmButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: txt || 'Si',//txt?txt:'si',
      cancelButtonText: 'Cancelar'
    })
  }

  errorAlert(error) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Ha ocurrido un error al enviar los datos al servidor: ' + error.error,
    })
  }

  errorGeneric(error) {
    return Swal.fire({
      icon: 'error',
      title: error.title,
      text: error.text,
    })
  }


}

