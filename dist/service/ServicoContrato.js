"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServicoContrato = void 0;
const Contrato_1 = require("../classes/Contrato");
class ServicoContrato {
    constructor(repositorio, repositorioOrganizacao, journal) {
        this.repositorio = repositorio;
        this.repositorioOrganizacao = repositorioOrganizacao;
        this.journal = journal;
    }
    criar(c, u) { const cs = this.repositorio.listar(); if (cs.some(x => x.id === c.id))
        throw new Error("Já existe um contrato com este ID."); if (!this.repositorioOrganizacao.listar().some(x => x.id === c.organizacaoId))
        throw new Error("A organização informada não existe."); if (c.dataFim <= c.dataInicio)
        throw new Error("A data de fim do contrato deve ser posterior à data de início."); if (!Number.isFinite(c.valorMensal) || c.valorMensal < 0)
        throw new Error("O valor mensal do contrato é inválido."); const d = { id: c.id, organizacaoId: c.organizacaoId, dataInicio: c.dataInicio.toISOString(), dataFim: c.dataFim.toISOString(), descricao: c.descricao, valorMensal: c.valorMensal, coletaAutomatica: c.coletaAutomatica, ativo: c.ativo }; this.journal.registrar(u, "CRIAR", "CONTRATO", c.id, `Cadastro do contrato ${c.id}`); this.repositorio.salvar([...cs, d]); }
    listar() { return this.repositorio.listar().map(d => this.converter(d)); }
    buscarPorId(id) { return this.listar().find(c => c.id === id); }
    renovar(id, fim, u) { const cs = this.repositorio.listar(); const c = cs.find(x => x.id === id); if (!c)
        throw new Error("Contrato não encontrado."); if (!c.ativo)
        throw new Error("Não é possível renovar um contrato encerrado."); if (fim <= new Date(c.dataInicio))
        throw new Error("A nova data de fim deve ser posterior à data de início."); c.dataFim = fim.toISOString(); this.journal.registrar(u, "RENOVAR", "CONTRATO", id, `Nova data de fim: ${c.dataFim}`); this.repositorio.salvar(cs); }
    encerrar(id, u) { const cs = this.repositorio.listar(); const c = cs.find(x => x.id === id); if (!c)
        throw new Error("Contrato não encontrado."); if (!c.ativo)
        throw new Error("O contrato já está encerrado."); c.ativo = false; this.journal.registrar(u, "ENCERRAR", "CONTRATO", id, `Encerramento do contrato ${id}`); this.repositorio.salvar(cs); }
    converter(d) { const c = new Contrato_1.Contrato(d.id, d.organizacaoId, new Date(d.dataInicio), new Date(d.dataFim), d.descricao, d.valorMensal, d.coletaAutomatica); if (!d.ativo)
        c.encerrar(); return c; }
}
exports.ServicoContrato = ServicoContrato;
//# sourceMappingURL=ServicoContrato.js.map