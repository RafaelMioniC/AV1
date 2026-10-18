"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RepositorioOrganizacao = void 0;
const RepositorioArquivo_1 = require("./RepositorioArquivo");
class RepositorioOrganizacao {
    constructor(chave) {
        this.nomeArquivo = "organizacoes.txt";
        this.arquivo = new RepositorioArquivo_1.RepositorioArquivo(chave);
    }
    salvar(organizacoes) {
        const dados = JSON.stringify(organizacoes, null, 2);
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
                throw new Error("O conteúdo das organizações não é uma lista.");
            }
            return resultado;
        }
        catch {
            throw new Error("O arquivo de organizações está inválido ou corrompido.");
        }
    }
}
exports.RepositorioOrganizacao = RepositorioOrganizacao;
//# sourceMappingURL=RepositorioOrganizacao.js.map