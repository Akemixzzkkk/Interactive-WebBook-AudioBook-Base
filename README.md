# 📖 Interactive Web-Book & Audio-Book Base

Este é um **boilerplate (base)** minimalista e de alta performance para a criação de livros digitais interativos e audiobooks baseados em web. Ideal para projetos de storytelling que exigem imersão sonora e visual sem a complexidade de frameworks pesados.

## 🚀 Por que usar esta Base?

- **Arquitetura Leve**: Construído com Vanilla JS, HTML e CSS puros.
- **Imersão Sonora Global**: Áudio persistente que não interrompe com a navegação entre páginas.
- **Motor de Narrativa Modular**: Sistema de capítulos fácil de configurar e expandir.
- **Design Ready-to-use**: Interface focada em legibilidade e atmosfera imersiva.

## 🛠️ Componentes do Core

### 1. AudioManager (`audio-manager.js`)
Gerencia a trilha sonora do projeto.
- **Persistência**: Usa `localStorage` para salvar a posição do áudio, garantindo que a música continue exatamente de onde parou ao mudar de página.
- **Controles**: Botão de mudo integrado e controle de volume otimizado para narrativa.

### 2. Narrative Engine (`livro1.js` / `livro2.js`)
O motor que processa a história.
- **Estrutura de Conteúdo**: Os dados são organizados em um array de capítulos, onde cada bloco pode conter:
  - `title`: Título de destaque.
  - `text`: Parágrafos da narração.
  - `audio`: Caminho para o arquivo de dublagem/som.
  - `image`: Visual de apoio para o bloco atual.
- **Navegação Inteligente**: Funções prontas para avançar (`skipCurrent`), retroceder (`prevContent`) e retornar ao menu.

## ⚙️ Como Customizar

### Adicionando seu Conteúdo
Para criar sua própria história, edite a constante `chapters` nos arquivos `.js`:

```javascript
const chapters = [
    {
        id: 1,
        name: "Título do Capítulo",
        content: [
            {
                text: "Seu parágrafo aqui...",
                audio: "audios/parte1.mp3",
                image: "images/cena1.jpg"
            }
        ]
    }
];
```

### Alterando a Estética
As animações e o layout podem ser ajustados nos blocos `<style>` dentro dos arquivos `.html` ou no arquivo `cursor.css`.

## � Estrutura de Arquivos

- `index.html`: Página de carregamento/entrada.
- `livro[n].html`: Interface de visualização do livro.
- `livro[n].js`: Banco de dados e lógica da narrativa.
- `audio-manager.js`: Sistema de áudio global.
- `cursor.js/css`: Feedback visual para o usuário.

## 🏁 Início Rápido

1. Clone este repositório.
2. Substitua os arquivos na pasta `audio-livro1` e `images-livro1` pelos seus recursos.
3. Atualize o `livro1.js` com seus textos e referências.
4. Abra o `index.html` e sua história estará pronta!

---
*Base desenvolvida para criadores que buscam simplicidade técnica e profundidade narrativa.*
