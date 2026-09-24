import { Link } from 'react-router-dom';
import logo from '../../assets/logo.png';
import styles from './Navbar.module.css';
import { children } from 'react';

function Navbar({children}) {
  return (
    <div className={styles.navbarContainer}>
      <nav className={styles.navRow}>

        <div>
          <img
            src={logo}
            alt="Logo da Alexandria"
            width={90}
          />
        </div>
        <div className={styles.navegation_input}>
          {children}
        </div>

        <div>
          <ul className={styles.navegation_ul}>

            <li>
              <Link to="/home" className={styles.link}>
                Início
              </Link>
            </li>

            <li>
              <Link to="/catalogo" className={styles.link}>
                Catálogo
              </Link>
            </li>

            <li>
              <Link to="/emprestimos" className={styles.link}>
                Empréstimos
              </Link>
            </li>


          </ul>
        </div>

      </nav>
    </div>
  );
}

export default Navbar;