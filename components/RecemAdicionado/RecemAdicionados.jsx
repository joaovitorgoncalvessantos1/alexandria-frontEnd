import React from 'react';
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import CardBook from '../CardBook/CardBook.jsx';
import styles from './RecemAdicionados.module.css';
import { buscarLivros } from '../../utils/utils';
import { criarEmprestimo } from '../../services/emprestimos';
 




export default function RecemAdicionados() {
const URL = 'http://localhost:3000/livros'
  const [livros, setLivros] = useState([])
const navigate = useNavigate();
useEffect(() => {

  async function carregarLivros() {
    try {
      const dados = await buscarLivros(URL);
      setLivros(dados);
    } catch (error) {
      console.error(error);
    }
  }

  carregarLivros();

}, []);
  const handleNext = () => console.log('Avançar carrossel');
  const handlePrev = () => console.log('Voltar carrossel');

  return (
    <section className={styles.sectionContainer}>
      {}
      <div className={styles.header}>
        <h3 className={styles.sectionTitle}>Livros recém adicionados</h3>
        <div className={styles.navigationButtons}>
          <button onClick={handlePrev} className={styles.navButton} aria-label="Voltar">
            &lt;
          </button>
          <button onClick={handleNext} className={styles.navButton} aria-label="Avançar">
            &gt;
          </button>
        </div>
      </div>

      {}
<div className={styles.booksGrid}>
  {livros.map((livro) => (
    <CardBook
      key={livro.id_livros}
      titulo={livro.titulo}
      autor={livro.autor}
      capa={livro.capa}
      button={'Ver detalhes'}
      onClick={() => navigate(`/livros/${livro.id_livros}`)}
    />
  ))}
</div>

    </section>
  );
}
