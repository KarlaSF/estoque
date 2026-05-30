import React, { useState, useEffect } from 'react';
import styles from './Reposicao.module.scss';

// --- Interfaces ---
interface ProdutoEstoque {
  codigo: string;
  nome: string;
  estoqueAtual: number;
  estoqueMinimo: number;
  custoUnitario: number;
}

interface ItemPedido {
  id: string;
  codigo: string;
  produto: string;
  quantidade: number;
  custoUnit: number;
  total: number;
}

interface Pedido {
  id: string;
  codigoFornecedor: 'FM001' | 'FF001';
  fornecedor: string;
  data: string;
  tipo: 'Automático' | 'Manual';
  status: 'Realizado' | 'Processando';
  itens: ItemPedido[];
}

// Lista Fornecedor - Produto
const CATALOGO_FORNECEDOR: Omit<ProdutoEstoque, 'estoqueAtual'>[] = [
  { codigo: '100', nome: 'Perfume SOXERO 100ml masculino', estoqueMinimo: 500, custoUnitario: 45.00 },
  { codigo: '105', nome: 'Perfume SOXERO 100ml feminino', estoqueMinimo: 500, custoUnitario: 46.20 },
  { codigo: '110', nome: 'Perfume SOHODOR 100ml masculino', estoqueMinimo: 500, custoUnitario: 47.40 },
  { codigo: '115', nome: 'Perfume SOHODOR 100ml feminino', estoqueMinimo: 500, custoUnitario: 48.60 },
  { codigo: '120', nome: 'Perfume SOLAVANDO 100ml masculino', estoqueMinimo: 500, custoUnitario: 49.80 },
  { codigo: '125', nome: 'Perfume SOLAVANDO 100ml feminino', estoqueMinimo: 500, custoUnitario: 51.00 },
  { codigo: '130', nome: 'Perfume SONOAR 100ml feminino', estoqueMinimo: 500, custoUnitario: 52.20 },
  { codigo: '135', nome: 'Perfume SONAREZA 100ml masculino', estoqueMinimo: 500, custoUnitario: 53.40 },
  { codigo: '140', nome: 'Perfume SONOAR 100ml masculino', estoqueMinimo: 500, custoUnitario: 54.60 },
  { codigo: '145', nome: 'Perfume SONAREZA 100ml feminino', estoqueMinimo: 500, custoUnitario: 55.80 },
  { codigo: '150', nome: 'Perfume SOREZANDO 100ml masculino', estoqueMinimo: 500, custoUnitario: 57.00 },
  { codigo: '155', nome: 'Perfume SOFRENCIA 100ml feminino', estoqueMinimo: 600, custoUnitario: 62.00 },
  { codigo: '200', nome: 'Perfume SOXERO 50ml masculino', estoqueMinimo: 800, custoUnitario: 65.00 },
  { codigo: '205', nome: 'Perfume SOXERO 50ml feminino', estoqueMinimo: 800, custoUnitario: 66.20 },
  { codigo: '210', nome: 'Perfume SOHODOR 50ml masculino', estoqueMinimo: 800, custoUnitario: 67.40 },
  { codigo: '215', nome: 'Perfume SOHODOR 50ml feminino', estoqueMinimo: 800, custoUnitario: 68.60 },
  { codigo: '220', nome: 'Perfume SOLAVANDO 50ml masculino', estoqueMinimo: 800, custoUnitario: 69.80 },
  { codigo: '225', nome: 'Perfume SOLAVANDO 50ml feminino', estoqueMinimo: 800, custoUnitario: 70.20 },
  { codigo: '230', nome: 'Perfume SONOAR 50ml feminino', estoqueMinimo: 800, custoUnitario: 71.40 },
  { codigo: '235', nome: 'Perfume SONAREZA 50ml masculino', estoqueMinimo: 800, custoUnitario: 72.60 },
  { codigo: '240', nome: 'Perfume SONOAR 50ml masculino', estoqueMinimo: 800, custoUnitario: 73.80 },
  { codigo: '245', nome: 'Perfume SONAREZA 50ml feminino', estoqueMinimo: 800, custoUnitario: 75.00 },
  { codigo: '250', nome: 'Perfume SOREZANDO 50ml masculino', estoqueMinimo: 800, custoUnitario: 76.20 },
  { codigo: '275', nome: 'Perfume SOREZANDO 50ml feminino', estoqueMinimo: 800, custoUnitario: 82.20 },
];

export const Reposicao: React.FC = () => {
  const [produtos, setProdutos] = useState<ProdutoEstoque[]>([]);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [carregando, setCarregando] = useState<boolean>(true);
  const [abaAtiva, setAbaAtiva] = useState<'automatica' | 'manual'>('automatica');


  const [modalAberto, setModalAberto] = useState<boolean>(false);
  const [formFornecedor, setFormFornecedor] = useState<string>('');
  const [formItens, setFormItens] = useState<ItemPedido[]>([]);

  //SIMULAÇÃO DE PEDIDO
  useEffect(() => {
    setTimeout(() => {
      setProdutos([
        { codigo: '115', nome: 'Perfume SOHODOR 100ml feminino', estoqueAtual: 530, estoqueMinimo: 500, custoUnitario: 48.60 },
        { codigo: '155', nome: 'Perfume SOFRENCIA 100ml feminino', estoqueAtual: 210, estoqueMinimo: 600, custoUnitario: 62.00 },
        { codigo: '140', nome: 'Perfume SONOAR 100ml masculino', estoqueAtual: 620, estoqueMinimo: 500, custoUnitario: 54.60 },
      ]);
      setCarregando(false);
    }, 600);
  }, []);

  //Reposição Automática (5s)
useEffect(() => {
    if (produtos.length === 0) return;

    produtos.forEach(prod => {
      if (prod.estoqueAtual < prod.estoqueMinimo) {
        const jaTemPedido = pedidos.some(p => p.itens.some(i => i.codigo === prod.codigo));
        
        if (!jaTemPedido) {
          const ehFeminino = prod.nome.toLowerCase().includes('feminino');
          const codForn = ehFeminino ? 'FF001' : 'FM001';
          const nomeForn = ehFeminino ? 'FORNFEM LTDA' : 'FORNMASC LTDA';
          const qtdRepor = prod.estoqueMinimo;
          const idPedido = `AUTO-${prod.codigo}-${codForn}`;

          const novoPedido: Pedido = {
            id: idPedido,
            codigoFornecedor: codForn,
            fornecedor: nomeForn,
            data: new Date().toLocaleDateString('pt-BR'),
            tipo: 'Automático',
            status: 'Processando',
            itens: [{ 
              id: Math.random().toString(), 
              codigo: prod.codigo, 
              produto: prod.nome, 
              quantidade: qtdRepor, 
              custoUnit: prod.custoUnitario, 
              total: qtdRepor * prod.custoUnitario 
            }]
          };

          setPedidos(prev => [novoPedido, ...prev]);

          setTimeout(() => {
            setProdutos(prev => prev.map(p => p.codigo === prod.codigo ? { ...p, estoqueAtual: p.estoqueAtual + qtdRepor } : p));
            setPedidos(prev => prev.map(p => p.id === idPedido ? { ...p, status: 'Realizado' } : p));
          }, 5000);
        }
      }
    });
  }, [produtos, pedidos]);

  const alertasFiltro = produtos.filter(p => {
    const pedidoRelacionado = pedidos.find(ped => ped.itens.some(i => i.codigo === p.codigo));
    if (!pedidoRelacionado) return p.estoqueAtual < p.estoqueMinimo;
    return pedidoRelacionado.status !== 'Realizado';
  });

  const simularVenda = () => {
    setProdutos(prev => prev.map(p => p.codigo === '115' ? { ...p, estoqueAtual: p.estoqueAtual - 300 } : p));
  };

  const handleAdicionarLinhaForm = () => {
    setFormItens([...formItens, { id: Math.random().toString(), codigo: '', produto: '', quantidade: 0, custoUnit: 0, total: 0 }]);
  };

  const handleSelecionarProdutoForm = (id: string, codigo: string) => {
    const itemMaster = CATALOGO_FORNECEDOR.find(c => c.codigo === codigo);
    if (!itemMaster) return;

    setFormItens(formItens.map(i => i.id === id ? {
      ...i,
      codigo: itemMaster.codigo,
      produto: itemMaster.nome,
      quantidade: itemMaster.estoqueMinimo, 
      custoUnit: itemMaster.custoUnitario,
      total: itemMaster.estoqueMinimo * itemMaster.custoUnitario
    } : i));
  };

  const handleAtualizarQuantidadeForm = (id: string, qtd: number) => {
    setFormItens(formItens.map(i => i.id === id ? { ...i, quantidade: qtd, total: qtd * i.custoUnit } : i));
  };

  const handleConfirmarManual = () => {
    if (!formFornecedor || formItens.length === 0 || formItens.some(i => !i.codigo)) return;

    const codForn = formFornecedor === 'FORNMASC LTDA' ? 'FM001' : 'FF001';
    const primCodigoProd = formItens[0].codigo;
    const idManual = `MAN-${primCodigoProd}-${codForn}`;

    const novoManual: Pedido = {
      id: idManual,
      codigoFornecedor: codForn,
      fornecedor: formFornecedor,
      data: new Date().toLocaleDateString('pt-BR'),
      tipo: 'Manual',
      status: 'Realizado',
      itens: formItens
    };

    setProdutos(prev => {
      return prev.map(prod => {
        const itemCorrespondente = formItens.find(i => i.codigo === prod.codigo);
        if (itemCorrespondente) {
          return { ...prod, estoqueAtual: prod.estoqueAtual + itemCorrespondente.quantidade };
        }
        return prod;
      });
    });

    setPedidos(prev => [novoManual, ...prev]);
    setModalAberto(false);
  };

  const formatarMoeda = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  if (carregando) return <div className={styles.container}>Conectando ao banco de dados...</div>;

  return (
    <div className={styles.container}>
      <header className={styles.headerPagina}>
        <div className={styles.titulos}>
          <h1>Reposição de Estoque</h1>
          <p>Painel geral de ordens de entrada e compras processadas</p>
        </div>
        <div className={styles.acoes}>
          <button className={styles.btnSimular} onClick={simularVenda}>⚡ Simular Venda (-300 un)</button>
          <button className={styles.btnNovo} onClick={() => { setFormFornecedor(''); setFormItens([]); setModalAberto(true); }}>
            + Novo Pedido de Compra
          </button>
        </div>
      </header>

      {/* Seção dos Alertas De reposição*/}
      <section className={styles.cardAlertasContainer}>
        <div className={styles.tituloSecaoAlertas}><h2>⚠️ Monitoramento de Reposição Crítica</h2></div>
        <div className={styles.gridAlertas}>
          {alertasFiltro.map(p => (
            <div key={p.codigo} className={styles.cardAlertaItem}>
              <div className={styles.topoAlertaItem}>
                <strong>{p.codigo} - {p.nome}</strong>
                <span className={styles.badgeReposicao}>Abaixo do Mínimo</span>
              </div>
              <p>Estoque Físico: <span className={styles.dangerText}>{p.estoqueAtual} un</span> / Limite Mínimo: {p.estoqueMinimo} un</p>
            </div>
          ))}
          {alertasFiltro.length === 0 && (
            <p className={styles.txtSucesso}>✓ Todos os produtos encontram-se acima da margem mínima estabelecida.</p>
          )}
        </div>
      </section>

      {/* Reposições realizadas */}
      <section className={styles.containerAbasPedidos}>
        <div className={styles.headerAbas}>
          <button className={abaAtiva === 'automatica' ? styles.abaAtiva : ''} onClick={() => setAbaAtiva('automatica')}>
            Pedidos de Reposição Automática ({pedidos.filter(p => p.tipo === 'Automático').length})
          </button>
          <button className={abaAtiva === 'manual' ? styles.abaAtiva : ''} onClick={() => setAbaAtiva('manual')}>
            Pedidos de Reposição Manual ({pedidos.filter(p => p.tipo === 'Manual').length})
          </button>
        </div>

        <div className={styles.conteudoAba}>
          {(abaAtiva === 'automatica' ? pedidos.filter(p => p.tipo === 'Automático') : pedidos.filter(p => p.tipo === 'Manual')).map(pedido => (
            <div key={pedido.id} className={styles.boxPedido}>
              <div className={styles.topoBoxPedido}>
                <div>
                  <h3>{pedido.fornecedor} <span className={styles.idPedido}>#{pedido.id}</span></h3>
                  <p>Data do Recebimento: {pedido.data} | Cód Fornecedor: {pedido.codigoFornecedor}</p>
                </div>
                {pedido.status === 'Realizado' ? (
                  <span className={styles.badgeAbastecido}>✓ Realizado / Estoque Abastecido</span>
                ) : (
                  <span className={styles.badgeEmAndamento}>⚙ Realizando reposição...</span>
                )}
              </div>

              <table className={styles.tabelaPedido}>
                <thead>
                  <tr>
                    <th>CÓDIGO</th>
                    <th>PRODUTO</th>
                    <th>QUANTIDADE REPOSTA</th>
                    <th>CUSTO UNIT.</th>
                    <th>VALOR TOTAL BRUTO</th>
                  </tr>
                </thead>
                <tbody>
                  {pedido.itens.map((item, idx) => (
                    <tr key={idx}>
                      <td className={styles.codTabela}>{item.codigo}</td>
                      <td>{item.produto}</td>
                      <td>{item.quantidade} un</td>
                      <td>{formatarMoeda(item.custoUnit)}</td>
                      <td>{formatarMoeda(item.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
          {abaAtiva === 'automatica' && pedidos.filter(p => p.tipo === 'Automático').length === 0 && <p className={styles.txtVazio}>Nenhuma entrada automática registrada.</p>}
          {abaAtiva === 'manual' && pedidos.filter(p => p.tipo === 'Manual').length === 0 && <p className={styles.txtVazio}>Nenhuma entrada manual registrada.</p>}
        </div>
      </section>

      {/*Aba Manual*/}
      {modalAberto && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>Novo Pedido de Compra (Exceção Manual)</h2>
              <button onClick={() => setModalAberto(false)}>×</button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.campo}>
                <label>Fornecedor</label>
                <select value={formFornecedor} onChange={e => setFormFornecedor(e.target.value)}>
                  <option value="">Selecione o Fornecedor...</option>
                  <option value="FORNMASC LTDA">FORNMASC LTDA (Cód: FM001)</option>
                  <option value="FORNFEM LTDA">FORNFEM LTDA (Cód: FF001)</option>
                </select>
              </div>
              <div className={styles.linhaItensHeader}>
                <h3>Itens da Ordem de Compra</h3>
                <button onClick={handleAdicionarLinhaForm}>+ Adicionar Linha</button>
              </div>
              <div className={styles.listaItensForm}>
                {formItens.map(item => (
                  <div key={item.id} className={styles.linhaItemForm}>
                    <select value={item.codigo} onChange={e => handleSelecionarProdutoForm(item.id, e.target.value)}>
                      <option value="">Escolha o Produto...</option>
                      {CATALOGO_FORNECEDOR.map(c => (
                        <option key={c.codigo} value={c.codigo}>{c.codigo} - {c.nome}</option>
                      ))}
                    </select>
                    <input 
                      type="number" 
                      value={item.quantidade || ''} 
                      placeholder="Qtd" 
                      onChange={e => handleAtualizarQuantidadeForm(item.id, Number(e.target.value))} 
                    />
                    <span>{formatarMoeda(item.total)}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className={styles.modalFooter}>
              <span>Total Geral: <strong>{formatarMoeda(formItens.reduce((acc, i) => acc + i.total, 0))}</strong></span>
              <div>
                <button onClick={() => setModalAberto(false)}>Cancelar</button>
                <button className={styles.btnConfirmar} onClick={handleConfirmarManual}>Enviar Solicitação</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};