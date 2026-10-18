"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sessao = void 0;
class Sessao {
    constructor(token, usuario, papel) {
        this.TEMPO_INATIVIDADE = 30 * 60 * 1000;
        this.token = token;
        this.usuario = usuario;
        this.papel = papel;
        this.criacao = new Date();
        this.ultimaAtividade = new Date();
    }
    valida() {
        const agora = Date.now();
        return (agora - this.ultimaAtividade.getTime()
            < this.TEMPO_INATIVIDADE);
    }
    renovar() {
        this.ultimaAtividade = new Date();
    }
}
exports.Sessao = Sessao;
//# sourceMappingURL=Sessao.js.map