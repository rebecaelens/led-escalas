#!/bin/bash

# 📅 LED Escala - Setup Script
# Use este script para iniciar rápido

echo "=================================="
echo "📅 LED Escala - Sistema de Voluntários"
echo "=================================="
echo ""

# Verificar Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não encontrado. Instale em https://nodejs.org"
    exit 1
fi

echo "✅ Node.js $(node -v)"
echo "✅ npm $(npm -v)"
echo ""

# Verificar .env.local
if [ ! -f .env.local ]; then
    echo "⚠️  Arquivo .env.local não encontrado"
    echo "   Copie de .env.example e adicione suas credenciais Supabase"
    echo ""
    echo "   Para configurar Supabase:"
    echo "   1. Acesse https://supabase.com"
    echo "   2. Crie um novo projeto"
    echo "   3. Em SQL Editor, execute o arquivo supabase.sql"
    echo "   4. Copie a URL e chave anon para .env.local"
    echo ""
    read -p "Deseja continuar mesmo assim? (s/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Ss]$ ]]; then
        exit 1
    fi
fi

echo "📦 Instalando dependências..."
npm install

echo ""
echo "✅ Setup completo!"
echo ""
echo "🚀 Para iniciar o servidor de desenvolvimento:"
echo "   npm run dev"
echo ""
echo "📖 Documentação: Veja README.md"
echo ""
