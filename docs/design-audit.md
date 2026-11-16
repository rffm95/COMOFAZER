# Auditoria e redesign — Cheers Bar Manual

16 de novembro de 2026 · Repositório rffm95/COMOFAZER

## Diagnóstico e alterações

| Problema observado | Correção implementada |
| --- | --- |
| Cartões apenas de texto, sem reconhecimento visual das bebidas | Fotografias e ilustrações da carta nos cartões e nas fichas |
| Tipografia pesada, em maiúsculas e itálico; contraste fraco em metadados | Títulos serifados, texto de apoio legível, tons marfim, verde profundo e dourado discreto |
| Pesquisa dependente de acentos; gins separados da consulta geral | Pesquisa por nome, ingrediente, técnica, copo, tónica e garnish; normalização de acentos e pesquisa com vários termos |
| Favoritos podiam manter uma categoria anterior escondida | Abertura dos favoritos na categoria Todas; favoritos também para gins |
| Tema claro não alterava efetivamente a interface | Temas claro e escuro com variáveis de cor consistentes |
| Cartões sem operação por teclado; diálogos sem gestão de foco | Botões semânticos, nomes acessíveis, Escape, foco preso no diálogo e restauro de foco |
| Ficha longa e pouco orientada ao serviço | Ingredientes e medidas destacados, passos com checklist e reinício |
| Zoom móvel desativado | Zoom permitido e layouts verificados em telemóvel e tablet |

## Imagens

Fonte: https://menu.cheersexperiences.com/cheers

30 das 43 entradas têm correspondência verificada: 18 receitas e 12 gins. Incluem 23 imagens apresentadas como fotografias e 7 ilustrações identificadas como tal na carta. São 29 ficheiros WebP únicos, armazenados na própria app (3,40 MB no total), com carregamento progressivo e identificação de origem em src/data/drinkImages.ts.

As 13 entradas sem imagem exata apresentam “Sem fotografia na carta”. Não foi atribuída uma fotografia de outra bebida ou variante:

- Gin de Morango, Maracujão, Caipirinha, Caipirosa.
- Basil Smash Clássico, Basil Smash Sour, Hazelnut Espresso, Pineapple Breeze.
- Adamus 2021, Martin Miller’s Azul, Vermelho e Verde, Hendrick’s Orbium.

A carta mostra Gin de Morango num pack, sem imagem individual. Basil Smash não distingue as variantes e apresenta um copo diferente da receita Sour. Martin Miller’s não identifica a variante por cor.

## Validação

- Verificação TypeScript e compilação Vite de produção concluídas.
- 26 receitas e 17 entradas de gin preservadas; comparação integral dos dados com a versão anterior, incluindo ingredientes, medidas e passos.
- Pesquisa sem acentos, por múltiplos termos e ingrediente/garnish; filtros e estado sem resultados.
- Favoritos de receitas e gins, persistência após recarregar, ordenação e vistas em grelha/lista.
- Diálogo com Escape, foco e checklist; atalho de pesquisa desativado dentro do diálogo.
- Tema escuro e layouts a 320, 390 e 768 px e no ecrã de computador; sem transbordo horizontal da página. Categorias têm deslocação horizontal própria em ecrãs pequenos.
- Ficheiros das imagens validados por HTTP, MIME e assinatura WebP; sem imagens partidas observadas no browser.

## Continuação recomendada

Adicionar fotografias próprias das 13 variantes em falta para completar a cobertura visual. A associação pode ser feita em src/data/drinkImages.ts, preservando os IDs das bebidas.
