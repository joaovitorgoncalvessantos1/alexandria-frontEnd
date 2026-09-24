import React from 'react'
import styles from './Categorias.module.css'

// 1. Importe as imagens das categorias do seu projeto
import imgRomance from '../../assets/romance.png'
import imgFiccao from '../../assets/ficcao.png'
import imgHistoria from '../../assets/historia.png'
import imgBiografia from '../../assets/biografia.png'

// 2. Crie o array de objetos com as informações
importante: var categorias = [
  { id: 1, nome: 'Romance', imagem: imgRomance },
  { id: 2, nome: 'Ficção Científica', imagem: imgFiccao },
  { id: 3, nome: 'História', imagem: imgHistoria },
  { id: 4, nome: 'Biografias', imagem: imgBiografia },
]

function Categorias() {
  return (
    <section className={styles.sectionCategorias}>
      <h1>Categorias</h1>
      <p>Explore livros por seus gêneros favoritos.</p>

    
      <div className={styles.gridCategorias}>
        
    
        {categorias.map((categoria) => (
          <div key={categoria.id} className={styles.cardCategoria}>
            <img 
              src={categoria.imagem} 
              alt={`Capa da categoria ${categoria.nome}`} 
              className={styles.imgCategoria}
            />
            <div className={styles.overlayNome}>
              <h3>{categoria.nome}</h3>
            </div>
          </div>
        ))}

      </div>
    </section>
  )
}

export default Categorias
