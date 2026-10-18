"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RepositorioCredencial = void 0;
const RepositorioArquivo_1 = require("./RepositorioArquivo");
class RepositorioCredencial {
    constructor(chave) {
        this.nomeArquivo = "credenciais.txt";
        this.arquivo = new RepositorioArquivo_1.RepositorioArquivo(chave);
    }
    salvar(credenciais) {
        const dados = JSON.stringify(credenciais, null, 2);
        this.arquivo.salvar(this.nomeArquivo, dados);
    }
    listar() {
        const dados = this.arquivo.ler(this.nomeArquivo);
        if (!dados) {
            return [];
        }
        try {
            const resultado = JSON.parse(dados);
            if (!Array.isArray(resultado)) {
                throw new Error("O conteúdo das credenciais não é uma lista.");
            }
            return resultado;
        }
        catch {
            throw new Error("O arquivo de credenciais está inválido ou corrompido.");
        }
    }
}
exports.RepositorioCredencial = RepositorioCredencial;
//# sourceMappingURL=RepositorioCredencial.js.map