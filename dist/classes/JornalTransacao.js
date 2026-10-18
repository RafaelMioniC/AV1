"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JornalTransacao = void 0;
class JornalTransacao {
    constructor(id, operacao, entidade, dadosAntes, dadosDepois, usuario) {
        this.id = id;
        this.timestamp = new Date();
        this.operacao = operacao;
        this.entidade = entidade;
        this.dadosAntes = dadosAntes;
        this.dadosDepois = dadosDepois;
        this.usuario = usuario;
    }
}
exports.JornalTransacao = JornalTransacao;
//# sourceMappingURL=JornalTransacao.js.map