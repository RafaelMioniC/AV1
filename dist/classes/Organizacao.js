"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Organizacao = void 0;
class Organizacao {
    constructor(id, razaoSocial, cnpj, inscricaoEstadual, enderecoCompleto, telefone, email) {
        this.id = id;
        this.razaoSocial = razaoSocial;
        this.cnpj = cnpj;
        this.inscricaoEstadual = inscricaoEstadual;
        this.enderecoCompleto = enderecoCompleto;
        this.telefone = telefone;
        this.email = email;
        this.dataCadastro = new Date();
        this.ativo = true;
        this.contratos = [];
    }
    contratar(contrato) {
        this.contratos.push(contrato);
    }
    ativar() {
        this.ativo = true;
    }
    desativar() {
        this.ativo = false;
    }
}
exports.Organizacao = Organizacao;
//# sourceMappingURL=Organizacao.js.map