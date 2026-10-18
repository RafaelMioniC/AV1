"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Credencial = void 0;
class Credencial {
    constructor(usuario, hashSenha, salt, papel) {
        this.usuario = usuario;
        this.hashSenha = hashSenha;
        this.salt = salt;
        this.ultimoAcesso = new Date();
        this.papel = papel;
    }
    atualizarUltimoAcesso() {
        this.ultimoAcesso = new Date();
    }
}
exports.Credencial = Credencial;
//# sourceMappingURL=Credencial.js.map