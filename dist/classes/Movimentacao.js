"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Movimentacao = void 0;
class Movimentacao {
    constructor(id, equipamentoId, statusAnterior, novoStatus, usuario, justificativa = "", data = new Date()) {
        this.id = id;
        this.equipamentoId = equipamentoId;
        this.statusAnterior = statusAnterior;
        this.novoStatus = novoStatus;
        this.data = data;
        this.usuario = usuario;
        this.justificativa = justificativa;
    }
}
exports.Movimentacao = Movimentacao;
//# sourceMappingURL=Movimentacao.js.map