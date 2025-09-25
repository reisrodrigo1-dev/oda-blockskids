# Instruções para Ícones da Extensão

## Opção 1: Usar extensão sem ícones (Mais Simples)
A extensão já foi atualizada para funcionar sem ícones. Você pode carregar ela no Chrome normalmente.

## Opção 2: Adicionar ícones (Opcional)
Se quiser ícones personalizados:

1. **Converter SVG para PNG online:**
   - Abrir: https://convertio.co/svg-png/
   - Upload do arquivo `icon.svg`
   - Converter para PNG
   - Baixar em 3 tamanhos: 16x16, 48x48, 128x128
   - Renomear para: `icon16.png`, `icon48.png`, `icon128.png`

2. **Ou usar ícones simples:**
   ```
   Pode usar qualquer imagem PNG quadrada nos tamanhos:
   - 16x16 pixels para icon16.png
   - 48x48 pixels para icon48.png  
   - 128x128 pixels para icon128.png
   ```

3. **Reativar ícones no manifest.json:**
   Descomentar a seção "icons" se quiser usar.

## Como carregar a extensão:
1. Abrir Chrome: `chrome://extensions/`
2. Ativar "Modo do desenvolvedor"
3. Clicar "Carregar extensão sem compactação"
4. Selecionar pasta: `arduino-extension`
5. Copiar o ID da extensão para configurar o app nativo
