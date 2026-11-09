/* DADOS DO OPERADOR */
const EMAIL_VALIDO = "operador@empresa.com";
const SENHA_VALIDA = "123456";
const NOME_OPERADOR = "Operador";

/* DADOS INICIAIS */
let registros = [
    { id: 1, titulo: "Manutenção preventiva", categoria: "manutencao", operador: "Carlos Silva", distancia: 2.5, tempo: 1.5, eficiencia: "95%", data: "08:30 - 08/11/26", curtidas: 3, comentarios: [], curtidoPor: [] },
    { id: 2, titulo: "Operação de equipamentos", categoria: "operacao", operador: "Mariana Costa", distancia: 1.8, tempo: 2, eficiencia: "90%", data: "09:45 - 08/11/26", curtidas: 5, comentarios: [], curtidoPor: [] },
    { id: 3, titulo: "Inspeção de máquinas", categoria: "inspecao", operador: "João Santos", distancia: 3.2, tempo: 1, eficiencia: "98%", data: "10:15 - 07/11/26", curtidas: 2, comentarios: [], curtidoPor: [] },
    { id: 4, titulo: "Manutenção de equipamentos", categoria: "manutencao", operador: "Ana Oliveira", distancia: 4, tempo: 2.5, eficiencia: "92%", data: "11:20 - 07/11/26", curtidas: 4, comentarios: [], curtidoPor: [] },
    { id: 5, titulo: "Operação de produção", categoria: "operacao", operador: "Carlos Silva", distancia: 2.1, tempo: 1.8, eficiencia: "94%", data: "13:30 - 06/11/26", curtidas: 1, comentarios: [], curtidoPor: [] },
    { id: 6, titulo: "Inspeção técnica", categoria: "inspecao", operador: "Mariana Costa", distancia: 1.5, tempo: 1.2, eficiencia: "97%", data: "14:10 - 06/11/26", curtidas: 2, comentarios: [], curtidoPor: [] }
];


/* ESTADOS DA APLICAÇÃO */
let usuarioLogado = false;
let categoriaAtual = "todos";
let paginaAtual = 1;
const registrosPorPagina = 4;


/* ELEMENTOS DO HTML */
const listaRegistros = document.getElementById("lista-registros");
const modalLogin = document.getElementById("modal-login");
const formularioLogin = document.getElementById("form-login");
const botaoLogin = document.getElementById("btn-login");
const botaoRegistros = document.getElementById("btn-registros");
const formularioRegistro = document.getElementById("formulario-registro");


/* ABRIR E FECHAR LOGIN */
function mostrarLogin() {
    modalLogin.hidden = false;
}


function fecharLogin() {
    modalLogin.hidden = true;
    formularioLogin.reset();
    limparErrosLogin();
}


document.getElementById("fechar-modal").addEventListener("click", fecharLogin);
document.getElementById("btn-cancelar").addEventListener("click", fecharLogin);


botaoLogin.addEventListener("click", function() {
    if (usuarioLogado) {
        usuarioLogado = false;
        atualizarLogin();
        renderizarRegistros();
    } else {
        mostrarLogin();
    }
});


/* LIMPAR ERROS DO LOGIN */
function limparErrosLogin() {
    document.getElementById("email").classList.remove("erro");
    document.getElementById("senha").classList.remove("erro");
    document.getElementById("erro-email").textContent = "";
    document.getElementById("erro-senha").textContent = "";
}


/* VALIDAR LOGIN */
formularioLogin.addEventListener("submit", function(evento) {
    evento.preventDefault();
    limparErrosLogin();


    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value.trim();


    if (email === "" || senha === "") {
        if (email === "") {
            document.getElementById("email").classList.add("erro");
            document.getElementById("erro-email").textContent = "email ou senha obrigatório";
        }
        if (senha === "") {
            document.getElementById("senha").classList.add("erro");
            document.getElementById("erro-senha").textContent = "email ou senha obrigatório";
        }
        return;
    }


    if (email !== EMAIL_VALIDO || senha !== SENHA_VALIDA) {
        document.getElementById("email").classList.add("erro");
        document.getElementById("senha").classList.add("erro");
        document.getElementById("erro-email").textContent = "email ou senha incorreta";
        return;
    }


    usuarioLogado = true;
    fecharLogin();
    atualizarLogin();
    renderizarRegistros();
});


/* ATUALIZAR INTERFACE DO LOGIN */
function atualizarLogin() {
    botaoLogin.textContent = usuarioLogado ? "Logout" : "Login";
    botaoRegistros.disabled = !usuarioLogado;


    const perfil = document.getElementById("perfil-operador");
    const nome = document.getElementById("nome-operador");


    if (usuarioLogado) {
        perfil.hidden = false;
        nome.textContent = NOME_OPERADOR;
    } else {
        perfil.hidden = true;
    }


    atualizarIndicadores();
}


/* INDICADORES */
function atualizarIndicadores() {
    document.getElementById("total-apontamentos").textContent = registros.length;


    const totalHoras = registros.reduce(function(total, registro) {
        return total + registro.tempo;
    }, 0);


    document.getElementById("total-horas").textContent = totalHoras.toFixed(2) + " h";
}


/* NOME DA CATEGORIA */
function formatarCategoria(categoria) {
    const categorias = {
        manutencao: "Manutenção",
        operacao: "Operação",
        inspecao: "Inspeção"
    };


    return categorias[categoria] || categoria;
}


/* FILTROS */
document.querySelectorAll(".filtro-btn").forEach(function(botao) {
    botao.addEventListener("click", function() {
        if (!usuarioLogado) {
            mostrarLogin();
            return;
        }


        categoriaAtual = botao.dataset.categoria;
        paginaAtual = 1;


        document.querySelectorAll(".filtro-btn").forEach(function(item) {
            item.classList.remove("ativo");
        });


        botao.classList.add("ativo");
        renderizarRegistros();
    });
});


/* MOSTRAR REGISTROS */
function renderizarRegistros() {
    listaRegistros.innerHTML = "";


    const registrosFiltrados = categoriaAtual === "todos"
        ? registros
        : registros.filter(function(registro) {
            return registro.categoria === categoriaAtual;
        });


    const inicio = (paginaAtual - 1) * registrosPorPagina;
    const registrosPagina = registrosFiltrados.slice(inicio, inicio + registrosPorPagina);


    if (registrosPagina.length === 0) {
        listaRegistros.innerHTML = "<p>Nenhum registro encontrado.</p>";
    }


    registrosPagina.forEach(function(registro) {
        const card = document.createElement("div");
        card.className = "card-registro";


        const curtiu = registro.curtidoPor.includes(EMAIL_VALIDO);


        card.innerHTML = `
            <div class="card-conteudo">
                <h3>${registro.titulo}</h3>
                <p class="categoria-registro">${formatarCategoria(registro.categoria)}</p>
                <div class="dados-operador">
                    <span class="avatar-inicial">${registro.operador.charAt(0)}</span>
                    <strong>${registro.operador}</strong>
                </div>
                <div class="informacoes-registro">
                    <p>Distância: ${registro.distancia.toFixed(2)} km</p>
                    <p>Tempo: ${registro.tempo.toFixed(2)} h</p>
                    <p>Eficiência: ${registro.eficiencia}</p>
                </div>
                <p class="data-registro">${registro.data}</p>
                <div class="acoes-registro">
                    <button class="btn-curtir ${curtiu ? "curtido" : ""}" data-id="${registro.id}">
                        <img src="assets/heart-angle-svgrepo-com.svg" alt="Curtir">
                        <span>${registro.curtidas}</span>
                    </button>
                    <button class="btn-comentarios" data-id="${registro.id}">
                        <img src="assets/1151460.png" alt="Comentários">
                        <span>${registro.comentarios.length}</span>
                    </button>
                </div>
                <div class="area-comentarios" id="comentarios-${registro.id}" hidden>
                    <div class="lista-comentarios"></div>
                    <div class="campo-comentario">
                        <input class="input-comentario" type="text" placeholder="Escrever um comentário...">
                        <button class="btn-enviar-comentario" data-id="${registro.id}">
                            <img src="assets/223484.png" alt="Enviar">
                        </button>
                    </div>
                    <p class="erro-comentario"></p>
                </div>
            </div>
        `;


        listaRegistros.appendChild(card);


        const listaComentarios = card.querySelector(".lista-comentarios");


        registro.comentarios.forEach(function(comentario) {
            const paragrafo = document.createElement("p");
            paragrafo.textContent = comentario;
            listaComentarios.appendChild(paragrafo);
        });
    });


    atualizarPaginacao();
    atualizarIndicadores();
    ativarBotoesCards();
}


/* CURTIDAS E COMENTÁRIOS */
function ativarBotoesCards() {
    document.querySelectorAll(".btn-curtir").forEach(function(botao) {
        botao.addEventListener("click", function() {
            if (!usuarioLogado) {
                mostrarLogin();
                return;
            }


            const id = Number(botao.dataset.id);
            const registro = registros.find(function(item) {
                return item.id === id;
            });


            const jaCurtiu = registro.curtidoPor.includes(EMAIL_VALIDO);


            if (jaCurtiu) {
                registro.curtidoPor = registro.curtidoPor.filter(function(email) {
                    return email !== EMAIL_VALIDO;
                });
                registro.curtidas--;
            } else {
                registro.curtidoPor.push(EMAIL_VALIDO);
                registro.curtidas++;
            }


            renderizarRegistros();
        });
    });


    document.querySelectorAll(".btn-comentarios").forEach(function(botao) {
        botao.addEventListener("click", function() {
            if (!usuarioLogado) {
                mostrarLogin();
                return;
            }


            const id = botao.dataset.id;
            const area = document.getElementById("comentarios-" + id);
            area.hidden = !area.hidden;
        });
    });


    document.querySelectorAll(".btn-enviar-comentario").forEach(function(botao) {
        botao.addEventListener("click", function() {
            if (!usuarioLogado) {
                mostrarLogin();
                return;
            }


            const id = Number(botao.dataset.id);
            const registro = registros.find(function(item) {
                return item.id === id;
            });


            const area = document.getElementById("comentarios-" + id);
            const input = area.querySelector(".input-comentario");
            const erro = area.querySelector(".erro-comentario");
            const texto = input.value.trim();


            if (texto.length <= 2) {
                erro.textContent = "não é possível enviar um comentário vazio";
                return;
            }


            registro.comentarios.push(texto);
            renderizarRegistros();


            const novaArea = document.getElementById("comentarios-" + id);
            novaArea.hidden = false;
        });
    });
}


/* PAGINAÇÃO */
function atualizarPaginacao() {
    const registrosFiltrados = categoriaAtual === "todos"
        ? registros
        : registros.filter(function(registro) {
            return registro.categoria === categoriaAtual;
        });


    const totalPaginas = Math.max(1, Math.ceil(registrosFiltrados.length / registrosPorPagina));


    if (paginaAtual > totalPaginas) {
        paginaAtual = totalPaginas;
    }


    document.getElementById("primeira-pagina").disabled = paginaAtual === 1;
    document.getElementById("pagina-anterior").disabled = paginaAtual === 1;
    document.getElementById("pagina-proxima").disabled = paginaAtual === totalPaginas;
    document.getElementById("ultima-pagina").disabled = paginaAtual === totalPaginas;


    const numeros = document.getElementById("numeros-paginas");
    numeros.innerHTML = "";


    for (let i = 1; i <= totalPaginas; i++) {
        const botao = document.createElement("button");
        botao.textContent = i;


        if (i === paginaAtual) {
            botao.classList.add("ativo");
        }


        botao.addEventListener("click", function() {
            if (!usuarioLogado) {
                mostrarLogin();
                return;
            }


            paginaAtual = i;
            renderizarRegistros();
        });


        numeros.appendChild(botao);
    }
}


/* BOTÕES DA PAGINAÇÃO */
document.getElementById("primeira-pagina").addEventListener("click", function() {
    if (!usuarioLogado) {
        mostrarLogin();
        return;
    }
    paginaAtual = 1;
    renderizarRegistros();
});


document.getElementById("pagina-anterior").addEventListener("click", function() {
    if (!usuarioLogado) {
        mostrarLogin();
        return;
    }
    if (paginaAtual > 1) {
        paginaAtual--;
        renderizarRegistros();
    }
});


document.getElementById("pagina-proxima").addEventListener("click", function() {
    if (!usuarioLogado) {
        mostrarLogin();
        return;
    }


    const total = Math.ceil(registrosFiltrados().length / registrosPorPagina);


    if (paginaAtual < total) {
        paginaAtual++;
        renderizarRegistros();
    }
});


document.getElementById("ultima-pagina").addEventListener("click", function() {
    if (!usuarioLogado) {
        mostrarLogin();
        return;
    }


    paginaAtual = Math.max(1, Math.ceil(registrosFiltrados().length / registrosPorPagina));
    renderizarRegistros();
});


function registrosFiltrados() {
    return categoriaAtual === "todos"
        ? registros
        : registros.filter(function(registro) {
            return registro.categoria === categoriaAtual;
        });
}


/* ABRIR FORMULÁRIO DE REGISTRO */
botaoRegistros.addEventListener("click", function() {
    if (!usuarioLogado) {
        mostrarLogin();
        return;
    }


    formularioRegistro.hidden = false;
    document.querySelector(".filtros").hidden = true;
    listaRegistros.hidden = true;
    document.querySelector(".paginacao").hidden = true;
    botaoRegistros.classList.add("ativo");
});


/* CADASTRAR NOVO REGISTRO */
document.getElementById("form-registro").addEventListener("submit", function(evento) {
    evento.preventDefault();


    const tipo = document.getElementById("tipo-registro");
    const deslocamento = document.getElementById("deslocamento");
    const tempo = document.getElementById("tempo-execucao");


    let valido = true;


    [tipo, deslocamento, tempo].forEach(function(campo) {
        const erro = campo.parentElement.querySelector(".erro");
        if (campo.value.trim() === "") {
            campo.classList.add("erro");
            if (erro) erro.textContent = "Campo obrigatório";
            valido = false;
        } else {
            campo.classList.remove("erro");
            if (erro) erro.textContent = "";
        }
    });


    if (!valido) return;


    const distanciaKm = Number(deslocamento.value) / 1000;
    const tempoHoras = Number(tempo.value) / 60;
    const agora = new Date();


    const hora = String(agora.getHours()).padStart(2, "0");
    const minuto = String(agora.getMinutes()).padStart(2, "0");
    const dia = String(agora.getDate()).padStart(2, "0");
    const mes = String(agora.getMonth() + 1).padStart(2, "0");
    const ano = String(agora.getFullYear()).slice(-2);


    registros.unshift({
        id: Date.now(),
        titulo: "Novo apontamento",
        categoria: tipo.value,
        operador: NOME_OPERADOR,
        distancia: distanciaKm,
        tempo: tempoHoras,
        eficiencia: "Não informada",
        data: `${hora}:${minuto} - ${dia}/${mes}/${ano}`,
        curtidas: 0,
        comentarios: [],
        curtidoPor: []
    });


    this.reset();
    formularioRegistro.hidden = true;
    document.querySelector(".filtros").hidden = false;
    listaRegistros.hidden = false;
    document.querySelector(".paginacao").hidden = false;
    botaoRegistros.classList.remove("ativo");


    categoriaAtual = "todos";
    paginaAtual = 1;


    document.querySelectorAll(".filtro-btn").forEach(function(botao) {
        botao.classList.remove("ativo");
    });

    renderizarRegistros();
});

/* INICIALIZAÇÃO */
modalLogin.hidden = true;
formularioRegistro.hidden = true;
atualizarLogin();
renderizarRegistros();