//  Seletores principais
const btnGerar = document.getElementById('btn-gerar');
const listaImagens = document.getElementById('lista-imagens');
const mensagemVazia = document.getElementById('mensagem-vazia');
const modal = document.getElementById('modal');
const modalImg = document.getElementById('modal-img');
const btnFecharModal = document.getElementById('fechar-modal');
const btnBaixar = document.getElementById('btn-baixar');
const btnFavoritar = document.getElementById('btn-favoritar');
const btnFavoritos = document.getElementById('btn-favoritos');

// Array de favoritos (armazenado no localStorage)
let favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];

// URL base da API
const API_URL = 'https://api.thedogapi.com/v1/images/search';

//  Classe principal para lógica do appp
class DogApp {
  constructor() {
    this.urlAtual = null; // Guarda a imagem exibida no modal
  }

  //  Função assíncrona para buscar imagem na API
  async gerarDog() {
    try {
      const resposta = await fetch(API_URL);
      const dados = await resposta.json();
      const imagemUrl = dados[0].url;

      // Cria o elemento de imagem e adiciona à galeria
      this.criarCard(imagemUrl);

      // Esconde a mensagem de vazio
      mensagemVazia.classList.add('hidden');

    } catch (erro) {
      console.error('Erro ao buscar imagem:', erro);
      alert('Ops! Não conseguimos buscar o doguinho 😢');
    }
  }

  //  Cria um card de imagem na galeria
  criarCard(url) {
    const card = document.createElement('div');
    card.className = 'rounded-xl overflow-hidden shadow-md hover:scale-105 transition cursor-pointer bg-white';
    card.innerHTML = `
      <img src="${url}" alt="Cachorro fofo" class="w-full h-48 object-cover">
    `;
    // Evento para abrir o modal
    card.addEventListener('click', () => this.abrirModal(url));
    listaImagens.appendChild(card);
  }

  //  Abre o modal com a imagem selecionada
  abrirModal(url) {
    modalImg.src = url;
    this.urlAtual = url;
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }

  // Fecha o modal
  fecharModal() {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }

  //  Favoritar imagem
  favoritarAtual() {
    if (!this.urlAtual) return;
    if (!favoritos.includes(this.urlAtual)) {
      favoritos.push(this.urlAtual);
      localStorage.setItem('favoritos', JSON.stringify(favoritos));
      alert('🐶 Doguinho adicionado aos favoritos!');
    } else {
      alert('❤️ Este doguinho já está nos favoritos!');
    }
  }

  // Baixar imagem
  baixarAtual() {
    if (!this.urlAtual) return;
    const link = document.createElement('a');
    link.href = this.urlAtual;
    link.download = 'doguinho-fofo.jpg';
    link.click();
  }

  // Ver favoritos
  mostrarFavoritos() {
    listaImagens.innerHTML = ''; // limpa a galeria
    if (favoritos.length === 0) {
      mensagemVazia.textContent = 'Nenhum doguinho favoritado ainda 😢';
      mensagemVazia.classList.remove('hidden');
      return;
    }
    mensagemVazia.classList.add('hidden');
    favoritos.forEach(url => this.criarCard(url));
  }
}

//  Instância da classe principal
const app = new DogApp();

// Eventos principaiss
btnGerar.addEventListener('click', () => app.gerarDog());
btnFecharModal.addEventListener('click', () => app.fecharModal());
btnFavoritar.addEventListener('click', () => app.favoritarAtual());
btnBaixar.addEventListener('click', () => app.baixarAtual());
btnFavoritos.addEventListener('click', () => app.mostrarFavoritos());

// Fecha o modal clicando fora
modal.addEventListener('click', (e) => {
  if (e.target === modal) app.fecharModal();
});
