import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { IAlertSMS_Database, IAlertSMS_Phone } from 'src/app/interfaces/AlertSMS/AlertSMS';
import { AllVar } from 'src/app/interfaces/interfaces';
import { AlertService } from 'src/app/service/alert.service';
import { Alert_SMS_Service } from 'src/app/service/alert.sms.service';
import { VarsService } from 'src/app/service/vars';

@Component({
  selector: 'app-funciones',
  templateUrl: './funciones.component.html',
  styleUrls: ['./funciones.component.scss']
})
export class FuncionesComponent {





  public menu: number = 1;
  set setMenu(option: number) {
    this.menu = option;
    this.clearInputs();
   
  }







  constructor(private alertService: AlertService,
    private alertSMS_Service: Alert_SMS_Service,
    private varsService: VarsService) {
    this.getAllVars();
    this.getAllAlertsSMS();
  }

  public allAlertasSMS: IAlertSMS_Database[] = [];
  getAllAlertsSMS(){
    this.alertSMS_Service.getAllAlertSMS().subscribe((alertas) => {
      this.allAlertasSMS = alertas;
    })
  }


  public allVarsCopy: AllVar[] = [];
  public allVars: AllVar[] = [];
  getAllVars() {
    this.allVars = [];
    this.allVarsCopy = [];
    this.varsService.getAllVars().subscribe((vars) => {
      this.allVars = vars;
      this.allVarsCopy = vars;
    })
  }






  //Numeros de telefono
  public numeros: IAlertSMS_Phone[] = [{ code: 0, phone: 0 }];
  modifyNumber(key: string, phone: string, idx: number) {
    if (phone.length >= 10 && phone.length <= 15) {
      this.numeros[idx].code = parseInt(key);
      this.numeros[idx].phone = parseInt(phone);
    } else {
      this.alertService.setMessageAlert("El numero debe de tener mas de 9 digitos  y menos de 16 digitos");
    }
  }








  searchByName(name: string) {
    this.allVars = [];
    this.allVarsCopy.forEach((variable) => {
      const minVariable = variable.name.toLowerCase();
      if (minVariable.includes(name.toLowerCase())) {
        this.allVars.push(variable);
      }
    })
  }








  searchByType(type: string) {
    this.allVars = [];
    this.allVarsCopy.forEach((variable) => {
      if (variable.type == type) {
        this.allVars.push(variable);
      }
    })
  }






  public idxVariableSelected: number | null = null;
  public idVariableSelectInVars: number = 0;
  selectVariable(idx: number) {
    this.idxVariableSelected = idx;
    this.idVariableSelectInVars = this.allVarsCopy[idx].idvar;
    this.alertService.setMessageAlert("Haz seleccionado la variable " + this.allVarsCopy[idx].name);
  }







  addNumber() {
    const newPhone: IAlertSMS_Phone = {
      code: null,
      phone: null
    }
    if (this.numeros.length <= 4) {
      this.numeros.push(newPhone);
    } else {
      this.alertService.setMessageAlert("Solo hay un limite de 5 telefonos moviles.");
    }
  }






  quitPhone(idx: number) {
    if (this.numeros.length > 1) {
      this.numeros.splice(idx, 1);
    }
  }






  quitIdVariableSelected() {
    this.idxVariableSelected = 0;
    this.idxVariableSelected = null;
  }






  public max_enable: boolean = false;
  public min_enable: boolean = false;
  public equal_enable: boolean = false;
  method_evaluation_Event(option: string) {
    switch (option) {
      case '1':
      case '2':
        //Si el valor de la variable es menor que - 1
        //Si el valor de la variable es mayor que - 2
        this.max_enable = false;
        this.min_enable = false;
        this.equal_enable = true;
        break;
      case '3':
        //Si el valor de la varianle esta entre
        this.max_enable = true;
        this.min_enable = true;
        this.equal_enable = false;
        break;
      case '4':
        //Si el valor de la variable esta fuera de
        this.max_enable = true;
        this.min_enable = true;
        this.equal_enable = false;
        break;
      case '5':
        //Si el valor es igual a
        this.max_enable = false;
        this.min_enable = false;
        this.equal_enable = true;
        break;
    }
  }









  public max: string = "0";
  public min: string = "0";
  public equal: string = "0";
  public type_data!: string;

  set_Max(max: string) {
    this.max = max;
  }
  set_Min(min: string) {
    this.min = min;
  }
  set_Equal(equal: string) {
    this.equal = equal;
  }
  set_Type_Data(typeData: string) {
    this.type_data = typeData;
  }



  clearInputs() {
    this.numeros = [{code: 0, phone: 0}];
    this.allVars = this.allVarsCopy;
    this.idxVariableSelected = null;
    this.max_enable = false;
    this.min_enable = false;
    this.equal_enable = false;
    this.idVariableSelectInVars = 0;
    this.getAllVars();
  }


  guardarAlertaSMS_Event(name: string,
    description: string,
    mensaje: string,
    waiting_next_message_time: string,
    waiting_send_first_message: string,
    method_evaluation: string) {

    let message = "";
    let enable_alertaSMS = false;


 

    if (this.equal_enable) {
      //Necesito this.equal para que funcione el registro
      if (this.equal) {
        enable_alertaSMS = true;
      } else {
        message = "No haz definido la entrada igual a";
      }
    } else if ((this.max != null && this.max != undefined) && (this.min != null && this.min != undefined)) {
      //Necesito this.max y min para que funcione el registro
      enable_alertaSMS = true;
    } else {
      enable_alertaSMS = false;
      message = "No haz definido la entrada valor maximo o la entrada valor minimo";
    }

  
    //Validar los numeros
    if (this.numeros.length <= 0) {
      enable_alertaSMS = false;
      message = "No hay numeros definidos";
    } else {
      this.numeros.forEach((numero) => {
        if (!numero.code || !numero.phone) {
          enable_alertaSMS = false;
          message = "El numero debe tener codigo de pais y numero de telefono obligatoriamente";
        } else {
          if (numero.phone.toString().length <= 9 && numero.phone.toString().length >= 16) {
            enable_alertaSMS = false;
            message = "El numero telefonico debe de tener mas de 9 digitos y menos de 16";
          }
        }
      })
    }


    //validar el metodo de evaluacion
    const methodEvaluation: string[] = ['menor que x', 'mayor que x', 'entre que x', 'fuera de x y y', 'igual a x'];
    let metodoEvaluacion;
    let numeros: number[] = [];
    this.numeros.forEach((numero) => {
      // let finalNumber = numero.code + "" + numero.phone;
      let finalNumber = ""+numero.phone;
      numeros.push(parseInt(finalNumber))
    })
    if (method_evaluation) {
      metodoEvaluacion = methodEvaluation[parseInt(method_evaluation) - 1];
    } else {
      enable_alertaSMS = false;
      message = "No se ha definido el tipo de evaluacion";
    }

    if (this.equal_enable && !this.type_data) {
      enable_alertaSMS = false;
      message = "No haz definido el tipo de dato de la entrada igual que"
    }

    //Validar waiting_send_first_message
    if (!waiting_send_first_message) {
      enable_alertaSMS = false;
      message = "No haz definido el tiempo de inicio de espera inicial";
    }

    //Validar waiting_next_message_time
    if (!waiting_next_message_time) {
      enable_alertaSMS = false;
      message = "No haz definido el tiempo de espera entre mensajes";
    }

    //validar mensaje
    if (!mensaje) {
      enable_alertaSMS = false;
      message = "No haz definido el mensaje a mandar";
    }

    //validar descripcion
    if (!description) {
      enable_alertaSMS = false;
      message = "No haz definido la descripcion de la alerta";
    }


    //validar nombre
    if (!name) {
      enable_alertaSMS = false;
      message = "No se ha definido el nombre de la alerta";
    }

      //Ver si tengo una variable definida
      if (!this.idVariableSelectInVars || this.idVariableSelectInVars == null) {
        enable_alertaSMS = false;
        message = "No haz definido la variable de evaluacion";
      }

      
    //Validar metodo de evaluacion 
    if (!this.equal_enable && !this.max_enable && !this.min_enable) {
      enable_alertaSMS = false;
      message = "No haz definido ningun metodo de evaluacion";
    }

    if (enable_alertaSMS) {
      this.alertSMS_Service.create({
        name,
        description,
        phone: numeros,
        message: mensaje,
        var_evaluation_id: this.idVariableSelectInVars ? this.idVariableSelectInVars : 0,
        waiting_next_message_time: parseInt(waiting_next_message_time),
        waiting_send_first_message: parseInt(waiting_send_first_message),
        method_evaluation: metodoEvaluacion ? metodoEvaluacion : "mayor que x",
        max: this.max,
        min: this.min,
        equal: this.equal,
        type_data: this.type_data
      }).subscribe((response) => {
        this.alertService.setMessageAlert("Alerta sms creada");
        this.clearInputs();
        this.menu = 1;
        this.getAllAlertsSMS();
        this.getAllVars();
      }, (err: HttpErrorResponse) => {
        console.log(err);
        this.alertService.setMessageAlert(err.message);
      });
    } else {
      this.alertService.setMessageAlert(message);
    }
  }
}
