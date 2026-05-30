import React, { useState } from 'react';
import styles from './Pedidos.module.scss';

interface PedidoIntegrado {
  id: string; // Ex: 500-001
  codigoVendedor: string;
  nomeVendedor: string;
  codigoProduto: string;
  nomeProduto: string;
  precoOriginal: number;
  ml: number;
  genero: 'Masculino' | 'Feminino';
  quantidadePedida: number;
  imagemUrl?: string; // Imagem do produto
}

export const Pedidos: React.FC = () => {
  // Mock de dados representando pedidos
  const [pedidos] = useState<PedidoIntegrado[]>([
    {
      id: '500-001',
      codigoVendedor: '500',
      nomeVendedor: 'ADAM SMITH',
      codigoProduto: '100',
      nomeProduto: 'Perfume SOXERO',
      precoOriginal: 50.00,
      ml: 100,
      genero: 'Masculino',
      quantidadePedida: 45,
    },
    {
      id: '510-002',
      codigoVendedor: '510',
      nomeVendedor: 'BENJAMIN FRANKLIN',
      codigoProduto: '115',
      nomeProduto: 'Perfume SOHODOR',
      precoOriginal: 57.50,
      ml: 100,
      genero: 'Feminino',
      quantidadePedida: 120, // Ganhará desconto (>100)
    },
    {
      id: '520-003',
      codigoVendedor: '520',
      nomeVendedor: 'CINDY CRAWFORD',
      codigoProduto: '120',
      nomeProduto: 'Perfume SOLAVANDO',
      precoOriginal: 60.00,
      ml: 100,
      genero: 'Masculino',
      quantidadePedida: 15,
    },
    {
      id: '530-004',
      codigoVendedor: '530',
      nomeVendedor: 'DONALD TRUMP',
      codigoProduto: '135',
      nomeProduto: 'Perfume SONAREZA',
      precoOriginal: 67.50,
      ml: 100,
      genero: 'Feminino',
      quantidadePedida: 80,
    },
    {
      id: '540-005',
      codigoVendedor: '540',
      nomeVendedor: 'EDWARD NORTON',
      codigoProduto: '200',
      nomeProduto: 'Perfume SOXERO',
      precoOriginal: 100.00,
      ml: 50,
      genero: 'Masculino',
      quantidadePedida: 110, // Ganhará desconto (>100)
    },
    {
      id: '550-006',
      codigoVendedor: '550',
      nomeVendedor: 'FRANCIS BACON',
      codigoProduto: '225',
      nomeProduto: 'Perfume SOLAVANDO',
      precoOriginal: 112.50,
      ml: 50,
      genero: 'Feminino',
      quantidadePedida: 30,
    },
    {
      id: '560-007',
      codigoVendedor: '560',
      nomeVendedor: 'GIULIANO GEMMA',
      codigoProduto: '240',
      nomeProduto: 'Perfume SONOAR',
      precoOriginal: 120.00,
      ml: 50,
      genero: 'Masculino',
      quantidadePedida: 250, // Ganhará desconto (>100)
    },
    {
      id: '570-008',
      codigoVendedor: '570',
      nomeVendedor: 'HAROLD FLINT',
      codigoProduto: '275',
      nomeProduto: 'Perfume SOREZANDO',
      precoOriginal: 137.50,
      ml: 50,
      genero: 'Feminino',
      quantidadePedida: 12,
    },
  ]);

  // Função para calcular preço final aplicando desconto máximo de 5% se Qtd > 100
  const calcularPrecoFinal = (preco: number, qtd: number) => {
    if (qtd > 100) {
      return preco * 0.95; // 5% de desconto
    }
    return preco;
  };

  const formatarMoeda = (valor: number) => {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  return (
    <div className={styles.containerPedidos}>
      {}
      <header className={styles.headerPedidos}>
        <h1>Pedidos Recebidos</h1>
        <p>Monitoramento de ordens de saída enviadas pelo sistema de vendas</p>
      </header>

      {}
      <div className={styles.gridCards}>
        {pedidos.map((pedido) => {
          const precoFinal = calcularPrecoFinal(pedido.precoOriginal, pedido.quantidadePedida);
          const temDesconto = pedido.quantidadePedida > 100;

          return (
            <div key={pedido.id} className={styles.cardStyle}>
              {/*Código Vendedor + Sequência*/}
              <div className={styles.tagCodigoIdentificador}>
                <span>{pedido.id}</span>
              </div>

              {/* Imagem */}
              <div className={styles.containerImagemProduto}>
                {pedido.imagemUrl ? (
                  <img src={pedido.imagemUrl} alt={pedido.nomeProduto} />
                ) : (
                  <div className={styles.placeholderImagem}>
                    <span>📦</span>
                    <small>CÓD: {pedido.codigoProduto}</small>
                  </div>
                )}
              </div>

              {/* informações gerais do pedido */}
              <div className={styles.infoCorpoCard}>
                <h3 className={styles.nomeProduto}>{pedido.nomeProduto}</h3>
                
                {/* Gênero */}
                <div className={styles.wrapperBadgesAtributos}>
                  <span className={styles.badgeMl}>{pedido.ml} ml</span>
                  <span className={`${styles.badgeGenero} ${pedido.genero === 'Feminino' ? styles.fem : styles.masc}`}>
                    {pedido.genero}
                  </span>
                </div>

                {/* Preços */}
                <div className={styles.blocoPreco}>
                  {temDesconto && (
                    <span className={styles.precoAntigo}>
                      {formatarMoeda(pedido.precoOriginal)}
                    </span>
                  )}
                  <span className={styles.precoAtual}>
                    {formatarMoeda(precoFinal)} <small>/un</small>
                  </span>
                </div>

                <hr className={styles.divisorCard} />

                {/* Detalhes do Pedido e Vendedor */}
                <div className={styles.rodapeDetalhesVenda}>
                  <p><strong>Qtd Pedida:</strong> <span className={styles.destaqueQtd}>{pedido.quantidadePedida} un</span></p>
                  <p className={styles.txtVendedor} title={`Vendedor: ${pedido.nomeVendedor}`}>
                    👤 {pedido.nomeVendedor}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};