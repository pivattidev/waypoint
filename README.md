<div align="center">

<img src="public/pin.svg" width="72" alt="Pin do WayPoint">

# WayPoint

### Veja a rua antes de pisar nela.

Relatos recentes de segurança para quem anda a pé, enviados pela comunidade, conferidos pela moderação e mostrados por bairro.<br>
**Sem login e sem identificar quem enviou.**

Global Solution 2026/2 · FIAP<br>
Tema **CitizenTech** · **ODS 11** (cidades sustentáveis) e **ODS 10** (redução das desigualdades)

![React](https://img.shields.io/badge/React-19-149ECA?style=flat-square&logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&logo=vite&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-7-CA4245?style=flat-square&logo=reactrouter&logoColor=white)
![Java](https://img.shields.io/badge/API-Spring_Boot-6DB33F?style=flat-square&logo=springboot&logoColor=white)
![Render](https://img.shields.io/badge/API_no-Render-46E3B7?style=flat-square&logo=render&logoColor=black)

[**Site publicado**](#-links) · [**API Java**](https://waypoint-api-k9vs.onrender.com) · [**Vídeo**](#-links) · [**Integrantes**](#-integrantes)

</div>

---

## 🧭 Sumário

[Objetivo](#-objetivo) · [Funcionalidades](#-funcionalidades) · [Tecnologias](#️-tecnologias) · [Estrutura](#️-estrutura-de-pastas) · [Rotas](#️-rotas-do-site) · [API Java](#-api-java) · [Como executar](#-como-executar) · [Deploy](#️-deploy) · [Integrantes](#-integrantes) · [Links](#-links) · [Contato](#-contato)

## 🎯 Objetivo

Quem anda a pé, principalmente à noite, não sabe se o caminho tem poste apagado, calçada quebrada, rua deserta ou ocorrência recente. O **WayPoint** junta essa informação de quem passou por ali:

1. a comunidade envia relatos **anônimos**;
2. a **moderação** confere cada um antes de publicar;
3. o **mapa** mostra, por bairro, só o que foi aprovado.

> **A ideia:** segurança é luz. Quanto mais gente relata o que viu, mais clara fica a rua para quem vem depois.

## ✨ Funcionalidades

| | |
| :--- | :--- |
| **Relatos aprovados** | Filtro por bairro e por tipo (o filtro fica na URL), agrupados em Hoje, Ontem, Esta semana e Antes. |
| **Detalhe do relato** | Rota com parâmetro `/relatos/:id`: local, data, selo da moderação e outros relatos do mesmo bairro. |
| **Mapa por bairro** | Pins dos relatos aprovados de cada bairro. |
| **Enviar relato** | Formulário em 4 etapas (Onde, O quê, Quando, Revisar), com validação em cada uma. Não pede nome nem e-mail. |
| **Moderação** | Fila de pendentes, aprovados e rejeitados: aprovar, rejeitar e excluir. |
| ⏳ **Estados de tela** | Carregando, erro com "Tentar de novo" e lista vazia em todas as consultas. |
| **Tema noite e claro** | A escolha fica salva no navegador. |
| **Responsivo** | Celular (390 px), tablet (768 px) e desktop (1440 px). |
| **Acessibilidade** | Atalho "Pular para o conteúdo", foco visível, rótulos e mensagens de erro ligadas a cada campo. |
| **Página 404** | "Rua sem saída", que volta ao início sozinha depois de 10 segundos. |

## 🛠️ Tecnologias

| Tecnologia | Para quê |
| :--- | :--- |
| **React 19 + Vite 8** | Aplicação SPA e ambiente de desenvolvimento |
| **TypeScript 6** | Tipagem dos componentes e dos dados da API |
| **Tailwind CSS 4** | Estilo, responsividade e tema escuro (`ThemeContext` + variante `dark:`) |
| **React Router 7** | Rotas fixas, rota com parâmetro e rotas aninhadas no `Layout` |
| **`fetch` nativo** | Todas as chamadas à API Java, em `src/services` (sem Axios) |
| **Java + Spring Boot + Oracle** | API REST do grupo, publicada no Render |
| **Vercel** | Publicação do front-end |
| **@fontsource** | Fontes Overpass e Atkinson Hyperlegible |

## 🗂️ Estrutura de pastas

```text
waypoint/
├── public/
│   ├── pin.svg                 # Ícone do site
│   └── integrantes/            # Fotos da equipe
├── src/
│   ├── components/             # Layout, Header, Footer, Button, Campo, EstadoTela, ItemRelato, MapaPrevia...
│   ├── contexts/               # ThemeContext (tema noite ou claro)
│   ├── hooks/                  # useRequisicao (carregando, erro e dados) e useMidia
│   ├── pages/                  # Home, Relatos, RelatoDetalhe, Mapa, EnviarRelato, Moderacao,
│   │                           # Sobre, Integrantes, FAQ, Contato e a 404
│   ├── services/               # Chamadas à API Java (api.ts, relatos.ts, regioes.ts)
│   ├── types/                  # Interfaces do site e do formato da API Java (java.ts)
│   └── utils/                  # Conversões Java ↔ site, datas e o exemplo de rotas do hero
├── .env.example                # URL da API Java
├── vercel.json                 # Rotas da SPA funcionando na Vercel
└── package.json
```

## 🗺️ Rotas do site

| Rota | Página | O que usa da API Java |
| :--- | :--- | :--- |
| `/` | Home | `GET /relato`, `GET /trecho`, `GET /categoria` |
| `/relatos` | Relatos aprovados | `GET /relato`, `GET /trecho`, `GET /categoria` |
| `/relatos/:id` | Detalhe do relato | `GET /relato/{id}`, `GET /trecho/{id}`, `GET /categoria/{id}` |
| `/mapa` | Mapa por bairro | `GET /relato`, `GET /trecho`, `GET /categoria` |
| `/enviar-relato` | Enviar relato | `GET /categoria`, `POST /trecho`, `POST /relato` |
| `/moderacao` | Moderação | `GET /relato`, `PUT /relato/{id}`, `DELETE /relato/{id}` |
| `/sobre` · `/integrantes` · `/faq` · `/contato` | ℹ️ Institucionais | — |
| qualquer outra | 404 "Rua sem saída" | — |

## ☕ API Java

O front-end consome a API REST desenvolvida pelo grupo em **Domain Driven Design Using Java** (Spring Boot + JDBC + Oracle).

- **URL publicada (Render):** https://waypoint-api-k9vs.onrender.com
- **Repositório:** https://github.com/kauansilva1472/waypoint-api

| Recurso | Endpoints usados | Para quê |
| :--- | :--- | :--- |
| Relato | `GET /relato` · `GET /relato/{id}` · `POST /relato` · `PUT /relato/{id}` · `DELETE /relato/{id}` | Listar, ver, enviar, moderar e excluir |
| Trecho | `GET /trecho` · `GET /trecho/{id}` · `POST /trecho` | Rua, bairro e coordenadas de cada relato |
| Categoria | `GET /categoria` · `GET /categoria/{id}` | Tipos de relato (Assalto, Iluminação...) |

**Como o site conversa com a API**

- Toda chamada passa por `requisicao()` em `src/services/api.ts`, que usa `fetch` e transforma qualquer falha numa mensagem clara na tela.
- `src/types/java.ts` segue o JSON da API, e `src/utils/conversaoJava.ts` converte para o formato das páginas (datas `dd/MM/aaaa`, status e região, que é o bairro do trecho).
- Status no banco: `ABERTO` (aguardando moderação) · `ATIVO` (aprovado) · `INATIVO` (rejeitado).
- O relato é **anônimo**: o site envia sempre o usuário "Anônimo" e nunca mostra quem enviou.

> No plano gratuito do Render, a API "dorme" depois de alguns minutos sem uso. A primeira consulta pode levar até 1 minuto.

## 🚀 Como executar

**Pré-requisito:** Node.js 20.19 ou mais recente.

**1. Clone e instale**

```bash
git clone https://github.com/pivattidev/waypoint.git
cd waypoint
npm install
```

**2. Configure a API:** copie o `.env.example` para `.env` (ele já traz a URL da API Java no Render)

```bash
VITE_API_URL=https://waypoint-api-k9vs.onrender.com
```

**3. Rode**

```bash
npm run dev       # site em modo de desenvolvimento
npm run build     # versão de produção em dist/
npm run lint      # confere o código com o ESLint
```

## ☁️ Deploy

| | |
| :--- | :--- |
| **Front-end** | Vercel, com a variável `VITE_API_URL` apontando para a API no Render. O `vercel.json` manda toda rota para o `index.html`: abrir `/relatos/1` direto ou apertar F5 funciona. |
| **API Java** | Render, com Docker (`Dockerfile` multi-stage no repositório da API) e CORS liberado para o site. |

## 👥 Integrantes

<table>
  <tr>
    <td align="center" width="20%">
      <img src="public/integrantes/pivatti.png" width="96" alt="Alexandre Salcines Messias Pivatti"><br>
      <b>Alexandre Salcines Messias Pivatti</b><br>
      RM572657 · 1TDSPF<br>
      <a href="https://github.com/pivattidev">GitHub</a> · <a href="https://www.linkedin.com/in/alexandre-pivatti-7b1a9a3a4/">LinkedIn</a>
    </td>
    <td align="center" width="20%">
      <img src="public/integrantes/luiz.png" width="96" alt="Luiz Eduardo Vieira Maciel"><br>
      <b>Luiz Eduardo Vieira Maciel</b><br>
      RM573713 · 1TDSPF<br>
      <a href="https://github.com/LuizVMaciel">GitHub</a> · <a href="https://www.linkedin.com/in/luiz-eduardo-vieira-maciel-038704356/">LinkedIn</a>
    </td>
    <td align="center" width="20%">
      <img src="public/integrantes/kaua.png" width="96" alt="Kauã Silva de Jesus"><br>
      <b>Kauã Silva de Jesus</b><br>
      RM573022 · 1TDSPF<br>
      <a href="https://github.com/kauansilva1472">GitHub</a> · <a href="https://www.linkedin.com/in/kauan-silva-9147a0351/">LinkedIn</a>
    </td>
    <td align="center" width="20%">
      <img src="public/integrantes/jardim.png" width="96" alt="Gustavo Henrique Jardim de Sá"><br>
      <b>Gustavo Henrique Jardim de Sá</b><br>
      RM572437 · 1TDSPF<br>
      <a href="https://github.com/GustavoJardimSa">GitHub</a> · <a href="https://www.linkedin.com/in/gustavo-de-sa-3113473b8/">LinkedIn</a>
    </td>
    <td align="center" width="20%">
      <img src="public/integrantes/guilherme.png" width="96" alt="Guilherme Boerato Medina"><br>
      <b>Guilherme Boerato Medina</b><br>
      RM570686 · 1TDSPF<br>
      <a href="https://github.com/guilhermemedina22">GitHub</a> · <a href="https://www.linkedin.com/in/guilherme-medina-025b4437b/">LinkedIn</a>
    </td>
  </tr>
</table>

## 🔗 Links

| | |
| :--- | :--- |
| Repositório (GitHub) | https://github.com/pivattidev/waypoint |
| Site publicado | https://waypoint-gs.vercel.app/ |
| API Java (Render) | https://waypoint-api-k9vs.onrender.com |
| Vídeo de demonstração (YouTube, até 3 min) | https://youtu.be/YfE4qltPVps |

## 📬 Contato

- Pela página **Contato** do próprio site (`/contato`).
- Pelos perfis de GitHub e LinkedIn de cada integrante, em [Integrantes](#-integrantes).
- Dúvidas sobre o código: abra uma *issue* em https://github.com/pivattidev/waypoint/issues.

> **Declaração de uso de IA:** o grupo usou o Claude e o Codex (ChatGPT) como ferramenta de apoio no desenvolvimento do código, com referências técnicas e visuais e recomendações de ajustes. Todo o conteúdo foi revisado e testado, e o grupo compreende e sabe explicar tudo o que foi feito.

---

<div align="center">

Feito pela equipe **WayPoint** · 1TDSPF · FIAP 2026

</div>
