"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServicoOrganizacao = void 0;
const Organizacao_1 = require("../classes/Organizacao");
const ValidadorCNPJ_1 = require("../validators/ValidadorCNPJ");
class ServicoOrganizacao {
    constructor(repositorio, journal) {
        this.repositorio = repositorio;
        this.journal = journal;
    }
    criar(organizacao, usuario) {
        const organizacoes = this.repositorio.listar();
        const validador = new ValidadorCNPJ_1.ValidadorCNPJ();
        if (!validador.validar(organizacao.cnpj)) {
            throw new Error(validador.obterMensagemErro());
        }
        const existe = organizacoes.some(item => item.cnpj === organizacao.cnpj);
        if (existe) {
            throw new Error("Já existe uma organização cadastrada com este CNPJ.");
        }
        const dados = {
            id: organizacao.id,
            razaoSocial: organizacao.razaoSocial,
            cnpj: organizacao.cnpj,
            inscricaoEstadual: organizacao.inscricaoEstadual,
            enderecoCompleto: organizacao.enderecoCompleto,
            telefone: organizacao.telefone,
            email: organizacao.email,
            dataCadastro: organizacao.dataCadastro.toISOString(),
            ativo: organizacao.ativo
        };
        this.journal.registrar(usuario, "CRIAR", "ORGANIZACAO", organizacao.id, `Cadastro da organização ${organizacao.razaoSocial}`);
        this.repositorio.salvar([
            ...organizacoes,
            dados
        ]);
    }
    listar() {
        return this.repositorio
            .listar()
            .map(dados => (() => {
            const organizacao = new Organizacao_1.Organizacao(dados.id, dados.razaoSocial, dados.cnpj, dados.inscricaoEstadual, dados.enderecoCompleto, dados.telefone, dados.email);
            organizacao.ativo = dados.ativo;
            organizacao.dataCadastro = new Date(dados.dataCadastro);
            return organizacao;
        })());
    }
    buscarPorId(id) {
        return this.listar().find(organizacao => organizacao.id === id);
    }
}
exports.ServicoOrganizacao = ServicoOrganizacao;
//# sourceMappingURL=ServicoOrganizacao.js.map