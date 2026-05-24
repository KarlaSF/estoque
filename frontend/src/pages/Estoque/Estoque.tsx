import { useState } from "react";
import styles from "./Estoque.module.scss";
import { estoqueProdutos } from "./Data/EstoqueProd";

export default function Estoque() {

  //status dos produtos

  const [buscaProduto, setBuscaProduto] = useState("");

  const [buscaPeriodo, setBuscaPeriodo] = useState("");

  
  //filtros
  const produtosFiltrados = estoqueProdutos.filter(
    (produto) => {

      const filtroProduto =
        buscaProduto === "" ||
        produto.produto === buscaProduto;

      const filtroPeriodo =
        buscaPeriodo === "" ||
        produto.periodo
          .toLowerCase()
          .includes(buscaPeriodo.toLowerCase());

      return filtroProduto && filtroPeriodo;
    }
  );

  //cards
  const totalMovimentacoes = produtosFiltrados.reduce(
    (total, produto) => {
      return total + produto.compras + produto.vendas;
    },
    0
  );

  const totalEstoque = produtosFiltrados.reduce(
    (total, produto) => {
      return total + produto.estoqueAtual;
    },
    0
  );

  const totalCompras = produtosFiltrados.reduce(
    (total, produto) => {
      return total + produto.compras;
    },
    0
  );

  const totalVendas = produtosFiltrados.reduce(
    (total, produto) => {
      return total + produto.vendas;
    },
    0
  );

  return (
    <div className={styles.container}>

      <h1 className={styles.title}>
        Operações de Estoque
      </h1>

      <p className={styles.subtitle}>
        Gerencie ajustes de estoque
      </p>

      {/*filtros*/} 
      <div className={styles.filters}>

        <div className={styles.searchBox}>
          🔍

          <input
            type="text"
            placeholder="Ex: Maio/2026"
            value={buscaPeriodo}
            onChange={(e) =>
              setBuscaPeriodo(e.target.value)
            }
          />
        </div>

        <div className={styles.searchBox}>
          🔍

          <select
            value={buscaProduto}
            onChange={(e) =>
              setBuscaProduto(e.target.value)
            }
          >
            <option value="">
              Todos os produtos
            </option>

            {estoqueProdutos.map((produto) => (
              <option
                key={produto.id}
                value={produto.produto}
              >
                {produto.produto}
              </option>
            ))}
          </select>
        </div>

      </div>

      {/*cards*/}
      <div className={styles.cards}>

        <div className={styles.card}>
          <h3>Total de movimentações</h3>

          <strong>
            {totalMovimentacoes}
          </strong>

          <p>
            {totalCompras} compras • {totalVendas} vendas
          </p>
        </div>

        <div className={styles.card}>
          <h3>
            Quantidade total em estoque
          </h3>

          <strong>
            {totalEstoque}
          </strong>

          <p>
            Produtos disponíveis
          </p>
        </div>

      </div>

      {/*tabela*/}
      <table>

        <thead>
          <tr>
            <th>Imagem</th>
            <th>Código</th>
            <th>Produto</th>
            <th>Estoque Atual</th>
            <th>Estoque Minimo</th>
            <th>Status</th>
            <th>Valor total</th>
          </tr>
        </thead>

        <tbody>

  {produtosFiltrados.map((produto) => (

    <tr key={produto.id}>

      <td>
        <img
          src={produto.imagem}
          className={styles.productImage}
        />
      </td>

      <td>{produto.id}</td>

      <td>{produto.produto}</td>

      <td>{produto.estoqueAtual}</td>

      <td>{produto.estoqueMinimo}</td>

      {/*deixar o status verse/vermelho*/}
      <td>
        <span
          className={
            produto.status === "Normal"
            ? styles.statusNormal
            : styles.statusRuptura
          }
        >
          {produto.status}
        </span>

</td>

      <td>
        {produto.valorTotal.toLocaleString(
          "pt-BR",
          {
            style: "currency",
            currency: "BRL",
          }
        )}
      </td>

    </tr>

  ))}

</tbody>
      </table>

    </div>
  );
}