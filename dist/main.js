"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const readline_1 = __importDefault(require("readline"));
const Mestre_1 = require("./config/Mestre");
const jornalTransacao_1 = require("./audit/jornalTransacao");
const GerenciadorSessao_1 = require("./security/GerenciadorSessao");
const RepositorioCredencial_1 = require("./repositories/RepositorioCredencial");
const RepositorioEquipamento_1 = require("./repositories/RepositorioEquipamento");
const RepositorioLote_1 = require("./repositories/RepositorioLote");
const RepositorioMovimentacao_1 = require("./repositories/RepositorioMovimentacao");
const RepositorioOrganizacao_1 = require("./repositories/RepositorioOrganizacao");
const RepositorioContrato_1 = require("./repositories/RepositorioContrato");
const RepositorioConfiguracao_1 = require("./repositories/RepositorioConfiguracao");
const ServicoAutenticar_1 = require("./service/ServicoAutenticar");
const ServicoEquipamento_1 = require("./service/ServicoEquipamento");
const ServicoLote_1 = require("./service/ServicoLote");
const ServicoMovimentacao_1 = require("./service/ServicoMovimentacao");
const ServicoOrganizacao_1 = require("./service/ServicoOrganizacao");
const ServicoRelatorio_1 = require("./service/ServicoRelatorio");
const ServicoContrato_1 = require("./service/ServicoContrato");
const ServicoConfiguracao_1 = require("./service/ServicoConfiguracao");
const Cli_1 = require("./cli/Cli");
async function perguntar(pergunta) {
    const rl = readline_1.default.createInterface({ input: process.stdin, output: process.stdout });
    return new Promise(resolve => rl.question(pergunta, res => { rl.close(); resolve(res.trim()); }));
}
async function perguntarSenha(pergunta) {
    return new Promise(resolve => {
        const stdin = process.stdin;
        const stdout = process.stdout;
        let senha = "";
        stdout.write(pergunta);
        const raw = stdin.isTTY;
        if (raw)
            stdin.setRawMode(true);
        stdin.resume();
        const receber = (dados) => {
            for (const caractere of dados.toString()) {
                if (caractere === "\u0003") {
                    if (raw)
                        stdin.setRawMode(false);
                    stdin.pause();
                    process.exit(0);
                }
                if (caractere === "\r" || caractere === "\n") {
                    if (raw)
                        stdin.setRawMode(false);
                    stdin.pause();
                    stdin.removeListener("data", receber);
                    stdout.write("\n");
                    resolve(senha);
                    return;
                }
                if (caractere === "\u007f") {
                    senha = senha.slice(0, -1);
                    continue;
                }
                senha += caractere;
            }
        };
        stdin.on("data", receber);
    });
}
async function provisionar(config) {
    console.log("\n=================================\n     GREENCODE - PROVISIONAMENTO\n=================================\n");
    let usuario = "";
    while (!usuario) {
        usuario = await perguntar("Usuário administrador: ");
        if (!usuario)
            console.log("O usuário é obrigatório.");
    }
    let senha = "";
    while (!senha) {
        senha = await perguntarSenha("Senha: ");
        if (!senha)
            console.log("A senha é obrigatória.");
    }
    const confirmacao = await perguntarSenha("Confirme a senha: ");
    if (senha !== confirmacao)
        throw new Error("As senhas não coincidem.");
    config.provisionar(usuario, senha);
    console.log("\n[OK] Configuração inicial criada.");
}
async function autenticar(servico) {
    console.log("\n==============================\n          LOGIN\n==============================");
    for (let tentativa = 1; tentativa <= 3; tentativa++) {
        const usuario = await perguntar("Usuário: ");
        const senha = await perguntarSenha("Senha: ");
        const sessao = servico.autenticar(usuario, senha);
        if (sessao) {
            console.log("\n[OK] Login realizado.");
            return sessao;
        }
        console.log("\n[ERRO] Usuário ou senha inválidos.");
    }
    throw new Error("Número máximo de tentativas excedido.");
}
async function main() {
    const configuracao = new Mestre_1.ConfiguracaoMestre();
    if (!configuracao.existe())
        await provisionar(configuracao);
    const senhaMestre = await perguntarSenha("Senha do administrador para desbloquear os dados: ");
    const chaveMestre = configuracao.obterChaveMestre(senhaMestre);
    const journal = new jornalTransacao_1.JournalTransacao(chaveMestre);
    const gerenciadorSessao = new GerenciadorSessao_1.GerenciadorSessao();
    const repositorioCredencial = new RepositorioCredencial_1.RepositorioCredencial(chaveMestre);
    const repositorioEquipamento = new RepositorioEquipamento_1.RepositorioEquipamento(chaveMestre);
    const repositorioLote = new RepositorioLote_1.RepositorioLote(chaveMestre);
    const repositorioMovimentacao = new RepositorioMovimentacao_1.RepositorioMovimentacao(chaveMestre);
    const repositorioOrganizacao = new RepositorioOrganizacao_1.RepositorioOrganizacao(chaveMestre);
    const repositorioContrato = new RepositorioContrato_1.RepositorioContrato(chaveMestre);
    const repositorioConfiguracao = new RepositorioConfiguracao_1.RepositorioConfiguracao(chaveMestre);
    const servicoAutenticacao = new ServicoAutenticar_1.ServicoAutenticacao(repositorioCredencial, journal, gerenciadorSessao);
    const administrador = configuracao.obterAdministrador(senhaMestre);
    servicoAutenticacao.sincronizarAdministrador(administrador.usuario, administrador.senhaHash, administrador.salt);
    const servicoOrganizacao = new ServicoOrganizacao_1.ServicoOrganizacao(repositorioOrganizacao, journal);
    const servicoLote = new ServicoLote_1.ServicoLote(repositorioLote, journal);
    const servicoEquipamento = new ServicoEquipamento_1.ServicoEquipamento(repositorioEquipamento, repositorioLote, journal);
    const servicoMovimentacao = new ServicoMovimentacao_1.ServicoMovimentacao(repositorioMovimentacao, repositorioEquipamento, journal);
    const servicoContrato = new ServicoContrato_1.ServicoContrato(repositorioContrato, repositorioOrganizacao, journal);
    const servicoConfiguracao = new ServicoConfiguracao_1.ServicoConfiguracao(repositorioConfiguracao, journal);
    const servicoRelatorio = new ServicoRelatorio_1.ServicoRelatorio(servicoOrganizacao, servicoLote, servicoEquipamento, servicoMovimentacao);
    const sessao = await autenticar(servicoAutenticacao);
    new Cli_1.CLI(sessao, servicoAutenticacao, servicoOrganizacao, servicoLote, servicoEquipamento, servicoMovimentacao, servicoRelatorio, servicoContrato, servicoConfiguracao, chaveMestre).iniciar();
}
main().catch(erro => { const mensagem = erro instanceof Error ? erro.message : "Erro inesperado."; console.error(`\n[ERRO] ${mensagem}`); process.exit(1); });
//# sourceMappingURL=main.js.map