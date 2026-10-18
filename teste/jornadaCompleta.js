const fs = require('fs');
const { ConfiguracaoMestre } = require('../dist/config/Mestre');
const { JournalTransacao } = require('../dist/audit/jornalTransacao');
const { GerenciadorSessao } = require('../dist/security/GerenciadorSessao');
const { RepositorioCredencial } = require('../dist/repositories/RepositorioCredencial');
const { RepositorioOrganizacao } = require('../dist/repositories/RepositorioOrganizacao');
const { RepositorioLote } = require('../dist/repositories/RepositorioLote');
const { RepositorioEquipamento } = require('../dist/repositories/RepositorioEquipamento');
const { RepositorioMovimentacao } = require('../dist/repositories/RepositorioMovimentacao');
const { RepositorioContrato } = require('../dist/repositories/RepositorioContrato');
const { RepositorioConfiguracao } = require('../dist/repositories/RepositorioConfiguracao');
const { ServicoAutenticacao } = require('../dist/service/ServicoAutenticar');
const { ServicoOrganizacao } = require('../dist/service/ServicoOrganizacao');
const { ServicoLote } = require('../dist/service/ServicoLote');
const { ServicoEquipamento } = require('../dist/service/ServicoEquipamento');
const { ServicoMovimentacao } = require('../dist/service/ServicoMovimentacao');
const { ServicoContrato } = require('../dist/service/ServicoContrato');
const { ServicoConfiguracao } = require('../dist/service/ServicoConfiguracao');
const { Organizacao } = require('../dist/classes/Organizacao');
const { Lote } = require('../dist/classes/Lote');
const { Equipamento } = require('../dist/classes/Equipamento');
const { Contrato } = require('../dist/classes/Contrato');
const { Movimentacao } = require('../dist/classes/Movimentacao');
const { PapelUsuario } = require('../dist/enums/PapelUsuario');
const { TipoEquipamento } = require('../dist/enums/TipoEquipamento');
const { EstadoFisico } = require('../dist/enums/EstadoFisico');
const { StatusEquipamento } = require('../dist/enums/StatusEquipamento');

fs.rmSync('data', { recursive: true, force: true });
fs.mkdirSync('data', { recursive: true });

const config = new ConfiguracaoMestre();
config.provisionar('admin', 'Admin@123');
const chave = config.obterChaveMestre('Admin@123');
const journal = new JournalTransacao(chave);
const auth = new ServicoAutenticacao(new RepositorioCredencial(chave), journal, new GerenciadorSessao());
auth.sincronizarAdministrador('admin', config.obterAdministrador('Admin@123').senhaHash, config.obterAdministrador('Admin@123').salt);
const orgRepo = new RepositorioOrganizacao(chave);
const loteRepo = new RepositorioLote(chave);
const eqRepo = new RepositorioEquipamento(chave);
const movRepo = new RepositorioMovimentacao(chave);
const so = new ServicoOrganizacao(orgRepo, journal);
const sl = new ServicoLote(loteRepo, journal);
const se = new ServicoEquipamento(eqRepo, loteRepo, journal);
const sm = new ServicoMovimentacao(movRepo, eqRepo, journal);
const sc = new ServicoContrato(new RepositorioContrato(chave), orgRepo, journal);
const sg = new ServicoConfiguracao(new RepositorioConfiguracao(chave), journal);

const sessao = auth.autenticar('admin', 'Admin@123');
if (!sessao || sessao.papel !== PapelUsuario.ADMINISTRADOR) throw new Error('Falha na autenticação.');

so.criar(new Organizacao('ORG001', 'Empresa Teste', '04.252.011/0001-10', '', '', '', ''), 'admin');
sl.criar(new Lote('LOTE001', new Date('2026-09-25'), 'ORG001', 'NF001', 'TransRapida'), 'admin');
se.cadastrar(new Equipamento('EQ001', 'BAR001', TipoEquipamento.NOTEBOOK, 'Dell', 'Latitude', 2023, EstadoFisico.NOVO, new Date('2026-09-25'), 'Almoxarifado', 2.5), 'LOTE001', 'admin');

const eq = se.buscarPorId('EQ001');
if (!eq) throw new Error('Equipamento não cadastrado.');

const mover = (novoStatus, justificativa = '') => {
    const atual = se.buscarPorId('EQ001');
    const mov = new Movimentacao(`EQ001-${Date.now()}-${novoStatus}`, 'EQ001', atual.status, novoStatus, 'admin', justificativa);
    sm.registrar(atual, mov);
};

mover(StatusEquipamento.EM_TRIAGEM, 'Início da triagem');
mover(StatusEquipamento.TRIAGEM_CONCLUIDA, 'Triagem concluída');
mover(StatusEquipamento.DESMONTE, 'Encaminhamento para desmonte');

let bloqueouQueda = false;
try { se.atualizarEstadoFisico('EQ001', EstadoFisico.DANIFICADO_LEVE, '', 'admin'); } catch { bloqueouQueda = true; }
if (!bloqueouQueda) throw new Error('A queda de duas categorias deveria exigir justificativa.');
se.atualizarEstadoFisico('EQ001', EstadoFisico.DANIFICADO_LEVE, 'Dano constatado na triagem', 'admin');

sc.criar(new Contrato('CON001', 'ORG001', new Date('2026-09-01'), new Date('2027-09-01'), 'Coleta mensal', 1500, true), 'admin');
sg.atualizar(10, 5, 'admin');

const rastreabilidade = sm.buscarPorEquipamento('EQ001');
if (rastreabilidade.length !== 3) throw new Error('Rastreabilidade incompleta.');
if (loteRepo.listar()[0].equipamentoIds[0] !== 'EQ001') throw new Error('Equipamento não ficou vinculado ao lote.');
if (eqRepo.listar()[0].loteId !== 'LOTE001') throw new Error('Lote não ficou salvo no equipamento.');
if (journal.listar().length < 8) throw new Error('Journal não registrou todas as operações.');

console.log('[OK] Jornada completa executada com sucesso.');
console.log(`[OK] Movimentações rastreadas: ${rastreabilidade.length}`);
console.log(`[OK] Journal: ${journal.listar().length} registros`);
