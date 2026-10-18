"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RepositorioLote = void 0;
const RepositorioArquivo_1 = require("./RepositorioArquivo");
class RepositorioLote {
    constructor(chave) {
        this.nomeArquivo = "lotes.txt";
        this.arquivo = new RepositorioArquivo_1.RepositorioArquivo(chave);
    }
    salvar(lotes) {
        const dados = JSON.stringify(lotes, null, 2);
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
                throw new Error("O conteúdo dos lotes não é uma lista.");
            }
            return resultado;
        }
        catch {
            throw new Error("O arquivo de lotes está inválido ou corrompido.");
        }
    }
}
exports.RepositorioLote = RepositorioLote;
//# sourceMappingURL=RepositorioLote.js.map