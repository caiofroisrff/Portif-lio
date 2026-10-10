document.addEventListener('DOMContentLoaded', () => {

    // --- 1. ALTERNÂNCIA DE TEMA ---
    const botaoTema = document.getElementById('botao-tema');
    const iconeTemaEscuro = document.getElementById('icone-tema-escuro');
    const iconeTemaClaro = document.getElementById('icone-tema-claro');
    let rgbParticula = '255, 255, 255';

    function aplicarTema(isEscuro) {
        if (isEscuro) {
            document.documentElement.classList.add('dark');
            iconeTemaEscuro.classList.remove('oculto');
            iconeTemaClaro.classList.add('oculto');
            localStorage.setItem('theme', 'dark');
            rgbParticula = '255, 255, 255';
        } else {
            document.documentElement.classList.remove('dark');
            iconeTemaEscuro.classList.add('oculto');
            iconeTemaClaro.classList.remove('oculto');
            localStorage.setItem('theme', 'light');
            rgbParticula = '139, 26, 43';
        }
    }

    const temaSalvo = localStorage.getItem('theme');
    aplicarTema(temaSalvo ? temaSalvo === 'dark' : true);

    if (botaoTema) {
        botaoTema.addEventListener('click', () => {
            const estaAtualmenteEscuro = document.documentElement.classList.contains('dark');
            aplicarTema(!estaAtualmenteEscuro);
        });
    }

    // --- 2. CANVAS DE PARTÍCULAS INTERATIVO ---
    const canvas = document.getElementById('canvas-particulas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particulas = [];
        const totalParticulas = 70;
        let mouse = { x: null, y: null, raio: 120 };

        window.addEventListener('mousemove', (event) => {
            mouse.x = event.x;
            mouse.y = event.y;
        });

        window.addEventListener('mouseout', () => {
            mouse.x = null;
            mouse.y = null;
        });

        function redimensionarCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        window.addEventListener('resize', redimensionarCanvas);
        redimensionarCanvas();

        class Particula {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.tamanho = Math.random() * 2 + 1;
                this.densidade = (Math.random() * 30) + 1;
                this.vx = (Math.random() - 0.5) * 0.7;
                this.vy = (Math.random() - 0.5) * 0.7;
            }
            update() {
                this.x += this.vx;
                this.y += this.vy;

                if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
                if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;

                if (mouse.x !== null) {
                    let dx = mouse.x - this.x;
                    let dy = mouse.y - this.y;
                    let distancia = Math.sqrt(dx * dx + dy * dy);
                    let direcaoForcaX = dx / distancia;
                    let direcaoForcaY = dy / distancia;
                    let distanciaMaxima = mouse.raio;
                    let forca = (distanciaMaxima - distancia) / distanciaMaxima;

                    if (distancia < distanciaMaxima) {
                        this.x -= direcaoForcaX * forca * this.densidade;
                        this.y -= direcaoForcaY * forca * this.densidade;
                    }
                }
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.tamanho, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${rgbParticula}, 0.5)`;
                ctx.fill();
            }
        }

        for (let i = 0; i < totalParticulas; i++) {
            particulas.push(new Particula());
        }

        function animarParticulas() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (let i = 0; i < particulas.length; i++) {
                particulas[i].update();
                particulas[i].draw();

                for (let j = i + 1; j < particulas.length; j++) {
                    const dx = particulas[i].x - particulas[j].x;
                    const dy = particulas[i].y - particulas[j].y;
                    const distancia = Math.sqrt(dx * dx + dy * dy);
                    if (distancia < 130) {
                        ctx.beginPath();
                        ctx.moveTo(particulas[i].x, particulas[i].y);
                        ctx.lineTo(particulas[j].x, particulas[j].y);
                        let opacidade = 0.2 - (distancia / 650);
                        ctx.strokeStyle = `rgba(${rgbParticula}, ${opacidade})`;
                        ctx.stroke();
                    }
                }
            }
            requestAnimationFrame(animarParticulas);
        }
        animarParticulas();
    }

    // --- 3. EFEITO TYPEWRITER ---
    const frases = [
        "Desenvolvedor de Software",
        "Criação de Sistemas Web",
        "Soluções em C# e JS"
    ];
    let indiceFrase = 0, indiceCaractere = 0, estaApagando = false;
    const elementoMaquina = document.getElementById('texto-maquina-escrever');

    function loopDigitacao() {
        if (!elementoMaquina) return;
        const fraseAtual = frases[indiceFrase];
        
        if (estaApagando) {
            elementoMaquina.textContent = fraseAtual.substring(0, indiceCaractere - 1);
            indiceCaractere--;
        } else {
            elementoMaquina.textContent = fraseAtual.substring(0, indiceCaractere + 1);
            indiceCaractere++;
        }

        let velocidadeDigitacao = estaApagando ? 30 : 80;
        if (!estaApagando && indiceCaractere === fraseAtual.length) {
            velocidadeDigitacao = 2000;
            estaApagando = true;
        } else if (estaApagando && indiceCaractere === 0) {
            estaApagando = false;
            indiceFrase = (indiceFrase + 1) % frases.length;
            velocidadeDigitacao = 400;
        }
        setTimeout(loopDigitacao, velocidadeDigitacao);
    }
    loopDigitacao();

    // --- 4. MÁSCARA DO TELEFONE ---
    const campoTelefone = document.getElementById('campo-telefone');
    if (campoTelefone) {
        campoTelefone.addEventListener('input', (e) => {
            let val = e.target.value.replace(/\D/g, '');
            let match = val.match(/(\d{0,2})(\d{0,5})(\d{0,4})/);
            if (!match[2]) {
                e.target.value = match[1] ? `(${match[1]}` : '';
            } else if (!match[3]) {
                e.target.value = `(${match[1]}) ${match[2]}`;
            } else {
                e.target.value = `(${match[1]}) ${match[2]}-${match[3]}`;
            }
        });
    }

    // --- 5. LÓGICA DE MODAL ---
    const fundoModal = document.getElementById('fundo-modal');
    const botaoFecharModal = document.getElementById('botao-fechar-modal');
    const corpoModal = document.getElementById('corpo-modal');

    function mostrarModal() {
        if (!fundoModal) return;
        fundoModal.classList.remove('oculto');
        document.body.style.overflow = 'hidden';
    }

    function fecharModal() {
        if (!fundoModal) return;
        fundoModal.classList.add('oculto');
        document.body.style.overflow = '';
    }

    if (botaoFecharModal) {
        botaoFecharModal.addEventListener('click', fecharModal);
    }

    if (fundoModal) {
        fundoModal.addEventListener('click', (e) => {
            if (e.target === fundoModal) fecharModal();
        });
    }

    document.querySelectorAll('.botao-demo').forEach(botao => {
        botao.addEventListener('click', () => {
            const tituloProjeto = botao.getAttribute('data-title');
            if (corpoModal) {
                corpoModal.innerHTML = `
                    <div style="text-align: center; padding: 1rem 0;">
                        <h3 style="font-size: 1.3rem; margin-bottom: 0.5rem;">Demonstração: ${tituloProjeto}</h3>
                        <p style="font-size: 0.9rem; color: var(--cor-texto-suave); margin-bottom: 1.5rem;">
                            O ambiente interativo de demonstração deste projeto pode ser integrado no seu link desejado.
                        </p>
                        <button type="button" class="botao botao-primario acao-fechar-modal">Entendido</button>
                    </div>
                `;
                mostrarModal();
                const acaoFechar = corpoModal.querySelector('.acao-fechar-modal');
                if (acaoFechar) acaoFechar.addEventListener('click', fecharModal);
            }
        });
    });

    const formularioContato = document.getElementById('formulario-contato');
    if (formularioContato) {
        formularioContato.addEventListener('submit', (e) => {
            e.preventDefault();
            const nome = document.getElementById('campo-nome').value;
            if (corpoModal) {
                corpoModal.innerHTML = `
                    <div style="text-align: center; padding: 1rem 0;">
                        <h3 style="font-size: 1.4rem; margin-bottom: 0.5rem;">Mensagem Enviada!</h3>
                        <p style="font-size: 0.95rem; color: var(--cor-texto-suave); margin-bottom: 1.5rem;">
                            Muito obrigado pelo contato, <strong>${nome}</strong>. Retornarei o mais breve possível.
                        </p>
                        <button type="button" class="botao botao-primario acao-fechar-modal">Fechar</button>
                    </div>
                `;
                mostrarModal();
                const acaoFechar = corpoModal.querySelector('.acao-fechar-modal');
                if (acaoFechar) acaoFechar.addEventListener('click', fecharModal);
            }
            formularioContato.reset();
        });
    }

    // --- 6. ANIMAÇÕES AO SCROLL E BARRAS DE PROGRESSO ---
    const observador = new IntersectionObserver((entradas, obs) => {
        entradas.forEach(entrada => {
            if (entrada.isIntersecting) {
                entrada.target.classList.add('active');
                const barrasProgresso = entrada.target.querySelectorAll('.barra-progresso');
                barrasProgresso.forEach(barra => {
                    const larguraAlvo = barra.getAttribute('data-width');
                    barra.style.width = larguraAlvo + '%';
                });
                obs.unobserve(entrada.target);
            }
        });
    }, { threshold: 0.15 });

    document.querySelectorAll('.revelar').forEach(el => observador.observe(el));

    // --- 7. MENU MOBILE ---
    const botaoMenuMobile = document.getElementById('botao-menu-mobile');
    const menuMobile = document.getElementById('menu-mobile');
    const iconeMenu = document.getElementById('icone-menu');

    if (botaoMenuMobile && menuMobile) {
        botaoMenuMobile.addEventListener('click', () => {
            const estaOculto = menuMobile.classList.contains('oculto');
            if (estaOculto) {
                menuMobile.classList.remove('oculto');
                iconeMenu.classList.replace('fa-bars', 'fa-xmark');
            } else {
                menuMobile.classList.add('oculto');
                iconeMenu.classList.replace('fa-xmark', 'fa-bars');
            }
        });

        document.querySelectorAll('.link-mobile').forEach(link => {
            link.addEventListener('click', () => {
                menuMobile.classList.add('oculto');
                iconeMenu.classList.replace('fa-xmark', 'fa-bars');
            });
        });
    }

    // --- 8. ANO NO RODAPÉ ---
    const elementoAno = document.getElementById('ano-atual');
    if (elementoAno) {
        elementoAno.textContent = new Date().getFullYear();
    }
});