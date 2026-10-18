"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServicoRelatorio = void 0;
class ServicoRelatorio {
    constructor(servicoOrganizacao, servicoLote, servicoEquipamento, servicoMovimentacao) {
        this.servicoOrganizacao = servicoOrganizacao;
        this.servicoLote = servicoLote;
        this.servicoEquipamento = servicoEquipamento;
        this.servicoMovimentacao = servicoMovimentacao;
    }
    gerarRelatorio() {
        const organizacoes = this.servicoOrganizacao
            .listar();
        const lotes = this.servicoLote
            .listar();
        const equipamentos = this.servicoEquipamento
            .listar();
        const movimentacoes = this.servicoMovimentacao
            .listar();
        console.log("");
        console.log("=================================");
        console.log("       RELATÓRIO GREENCODE");
        console.log("=================================");
        console.log(`Organizações: ${organizacoes.length}`);
        console.log(`Lotes: ${lotes.length}`);
        console.log(`Equipamentos: ${equipamentos.length}`);
        console.log(`Movimentações: ${movimentacoes.length}`);
        console.log("=================================");
    }
}
exports.ServicoRelatorio = ServicoRelatorio;
//# sourceMappingURL=ServicoRelatorio.js.map