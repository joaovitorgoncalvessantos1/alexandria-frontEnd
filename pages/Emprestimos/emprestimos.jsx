import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import CardBook from '../../components/CardBook/CardBook';
import styles from './emprestimos.module.css';
import { buscarLivroPorId, getEmprestimos } from '../../services/emprestimos'; 
import { useNavigate } from 'react-router-dom';


function Emprestimos() {
  const [emprestimos, setEmprestimos] = useState([]); 
  const [livroDetalhado, setLivroDetalhado] = useState(null); 
 const navigate = useNavigate();
 async function abrirDetalhes(id) {
  
  // 1. Log de segurança para ver o que está sendo passado
  console.log("ID enviado para a função:", id);

  if (!id) {
    console.error("ERRO: O ID do livro está vindo vazio ou undefined!");
    return;
  }

  try {
    const dados = await buscarLivroPorId(id);
    setLivroDetalhado(dados); 
    navigation()
    console.log("Detalhes do livro recebidos com sucesso:", dados); 
  } catch (error) {
    console.error("Erro ao buscar detalhes do livro:", error);
  }
}


  useEffect(() => {
    async function carregarEmprestimosPagina() {
      try {
        const dados = await getEmprestimos();
        const lista = dados.data || dados;
        setEmprestimos(lista); 
      } catch (error) {
        console.error("Erro ao buscar empréstimos:", error);
      }
    }
    carregarEmprestimosPagina();
  }, []);

  return (
    <div>
      <Navbar />
      <div className={styles.pageContainer}>
        <h1 className={styles.pageTitle}>Meus Empréstimos</h1>
        
        {emprestimos.length > 0 ? (
          <div className={styles.gridCards}>
            {emprestimos.map((emprestimo) => {
              const hoje = new Date();
              const dataDevolucao = new Date(emprestimo.data_prevista_devolucao);
              
              hoje.setHours(0, 0, 0, 0);
              dataDevolucao.setHours(0, 0, 0, 0);
              
              const diferencaTempo = hoje - dataDevolucao;
              const diasAtraso = Math.floor(diferencaTempo / (1000 * 60 * 60 * 24));
              const estaAtrasado = diasAtraso > 0;
              const diasRestantes = Math.abs(diasAtraso);

              return (
                <div key={emprestimo.id_emprestimos} className={styles.cardWrapper}>
                  <div className={styles.cardContent}>
                    <CardBook 
                      autor={emprestimo.autor} 
                      capa={emprestimo.capa} 
                      titulo={emprestimo.titulo} 
                      button={'ver detalhes'} 
                      
      onClick={() => navigate(`/emprestimos/${emprestimo.id_emprestimos}`)}

                    />
                    <div className={styles.progressoTexto}>
                      <span>
                        <strong>Emprestado em:</strong>{" "}
                        {new Date(emprestimo.data_emprestimo).toLocaleDateString("pt-BR")}
                      </span>
                      <span>
                        <strong>Devolver até:</strong>{" "}
                        {new Date(emprestimo.data_prevista_devolucao).toLocaleDateString("pt-BR")}
                      </span>
                    </div>
                  </div>

                  {estaAtrasado ? (
                    <div className={styles.tagAtrasado}>
                      ATRASADO ({diasAtraso} DIAS)
                    </div>
                  ) : (
                    <div className={styles.tagAtivo}>
                      {diasRestantes === 0 ? "HOJE" : `ATIVO (${diasRestantes} DIAS RESTANTES)`}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <p className={styles.semDados}>
            Nenhum empréstimo encontrado no momento.
          </p>
        )}
      </div>
    </div>
  );
}

export default Emprestimos;
