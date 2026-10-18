"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServicoEquipamento = void 0;
const Equipamento_1 = require("../classes/Equipamento");
class ServicoEquipamento {
    constructor(repositorio, repositorioLote, journal) {
        this.repositorio = repositorio;
        this.repositorioLote = repositorioLote;
        this.journal = journal;
    }
    cadastrar(equipamento, loteId, usuario) {
        const equipamentos = this.repositorio.listar();
        const lotes = this.repositorioLote.listar();
        if (!lotes.some(item => item.id === loteId))
            throw new Error("O lote informado não existe.");
        if (equipamentos.some(item => item.id === equipamento.id))
            throw new Error("Equipamento já cadastrado.");
        if (equipamentos.some(item => item.codigoBarrasInterno === equipamento.codigoBarrasInterno))
            throw new Error("O código de barras interno já está cadastrado.");
        if (!Number.isInteger(equipamento.anoFabricacao) || equipamento.anoFabricacao < 1900 || equipamento.anoFabricacao > new Date().getFullYear())
            throw new Error("Ano de fabricação inválido.");
        if (!Number.isFinite(equipamento.peso) || equipamento.peso <= 0)
            throw new Error("O peso deve ser maior que zero.");
        if (Number.isNaN(equipamento.dataEntrada.getTime()))
            throw new Error("A data de entrada do equipamento é inválida.");
        const dados = { ...equipamento, loteId, dataEntrada: equipamento.dataEntrada.toISOString() };
        this.journal.registrar(usuario, "CRIAR", "EQUIPAMENTO", equipamento.id, `Cadastro do equipamento ${equipamento.id} no lote ${loteId}`);
        this.repositorio.salvar([...equipamentos, dados]);
        const lote = lotes.find(item => item.id === loteId);
        if (!lote.equipamentoIds)
            lote.equipamentoIds = [];
        if (!lote.equipamentoIds.includes(equipamento.id))
            lote.equipamentoIds.push(equipamento.id);
        this.repositorioLote.salvar(lotes);
    }
    atualizarEstadoFisico(id, novoEstado, justificativa, usuario) {
        const equipamentos = this.repositorio.listar();
        const equipamento = equipamentos.find(item => item.id === id);
        if (!equipamento)
            throw new Error("Equipamento não encontrado.");
        const objeto = this.converter(equipamento);
        objeto.atualizarEstadoFisico(novoEstado, justificativa);
        const atualizado = { ...equipamento, estadoFisico: objeto.estadoFisico };
        this.journal.registrar(usuario, "ATUALIZAR", "EQUIPAMENTO", id, `Estado físico: ${equipamento.estadoFisico} -> ${novoEstado}; Justificativa: ${justificativa || "não informada"}`);
        this.repositorio.salvar(equipamentos.map(item => item.id === id ? atualizado : item));
    }
    listar() { return this.repositorio.listar().map(dados => this.converter(dados)); }
    buscarPorId(id) { return this.listar().find(e => e.id === id); }
    converter(dados) {
        const equipamento = new Equipamento_1.Equipamento(dados.id, dados.codigoBarrasInterno, dados.tipo, dados.marca, dados.modelo, dados.anoFabricacao, dados.estadoFisico, new Date(dados.dataEntrada), dados.local, dados.peso);
        equipamento.status = dados.status;
        return equipamento;
    }
}
exports.ServicoEquipamento = ServicoEquipamento;
//# sourceMappingURL=ServicoEquipamento.js.map