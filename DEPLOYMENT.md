# 🚀 Configuração para Produção - Vercel

## ✅ Configurações Realizadas

O projeto já está **totalmente configurado** para produção no Vercel com as seguintes otimizações:

### 🔧 Configurações Técnicas
- **Build otimizado** com code splitting (vendor, ui chunks)
- **Minificação esbuild** para performance máxima
- **Headers de segurança** (XSS, CSRF protection)
- **SPA routing** configurado corretamente
- **Serverless functions** prontas para APIs futuras

### 📦 Arquivos de Build
- Cliente: `dist/public/` (HTML, CSS, JS otimizados)
- Servidor: `dist/index.js` (bundled com esbuild)

## 🌍 Variáveis de Ambiente

Configure no painel do Vercel (Project Settings > Environment Variables):

### Obrigatórias
- `VITE_APP_TITLE`: Título da aplicação (ex: "Code Crafter Game")

### Opcionais (para funcionalidades avançadas)
- `VITE_OAUTH_PORTAL_URL`: URL do portal OAuth (se usado)
- `VITE_APP_ID`: ID da aplicação (se usado)
- `VITE_FRONTEND_FORGE_API_KEY`: Chave da API Mapbox/Forge (para mapas)
- `VITE_FRONTEND_FORGE_API_URL`: URL base da API (padrão: https://api.mapbox.com)

## 🚀 Deploy no Vercel

1. **Conecte o repositório** ao Vercel
2. **Configure as variáveis de ambiente** acima
3. **Deploy automático** em cada push para main

### 📊 Performance Esperada
- **Bundle size**: ~780KB total (gzipped: ~200KB)
- **Loading**: Code splitting automático
- **Caching**: Headers otimizados

## 🧪 Testes Locais

```bash
# Build de produção
npm run build

# Preview local
npm run preview
```

## 📁 Estrutura Final

```
dist/
├── index.js          # Servidor (Express)
└── public/
    ├── index.html
    ├── assets/
    │   ├── vendor-*.js    # React + libs
    │   ├── ui-*.js        # UI components
    │   └── index-*.js     # App code
    └── sounds/            # Audio files
```

**✅ Pronto para deploy!** O projeto está otimizado e configurado para produção no Vercel.
