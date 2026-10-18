"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServicoLote = void 0;
const Lote_1 = require("../classes/Lote");
const ValidadorDataEntrada_1 = require("../validators/ValidadorDataEntrada");
class ServicoLote {
    constructor(repositorio, journal) {
        this.repositorio = repositorio;
        this.journal = journal;
    }
    criar(lote, usuario) {
        const lotes = this.repositorio.listar();
        if (lotes.some(item => item.id === lote.id))
            throw new Error("Já existe um lote com este ID.");
        if (!new ValidadorDataEntrada_1.ValidadorDataEntrada().validar(lote.dataEntrada))
            throw new Error(new ValidadorDataEntrada_1.ValidadorDataEntrada().obterMensagemErro());
        const dados = {
            id: lote.id,
            dataEntrada: lote.dataEntrada.toISOString(),
            organizacaoId: lote.organizacaoId,
            notaFiscal: lote.notaFiscal,
            transportadora: lote.transportadora,
            status: lote.status,
            observacoes: lote.observacoes,
            equipamentoIds: []
        };
        this.journal.registrar(usuario, "CRIAR", "LOTE", lote.id, `Cadastro do lote ${lote.id}`);
        this.repositorio.salvar([...lotes, dados]);
    }
    listar() {
        return this.repositorio.listar().map(dados => {
            const lote = new Lote_1.Lote(dados.id, new Date(dados.dataEntrada), dados.organizacaoId, dados.notaFiscal, dados.transportadora, dados.observacoes);
            lote.status = dados.status;
            return lote;
        });
    }
    buscarPorId(id) { return this.listar().find(lote => lote.id === id); }
    vincularEquipamento(loteId, equipamentoId, usuario) {
        const lotes = this.repositorio.listar();
        const lote = lotes.find(item => item.id === loteId);
        if (!lote)
            throw new Error("O lote informado não existe.");
        if (!lote.equipamentoIds)
            lote.equipamentoIds = [];
        if (lote.equipamentoIds.includes(equipamentoId))
            return;
        lote.equipamentoIds.push(equipamentoId);
        this.journal.registrar(usuario, "VINCULAR", "LOTE", loteId, `Equipamento ${equipamentoId} vinculado ao lote ${loteId}`);
        this.repositorio.salvar(lotes);
    }
}
exports.ServicoLote = ServicoLote;
//# sourceMappingURL=ServicoLote.js.map