import { NegociacoesView, MensagemView } from '../views/index';
import { Negociacoes, Negociacao, NegociacaoParcial } from '../models/Index';
import { domInject, throttle } from '../helpers/decorators/index';
import { NegociacaoService } from '../services/index';
import { imprime } from '../helpers/index';

export class NegociacaoController{

    @domInject('#data')
    private _inputData: JQuery;
    
    @domInject('#quantidade')
    private _inputQuantidade: JQuery;
    
    @domInject('#valor')
    private _inputValor: JQuery;
    
    private _negociacoes: Negociacoes = new Negociacoes();
    private _negociacoesView = new NegociacoesView('#negociacoesView', true);
    private _mensagemView = new MensagemView('#mensagemView')

    private _service = new NegociacaoService();
    
    constructor(){
            this._negociacoesView.update(this._negociacoes);
        }

    @throttle()
    adiciona(){
            console.log('*************************************penis*******************');
            const data = new Date(this._inputData.val().replace(/-/g, ','));
            if(data.getDay() == DiaDaSemana.Sabado || data.getDay() == DiaDaSemana.Domingo){

            this._mensagemView.update('Somente negociações em dias uteis, por favor')
            return
            }

            const negociacao = new Negociacao(
                data,
                parseInt(this._inputQuantidade.val()),
            parseFloat(this._inputValor.val())
            );

                this._negociacoes.adiciona(negociacao);

                imprime(negociacao, this._negociacoes);

                this._negociacoesView.update(this._negociacoes);
                this._mensagemView.update('Negociação adicionada com sucesso!');
        }

        @throttle()
        async importaDados() {

            try{

                const negociacoesParaImportar = await this._service
                .obterNegociacoes(res => {

                    if(res.ok) {
                        return res;
                    } else {
                        throw new Error(res.statusText);
                    }
                });
            
                    const negociacoesJaImportadas = this._negociacoes.paraArray();

                    negociacoesParaImportar
                        .filter(negociacao => 
                            !negociacoesJaImportadas.some(jaImportada => 
                                negociacao.ehIgual(jaImportada)))
                        .forEach(negociacao => 
                        this._negociacoes.adiciona(negociacao));

                    this._negociacoesView.update(this._negociacoes);
                }

               catch(err){
                this._mensagemView.update(err.message);
        }
                
    }

}

enum DiaDaSemana{
        Domingo,
        Segunda,
        Terca,
        Quarta,
        Quinta,
        Sexta, 
        Sabado
}