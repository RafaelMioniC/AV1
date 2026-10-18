"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServicoAutenticacao = void 0;
const crypto_1 = __importDefault(require("crypto"));
const Hash_1 = require("../security/Hash");
const Sessao_1 = require("../classes/Sessao");
const PapelUsuario_1 = require("../enums/PapelUsuario");
class ServicoAutenticacao {
    constructor(repositorio, journal, gerenciadorSessao) {
        this.repositorio = repositorio;
        this.journal = journal;
        this.gerenciadorSessao = gerenciadorSessao;
    }
    autenticar(usuario, senha) {
        const credenciais = this.repositorio.listar();
        const dados = credenciais.find(item => item.usuario === usuario);
        if (!dados) {
            return undefined;
        }
        const senhaValida = Hash_1.Hash.verificar(senha, dados.senhaHash, dados.salt);
        if (!senhaValida) {
            return undefined;
        }
        const sessao = new Sessao_1.Sessao(crypto_1.default.randomUUID(), usuario, dados.papel);
        this.gerenciadorSessao.criar(sessao);
        return sessao;
    }
    criarUsuario(usuario, senha, papel, usuarioResponsavel) {
        const credenciais = this.repositorio.listar();
        if (credenciais.some(item => item.usuario === usuario)) {
            throw new Error("Usuário já cadastrado.");
        }
        const salt = Hash_1.Hash.gerarSalt();
        const hash = Hash_1.Hash.gerar(senha, salt);
        const dados = {
            id: crypto_1.default.randomUUID(),
            usuario,
            senhaHash: hash,
            salt,
            papel,
            ultimoAcesso: new Date().toISOString()
        };
        this.journal.registrar(usuarioResponsavel, "CRIAR", "CREDENCIAL", dados.id, `Criação do usuário ${usuario}`);
        this.repositorio.salvar([
            ...credenciais,
            dados
        ]);
    }
    sincronizarAdministrador(usuario, senhaHash, salt) {
        const credenciais = this.repositorio.listar();
        const administradorExiste = credenciais.some(item => item.usuario === usuario);
        if (administradorExiste) {
            return;
        }
        const dados = {
            id: crypto_1.default.randomUUID(),
            usuario,
            senhaHash,
            salt,
            papel: PapelUsuario_1.PapelUsuario.ADMINISTRADOR,
            ultimoAcesso: new Date().toISOString()
        };
        this.journal.registrar("sistema", "CRIAR", "CREDENCIAL", dados.id, `Provisionamento do administrador ${usuario}`);
        this.repositorio.salvar([
            ...credenciais,
            dados
        ]);
    }
    listarUsuarios() {
        return this.repositorio.listar();
    }
    validarSessao(token) {
        return this.gerenciadorSessao.buscar(token);
    }
    encerrarSessao(token) {
        this.gerenciadorSessao.encerrar(token);
    }
}
exports.ServicoAutenticacao = ServicoAutenticacao;
//# sourceMappingURL=ServicoAutenticar.js.map