"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JournalTransacao = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const crypto_1 = __importDefault(require("crypto"));
const Criptografia_1 = require("../security/Criptografia");
class JournalTransacao {
    constructor(chave, arquivo = "data/journal.enc") {
        this.limiteTamanho = 10 * 1024 * 1024;
        this.retencaoDias = 180;
        this.chave = Buffer.from(chave);
        this.arquivo = path_1.default.resolve(arquivo);
        this.criptografia = new Criptografia_1.Criptografia();
        this.criarDiretorio();
        this.criarArquivo();
        this.aplicarRetencao();
        this.validarIntegridade();
    }
    criarDiretorio() {
        const diretorio = path_1.default.dirname(this.arquivo);
        if (!fs_1.default.existsSync(diretorio))
            fs_1.default.mkdirSync(diretorio, { recursive: true });
    }
    criarArquivo() {
        if (!fs_1.default.existsSync(this.arquivo))
            this.salvarRegistros([]);
    }
    lerRegistrosArquivo(arquivo) {
        if (!fs_1.default.existsSync(arquivo))
            return [];
        const criptografado = fs_1.default.readFileSync(arquivo, "utf8");
        if (!criptografado.trim())
            return [];
        let conteudo;
        try {
            conteudo = this.criptografia.descriptografar(criptografado, this.chave);
        }
        catch {
            throw new Error(`Não foi possível descriptografar o journal: ${arquivo}`);
        }
        try {
            const registros = JSON.parse(conteudo);
            if (!Array.isArray(registros))
                throw new Error();
            return registros;
        }
        catch {
            throw new Error(`Journal inválido: ${arquivo}`);
        }
    }
    lerRegistros() { return this.lerRegistrosArquivo(this.arquivo); }
    salvarRegistros(registros) {
        const conteudo = this.criptografia.criptografar(JSON.stringify(registros, null, 2), this.chave);
        const temporario = `${this.arquivo}.${crypto_1.default.randomUUID()}.tmp`;
        try {
            fs_1.default.writeFileSync(temporario, conteudo, "utf8");
            fs_1.default.renameSync(temporario, this.arquivo);
        }
        catch (erro) {
            if (fs_1.default.existsSync(temporario))
                fs_1.default.unlinkSync(temporario);
            throw erro;
        }
    }
    hashRegistro(registro) {
        return crypto_1.default.createHash("sha256").update(JSON.stringify(registro)).digest("hex");
    }
    rotacionarSeNecessario() {
        if (!fs_1.default.existsSync(this.arquivo) || fs_1.default.statSync(this.arquivo).size <= this.limiteTamanho)
            return;
        const data = new Date().toISOString().replace(/[:.]/g, "-");
        const destino = path_1.default.join(path_1.default.dirname(this.arquivo), `journal-${data}-${crypto_1.default.randomUUID()}.enc`);
        fs_1.default.renameSync(this.arquivo, destino);
        this.salvarRegistros([]);
    }
    aplicarRetencao() {
        // O journal é mantido por tempo indeterminado, portanto atende ao
        // requisito mínimo de 180 dias sem quebrar o encadeamento de hashes.
        // A rotação por tamanho continua sendo aplicada separadamente.
    }
    salvarArquivoRotacionado(arquivo, registros) {
        const conteudo = this.criptografia.criptografar(JSON.stringify(registros, null, 2), this.chave);
        const temporario = `${arquivo}.${crypto_1.default.randomUUID()}.tmp`;
        try {
            fs_1.default.writeFileSync(temporario, conteudo, "utf8");
            fs_1.default.renameSync(temporario, arquivo);
        }
        catch (erro) {
            if (fs_1.default.existsSync(temporario))
                fs_1.default.unlinkSync(temporario);
            throw erro;
        }
    }
    validarIntegridade() {
        const registros = this.listarBruto();
        let anterior = "GENESIS";
        for (const registro of registros) {
            if (registro.hashAnterior !== anterior)
                throw new Error("Integridade do journal comprometida: encadeamento inválido.");
            const semHash = {
                id: registro.id,
                data: registro.data,
                usuario: registro.usuario,
                operacao: registro.operacao,
                entidade: registro.entidade,
                entidadeId: registro.entidadeId,
                detalhes: registro.detalhes,
                hashAnterior: registro.hashAnterior
            };
            if (this.hashRegistro(semHash) !== registro.hashRegistro)
                throw new Error("Integridade do journal comprometida: hash inválido.");
            anterior = registro.hashRegistro;
        }
    }
    listarBruto() {
        const registros = [...this.lerRegistros()];
        const diretorio = path_1.default.dirname(this.arquivo);
        if (fs_1.default.existsSync(diretorio)) {
            for (const nome of fs_1.default.readdirSync(diretorio).filter(n => n.startsWith("journal-") && n.endsWith(".enc")).sort()) {
                registros.push(...this.lerRegistrosArquivo(path_1.default.join(diretorio, nome)));
            }
        }
        registros.sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime());
        return registros;
    }
    registrar(usuario, operacao, entidade, entidadeId, detalhes) {
        const registros = this.lerRegistros();
        const todos = this.listarBruto();
        const hashAnterior = todos.length ? todos[todos.length - 1].hashRegistro : "GENESIS";
        const base = {
            id: crypto_1.default.randomUUID(),
            data: new Date().toISOString(),
            usuario,
            operacao,
            entidade,
            entidadeId,
            detalhes,
            hashAnterior
        };
        const registro = { ...base, hashRegistro: this.hashRegistro(base) };
        registros.push(registro);
        this.salvarRegistros(registros);
        this.rotacionarSeNecessario();
        return Object.freeze({ ...registro });
    }
    listar() {
        return Object.freeze(this.listarBruto().map(registro => Object.freeze({ ...registro })));
    }
    buscarPorEntidade(entidade, entidadeId) {
        return Object.freeze(this.listar().filter(r => r.entidade === entidade && r.entidadeId === entidadeId).map(r => Object.freeze({ ...r })));
    }
}
exports.JournalTransacao = JournalTransacao;
//# sourceMappingURL=jornalTransacao.js.map