"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RepositorioConfiguracao = void 0;
const RepositorioArquivo_1 = require("./RepositorioArquivo");
class RepositorioConfiguracao {
    constructor(chave) {
        this.nomeArquivo = "configuracoes.txt";
        this.arquivo = new RepositorioArquivo_1.RepositorioArquivo(chave);
    }
    obter() { const d = this.arquivo.ler(this.nomeArquivo); if (!d)
        return { aliquotaImposto: 0, coeficienteDepreciacao: 0 }; try {
        const r = JSON.parse(d);
        if (typeof r.aliquotaImposto !== "number" || typeof r.coeficienteDepreciacao !== "number")
            throw new Error();
        return { aliquotaImposto: r.aliquotaImposto, coeficienteDepreciacao: r.coeficienteDepreciacao };
    }
    catch {
        throw new Error("O arquivo de configurações está inválido ou corrompido.");
    } }
    salvar(v) { this.arquivo.salvar(this.nomeArquivo, JSON.stringify(v, null, 2)); }
}
exports.RepositorioConfiguracao = RepositorioConfiguracao;
//# sourceMappingURL=RepositorioConfiguracao.js.map