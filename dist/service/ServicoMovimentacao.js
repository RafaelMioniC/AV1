"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServicoMovimentacao = void 0;
const Movimentacao_1 = require("../classes/Movimentacao");
const StatusEquipamento_1 = require("../enums/StatusEquipamento");
class ServicoMovimentacao {
    constructor(repositorio, repositorioEquipamento, journal) {
        this.repositorio = repositorio;
        this.repositorioEquipamento = repositorioEquipamento;
        this.journal = journal;
    }
    registrar(equipamento, movimentacao) {
        if (movimentacao.novoStatus ===
            StatusEquipamento_1.StatusEquipamento.DESMONTE &&
            equipamento.status !==
                StatusEquipamento_1.StatusEquipamento.TRIAGEM_CONCLUIDA) {
            throw new Error("O equipamento precisa passar por triagem completa antes de ir para desmonte.");
        }
        const movimentacoes = this.repositorio.listar();
        const equipamentos = this.repositorioEquipamento.listar();
        const dadosMovimentacao = {
            id: movimentacao.id,
            equipamentoId: movimentacao.equipamentoId,
            statusAnterior: movimentacao.statusAnterior,
            novoStatus: movimentacao.novoStatus,
            data: movimentacao.data.toISOString(),
            usuario: movimentacao.usuario,
            justificativa: movimentacao.justificativa
        };
        this.journal.registrar(movimentacao.usuario, "CRIAR", "MOVIMENTACAO", movimentacao.id, `Movimentação do equipamento ${equipamento.id}: ${movimentacao.statusAnterior} -> ${movimentacao.novoStatus}`);
        const equipamentoAtualizado = {
            id: equipamento.id,
            codigoBarrasInterno: equipamento.codigoBarrasInterno,
            tipo: equipamento.tipo,
            marca: equipamento.marca,
            modelo: equipamento.modelo,
            anoFabricacao: equipamento.anoFabricacao,
            estadoFisico: equipamento.estadoFisico,
            dataEntrada: equipamento.dataEntrada.toISOString(),
            local: equipamento.local,
            peso: equipamento.peso,
            status: movimentacao.novoStatus
        };
        this.repositorio.salvar([
            ...movimentacoes,
            dadosMovimentacao
        ]);
        this.repositorioEquipamento.salvar(equipamentos.map(item => item.id === equipamento.id
            ? { ...equipamentoAtualizado, loteId: item.loteId }
            : item));
        equipamento.status =
            movimentacao.novoStatus;
    }
    listar() {
        return this.repositorio
            .listar()
            .map(dados => new Movimentacao_1.Movimentacao(dados.id, dados.equipamentoId, dados.statusAnterior, dados.novoStatus, dados.usuario, dados.justificativa, new Date(dados.data)));
    }
    buscarPorEquipamento(idEquipamento) {
        return this.listar().filter(movimentacao => movimentacao.equipamentoId ===
            idEquipamento);
    }
}
exports.ServicoMovimentacao = ServicoMovimentacao;
//# sourceMappingURL=ServicoMovimentacao.js.map