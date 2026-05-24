//export default function Reposicao() {
//  return <div>Reposicao</div>;
//}

import React, { useState } from 'react';
import styles from './Reposicao.module.scss';

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
  fornecedor: string;
  data: string;
  tipo: 'Automático' | 'Exceção';
  status: 'Pendente' | 'Aguardando Aprovação';
  itens: ItemPedido[];
}

// produtos preenchidos manualmente (CORRIGIR COM BASE NO NOSSO BANCO DE DADOS)
const CATALOGO_MASTER: ProdutoEstoque[] = [
  { codigo: '100', nome: 'Perfume SOXERO 100ml masculino', estoqueAtual: 1100, estoqueMinimo: 500, custoUnitario: 45.00 },
  { codigo: '105', nome: 'Perfume SOXERO 100ml feminino', estoqueAtual: 1155, estoqueMinimo: 500, custoUnitario: 46.20 },
  { codigo: '110', nome: 'Perfume SOHODOR 100ml masculino', estoqueAtual: 1210, estoqueMinimo: 500, custoUnitario: 47.40 },
  { codigo: '115', nome: 'Perfume SOHODOR 100ml feminino', estoqueAtual: 0, estoqueMinimo: 500, custoUnitario: 48.60 },
  { codigo: '120', nome: 'Perfume SOLAVANDO 100ml masculino', estoqueAtual: 1320, estoqueMinimo: 500, custoUnitario: 49.80 },
  { codigo: '140', nome: 'Perfume SONOAR 100ml masculino', estoqueAtual: 0, estoqueMinimo: 500, custoUnitario: 54.60 },
  { codigo: '155', nome: 'Perfume SOFRENCIA 100ml feminino', estoqueAtual: 0, estoqueMinimo: 600, custoUnitario: 62.00 },
  { codigo: '225', nome: 'Perfume SOLAVANDO 50ml feminino', estoqueAtual: 430, estoqueMinimo: 800, custoUnitario: 70.20 },
  { codigo: '245', nome: 'Perfume SONOAR 50ml feminino', estoqueAtual: 0, estoqueMinimo: 800, custoUnitario: 75.00 },
  { codigo: '275', nome: 'Perfume SOREZANDO 50ml feminino', estoqueAtual: 710, estoqueMinimo: 800, custoUnitario: 82.20 },
];

export const Reposicao: React.FC = () => {
  // Produtos com estoque BAIXO ou ZERADO
  const [produtos, setProdutos] = useState<ProdutoEstoque[]>([
    { codigo: '115', nome: 'Perfume SOHODOR 100ml feminino', estoqueAtual: 0, estoqueMinimo: 500, custoUnitario: 48.60 },
    { codigo: '140', nome: 'Perfume SONOAR 100ml masculino', estoqueAtual: 0, estoqueMinimo: 500, custoUnitario: 54.60 },
    { codigo: '225', nome: 'Perfume SOLAVANDO 50ml feminino', estoqueAtual: 430, estoqueMinimo: 800, custoUnitario: 70.20 },
    { codigo: '245', nome: 'Perfume SONOAR 50ml feminino', estoqueAtual: 0, estoqueMinimo: 800, custoUnitario: 75.00 },
    { codigo: '275', nome: 'Perfume SOREZANDO 50ml feminino', estoqueAtual: 710, estoqueMinimo: 800, custoUnitario: 82.20 },
  ]);

  // Pedidos em aberto para reposição
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  
  // Formulario Manual de Gerar Pedido
  const [modalAberto, setModalAberto] = useState<boolean>(false);
  const [formFornecedor, setFormFornecedor] = useState<string>('');
  const [formItens, setFormItens] = useState<ItemPedido[]>([]);

  // Lógica de Alertas de falta de estoque
  const alertas = produtos.map(p => {
    let status: 'Ruptura' | 'Reposicao' | 'Normal' = 'Normal';
    if (p.estoqueAtual === 0) {
      status = 'Ruptura';
    } else if (p.estoqueAtual < p.estoqueMinimo) {
      status = 'Reposicao';
    }
    return { ...p, status, sugestao: p.estoqueMinimo };
  }).filter(a => a.status === 'Ruptura' || a.status === 'Reposicao');

  //  PASSO 1: Gerar Pedido Automático
  const handleGerarPedidoAutomatico = () => {
    if (alertas.length === 0) return;

    // Evita gerar duplicado se já houver um automático pendente
    if (pedidos.some(p => p.tipo === 'Automático')) return;

    const novoPedidoAuto: Pedido = {
      id: `comp-auto-${Date.now()}`,
      fornecedor: 'FORNMASC LTDA',
      data: '24/05/2026',
      tipo: 'Automático',
      status: 'Pendente',
      itens: alertas.map(a => ({
        id: Math.random().toString(),
        codigo: a.codigo,
        produto: a.nome,
        quantidade: a.sugestao,
        custoUnit: a.custoUnitario,
        total: a.sugestao * a.custoUnitario
      }))
    };

    setPedidos([...pedidos, novoPedidoAuto]);
  };

  //Ação do formulario de pedido de compra individual
  const handleAbrirModal = () => {
    setFormFornecedor('');
    setFormItens([]);
    setModalAberto(true);
  };

  const handleAdicionarItemForm = () => {
    const novoItemForm: ItemPedido = {
      id: Date.now().toString() + Math.random(),
      codigo: '',
      produto: '',
      quantidade: 0,
      custoUnit: 0,
      total: 0
    };
    setFormItens([...formItens, novoItemForm]);
  };

  const handleRemoverItemForm = (id: string) => {
    setFormItens(formItens.filter(item => item.id !== id));
  };

  const handleSelecionarProdutoForm = (id: string, codigo: string) => {
    const produtoMaster = CATALOGO_MASTER.find(p => p.codigo === codigo);
    if (!produtoMaster) return;

    setFormItens(formItens.map(item => {
      if (item.id === id) {
        const quantidadeSugerida = produtoMaster.estoqueMinimo;
        return {
          ...item,
          codigo: produtoMaster.codigo,
          produto: produtoMaster.nome,
          quantidade: quantidadeSugerida,
          custoUnit: produtoMaster.custoUnitario,
          total: quantidadeSugerida * produtoMaster.custoUnitario
        };
      }
      return item;
    }));
  };

  const handleAtualizarQuantidadeForm = (id: string, qtd: number) => {
    setFormItens(formItens.map(item => {
      if (item.id === id) {
        return {
          ...item,
          quantidade: qtd,
          total: qtd * item.custoUnit
        };
      }
      return item;
    }));
  };

  const handleGerarPedidoExcecao = () => {
    if (!formFornecedor || formItens.length === 0 || formItens.some(i => !i.codigo)) return;

    const novoPedidoExcecao: Pedido = {
      id: `comp-exc-${Date.now()}`,
      fornecedor: formFornecedor,
      data: '24/05/2026',
      tipo: 'Exceção',
      status: 'Aguardando Aprovação',
      itens: formItens
    };

    setPedidos([...pedidos, novoPedidoExcecao]);
    setModalAberto(false);
  };

  //Marca como RECEBEIDO quando chegar a aprovação do financeiro
  const handleMarcarComoRecebido = (idPedido: string) => {
    const pedidoAlvo = pedidos.find(p => p.id === idPedido);
    if (!pedidoAlvo) return;

    // Faz a soma dos itens recebidos ao estoque atual
    const estoqueAtualizado = produtos.map(prod => {
      const itemCorrespondente = pedidoAlvo.itens.find(i => i.codigo === prod.codigo);
      if (itemCorrespondente) {
        return {
          ...prod,
          estoqueAtual: prod.estoqueAtual + itemCorrespondente.quantidade
        };
      }
      return prod;
    });

    setProdutos(estoqueAtualizado);
    // Remove o pedido finalizado da listagem da tela
    setPedidos(pedidos.filter(p => p.id !== idPedido));
  };

  const formatarMoeda = (valor: number) => {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  return (
    <div className={styles.container}>
      {/* Topo da Página */}
      <header className={styles.headerPagina}>
        <div className={styles.titulos}>
          <h1>Reposição de Estoque</h1>
          <p>Gerencie alertas e pedidos de compra para fornecedores</p>
        </div>
        <div className={styles.acoes}>
          {!pedidos.some(p => p.tipo === 'Automático') && (
            <button className={styles.btnAutomatico} onClick={handleGerarPedidoAutomatico}>
              ⚠️ Gerar Pedido Automático
            </button>
          )}
          <button className={styles.btnNovo} onClick={handleAbrirModal}>
            + Novo Pedido de Compra
          </button>
        </div>
      </header>

      {/* Seção de Alertas */}
      <section className={styles.cardAlertasContainer}>
        <div className={styles.tituloSecaoAlertas}>
          <span>⚠️</span>
          <h2>Alertas de Reposição ({alertas.length})</h2>
        </div>

        {alertas.length === 0 ? (
          <p style={{ margin: 0, color: '#1db970', fontWeight: 500 }}>
            🎉 Excelente! Todos os produtos estão com níveis de estoque seguros.
          </p>
        ) : (
          <div className={styles.gridAlertas}>
            {alertas.map((alerta) => (
              <div key={alerta.codigo} className={styles.cardAlertaItem}>
                <div className={styles.topoAlertaItem}>
                  <span className={styles.nomeProdutoAlertado}>
                    {alerta.codigo} - {alerta.nome}
                  </span>
                  <span className={`${styles.badge} ${alerta.status === 'Ruptura' ? styles.badgeRuptura : styles.badgeReposicao}`}>
                    {alerta.status === 'Ruptura' ? 'Ruptura' : 'Reposição'}
                  </span>
                </div>
                <div className={styles.corpoAlertaItem}>
                  <p>Estoque: {alerta.estoqueAtual} / Mínimo: {alerta.estoqueMinimo}</p>
                  <span className={styles.sugestaoTexto}>Sugestão: {alerta.sugestao} unidades</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Listagem Dinâmica de Pedidos Pendentes */}
      {pedidos.map((pedido) => {
        const valorTotalPedido = pedido.itens.reduce((acc, item) => acc + item.total, 0);

        return (
          <section key={pedido.id} className={styles.cardPedidoAutomatico}>
            <div className={styles.headerPedidoSecao}>
              <h2>Pedidos de Reposição Automática</h2>
              <p>Pedidos gerados automaticamente com base nos alertas de estoque</p>
            </div>

            <div className={styles.boxPedido}>
              <div className={styles.topoBoxPedido}>
                <div className={styles.infoMetaPedido}>
                  <h3>
                    Pedido <span>#{pedido.id}</span>
                    <span className={styles.tagAutomatico}>{pedido.tipo}</span>
                  </h3>
                  <p>Fornecedor: {pedido.fornecedor}</p>
                  <p>Data: {pedido.data}</p>
                </div>
                <div className={styles.statusFinanceiroBlock}>
                  <span className={pedido.status === 'Pendente' ? styles.badgePendente : styles.badgeAguardando}>
                    {pedido.status}
                  </span>
                  <button className={styles.btnMarcarRecebido} onClick={() => handleMarcarComoRecebido(pedido.id)}>
                    Marcar como Recebido
                  </button>
                </div>
              </div>

              <div className={styles.wrapperTabela}>
                <table className={styles.tabelaPedido}>
                  <thead>
                    <tr>
                      <th>PRODUTO</th>
                      <th>QUANTIDADE</th>
                      <th>CUSTO UNIT.</th>
                      <th>TOTAL</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pedido.itens.map((item, idx) => (
                      <tr key={idx}>
                        <td className={styles.nomeTabelaProd}>{item.produto}</td>
                        <td>{item.quantidade}</td>
                        <td>{formatarMoeda(item.custoUnit)}</td>
                        <td className={styles.valorTotalItem}>{formatarMoeda(item.total)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className={styles.rodapeTotalPedido}>
                <span>Valor Total:</span>
                <strong>{formatarMoeda(valorTotalPedido)}</strong>
              </div>
            </div>
          </section>
        );
      })}

      {/* MODAL DO FORMULÁRIO DE EXCEÇÃO */}
      {modalAberto && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>Novo Pedido de Compra (Exceção)</h2>
              <button className={styles.btnFecharModal} onClick={() => setModalAberto(false)}>×</button>
            </div>

            <div className={styles.modalCorpo}>
              <div className={styles.campoForm}>
                <label>Fornecedor</label>
                <select value={formFornecedor} onChange={(e) => setFormFornecedor(e.target.value)}>
                  <option value="">Selecione um fornecedor...</option>
                  <option value="FORNMASC LTDA">FORNMASC LTDA</option>
                  <option value="FORNFEM LTDA">FORNFEM LTDA</option>
                </select>
              </div>

              <div className={styles.linhaTituloItens}>
                <h3>Itens do Pedido</h3>
                <button type="button" className={styles.btnAdicionarItem} onClick={handleAdicionarItemForm}>
                  + Adicionar Item
                </button>
              </div>

              <div className={styles.listaItensForm}>
                {formItens.map((item) => (
                  <div key={item.id} className={styles.itemFormLinha}>
                    <select 
                      value={item.codigo} 
                      onChange={(e) => handleSelecionarProdutoForm(item.id, e.target.value)}
                    >
                      <option value="">Selecione um produto do catálogo...</option>
                      {CATALOGO_MASTER.map(c => (
                        <option key={c.codigo} value={c.codigo}>
                          {c.codigo} - {c.nome} (Estoque: {c.estoqueAtual})
                        </option>
                      ))}
                    </select>

                    <input 
                      type="number" 
                      placeholder="Qtd"
                      min="1"
                      value={item.quantidade || ''} 
                      onChange={(e) => handleAtualizarQuantidadeForm(item.id, Number(e.target.value))}
                    />

                    <span className={styles.precoItemForm}>
                      {formatarMoeda(item.total)}
                    </span>

                    <button type="button" className={styles.btnRemoverItem} onClick={() => handleRemoverItemForm(item.id)}>
                      ×
                    </button>
                  </div>
                ))}
                {formItens.length === 0 && (
                  <p className={styles.txtVazio}>Nenhum item adicionado a este pedido de exceção.</p>
                )}
              </div>
            </div>

            <div className={styles.modalRodape}>
              <div className={styles.totalGeralModal}>
                Total Geral: <strong>{formatarMoeda(formItens.reduce((acc, curr) => acc + curr.total, 0))}</strong>
              </div>
              <div className={styles.botoesModal}>
                <button className={styles.btnCancelar} onClick={() => setModalAberto(false)}>Cancelar</button>
                <button className={styles.btnConfirmar} onClick={handleGerarPedidoExcecao}>Gerar Pedido</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};