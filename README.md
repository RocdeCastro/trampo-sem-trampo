# Trampo sem Trampo

**Procurar trampo dá um trampo. Aqui nem tanto.**

Landing page de um copiloto de carreira (nome provisório). O produto nasceu de uma skill real que eu uso na minha própria busca de emprego: ela acorda às 6h, lê as vagas das últimas 24 horas em vários portais, separa as que passam na minha régua (nível, faixa, regime, remoto), explica por que cada uma vale ou não, monta currículo e carta sob medida em português ou inglês e, com uma extensão no navegador, preenche a candidatura no site da vaga. O envio fica sempre comigo.

Esta página apresenta esse fluxo como se fosse um produto.

## O que tem aqui

- `index.html`: a página inteira, em HTML e CSS puros, sem framework e sem build.
- `assets/js/main.js`: a animação da seção da extensão (cursor que vai de campo em campo, digita, para na pretensão salarial e no botão Enviar) e o formulário da lista de espera.

## Detalhes de experiência

- A animação só roda quando a seção aparece na tela e pausa quando sai.
- Com "reduzir movimento" ligado no sistema, a página mostra direto o estado final, sem animação.
- O cursor é posicionado medindo os campos na hora, então acompanha qualquer largura de tela.
- A lista de espera ainda não guarda e-mails: o formulário avisa isso com clareza em vez de fingir que cadastrou.

## Rodar localmente

```
python3 -m http.server 8000
```

Depois é só abrir http://localhost:8000. Também abre com duplo clique no `index.html`.

## Créditos

Ideia, produto e texto: Roc de Castro. Design, código e animação feitos em conversa com o Claude.
