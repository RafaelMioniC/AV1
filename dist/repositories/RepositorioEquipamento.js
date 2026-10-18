"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RepositorioEquipamento = void 0;
const RepositorioArquivo_1 = require("./RepositorioArquivo");
class RepositorioEquipamento {
    constructor(chave) {
        this.nomeArquivo = "equipamentos.txt";
        this.arquivo = new RepositorioArquivo_1.RepositorioArquivo(chave);
    }
    salvar(equipamentos) {
        const dados = JSON.stringify(equipamentos, null, 2);
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
                throw new Error("O conteúdo dos equipamentos não é uma lista.");
            }
            return resultado;
        }
        catch {
            throw new Error("O arquivo de equipamentos está inválido ou corrompido.");
        }
    }
}
exports.RepositorioEquipamento = RepositorioEquipamento;
//# sourceMappingURL=RepositorioEquipamento.js.map