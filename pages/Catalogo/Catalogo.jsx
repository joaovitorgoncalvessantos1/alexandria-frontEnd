import React, { useEffect, useState } from 'react'
import Navbar from '../../components/Navbar/Navbar'
import Input from '../../components/Input/Input'
import Footer from '../../components/Footer/Footer'
import styles from './Catalogo.module.css'
import Categorias from '../../components/Categorias/Categorias'
import { getLivros } from '../../services/emprestimos'
import CardBook from '../../components/CardBook/CardBook'
import { Link } from 'react-router-dom';

function Catalogo() {
  const [livros, setLivros] = useState([])
  const [busca, setBusca] = useState('') // Corrigido: iniciado como string e minúsculo

  useEffect(() => {
    async function carregarCatalogo() {
      try {
        const dadosCatalogo = await getLivros()
        setLivros(dadosCatalogo)
      } catch (error) {
        console.error('Erro ao buscar o catálogo:', error)
      }
    }
    
    carregarCatalogo() 
  }, [])

  // Corrigido: função recebe o valor do input e atualiza o estado
  function handleBusca(valor) {
    setBusca(valor)
    {console.log(busca)}
  }

  // Lógica de filtragem por título, autor ou categoria
  const livrosFiltrados = livros.filter(livro => {
    const termo = busca.toLowerCase()
    return (
      livro.titulo?.toLowerCase().includes(termo) ||
      livro.autor?.toLowerCase().includes(termo) ||
      livro.categoria?.toLowerCase().includes(termo)
    )
  })

  return (
    <div className={styles.section}>
      <Navbar />

      <div className={styles.catalogoContainer}>
        <div className={styles.header}>
          <h1>Explore nossa coleção</h1>
          <p>Encontre histórias, conhecimentos e novos mundos para descobrir na curadoria exclusiva da biblioteca Alexandria.</p>
        </div>

        <div className={styles.searchWrapper}>
          <div className={styles.navegation_input}>
            {/* Corrigido: sintaxe da arrow function no onChange */}
            <Input 
              onChange={(e) => handleBusca(e.target.value)} 
              placeholder='Pesquisar por título, autor ou categoria'
            />
          </div>
        </div>

        <div className={styles.booksGrid}>
          {/* Alterado de "livros" para "livrosFiltrados" */}
          {livrosFiltrados.length > 0 ? (
            livrosFiltrados.map(livro => (
              <CardBook 
                key={livro.id_livros}
                titulo={livro.titulo}
                autor={livro.autor}
                capa={livro.capa}
                button={<Link to={`/catalogo/${livro.id_livros}`}>Ver detalhes</Link>}
              />
            ))
          ) : (
            <p className={styles.emptyMessage}>Nenhum livro encontrado no momento.</p>
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default Catalogo
