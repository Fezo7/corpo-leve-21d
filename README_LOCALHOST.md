# Como abrir o site Corpo Leve 21D no seu computador

## Jeito mais fácil (recomendado)

1. Abra a pasta `site_vendas`.
2. Dê **dois cliques** em **`start-site.bat`**.
3. Uma janela preta vai abrir e o site vai aparecer sozinho no navegador em:

   **http://localhost:5500/**

4. Para **fechar o site**, é só fechar aquela janela preta (ou apertar `Ctrl + C` dentro dela).

> Não precisa instalar Python nem Node. O `start-site.bat` já usa um servidor que vem pronto no Windows.

---

## Se os dois cliques não funcionarem

Abra o **PowerShell** dentro da pasta `site_vendas` e rode:

```powershell
powershell -ExecutionPolicy Bypass -File .\start-localhost.ps1
```

O site abrirá em **http://localhost:5500/**.

---

## Último recurso (sem servidor)

Se nada acima funcionar, dê **dois cliques no `index.html`** para abrir direto no navegador.
A maior parte do site funciona assim, mas o ideal é usar o `start-site.bat`
(algumas coisas funcionam melhor via `http://localhost`).

---

## Onde ficam as imagens

Todas as imagens do site ficam em:

```
site_vendas\assets\images\
```

Os nomes que o site usa são:

- `background-wellness.png` (fundo)
- `groceries-lista-compras.png`
- `rotina-cozinha.png`
- `metodo-3-pilares.png`
- `mockup-entregaveis.png`
- `ritual-noturno.png`

Se você quiser **trocar uma imagem**, basta substituir o arquivo com o mesmo nome
nessa pasta (mantendo a extensão `.png`).

---

## Antes de publicar (lembretes)

No HTML ainda existem **placeholders** que você precisa preencher:

- `[INSERIR LINK DO CHECKOUT]` — o link de pagamento (aparece em vários botões)
- `[INSERIR LINK TERMOS DE USO]`
- `[INSERIR LINK POLÍTICA DE PRIVACIDADE]`
- `[INSERIR E-MAIL DE SUPORTE]`

Enquanto não preencher, os botões de compra não levam a lugar nenhum.
