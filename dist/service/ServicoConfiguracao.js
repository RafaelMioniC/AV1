"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServicoConfiguracao = void 0;
class ServicoConfiguracao {
    constructor(repositorio, journal) {
        this.repositorio = repositorio;
        this.journal = journal;
    }
    obter() { return this.repositorio.obter(); }
    atualizar(aliquotaImposto, coeficienteDepreciacao, usuario) { if (!Number.isFinite(aliquotaImposto) || aliquotaImposto < 0 || aliquotaImposto > 100)
        throw new Error("A alíquota de imposto deve estar entre 0 e 100."); if (!Number.isFinite(coeficienteDepreciacao) || coeficienteDepreciacao < 0 || coeficienteDepreciacao > 100)
        throw new Error("O coeficiente de depreciação deve estar entre 0 e 100."); const v = { aliquotaImposto, coeficienteDepreciacao }; this.journal.registrar(usuario, "ATUALIZAR", "CONFIGURACAO", "GLOBAL", `Alíquota=${aliquotaImposto}; Depreciação=${coeficienteDepreciacao}`); this.repositorio.salvar(v); }
}
exports.ServicoConfiguracao = ServicoConfiguracao;
//# sourceMappingURL=ServicoConfiguracao.js.map