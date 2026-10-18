"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Contrato = void 0;
class Contrato {
    constructor(id, organizacaoId, dataInicio, dataFim, descricao, valorMensal, coletaAutomatica) {
        this.id = id;
        this.organizacaoId = organizacaoId;
        this.dataInicio = dataInicio;
        this.dataFim = dataFim;
        this.descricao = descricao;
        this.valorMensal = valorMensal;
        this.coletaAutomatica = coletaAutomatica;
        this.ativo = true;
    }
    renovar(novaDataFim) {
        this.dataFim = novaDataFim;
    }
    encerrar() {
        this.ativo = false;
    }
}
exports.Contrato = Contrato;
//# sourceMappingURL=Contrato.js.map