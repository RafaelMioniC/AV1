"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RepositorioContrato = void 0;
const RepositorioArquivo_1 = require("./RepositorioArquivo");
class RepositorioContrato {
    constructor(chave) {
        this.nomeArquivo = "contratos.txt";
        this.arquivo = new RepositorioArquivo_1.RepositorioArquivo(chave);
    }
    salvar(v) { this.arquivo.salvar(this.nomeArquivo, JSON.stringify(v, null, 2)); }
    listar() { const d = this.arquivo.ler(this.nomeArquivo); if (!d)
        return []; try {
        const r = JSON.parse(d);
        if (!Array.isArray(r))
            throw new Error();
        return r;
    }
    catch {
        throw new Error("O arquivo de contratos está inválido ou corrompido.");
    } }
}
exports.RepositorioContrato = RepositorioContrato;
//# sourceMappingURL=RepositorioContrato.js.map