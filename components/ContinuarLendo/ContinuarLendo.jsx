import React, { useEffect, useState } from 'react'; // Adicionado aspas
import styles from './continuarLendo.module.css';
import { Link } from 'react-router-dom'; // Removido useNavigate não utilizado
import { getEmprestimos } from '../../services/emprestimos';
import { calcularAtraso, getStatusText } from '../../utils/utils.js';

function ContinuarLendo() {
  const [emprestimos, setEmprestimos] = useState([]);
  const [carregando, setCarregando] = useState(true); // Boa prática: estado de loading

useEffect(() => {
  async function carregarEmprestimos() {
    try {
      const dados = await getEmprestimos();
      const dadosComAtraso = calcularAtraso(dados);
      
      const arrayDados = Array.isArray(dadosComAtraso) ? dadosComAtraso : [];

      // 🟢 FILTRO ATUALIZADO: Remove os livros que já foram devolvidos/encerrados
      const apenasPendentes = arrayDados.filter(
        (emprestimo) => {
          const status = emprestimo.status_livro?.toLowerCase();
          return status !== 'aguardando_devolucao' && status !== 'devolvido';
        }
      );

      setEmprestimos(apenasPendentes);
    } catch (error) {
      console.error("Erro ao buscar dados na API:", error);
      setEmprestimos([]);
    } finally {
      setCarregando(false);
    }
  }
  carregarEmprestimos();
}, []);



  if (carregando) {
    return <p className={styles.semDados}>Carregando próximas devoluções...</p>;
  }

  return (
    <section className={styles.sectionContinuar}>
      <h1>Próximas devoluções</h1>
      <p>Mantenha o ritmo da sua leitura atual.</p>

      {emprestimos.length > 0 ? (
        emprestimos.map((emprestimo) => {
          // Normaliza o status para evitar repetição de código (.toLowerCase())
          const statusNormalizado = emprestimo.status_livro?.toLowerCase();

          return (
            <div key={emprestimo.id_emprestimos} className={styles.conteiner}>
              <div>
                <img 
                  src={emprestimo.capa} 
                  alt={emprestimo.titulo} 
                  className={styles.capalivro} 
                />
              </div>

              <div className={styles.infolivro}>
                <h2>{emprestimo.titulo}</h2>
                <span className={styles.autor}>{emprestimo.autor}</span>
                
                <div className={styles.progressoTexto}>
                  <span>
                    Emprestado em:{' '} 
                    {new Date(emprestimo.data_emprestimo).toLocaleDateString('pt-BR')}
                  </span>
                  <span>
                    Devolver até:{' '} 
                    {new Date(emprestimo.data_prevista_devolucao).toLocaleDateString('pt-BR')}
                  </span>
                </div>

                <Link to={`/emprestimos/${emprestimo.id_emprestimos}`} className={styles.btnRetomar}>
                  Ver detalhes →
                </Link>
              </div>

              {/* Classe de estilo dinamicamente corrigida com aspas */}
              <div className={`
                ${styles.statusBadge} 
                ${statusNormalizado === 'atrasado' ? styles.statusAtrasado : 
                  statusNormalizado === 'devolvido' ? styles.statusDevolvido : styles.statusAtivo}
              `}>
                {statusNormalizado === 'atrasado' 
                  ? `Atrasado (${emprestimo.diasAtraso} dias)` 
                  : getStatusText(emprestimo.status_livro)}
              </div>
            </div>
          );
        })
      ) : (
        <p className={styles.semDados}>
          Nenhum empréstimo pendente encontrado no momento.
        </p>
      )}
    </section>
  );
}

export default ContinuarLendo;
