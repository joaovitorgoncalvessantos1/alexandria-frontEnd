import styles from "./CardBook.module.css";

 function CardBook({ titulo, autor, capa, onClick,button }) {
  return (
    <article className={styles.card} onClick={onClick}>

      <div className={styles.cover}>
        <img
          src={capa}
          alt={`Capa do livro ${titulo}`}
          className={styles.image}
        />
      </div>

      <div className={styles.info}>

        <h3 className={styles.title}>{titulo}</h3>
        <p className={styles.author}>{autor}</p>
        <button className={styles.button}>{button}</button>
    
      </div>

    </article>
  );
}
export default CardBook