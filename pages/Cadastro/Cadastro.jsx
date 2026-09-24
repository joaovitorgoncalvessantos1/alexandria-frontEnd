import React, { useState } from "react";
import Input from "../../components/Input/Input.jsx";
import styles from "./Cadastro.module.css";
import { Link, useNavigate } from "react-router-dom";

// ❌ O 'const navigate = useNavigate()' foi removido daqui de fora

function Cadastro() {
  //  O 'navigate' deve ser declarado EXATAMENTE aqui dentro
  const navigate = useNavigate();
  const [erro, setErro] = useState("");
  
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    senha: "",
    confirmarSenha: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro(""); // Apenas limpa erros anteriores ao tentar reenviar

    // 1. Primeiro valida se as senhas batem
    if (formData.senha !== formData.confirmarSenha) {
      setErro("As senhas não coincidem.");
      return;
    }

    try {
      // 2. Tenta fazer a requisição no backend
      const response = await fetch("http://localhost:3000/clientes/cadastrar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome: formData.nome,
          email: formData.email,
          senha: formData.senha,
        }),
      });

      const dados = await response.json();

      // 3. Se o servidor apontar erro (Ex: e-mail duplicado), interrompe aqui
      if (!response.ok) {
        setErro(dados.erro || "Erro ao realizar cadastro.");
        return;
      }

      // 4. Se deu tudo certo no banco, EXIBE o alerta e SÓ DEPOIS muda de página
      alert("Cadastro realizado com sucesso!");
      navigate('/login');
      
    } catch (error) {
      console.error("Erro na requisição:", error);
      setErro("Não foi possível conectar ao servidor.");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Crie sua conta</h1>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>NOME COMPLETO</label>
            <div className={styles.inputWrapper}>
              <Input
                type="text"
                name="nome"
                placeholder="Digite seu nome completo"
                value={formData.nome}
                onChange={handleChange}
                required
                minLength={8}
                autoComplete="name"


              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>E-MAIL</label>
            <div className={styles.inputWrapper}>
              <Input
                type="email"
                name="email"
                placeholder="Digite seu e-mail"
                value={formData.email}
                onChange={handleChange}
                required
                autoComplete="email"
                maxLength={254}
      
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>SENHA</label>
            <div className={styles.inputWrapper}>
              <Input
                type="password"
                name="senha"
                placeholder="Crie uma senha"
                value={formData.senha}
                onChange={handleChange}
                required
                minLength={8}
                maxLength={32}
                autoComplete="new-password"
              />
              <button type="button" className={styles.togglePassword}></button>
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>CONFIRMAR SENHA</label>
            <div className={styles.inputWrapper}>
              <Input
                type="password"
                name="confirmarSenha"
                placeholder="Digite sua senha novamente"
                value={formData.confirmarSenha}
                onChange={handleChange}
                required
                minLength={8}
                maxLength={32}
                autoComplete="new-password"
              />
            </div>
          </div>

          <button className={styles.submitButton} type="submit">
            Criar conta
          </button>
        </form>

        {/* Movi o erro para dentro do card para manter o layout centralizado */}
        {erro && <p className={styles.erro}>{erro}</p>}

        <p className={styles.footerText}>
          Já possui uma conta? <Link to={"/login"}>Entrar</Link>
        </p>
      </div>
    </div>
  );
}

export default Cadastro;
