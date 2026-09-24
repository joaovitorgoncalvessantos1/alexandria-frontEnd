import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import styles from './DetalhesEmprestimo.module.css';

import {
  buscarEmprestimosPorId,
  criarEmprestimo,
  pagarMultaService
} from '../../services/emprestimos';


const VALOR_MULTA_DIARIA = 1.00;
const ID_CLIENTE = 1;

function DetalhesEmprestimo() {
  const { id } = useParams();

  const [emprestimo, setEmprestimo] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [pagandoMulta, setPagandoMulta] = useState(false);

  useEffect(() => {
    async function carregarEmprestimo() {
      try {
        setCarregando(true);

        const dados = await buscarEmprestimosPorId(id);
        
        // Exibe no console para você validar as colunas que seu backend mapeou
        console.log("Dados oficiais do banco de dados:", dados);

        setEmprestimo(dados);
      } catch (error) {
        console.error('Erro ao carregar empréstimo:', error);
      } finally {
        setCarregando(false);
      }
    }

    if (id) {
      carregarEmprestimo();
    }
  }, [id]);
async function solicitarEmprestimo() {
  try {
    const resultado = await criarEmprestimo({
      id_cliente: ID_CLIENTE,
      id_livro: emprestimo.id_livros
    });

    console.log("Empréstimo criado:", resultado);

  } catch (error) {
    console.error("Erro ao solicitar empréstimo:", error);
  }
}
  const formatarDataBanco = (dataString) => {
    if (!dataString) return '-';

    const dataValida = dataString.replace(' ', 'T');
    const data = new Date(dataValida);

    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(data);
  };

  const calcularDiasAtraso = (dataDevolucaoPrevista) => {
    if (!dataDevolucaoPrevista) return 0;

    // Conforme o seu ENUM do banco, se já foi 'devolvido', não há atraso
    if (emprestimo?.status_livro === 'devolvido' || emprestimo?.data_real_devolucao) {
      return 0;
    }

    // Se a multa já foi paga (controle local ou via banco)
    if (emprestimo?.pago === 1 || emprestimo?.pago === true || emprestimo?.multa_paga) {
      return emprestimo?.dias_atrasado || 0;
    }

    const dataLimite = new Date(dataDevolucaoPrevista.replace(' ', 'T'));
    const hoje = new Date();

    dataLimite.setHours(0, 0, 0, 0);
    hoje.setHours(0, 0, 0, 0);

    const diferencaTempo = hoje.getTime() - dataLimite.getTime();
    const diasAtraso = Math.floor(diferencaTempo / (1000 * 60 * 60 * 24));

    return diasAtraso > 0 ? diasAtraso : 0;
  };

  const formatarMoeda = (valor) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  async function handlePagarMulta() {
    // ✅ Como o backend usa a cláusula WHERE id_multas_emprestimos = ?, 
    // enviamos o idEmprestimo (que vale 3 no seu exemplo)
    const idParaPagamento = emprestimo?.idEmprestimo;

    if (!idParaPagamento) {
      console.error('ID do empréstimo não encontrado.');
      alert('Não foi possível identificar o código deste empréstimo.');
      return;
    }

    try {
      setPagandoMulta(true);

      // Dispara a requisição HTTP enviando o ID 3
      await pagarMultaService(idParaPagamento);

  setEmprestimo((atual) => ({
  ...atual,
  pago: 1, 
  multa_paga: true,
  status_livro: 'devolvido' // 🟢 Força o status para sumir do filtro de pendentes
}));

alert("Multa paga com sucesso!");
      

    } catch (error) {
      console.error('Erro ao pagar multa:', error);
      alert(error.message || 'Erro ao processar pagamento.');
    } finally {
      setPagandoMulta(false);
    }
  }


  if (carregando) {
    return (
      <>
        <Navbar />
        <main className={styles.detalhes}>
          <p>Carregando informações do empréstimo...</p>
        </main>
      </>
    );
  }

  if (!emprestimo) {
    return (
      <>
        <Navbar />
        <main className={styles.detalhes}>
          <h1>Empréstimo não encontrado</h1>
          <p>Não foi possível encontrar as informações deste empréstimo.</p>
        </main>
      </>
    );
  }

  const diasAtraso = calcularDiasAtraso(emprestimo.data_prevista_devolucao);
  const valorTotalMulta = diasAtraso * VALOR_MULTA_DIARIA;
  
  const status = emprestimo.status_livro?.toLowerCase().trim();
  const estaPago = emprestimo.pago === 1 || emprestimo.pago === true || emprestimo.multa_paga === true;

  // O botão deve aparecer se o status do livro indicar 'atrasado' ou se houver dias de atraso calculados, DESDE QUE a multa não esteja paga
  const deveMostrarBotaoPagar = (status === 'atrasado' || diasAtraso > 0) && !estaPago;

  return (
    <>
      <Navbar />

      <main className={styles.detalhes}>

        <section className={styles.cabecalho}>
          <div className={styles.informacoes}>
            <span className={styles.eyebrow}>Detalhes do empréstimo</span>
            <h1>{emprestimo.titulo || 'Título não informado'}</h1>
            <div className={styles.status}>
              <span>{emprestimo.status_livro || 'Sem status'}</span>
            </div>
          </div>
        </section>

        <section className={styles.informacoesEmprestimo}>
          <h2>Informações do empréstimo</h2>

          <div className={styles.grid}>
            <div className={styles.item}>
              <span>Data do empréstimo</span>
              <strong>{formatarDataBanco(emprestimo.data_emprestimo)}</strong>
            </div>

            <div className={styles.item}>
              <span>Devolução prevista</span>
              <strong>{formatarDataBanco(emprestimo.data_prevista_devolucao)}</strong>
            </div>

            <div className={styles.item}>
              <span>Devolução realizada</span>
              <strong>
                {emprestimo.data_real_devolucao
                  ? formatarDataBanco(emprestimo.data_real_devolucao)
                  : 'Ainda não devolvido'}
              </strong>
            </div>

            <div className={styles.item}>
              <span>Status de atraso</span>
              <strong style={{ color: diasAtraso > 0 && !estaPago ? '#ff4d4f' : 'inherit' }}>
                {diasAtraso > 0
                  ? `${diasAtraso} ${diasAtraso === 1 ? 'dia atrasado' : 'dias atrasados'}`
                  : 'Em dia'}
              </strong>
            </div>

            <div className={styles.item}>
              <span>Valor da multa</span>
              <strong style={{ color: valorTotalMulta > 0 && !estaPago ? '#ff4d4f' : 'inherit' }}>
                {formatarMoeda(valorTotalMulta)}
              </strong>
            </div>

            <div className={styles.item}>
              <span>Renovado</span>
              <strong>{emprestimo.renovado ? 'Sim' : 'Não'}</strong>
            </div>
          </div>

          {/* BOTÃO DINÂMICO BASEADO NO SEU BANCO DE DADOS */}
          {deveMostrarBotaoPagar && (
            <div className={styles.botao}>
              <button
                onClick={handlePagarMulta}
                disabled={pagandoMulta}
              >
                {pagandoMulta ? 'Processando...' : 'Pagar multa'}
              </button>
            </div>
          )}

          {/* MENSAGEM DE SUCESSO COALINHADA COM O CAMPO 'pago' DA SUA TABELA */}
          {estaPago && (
            <div className={styles.mensagem}>
              <strong>Multa paga com sucesso!</strong>
              <p>O pagamento desta multa já consta como liquidado no sistema da biblioteca.</p>
            </div>
          )}

        </section>
      </main>
    </>
  );
}

export default DetalhesEmprestimo;
