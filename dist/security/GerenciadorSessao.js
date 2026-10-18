"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GerenciadorSessao = void 0;
class GerenciadorSessao {
    constructor() {
        this.sessoes = new Map();
    }
    criar(sessao) {
        this.sessoes.set(sessao.token, sessao);
    }
    buscar(token) {
        const sessao = this.sessoes.get(token);
        if (!sessao) {
            return undefined;
        }
        if (!sessao.valida()) {
            this.sessoes.delete(token);
            return undefined;
        }
        return sessao;
    }
    encerrar(token) {
        this.sessoes.delete(token);
    }
    renovar(token) {
        const sessao = this.buscar(token);
        if (!sessao) {
            return false;
        }
        sessao.renovar();
        return true;
    }
    limparExpiradas() {
        for (const [token, sessao] of this.sessoes) {
            if (!sessao.valida()) {
                this.sessoes.delete(token);
            }
        }
    }
}
exports.GerenciadorSessao = GerenciadorSessao;
//# sourceMappingURL=GerenciadorSessao.js.map