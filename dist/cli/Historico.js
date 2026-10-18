"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Historico = void 0;
const RepositorioArquivo_1 = require("../repositories/RepositorioArquivo");
class Historico {
    constructor(chave) {
        this.nomeArquivo = "historico.txt";
        this.arquivo = new RepositorioArquivo_1.RepositorioArquivo(chave);
    }
    adicionar(comando) {
        const comandos = this.listar();
        comandos.push(comando);
        this.arquivo.salvar(this.nomeArquivo, JSON.stringify(comandos.slice(-100)));
    }
    listar() {
        const dados = this.arquivo.ler(this.nomeArquivo);
        if (!dados)
            return [];
        try {
            const resultado = JSON.parse(dados);
            return Array.isArray(resultado) ? resultado.filter((v) => typeof v === "string") : [];
        }
        catch {
            throw new Error("O histórico está inválido ou corrompido.");
        }
    }
    limpar() { this.arquivo.salvar(this.nomeArquivo, JSON.stringify([])); }
}
exports.Historico = Historico;
//# sourceMappingURL=Historico.js.map