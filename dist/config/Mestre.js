"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfiguracaoMestre = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const crypto_1 = __importDefault(require("crypto"));
const Criptografia_1 = require("../security/Criptografia");
const Hash_1 = require("../security/Hash");
class ConfiguracaoMestre {
    constructor(arquivo = "data/configuracao-mestre.enc") {
        this.arquivo = path_1.default.resolve(arquivo);
        this.criptografia = new Criptografia_1.Criptografia();
        this.criarDiretorio();
    }
    criarDiretorio() {
        const diretorio = path_1.default.dirname(this.arquivo);
        if (!fs_1.default.existsSync(diretorio)) {
            fs_1.default.mkdirSync(diretorio, { recursive: true });
        }
    }
    existe() {
        return fs_1.default.existsSync(this.arquivo);
    }
    provisionar(usuario, senha) {
        if (this.existe()) {
            throw new Error("O sistema já foi provisionado.");
        }
        if (!usuario.trim()) {
            throw new Error("O usuário do administrador é obrigatório.");
        }
        if (!senha) {
            throw new Error("A senha do administrador é obrigatória.");
        }
        const chaveMestre = this.criptografia.gerarChave();
        const salt = crypto_1.default.randomBytes(16).toString("hex");
        const chaveConfiguracao = this.gerarChaveConfiguracao(senha, salt);
        const saltSenha = Hash_1.Hash.gerarSalt();
        const senhaHash = Hash_1.Hash.gerar(senha, saltSenha);
        const configuracao = {
            chaveMestre: chaveMestre.toString("base64"),
            administrador: {
                usuario: usuario.trim(),
                senhaHash,
                salt: saltSenha
            }
        };
        this.salvarEnvelope(configuracao, salt, chaveConfiguracao);
    }
    carregar(senhaAdministrador) {
        const envelope = this.lerEnvelope();
        const chave = this.gerarChaveConfiguracao(senhaAdministrador, envelope.salt);
        let conteudo;
        try {
            conteudo = this.criptografia.descriptografar(envelope.conteudo, chave);
        }
        catch {
            throw new Error("Não foi possível desbloquear a configuração mestre. Verifique a senha do administrador.");
        }
        let configuracao;
        try {
            configuracao = JSON.parse(conteudo);
        }
        catch {
            throw new Error("A configuração mestre está inválida ou corrompida.");
        }
        this.validarConfiguracao(configuracao);
        return configuracao;
    }
    obterChaveMestre(senhaAdministrador) {
        const configuracao = this.carregar(senhaAdministrador);
        const chave = Buffer.from(configuracao.chaveMestre, "base64");
        if (chave.length !== 32) {
            throw new Error("A chave mestre deve possuir 32 bytes.");
        }
        return Buffer.from(chave);
    }
    obterAdministrador(senhaAdministrador) {
        const configuracao = this.carregar(senhaAdministrador);
        return {
            usuario: configuracao.administrador.usuario,
            senhaHash: configuracao.administrador.senhaHash,
            salt: configuracao.administrador.salt
        };
    }
    lerEnvelope() {
        if (!this.existe()) {
            throw new Error("O sistema ainda não foi provisionado.");
        }
        let bruto;
        try {
            bruto = fs_1.default.readFileSync(this.arquivo, "utf8");
        }
        catch {
            throw new Error("Não foi possível ler a configuração mestre.");
        }
        let envelope;
        try {
            envelope = JSON.parse(bruto);
        }
        catch {
            throw new Error("A configuração mestre está inválida ou corrompida.");
        }
        if (typeof envelope !== "object" ||
            envelope === null ||
            typeof envelope.versao !== "number" ||
            typeof envelope.salt !== "string" ||
            typeof envelope.conteudo !== "string") {
            throw new Error("Formato da configuração mestre inválido.");
        }
        return envelope;
    }
    salvarEnvelope(configuracao, salt, chave) {
        const conteudo = JSON.stringify(configuracao, null, 2);
        const envelope = {
            versao: 2,
            salt,
            conteudo: this.criptografia.criptografar(conteudo, chave)
        };
        const temporario = `${this.arquivo}.${crypto_1.default.randomUUID()}.tmp`;
        try {
            fs_1.default.writeFileSync(temporario, JSON.stringify(envelope, null, 2), "utf8");
            fs_1.default.renameSync(temporario, this.arquivo);
        }
        catch {
            if (fs_1.default.existsSync(temporario)) {
                fs_1.default.unlinkSync(temporario);
            }
            throw new Error("Não foi possível concluir o provisionamento do sistema.");
        }
    }
    gerarChaveConfiguracao(senha, saltHex) {
        return crypto_1.default.scryptSync(senha, Buffer.from(saltHex, "hex"), 32);
    }
    validarConfiguracao(configuracao) {
        if (typeof configuracao !== "object" || configuracao === null) {
            throw new Error("A configuração mestre possui formato inválido.");
        }
        const dados = configuracao;
        const administrador = dados.administrador;
        if (typeof dados.chaveMestre !== "string" || !dados.chaveMestre) {
            throw new Error("A configuração mestre não possui uma chave válida.");
        }
        if (!administrador || typeof administrador !== "object") {
            throw new Error("A configuração mestre não possui um administrador válido.");
        }
        if (typeof administrador.usuario !== "string" || !administrador.usuario.trim()) {
            throw new Error("O usuário do administrador é inválido.");
        }
        if (typeof administrador.senhaHash !== "string" || !administrador.senhaHash) {
            throw new Error("O hash da senha do administrador é inválido.");
        }
        if (typeof administrador.salt !== "string" || !administrador.salt) {
            throw new Error("O salt do administrador é inválido.");
        }
        const chave = Buffer.from(dados.chaveMestre, "base64");
        if (chave.length !== 32) {
            throw new Error("A chave mestre deve possuir 32 bytes válidos.");
        }
    }
}
exports.ConfiguracaoMestre = ConfiguracaoMestre;
//# sourceMappingURL=Mestre.js.map