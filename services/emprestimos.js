const URLEMPRESTIMOS = "http://localhost:3000/emprestimos";
const URLLIVROS = "http://localhost:3000/livros";


// =============================
// BUSCAR EMPRÉSTIMOS
// =============================

export const getEmprestimos = async () => {
  try {
    const response = await fetch(URLEMPRESTIMOS);

    if (!response.ok) {
      throw new Error("Erro ao buscar empréstimos");
    }

    return await response.json();

  } catch (error) {
    console.error(error);
    throw error;
  }
};


// =============================
// BUSCAR LIVROS
// =============================

export const getLivros = async () => {
  try {
    const response = await fetch(URLLIVROS);

    if (!response.ok) {
      throw new Error("Erro ao buscar livros");
    }

    return await response.json();

  } catch (error) {
    console.error(error);
    throw error;
  }
};


// =============================
// BUSCAR LIVRO POR ID
// =============================

export const buscarLivroPorId = async (id) => {
  try {
    const response = await fetch(
      `${URLLIVROS}/${id}`
    );

    if (!response.ok) {
      throw new Error("Erro ao buscar livro");
    }

    return await response.json();

  } catch (error) {
    console.error(error);
    throw error;
  }
};


// =============================
// BUSCAR EMPRÉSTIMO POR ID
// =============================

export const buscarEmprestimosPorId = async (id) => {
  try {
    const response = await fetch(
      `${URLEMPRESTIMOS}/${id}`
    );

    if (!response.ok) {
      throw new Error("Erro ao buscar dados do empréstimo");
    }

    return await response.json();

  } catch (error) {
    console.error(error);
    throw error;
  }
};


// =============================
// PAGAR MULTA
// =============================

export async function pagarMultaService(idMulta) {

  const resposta = await fetch(
    `${URLEMPRESTIMOS}/${idMulta}/pagar`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!resposta.ok) {

    let mensagemErro = "Erro ao processar pagamento.";

    try {
      const dadosErro = await resposta.json();

      mensagemErro =
        dadosErro.mensagem || mensagemErro;

    } catch (error) {

      if (resposta.status === 404) {
        mensagemErro =
          "Rota de pagamento não encontrada no servidor.";
      }
    }

    const erro = new Error(mensagemErro);

    erro.status = resposta.status;

    throw erro;
  }

  return await resposta.json();
}


export async function criarEmprestimo(novoEmprestimo) {
  try {
    const resposta = await fetch(
      "http://localhost:3000/emprestimos",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(novoEmprestimo)
      }
    );

    if (!resposta.ok) {
      throw new Error("Erro ao criar empréstimo");
    }

    return await resposta.json();

  } catch (error) {
    console.error("Erro ao criar empréstimo:", error);
    throw error;
  }
}