import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import logo from '../../assets/logo.png';
import Input from '../../components/Input/Input.jsx';
import styles from './Login.module.css';

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', senha: '' });
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    setCarregando(true);

    try {
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          senha: formData.senha,
        }),
      });

      const dados = await response.json();

      if (!response.ok) {
        setErro(dados.erro || 'Email ou senha inválidos.');
        return;
      }

      console.log('Login realizado:', dados);
      localStorage.setItem('cliente', JSON.stringify(dados.cliente));
      navigate('/home');
    } catch (error) {
      console.error('Erro ao realizar login:', error);
      setErro('Não foi possível conectar ao servidor.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        
        {/* Logo adicionado do segundo código */}
        <div className={styles.logoContainer}>
          <img src={logo} alt="logo" width={150} />
        </div>

        <div className={styles.titleContainer}>
          <h1 className={styles.title}>Bem-vindo de volta</h1>
        </div>

        <div className={styles.formContainer}>
          <form className={styles.form} onSubmit={handleSubmit}>
            
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
                />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>SENHA</label>
              <div className={styles.inputWrapper}>
                <Input
                  type="password"
                  name="senha"
                  placeholder="Digite sua senha"
                  value={formData.senha}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <p className={styles.forgotPassword}>
              <a href="#_">Esqueci a minha senha</a>
            </p>
  {erro && <p className={styles.erro}>{erro}</p>}

            <button
              className={styles.submitButton}
              type="submit"
              disabled={carregando}
            >
              {carregando ? 'Entrando...' : 'Entrar'}
            </button>

            <p className={styles.footerText}>
              Ainda não possui uma conta?{' '}
              <Link to="/cadastro">Criar conta</Link>
            </p>
          </form>
        </div>

      </div>
    </div>
  );
}

export default Login;
