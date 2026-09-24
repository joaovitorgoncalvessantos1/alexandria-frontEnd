import React from 'react';
import styles from './Footer.module.css';

 function Footer() {
  return (
    <footer className={styles.footerContainer}>
      <div className={styles.footerContent}>
        
        {/* Coluna 1: Branding */}
        <div className={styles.brandColumn}>
          <h2 className={styles.brandTitle}>Alexandria</h2>
          <p className={styles.brandText}>Conhecimento para todos.</p>
        </div>

        {/* Coluna 2: Navegação */}
        <div className={styles.linksColumn}>
          <h3 className={styles.columnTitle}>Links</h3>
          <ul className={styles.linksList}>
            <li><a href="#home">Home</a></li>
            <li><a href="#catalogo">Catálogo</a></li>
            <li><a href="#favoritos">Favoritos</a></li>
            <li><a href="#contato">Contato</a></li>
          </ul>
        </div>

        {/* Coluna 3: Redes / Contato */}
        <div className={styles.linksColumn}>
          <h3 className={styles.columnTitle}>Redes</h3>
          <ul className={styles.linksList}>
            <li><a href="mailto:contato@alexandria.com">Email</a></li>
            <li><a href="https://instagram.com" target="_blank" rel="noreferrer">Instagram</a></li>
            <li><a href="https://github.com" target="_blank" rel="noreferrer">GitHub</a></li>
          </ul>
        </div>

      </div>

      {/* Barra de Direitos Autorais */}
      <div className={styles.copyrightBar}>
        <p>© 2026 Alexandria</p>
      </div>
    </footer>
  );
}

export default Footer