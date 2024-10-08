import { EventEmitter } from "@angular/core";
import { VarsService } from "../service/vars";
import { HttpErrorResponse } from "@angular/common/http";
import { AllVar } from "../interfaces/interfaces";
import { JsonVariableClass } from "./json_functions";
import { IMemoryVar } from "../interfaces/Modbus.interfaces/ModbusInterfaces";
import { Router } from "@angular/router";

export class CalculatorExpression {

    operatorsArr = [];
    /**
     * 
     * @param {string} expresion //expresion usada para parsear la informacion
     */
    constructor(private varsService: VarsService
        ,  private router: Router
    ) {

    }






    /**
     * Funcion para obtener los valores de las variables incluidas en la expresion
     * @param expresion 
     * @param vars 
     * @param names 
     * @returns 
     */
    parserRegexVars(expresion: string, vars: AllVar[], names: string[], jsonBuilder: JsonVariableClass) {
        return new Promise((resolve, reject) => {
            const arraynames = expresion.split(/[{}]/);
            const variablesIncluidas: AllVar[] = [];
            arraynames.forEach((key) => {
                const idKey = names.indexOf(key);
                if (idKey !== -1) {
                    //Se encontro la llave
                    variablesIncluidas.push(vars[idKey]);
                }
            })
            const noVariables = variablesIncluidas.length;
            let contadorVariablesObtenidas = 0;
            variablesIncluidas.forEach((variable) => {
                if (variable.type == 'json') {
                    const token = sessionStorage.getItem("token");
                    const id_user = sessionStorage.getItem("idUser");
                    if (token && id_user) {
                        this.varsService.getJsonVarById(variable.id, parseInt(id_user)).subscribe((variableJson) => {
                            if(variableJson[0])
                            jsonBuilder.doQuery(variableJson[0])
                                .then((value) => {
                                    if (typeof value == 'number') {
                                        expresion = expresion.replace("{" + variable.name + "}", (value.toString().includes("-") ? ("(0" + value.toString() + ")") : value.toString()));
                                        contadorVariablesObtenidas++;
                                        if (contadorVariablesObtenidas == noVariables) {
                                            resolve(expresion);
                                            this.separarDelimitadores(expresion);
                                        }
                                    } else {
                                        reject(`La variable ${variable.name}de valor no es un numero.`)
                                    }
                                })
                                .catch((err) => {
                                    reject("No se pudo obtener el valor de la variable " + variable.name)
                                })
                        }, ((err) => {
                            reject(`No se pudo obtener la variable ${variable.name}`);
                        }))
                    }else{
                        //TODO
                        this.router.navigate(['/login']);
                    }
                }
                if (variable.type == 'modbus') {
                    this.varsService.getModbusVarById(variable.id).subscribe((variableModbus) => {
                        const value: number = variableModbus[0].value[0]
                        if (typeof value == "number") {
                            expresion = expresion.replace("{" + variable.name + "}", (value.toString().includes("-") ? ("(0" + value.toString() + ")") : value.toString()));
                            contadorVariablesObtenidas++;
                            if (contadorVariablesObtenidas == noVariables) {
                                resolve(expresion);
                                this.separarDelimitadores(expresion);
                            }
                        } else {
                            reject(`La variable ${variable.name}de valor no es un numero.`)
                        }
                    }, (err: HttpErrorResponse) => {
                        reject("No se pudo obtener el valor de la variable " + variable.name)
                    })
                }
            })
        })
    }



    /**
     * Funcion para separar la expresion por operadores y numeros y crear la materia prima
     */
    public expresion!: string;
    separarDelimitadores(expresion: string) {
        this.expresion = expresion.replaceAll(" ", "");
        const expresionArr = this.expresion.split("");

        const delimitadores = /[()\+\-\*\/&\^]/;

        const numerosArr = this.expresion.split(delimitadores).filter((char => {
            if (char.length >= 1) {
                return char
            } else {
                return null;
            }
        }));

        const operadoresArr: string[] = [];
        const operadoresSinParentesis: string[] = [];

        expresionArr.forEach((char) => {
            if (char === "(" || char === ")" || char === "+" || char === "-" || char === "*" || char === "/" || char === "%" || char === "^") {
                operadoresArr.push(char);
            }
        })

        expresionArr.forEach((char) => {
            if (char === "+" || char === "-" || char === "*" || char === "/" || char === "%" || char === "^") {
                operadoresSinParentesis.push(char);
            }
        })

        //Verificar si hay un error
        if (operadoresSinParentesis.length == numerosArr.length - 1) {
            //Materia prima 
            this.escaneoJerarquia(operadoresArr, numerosArr)
        }
    }


    /**
     * Funcion que reliza las operaciones por orden de jearquia
     * @param {string[]} operadores 
     * @param {number[]} numeros 
     */
    escaneoJerarquia(operadores: string[], numeros: string[]) {
        let cola_operadores = []; //los operadores que van a ser usados
        let parentesis_inicio = 0;
        let parentesis_fin = 0;
        let estaCerrado = false;
        let idx = 0;
        let size = operadores.length;
        let recorrer = 0;

        while (!estaCerrado) {
            const operador = operadores[idx];
            if (operador == "(") {
                cola_operadores = [];
                operadores.forEach((operador, i) => {
                    if (operador.match(/[\+\-\*\/&\^]/) && i < idx) {
                        recorrer++;
                    }
                })
                parentesis_inicio = idx;
            } else if (operador == ")") {
                estaCerrado = true;
                parentesis_fin = idx;
            } else {
                cola_operadores.push(operador);
            }
            if (idx == (size - 1)) {
                estaCerrado = true;
            }
            idx++;
        }
        let x;
        let exit = true;
        while (exit) {
            if (cola_operadores.includes("^")) {
                const index_operador = cola_operadores.indexOf("^");
                cola_operadores.splice(index_operador, 1);
                const p1 = parseFloat(numeros.splice(index_operador + recorrer, 1)[0]);
                const p2 = parseFloat(numeros.splice(index_operador + recorrer, 1)[0]);
                const resultado: number = p1 ** p2;
                numeros.splice(index_operador + recorrer, 0, resultado.toString());
            } else if (cola_operadores.includes("*")) {
                const index_operador = cola_operadores.indexOf("*");
                cola_operadores.splice(index_operador, 1);
                const p1 = parseFloat(numeros.splice(index_operador + recorrer, 1)[0]);
                const p2 = parseFloat(numeros.splice(index_operador + recorrer, 1)[0]);
                const resultado: number = p1 * p2;
                numeros.splice(index_operador + recorrer, 0, resultado.toString());
            } else if (cola_operadores.includes("/")) {
                const index_operador = cola_operadores.indexOf("/");
                cola_operadores.splice(index_operador, 1);
                const p1 = parseFloat(numeros.splice(index_operador + recorrer, 1)[0]);
                const p2 = parseFloat(numeros.splice(index_operador + recorrer, 1)[0]);
                const resultado: number = p1 / p2;
                numeros.splice(index_operador + recorrer, 0, resultado.toString());
            } else if (cola_operadores.includes("+")) {
                const index_operador = cola_operadores.indexOf("+");
                cola_operadores.splice(index_operador, 1);
                const p1 = parseFloat(numeros.splice(index_operador + recorrer, 1)[0]);
                const p2 = parseFloat(numeros.splice(index_operador + recorrer, 1)[0]);
                const resultado: number = p1 + p2;
                numeros.splice(index_operador + recorrer, 0, resultado.toString());
            } else if (cola_operadores.includes("-")) {
                const index_operador = cola_operadores.indexOf("-");
                cola_operadores.splice(index_operador, 1);
                const p1 = parseFloat(numeros.splice(index_operador + recorrer, 1)[0]);
                const p2 = parseFloat(numeros.splice(index_operador + recorrer, 1)[0]);
                const resultado: number = p1 - p2;
                numeros.splice(index_operador + recorrer, 0, resultado.toString());
            }
            if (cola_operadores.length == 0) {
                const elementosSize = (parentesis_fin - parentesis_inicio) + 1;
                operadores.splice(parentesis_inicio, elementosSize);
                exit = false;
                if (operadores.length > 0 && numeros.length > 1) {
                    this.escaneoJerarquia(operadores, numeros);
                } else {
                    this.sendResult(numeros[0]);
                }
            }
        }
    }

    /**
     * Funcion para mandar la respuesta
     * @param result 
     */
    public getMessage: EventEmitter<string> = new EventEmitter();
    sendResult(result: string) {
        this.getMessage.emit(result);
    }
}

