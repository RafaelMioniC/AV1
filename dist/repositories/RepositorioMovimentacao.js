"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RepositorioMovimentacao = void 0;
const RepositorioArquivo_1 = require("./RepositorioArquivo");
class RepositorioMovimentacao {
    constructor(chave) {
        this.nomeArquivo = "movimentacoes.txt";
        this.arquivo = new RepositorioArquivo_1.RepositorioArquivo(chave);
    }
    salvar(movimentacoes) {
        const dados = JSON.stringify(movimentacoes, null, 2);
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
                throw new Error("O conteúdo das movimentações não é uma lista.");
            }
            return resultado;
        }
        catch {
            throw new Error("O arquivo de movimentações está inválido ou corrompido.");
        }
    }
}
exports.RepositorioMovimentacao = RepositorioMovimentacao;
//# sourceMappingURL=RepositorioMovimentacao.js.map