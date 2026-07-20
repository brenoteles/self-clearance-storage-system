// ==UserScript==
// @name         Carregador de Interface WMS
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Busca código local e injeta em nova aba via Blob para evitar CSP
// @author       Breno Teles
// @match        https://www.google.com/*
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(function() {
    'use strict';

    // CONFIGURAÇÕES
    const SUPABASE_URL = 'https://tcsjuzwlbflvzcaujmwm.supabase.co';
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRjc2p1endsYmZsdnpjYXVqbXdtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ4MDA2OTQsImV4cCI6MjA5MDM3NjY5NH0.do658h4HLTRBrqFZR37U6q3Pxw7M3-1NVk7_0pOtZig';
    const URL_DO_CODIGO = 'http://127.0.0.1:5500/index.html';

    // Criação do botão
    const btn = document.createElement('button');
    btn.innerHTML = 'Abrir Sistema WMS';
    btn.style.position = 'fixed';
    btn.style.top = '10px';
    btn.style.right = '10px';
    btn.style.zIndex = '9999';
    document.body.appendChild(btn);

    btn.addEventListener('click', () => {
        const urlComCacheBusting = URL_DO_CODIGO + '?t=' + new Date().getTime();

        GM_xmlhttpRequest({
            method: 'GET',
            url: urlComCacheBusting,
            onload: function(response) {
                const codigoConteudo = response.responseText;

                // Injeta a configuração dentro do conteúdo do seu HTML
                const conteudoFinal = `
                    <script>
                        window.SUPABASE_CONFIG = {
                            url: "${SUPABASE_URL}",
                            key: "${SUPABASE_ANON_KEY}"
                        };
                    </script>
                    ${codigoConteudo}
                `;

                // Cria um objeto Blob para isolar a política de segurança (CSP)
                const blob = new Blob([conteudoFinal], { type: 'text/html' });
                const url = URL.createObjectURL(blob);

                // Abre a nova aba
                window.open(url, '_blank');
            },
            onerror: function(err) {
                console.error("Erro ao carregar o arquivo local:", err);
                alert("Erro ao carregar o arquivo! Verifique se o servidor local está rodando em http://127.0.0.1:5500");
            }
        });
    });
})();
