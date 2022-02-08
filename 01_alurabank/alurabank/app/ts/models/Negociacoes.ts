import {Negociacao} from './index'
import { MeuObjeto } from './MeuObjeto';
import {logarTempoDeExecucao} from '../helpers/decorators/index'
export class Negociacoes implements MeuObjeto<Negociacoes>{

    private _negociacoes:Negociacao[] =[];

    adiciona(negociacao:Negociacao):void {

        this._negociacoes.push(negociacao);
    }

    @logarTempoDeExecucao()
    paraArray():Negociacao[]{

        return ([] as Negociacao[]).concat(this._negociacoes);
    }

    paraTexto(): void{
        console.log("impressao")
        console.log(JSON.stringify(this._negociacoes))
    }
    
    ehIgual(negociacoes: Negociacoes): boolean{
        return JSON.stringify(this._negociacoes) == JSON.stringify(negociacoes.paraArray)
    }
}