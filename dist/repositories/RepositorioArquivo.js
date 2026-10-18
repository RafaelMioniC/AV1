"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RepositorioArquivo = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const crypto_1 = __importDefault(require("crypto"));
const Criptografia_1 = require("../security/Criptografia");
class RepositorioArquivo {
    constructor(chave) {
        if (!Buffer.isBuffer(chave) || chave.length !== 32) {
            throw new Error("A chave de criptografia deve possuir 32 bytes.");
        }
        this.chave = Buffer.from(chave);
        this.diretorio = path_1.default.join(process.cwd(), "data");
        this.criptografia = new Criptografia_1.Criptografia();
        fs_1.default.mkdirSync(this.diretorio, {
            recursive: true
        });
    }
    salvar(nomeArquivo, dados) {
        const caminho = this.obterCaminho(nomeArquivo);
        const dadosCriptografados = this.criptografia.criptografar(dados, this.chave);
        const temporario = `${caminho}.${crypto_1.default.randomUUID()}.tmp`;
        try {
            fs_1.default.writeFileSync(temporario, dadosCriptografados, "utf8");
            fs_1.default.renameSync(temporario, caminho);
        }
        catch (erro) {
            if (fs_1.default.existsSync(temporario)) {
                fs_1.default.unlinkSync(temporario);
            }
            throw new Error(`Não foi possível salvar o arquivo "${nomeArquivo}".`);
        }
    }
    ler(nomeArquivo) {
        const caminho = this.obterCaminho(nomeArquivo);
        if (!fs_1.default.existsSync(caminho)) {
            return null;
        }
        let dadosCriptografados;
        try {
            dadosCriptografados = fs_1.default.readFileSync(caminho, "utf8");
        }
        catch {
            throw new Error(`Não foi possível ler o arquivo "${nomeArquivo}".`);
        }
        if (!dadosCriptografados.trim()) {
            return null;
        }
        try {
            return this.criptografia.descriptografar(dadosCriptografados, this.chave);
        }
        catch {
            throw new Error(`Não foi possível descriptografar o arquivo "${nomeArquivo}".`);
        }
    }
    excluir(nomeArquivo) {
        const caminho = this.obterCaminho(nomeArquivo);
        if (!fs_1.default.existsSync(caminho)) {
            return;
        }
        try {
            fs_1.default.unlinkSync(caminho);
        }
        catch {
            throw new Error(`Não foi possível excluir o arquivo "${nomeArquivo}".`);
        }
    }
    obterCaminho(nomeArquivo) {
        if (!nomeArquivo || nomeArquivo.trim() === "") {
            throw new Error("O nome do arquivo é obrigatório.");
        }
        const caminho = path_1.default.resolve(this.diretorio, nomeArquivo);
        const diretorioResolvido = path_1.default.resolve(this.diretorio);
        if (caminho !== diretorioResolvido &&
            !caminho.startsWith(diretorioResolvido + path_1.default.sep)) {
            throw new Error("O arquivo deve estar dentro do diretório de dados.");
        }
        return caminho;
    }
}
exports.RepositorioArquivo = RepositorioArquivo;
//# sourceMappingURL=RepositorioArquivo.js.map