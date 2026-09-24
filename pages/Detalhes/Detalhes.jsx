import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';

import styles from './Detalhes.module.css';
import { buscarLivroPorId } from '../../services/emprestimos';
import { solicitarEmprestimo} from '../../utils/utils';




function Detalhes() {
  const { id } = useParams();
   const navigate = useNavigate();
  const [livro, setLivro] = useState(null);

  // Temporário: depois vamos pegar isso do usuário logado
  const idCliente = 1;
const { idLivro } = useParams()
  useEffect(() => {
    async function carregarLivro() {
      try {
        const dados = await buscarLivroPorId(id);
        setLivro(dados);
      } catch (error) {
        console.error('Erro ao carregar detalhes:', error);
      }
    }

    carregarLivro();
  }, [id]);


// Local: Detalhes.jsx
const handleClick = async () => {
  try {
    const idClienteTemporario = 1;

    // 🟢 Chame APENAS esta função. Apague qualquer menção a verificarEmprestimo ou realizarEmprestimo antigas
    const resposta = await solicitarEmprestimo(idClienteTemporario, livro.id || livro.id_livros);
    
    if (resposta.sucesso) {
      alert("Livro solicitado com sucesso!");
      
      // Lógica do seu MVP para diminuir a quantidade na tela:
      // setLivro(prev => ({ ...prev, quantidade: prev.quantidade - 1 }));
    } else {
      alert("Falha no servidor.");
    }

  } catch (error) {
    console.error("Erro no clique:", error);
  }
};




  if (!livro) {
    return (
      <>
        <Navbar />

        <main className={styles.carregando}>
          <p>Carregando informações do livro...</p>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className={styles.detalhes}>
        <section className={styles.cabecalho}>
          <div className={styles.capaContainer}>
            <img
              src={livro.capa}
              alt={`Capa do livro ${livro.titulo}`}
              className={styles.capa}
            />
          </div>

          <div className={styles.informacoes}>
            <span className={styles.eyebrow}>
              Detalhes do livro
            </span>

            <h1>{livro.titulo}</h1>

            <p className={styles.sinopse}>
              {livro.sinopse}
            </p>

            <div className={styles.status}>
              <span className={styles.statusDisponivel}>
                {livro.quantidade_disponivel > 0
                  ? 'Disponível para empréstimo'
                  : 'Indisponível no momento'}
              </span>
            </div>
          </div>
        </section>

        <section className={styles.informacoesLivro}>
          <h2>Informações</h2>

          <div className={styles.grid}>
            <div className={styles.item}>
              <span>ISBN</span>
              <strong>{livro.isbn}</strong>
            </div>

            <div className={styles.item}>
              <span>Ano de publicação</span>
              <strong>{livro.ano_publicacao}</strong>
            </div>

            <div className={styles.item}>
              <span>Edição</span>
              <strong>{livro.edicao}</strong>
            </div>

            <div className={styles.item}>
              <span>Idioma</span>
              <strong>{livro.idioma}</strong>
            </div>

            <div className={styles.item}>
              <span>Páginas</span>
              <strong>{livro.numeros_paginas}</strong>
            </div>

            <div className={styles.item}>
              <span>Valor</span>
              <strong>
                {Number(livro.valor_livro).toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                })}
              </strong>
            </div>
          </div>
        </section>

        <section className={styles.disponibilidade}>
          <div>
            <h2>Disponibilidade</h2>

            <p>
              Este livro possui atualmente{' '}
              <strong>{livro.quantidade_disponivel}</strong>{' '}
              exemplares disponíveis.
            </p>
          </div>

          <button
            onClick={handleClick}
            className={styles.btnEmprestimo}
            disabled={livro.quantidade_disponivel <= 0}
          >
            {livro.quantidade_disponivel > 0
              ? 'Solicitar empréstimo'
              : 'Indisponível'}
          </button>
        </section>
      </main>
    </>
  );
}

export default Detalhes;