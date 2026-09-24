const URL = "http://localhost:3000/emprestimos";

// 1. ADICIONADA: Função que faz o envio real para o seu Backend Node.js
export async function criarEmprestimo(novoEmprestimo) {
  try {
    const resposta = await fetch(URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(novoEmprestimo)
    });

    if (!resposta.ok) {
      throw new Error("Erro ao criar empréstimo no servidor");
    }

    return await resposta.json();
  } catch (error) {
    console.error("Erro na requisição criarEmprestimo:", error);
    throw error;
  }
}

// 2. BUSCA DE LIVROS
export const buscarLivros = async (urlBusca) => {
  try {
    const resposta = await fetch(urlBusca || URL);
    if (!resposta.ok) throw new Error("Erro ao buscar livros");
    return await resposta.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// 3. FORMATAÇÃO DE DATA MYSQL
function formatarDataMySQL(data) {
  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const dia = String(data.getDate()).padStart(2, "0");
  const hora = String(data.getHours()).padStart(2, "0");
  const minuto = String(data.getMinutes()).padStart(2, "0");
  const segundo = String(data.getSeconds()).padStart(2, "0");
  return `${ano}-${mes}-${dia} ${hora}:${minuto}:${segundo}`;
}

// Local: Front-end (utils.js ou emprestimos.js)
export async function solicitarEmprestimo(idCliente, idLivro) {
  try {
    const dataEmprestimo = new Date();
    const dataDevolucao = new Date();
    dataDevolucao.setDate(dataEmprestimo.getDate() + 20);

    const dataFormatada = formatarDataMySQL(dataEmprestimo);
    const devolucaoFormatada = formatarDataMySQL(dataDevolucao);

    const novoEmprestimo = {
      id_emprestimos_cliente: idCliente || 1,
      id_livro: idLivro, // 🟢 GARANTE QUE ENVIE O ID DO LIVRO
      data_emprestimo: dataFormatada,
      data_prevista_devolucao: devolucaoFormatada,
      status_livro: "ativo"
    };

    console.log("[React] Enviando uma única requisição com livro ID:", idLivro);

    const resposta = await fetch("http://localhost:3000/emprestimos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(novoEmprestimo)
    });

    if (!resposta.ok) {
      throw new Error("Erro na resposta do servidor");
    }

    return await resposta.json();

  } catch (erro) {
    console.error("[React Catch]", erro);
    return { sucesso: false, mensagem: "Erro ao conectar com o servidor." };
  }
}

// 5. OUTRAS FUNÇÕES AUXILIARES UTILITÁRIAS
export const calcularAtraso = (dadosEmprestimos) => {
  if (!Array.isArray(dadosEmprestimos)) return [];
  return dadosEmprestimos.map((emprestimo) => {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const [ano, mes, dia] = emprestimo.data_prevista_devolucao.split(/[-/]/);
    const dataDevolucao = new Date(ano, mes - 1, parseInt(dia));
    dataDevolucao.setHours(0, 0, 0, 0);
    const diferencaEmMilissegundos = hoje - dataDevolucao;
    const diasDeAtraso = Math.floor(diferencaEmMilissegundos / (1000 * 60 * 60 * 24));
    const estaAtrasado = diasDeAtraso > 0;

    return {
      ...emprestimo,
      diasAtraso: estaAtrasado ? diasDeAtraso : 0,
      status_livro: estaAtrasado ? "atrasado" : "ativo"
    };
  });
};

export function getStatusText(status) {
  const statusMap = { ativo: "Ativo", atrasado: "Atrasado", devolvido: "Devolvido" };
  return statusMap[status] || "Desconhecido";
}
