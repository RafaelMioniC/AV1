"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CLI = void 0;
const readline_1 = __importDefault(require("readline"));
const crypto_1 = __importDefault(require("crypto"));
const Organizacao_1 = require("../classes/Organizacao");
const Lote_1 = require("../classes/Lote");
const Equipamento_1 = require("../classes/Equipamento");
const Movimentacao_1 = require("../classes/Movimentacao");
const Contrato_1 = require("../classes/Contrato");
const TipoEquipamento_1 = require("../enums/TipoEquipamento");
const EstadoFisico_1 = require("../enums/EstadoFisico");
const StatusEquipamento_1 = require("../enums/StatusEquipamento");
const PapelUsuario_1 = require("../enums/PapelUsuario");
const Menu_1 = require("./Menu");
const ParserComando_1 = require("./ParserComando");
const Historico_1 = require("./Historico");
class CLI {
    constructor(sessao, autenticacao, servicoOrganizacao, servicoLote, servicoEquipamento, servicoMovimentacao, servicoRelatorio, servicoContrato, servicoConfiguracao, chaveMestre) {
        this.sessao = sessao;
        this.autenticacao = autenticacao;
        this.servicoOrganizacao = servicoOrganizacao;
        this.servicoLote = servicoLote;
        this.servicoEquipamento = servicoEquipamento;
        this.servicoMovimentacao = servicoMovimentacao;
        this.servicoRelatorio = servicoRelatorio;
        this.servicoContrato = servicoContrato;
        this.servicoConfiguracao = servicoConfiguracao;
        this.menu = new Menu_1.Menu();
        this.parser = new ParserComando_1.ParserComando();
        this.historico = new Historico_1.Historico(chaveMestre);
        this.rl = readline_1.default.createInterface({
            input: process.stdin,
            output: process.stdout,
            prompt: "greencode> ",
            historySize: 100,
            removeHistoryDuplicates: true,
            completer: (linha, callback) => {
                const opcoes = this.opcoesAutocomplete();
                const correspondentes = opcoes.filter(item => item.startsWith(linha));
                callback(null, [correspondentes.length ? correspondentes : opcoes, linha]);
            }
        });
        this.rl.history = this.historico.listar().slice().reverse();
    }
    iniciar() {
        console.log("\n==============================\n          GREENCODE\n==============================");
        console.log(`Usuário: ${this.sessao.usuario}`);
        console.log(`Perfil: ${this.sessao.papel}`);
        this.menu.exibir(this.sessao.papel);
        this.rl.prompt();
        this.rl.on("line", async (linha) => {
            const entrada = linha.trim();
            if (!entrada) {
                this.rl.prompt();
                return;
            }
            try {
                if (entrada.toLowerCase() === "sair") {
                    this.encerrar();
                    return;
                }
                if (entrada.toLowerCase() === "menu") {
                    this.menu.exibir(this.sessao.papel);
                    this.rl.prompt();
                    return;
                }
                const sessaoAtual = this.autenticacao.validarSessao(this.sessao.token);
                if (!sessaoAtual) {
                    console.log("\n[ERRO] Sessão expirada.");
                    this.encerrar();
                    return;
                }
                this.sessao.renovar();
                this.historico.adicionar(entrada);
                await this.executar(this.parser.interpretar(entrada));
            }
            catch (erro) {
                const mensagem = erro instanceof Error ? erro.message : "Erro desconhecido.";
                console.log(`\n[ERRO] ${mensagem}`);
            }
            this.rl.prompt();
        });
        this.rl.on("close", () => console.log("\nGreenCode encerrado."));
    }
    async executar(comando) {
        const chave = `${comando.recurso} ${comando.acao}`.trim().toLowerCase();
        switch (chave) {
            case "organização criar":
            case "organizacao criar":
                this.verificarPermissao([PapelUsuario_1.PapelUsuario.ADMINISTRADOR, PapelUsuario_1.PapelUsuario.OPERADOR_CADASTRO]);
                this.criarOrganizacao(comando);
                break;
            case "organização listar":
            case "organizacao listar":
                this.verificarPermissao(Object.values(PapelUsuario_1.PapelUsuario));
                this.listarOrganizacoes();
                break;
            case "contrato criar":
                this.verificarPermissao([PapelUsuario_1.PapelUsuario.ADMINISTRADOR, PapelUsuario_1.PapelUsuario.OPERADOR_CADASTRO]);
                this.criarContrato(comando);
                break;
            case "contrato listar":
                this.verificarPermissao(Object.values(PapelUsuario_1.PapelUsuario));
                this.listarContratos();
                break;
            case "contrato renovar":
                this.verificarPermissao([PapelUsuario_1.PapelUsuario.ADMINISTRADOR, PapelUsuario_1.PapelUsuario.OPERADOR_CADASTRO]);
                this.renovarContrato(comando);
                break;
            case "contrato encerrar":
                this.verificarPermissao([PapelUsuario_1.PapelUsuario.ADMINISTRADOR, PapelUsuario_1.PapelUsuario.OPERADOR_CADASTRO]);
                this.encerrarContrato(comando);
                break;
            case "lote criar":
                this.verificarPermissao([PapelUsuario_1.PapelUsuario.ADMINISTRADOR, PapelUsuario_1.PapelUsuario.GESTOR_ALMOXARIFADO]);
                this.criarLote(comando);
                break;
            case "lote listar":
                this.verificarPermissao([PapelUsuario_1.PapelUsuario.ADMINISTRADOR, PapelUsuario_1.PapelUsuario.GESTOR_ALMOXARIFADO, PapelUsuario_1.PapelUsuario.AUDITOR]);
                this.listarLotes();
                break;
            case "equipamento cadastrar":
                this.verificarPermissao([PapelUsuario_1.PapelUsuario.ADMINISTRADOR, PapelUsuario_1.PapelUsuario.GESTOR_ALMOXARIFADO]);
                this.cadastrarEquipamento(comando);
                break;
            case "equipamento listar":
                this.verificarPermissao([PapelUsuario_1.PapelUsuario.ADMINISTRADOR, PapelUsuario_1.PapelUsuario.GESTOR_ALMOXARIFADO, PapelUsuario_1.PapelUsuario.AUDITOR]);
                this.listarEquipamentos();
                break;
            case "equipamento estado":
                this.verificarPermissao([PapelUsuario_1.PapelUsuario.ADMINISTRADOR, PapelUsuario_1.PapelUsuario.GESTOR_ALMOXARIFADO]);
                this.alterarEstado(comando);
                break;
            case "movimentação registrar":
            case "movimentacao registrar":
                this.verificarPermissao([PapelUsuario_1.PapelUsuario.ADMINISTRADOR, PapelUsuario_1.PapelUsuario.GESTOR_ALMOXARIFADO]);
                this.registrarMovimentacao(comando);
                break;
            case "movimentação listar":
            case "movimentacao listar":
                this.verificarPermissao([PapelUsuario_1.PapelUsuario.ADMINISTRADOR, PapelUsuario_1.PapelUsuario.GESTOR_ALMOXARIFADO, PapelUsuario_1.PapelUsuario.AUDITOR]);
                this.listarMovimentacoes(comando);
                break;
            case "usuário criar":
            case "usuario criar":
                this.verificarPermissao([PapelUsuario_1.PapelUsuario.ADMINISTRADOR]);
                this.criarUsuario(comando);
                break;
            case "usuário listar":
            case "usuario listar":
                this.verificarPermissao([PapelUsuario_1.PapelUsuario.ADMINISTRADOR]);
                this.listarUsuarios();
                break;
            case "configuração atualizar":
            case "configuracao atualizar":
                this.verificarPermissao([PapelUsuario_1.PapelUsuario.ADMINISTRADOR]);
                this.atualizarConfiguracao(comando);
                break;
            case "configuração listar":
            case "configuracao listar":
                this.verificarPermissao([PapelUsuario_1.PapelUsuario.ADMINISTRADOR, PapelUsuario_1.PapelUsuario.AUDITOR]);
                this.listarConfiguracao();
                break;
            case "relatório":
            case "relatorio":
                this.verificarPermissao([PapelUsuario_1.PapelUsuario.ADMINISTRADOR, PapelUsuario_1.PapelUsuario.AUDITOR]);
                this.servicoRelatorio.gerarRelatorio();
                break;
            default: console.log("\n[AVISO] Comando não reconhecido.\nDigite 'menu' para visualizar as opções.");
        }
    }
    criarOrganizacao(c) {
        const p = this.completar(c, ["id", "nome", "cnpj", "ie", "endereco", "telefone", "email"]);
        const organizacao = new Organizacao_1.Organizacao(this.obrigatorio(p, "id"), this.obrigatorio(p, "nome"), this.obrigatorio(p, "cnpj"), p.ie ?? "", p.endereco ?? "", p.telefone ?? "", p.email ?? "");
        this.servicoOrganizacao.criar(organizacao, this.sessao.usuario);
        console.log("[OK] Organização cadastrada.");
    }
    listarOrganizacoes() {
        const dados = this.servicoOrganizacao.listar();
        if (!dados.length) {
            console.log("[INFO] Nenhuma organização cadastrada.");
            return;
        }
        dados.forEach(o => console.log(`${o.id} | ${o.razaoSocial} | ${o.cnpj} | ${o.ativo ? "ATIVA" : "INATIVA"}`));
    }
    criarContrato(c) {
        const p = this.completar(c, ["id", "org", "inicio", "fim", "descricao", "valor", "coleta"]);
        const contrato = new Contrato_1.Contrato(this.obrigatorio(p, "id"), this.obrigatorio(p, "org"), this.converterData(this.obrigatorio(p, "inicio")), this.converterData(this.obrigatorio(p, "fim")), p.descricao ?? "", Number(this.obrigatorio(p, "valor")), (p.coleta ?? "false").toLowerCase() === "true");
        this.servicoContrato.criar(contrato, this.sessao.usuario);
        console.log("[OK] Contrato cadastrado.");
    }
    listarContratos() {
        const dados = this.servicoContrato.listar();
        if (!dados.length) {
            console.log("[INFO] Nenhum contrato cadastrado.");
            return;
        }
        dados.forEach(c => console.log(`${c.id} | organização: ${c.organizacaoId} | ${c.dataInicio.toLocaleDateString()} -> ${c.dataFim.toLocaleDateString()} | R$ ${c.valorMensal.toFixed(2)} | ${c.ativo ? "ATIVO" : "ENCERRADO"}`));
    }
    renovarContrato(c) {
        const p = this.completar(c, ["id", "fim"]);
        this.servicoContrato.renovar(this.obrigatorio(p, "id"), this.converterData(this.obrigatorio(p, "fim")), this.sessao.usuario);
        console.log("[OK] Contrato renovado.");
    }
    encerrarContrato(c) {
        const p = this.completar(c, ["id"]);
        this.servicoContrato.encerrar(this.obrigatorio(p, "id"), this.sessao.usuario);
        console.log("[OK] Contrato encerrado.");
    }
    criarLote(c) {
        const p = { ...c.parametros };
        if (c.posicionais.length) {
            p.org ?? (p.org = c.posicionais[0]);
            p.nf ?? (p.nf = c.posicionais[1]);
            p.transp ?? (p.transp = c.posicionais[2]);
        }
        p.id ?? (p.id = `LOTE-${crypto_1.default.randomUUID().slice(0, 8).toUpperCase()}`);
        p.data ?? (p.data = new Date().toISOString().slice(0, 10));
        const lote = new Lote_1.Lote(this.obrigatorio(p, "id"), this.converterData(this.obrigatorio(p, "data")), this.obrigatorio(p, "org"), this.obrigatorio(p, "nf"), this.obrigatorio(p, "transp"), p.obs ?? "");
        if (!this.servicoOrganizacao.buscarPorId(lote.organizacaoId))
            throw new Error("A organização informada não existe.");
        this.servicoLote.criar(lote, this.sessao.usuario);
        console.log(`[OK] Lote cadastrado: ${lote.id}`);
    }
    listarLotes() {
        const dados = this.servicoLote.listar();
        if (!dados.length) {
            console.log("[INFO] Nenhum lote cadastrado.");
            return;
        }
        dados.forEach(l => console.log(`${l.id} | organização: ${l.organizacaoId} | NF: ${l.notaFiscal} | ${l.status}`));
    }
    cadastrarEquipamento(c) {
        const p = this.completar(c, ["lote", "id", "codigo", "tipo", "marca", "modelo", "ano", "estado", "data", "local", "peso"]);
        const equipamento = new Equipamento_1.Equipamento(this.obrigatorio(p, "id"), this.obrigatorio(p, "codigo"), this.converterEnum(p.tipo, TipoEquipamento_1.TipoEquipamento), this.obrigatorio(p, "marca"), this.obrigatorio(p, "modelo"), Number(this.obrigatorio(p, "ano")), this.converterEnum(p.estado, EstadoFisico_1.EstadoFisico), this.converterData(this.obrigatorio(p, "data")), this.obrigatorio(p, "local"), Number(this.obrigatorio(p, "peso")));
        this.servicoEquipamento.cadastrar(equipamento, this.obrigatorio(p, "lote"), this.sessao.usuario);
        console.log("[OK] Equipamento cadastrado.");
    }
    listarEquipamentos() {
        const dados = this.servicoEquipamento.listar();
        if (!dados.length) {
            console.log("[INFO] Nenhum equipamento cadastrado.");
            return;
        }
        dados.forEach(e => console.log(`${e.id} | ${e.codigoBarrasInterno} | ${e.tipo} | ${e.marca} ${e.modelo} | ${e.estadoFisico} | ${e.status}`));
    }
    alterarEstado(c) {
        const p = this.completar(c, ["equipamento", "estado", "justificativa"]);
        this.servicoEquipamento.atualizarEstadoFisico(this.obrigatorio(p, "equipamento"), this.converterEnum(p.estado, EstadoFisico_1.EstadoFisico), p.justificativa ?? "", this.sessao.usuario);
        console.log("[OK] Estado físico atualizado.");
    }
    registrarMovimentacao(c) {
        const p = this.completar(c, ["equipamento", "status", "justificativa"]);
        const equipamento = this.servicoEquipamento.buscarPorId(this.obrigatorio(p, "equipamento"));
        if (!equipamento)
            throw new Error("O equipamento informado não existe.");
        const novoStatus = this.converterEnum(p.status, StatusEquipamento_1.StatusEquipamento);
        const movimentacao = new Movimentacao_1.Movimentacao(`${equipamento.id}-${Date.now()}`, equipamento.id, equipamento.status, novoStatus, this.sessao.usuario, p.justificativa ?? "");
        this.servicoMovimentacao.registrar(equipamento, movimentacao);
        console.log("[OK] Movimentação registrada.");
    }
    listarMovimentacoes(c) {
        const id = c.parametros.equipamento ?? c.posicionais[0];
        const dados = id ? this.servicoMovimentacao.buscarPorEquipamento(id) : this.servicoMovimentacao.listar();
        if (!dados.length) {
            console.log("[INFO] Nenhuma movimentação encontrada.");
            return;
        }
        dados.forEach(m => console.log(`${m.id} | ${m.equipamentoId} | ${m.statusAnterior} -> ${m.novoStatus} | ${m.usuario} | ${m.justificativa}`));
    }
    criarUsuario(c) {
        const p = this.completar(c, ["usuario", "senha", "papel"]);
        this.autenticacao.criarUsuario(this.obrigatorio(p, "usuario"), this.obrigatorio(p, "senha"), this.converterEnum(p.papel, PapelUsuario_1.PapelUsuario), this.sessao.usuario);
        console.log("[OK] Usuário cadastrado.");
    }
    listarUsuarios() { this.autenticacao.listarUsuarios().forEach(u => console.log(`${u.usuario} | ${u.papel}`)); }
    atualizarConfiguracao(c) {
        const p = this.completar(c, ["aliquota", "depreciacao"]);
        this.servicoConfiguracao.atualizar(Number(this.obrigatorio(p, "aliquota")), Number(this.obrigatorio(p, "depreciacao")), this.sessao.usuario);
        console.log("[OK] Configurações atualizadas.");
    }
    listarConfiguracao() {
        const c = this.servicoConfiguracao.obter();
        console.log(`Alíquota de imposto: ${c.aliquotaImposto}%`);
        console.log(`Coeficiente de depreciação: ${c.coeficienteDepreciacao}%`);
    }
    completar(c, nomes) {
        const p = { ...c.parametros };
        c.posicionais.forEach((valor, i) => { if (nomes[i] && p[nomes[i]] === undefined)
            p[nomes[i]] = valor; });
        return p;
    }
    verificarPermissao(permitidos) {
        if (!permitidos.includes(this.sessao.papel))
            throw new Error("Você não possui permissão para executar este comando.");
    }
    obrigatorio(p, nome) {
        const valor = p[nome];
        if (!valor)
            throw new Error(`O parâmetro --${nome} é obrigatório.`);
        return valor;
    }
    converterData(valor) {
        const texto = valor.trim();
        let data;
        const brasileiro = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(texto);
        if (brasileiro)
            data = new Date(Number(brasileiro[3]), Number(brasileiro[2]) - 1, Number(brasileiro[1]));
        else
            data = new Date(texto);
        if (Number.isNaN(data.getTime()))
            throw new Error(`Data inválida: ${valor}. Use DD/MM/AAAA ou AAAA-MM-DD.`);
        return data;
    }
    converterEnum(valor, enumeracao) {
        if (!valor)
            throw new Error("Parâmetro obrigatório não informado.");
        const encontrado = Object.values(enumeracao).find(item => item.toUpperCase() === valor.toUpperCase());
        if (!encontrado)
            throw new Error(`Valor inválido: ${valor}.`);
        return encontrado;
    }
    opcoesAutocomplete() {
        return [
            "menu", "sair", "organização criar", "organização listar", "contrato criar", "contrato listar", "contrato renovar", "contrato encerrar",
            "lote criar", "lote listar", "equipamento cadastrar", "equipamento listar", "equipamento estado", "movimentação registrar", "movimentação listar",
            "usuario criar", "usuario listar", "configuracao atualizar", "configuracao listar", "relatorio"
        ];
    }
    encerrar() { this.autenticacao.encerrarSessao(this.sessao.token); this.rl.close(); }
}
exports.CLI = CLI;
//# sourceMappingURL=Cli.js.map