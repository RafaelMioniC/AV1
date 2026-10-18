"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lote = void 0;
const StatusLote_1 = require("../enums/StatusLote");
class Lote {
    constructor(id, dataEntrada, organizacaoId, notaFiscal, transportadora, observacoes = "") {
        this.id = id;
        this.dataEntrada = dataEntrada;
        this.organizacaoId = organizacaoId;
        this.notaFiscal = notaFiscal;
        this.transportadora = transportadora;
        this.equipamentos = [];
        this.status = StatusLote_1.StatusLote.RECEBIDO;
        this.observacoes = observacoes;
    }
    adicionarEquipamento(equipamento) {
        this.equipamentos.push(equipamento);
    }
    removerEquipamento(idEquipamento) {
        this.equipamentos = this.equipamentos.filter(equipamento => equipamento.id !== idEquipamento);
    }
}
exports.Lote = Lote;
//# sourceMappingURL=Lote.js.map