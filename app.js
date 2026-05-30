const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// ===================== BANCO EM MEMÓRIA =====================
let filmes = [
{ id: 1, titulo: "Desventuras em Série", genero: "Suspense", ano_lancamento: 2004 },
{ id: 2, titulo: "O Último Mestre do Ar", genero: "Ação", ano_lancamento: 2010 },
{ id: 3, titulo: "Meu Amigo Totoro", genero: "Animação", ano_lancamento: 1995 }
];

let usuarios = [
{ id: 1, nome: "Maria Silva", email: "[maria@email.com](mailto:maria@email.com)" },
{ id: 2, nome: "João Souza", email: "[joao@email.com](mailto:joao@email.com)" },
{ id: 3, nome: "Ana Costa", email: "[ana@email.com](mailto:ana@email.com)" }
];

let favoritos = [
{ id: 1, id_usuario: 1, id_filme: 2 },
{ id: 2, id_usuario: 2, id_filme: 1 }
];

// IDs
let filmeId = 4;
let usuarioId = 4;
let favoritoId = 3;

// ===================== FILMES =====================
app.get('/filmes', (req, res) => {
res.status(200).json(filmes);
});

app.post('/filmes', (req, res) => {
const novoFilme = {
id: filmeId++,
titulo: req.body.titulo || "Sem título",
genero: req.body.genero || "Não informado",
ano_lancamento: req.body.ano_lancamento || 2025
};

```
filmes.push(novoFilme);
res.status(200).json({ sucesso: true, filme: novoFilme });
```

});

app.delete('/filmes/:id', (req, res) => {
const id = parseInt(req.params.id);

```
const existe = filmes.find(f => f.id === id);
if (!existe) {
    return res.status(200).json({ sucesso: false, mensagem: "Filme não encontrado" });
}

filmes = filmes.filter(f => f.id !== id);
favoritos = favoritos.filter(f => f.id_filme !== id);

res.status(200).json({ sucesso: true, mensagem: "Filme removido" });
```

});

// ===================== USUÁRIOS =====================
app.get('/usuarios', (req, res) => {
res.status(200).json(usuarios);
});

app.post('/usuarios', (req, res) => {
const novoUsuario = {
id: usuarioId++,
nome: req.body.nome || "Sem nome",
email: req.body.email || "[sem@email.com](mailto:sem@email.com)"
};

```
usuarios.push(novoUsuario);
res.status(200).json({ sucesso: true, usuario: novoUsuario });
```

});

app.put('/usuarios/:id', (req, res) => {
const id = parseInt(req.params.id);
const usuario = usuarios.find(u => u.id === id);

```
if (!usuario) {
    return res.status(200).json({ sucesso: false, mensagem: "Usuário não encontrado" });
}

if (req.body.nome) usuario.nome = req.body.nome;
if (req.body.email) usuario.email = req.body.email;

res.status(200).json({ sucesso: true, usuario });
```

});

// ===================== FAVORITOS =====================
app.post('/favoritos', (req, res) => {
let { id_usuario, id_filme } = req.body;

```
id_usuario = parseInt(id_usuario);
id_filme = parseInt(id_filme);

const usuario = usuarios.find(u => u.id === id_usuario);
const filme = filmes.find(f => f.id === id_filme);

if (!usuario) {
    return res.status(200).json({ sucesso: false, mensagem: "Usuário não encontrado" });
}

if (!filme) {
    return res.status(200).json({ sucesso: false, mensagem: "Filme não encontrado" });
}

const jaExiste = favoritos.find(f => f.id_usuario === id_usuario && f.id_filme === id_filme);
if (jaExiste) {
    return res.status(200).json({ sucesso: false, mensagem: "Já favoritado" });
}

const novoFavorito = {
    id: favoritoId++,
    id_usuario,
    id_filme
};

favoritos.push(novoFavorito);

res.status(200).json({ sucesso: true, favorito: novoFavorito });
```

});

app.get('/favoritos', (req, res) => {
res.status(200).json(favoritos);
});

app.get('/favoritos/usuario/:id_usuario', (req, res) => {
const id_usuario = parseInt(req.params.id_usuario);

```
const usuario = usuarios.find(u => u.id === id_usuario);
if (!usuario) {
    return res.status(200).json({ sucesso: false, mensagem: "Usuário não encontrado" });
}

const filmesFav = favoritos
    .filter(f => f.id_usuario === id_usuario)
    .map(f => filmes.find(filme => filme.id === f.id_filme));

res.status(200).json({ sucesso: true, filmes: filmesFav });
```

});

// ===================== ROOT =====================
app.get('/', (req, res) => {
res.status(200).json({ mensagem: "API CineStream funcionando!" });
});

// ===================== SERVER =====================
const PORT = 3000;
app.listen(PORT, () => {
console.log(`🚀 http://localhost:${PORT}`);
});