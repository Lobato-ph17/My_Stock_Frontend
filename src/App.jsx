import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
 
function App() {
    const [produtos, setProdutos] = useState([]);
    const [nome, setNome] = useState('');
    const [quantidade, setQuantidade] = useState('');
    const [preco, setPreco] = useState('');
    const [busca, setBusca] = useState('');
    const [mensagem, setMensagem] = useState(null);
    const [editandoId, setEditandoId] = useState(null);
    const [editNome, setEditNome] = useState('');
    const [editPreco, setEditPreco] = useState('');
    const [pagina, setPagina] = useState('produtos');
 
    const totalProdutos = produtos.length;
 
    const valorTotalEstoque = produtos.reduce((total, produto) => {
        return total + (produto.preco * produto.quantidade);
    }, 0);
 
    const produtoMaisCaro = produtos.length > 0
        ? produtos.reduce((maior, produto) =>
            produto.preco > maior.preco ? produto : maior)
        : null;
 
    const produtosFiltrados = produtos.filter(produto =>
        produto.nome.toLowerCase().includes(busca.toLowerCase())
    );
 
    function mostrarMensagem(texto, tipo) {
        setMensagem({ texto, tipo });
        setTimeout(() => setMensagem(null), 3000);
    }
 
    useEffect(() => {
        fetch('http://localhost:8080/produtos')
            .then(response => response.json())
            .then(data => setProdutos(data));
    }, []);
 
    function adicionarProduto() {
        const produtoExistente = produtos.find(
            p => p.nome.toLowerCase() === nome.toLowerCase()
        );
 
        if (!nome || !quantidade) {
            mostrarMensagem('Preencha nome e quantidade!', 'erro');
            return;
        }
        if (!produtoExistente && !preco) {
            mostrarMensagem('Preencha o preço para novo produto!', 'erro');
            return;
        }
        if (isNaN(parseFloat(preco || '0')) || isNaN(parseInt(quantidade))) {
            mostrarMensagem('Preço e quantidade devem ser números!', 'erro');
            return;
        }
 
        if (produtoExistente) {
            fetch(`http://localhost:8080/produtos/${produtoExistente.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ quantidade: parseInt(quantidade) })
            })
            .then(response => response.json())
            .then(produtoAtualizado => {
                setProdutos(produtos.map(p =>
                    p.id === produtoAtualizado.id ? produtoAtualizado : p
                ));
                setNome('');
                setQuantidade('');
                setPreco('');
                mostrarMensagem(`+${quantidade} unidades adicionadas ao ${nome}!`, 'sucesso');
            });
        } else {
            fetch('http://localhost:8080/produtos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    nome: nome,
                    quantidade: parseInt(quantidade),
                    preco: parseFloat(preco)
                })
            })
            .then(response => response.json())
            .then(novoProduto => {
                setProdutos([...produtos, novoProduto]);
                setNome('');
                setQuantidade('');
                setPreco('');
                mostrarMensagem('Produto adicionado com sucesso!', 'sucesso');
            });
        }
    }
 
    function removerProduto(id) {
        fetch(`http://localhost:8080/produtos/${id}`, {
            method: 'DELETE'
        })
        .then(() => {
            setProdutos(produtos.filter(p => p.id !== id));
            mostrarMensagem('Produto removido!', 'erro');
        });
    }
 
    function iniciarEdicao(produto) {
        setEditandoId(produto.id);
        setEditNome(produto.nome);
        setEditPreco(produto.preco);
    }
 
    function salvarEdicao(id) {
        fetch(`http://localhost:8080/produtos/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                nome: editNome,
                quantidade: 0,
                preco: parseFloat(editPreco)
            })
        })
        .then(response => response.json())
        .then(produtoAtualizado => {
            setProdutos(produtos.map(p =>
                p.id === produtoAtualizado.id ? produtoAtualizado : p
            ));
            setEditandoId(null);
            mostrarMensagem('Produto atualizado!', 'sucesso');
        });
    }
 
    return (
        <div className="app">
            <aside className="sidebar">
                <div className="sidebar-logo">
                    📦 StockSystem
                    <span>Gerenciamento de Estoque</span>
                </div>
                <ul className="sidebar-menu">
                    <li className={pagina === 'produtos' ? 'active' : ''}
                        onClick={() => setPagina('produtos')}>
                        📦 Produtos
                    </li>
                    <li className={pagina === 'dashboard' ? 'active' : ''}
                        onClick={() => setPagina('dashboard')}>
                        📊 Dashboard
                    </li>
                    <li>📈 Relatórios</li>
                    <li>⚙️ Configurações</li>
                </ul>
            </aside>
 
            <div className="main">
                <div className="topbar">
                    <h2>{pagina === 'produtos' ? 'Produtos' : 'Dashboard'}</h2>
                    <span className="topbar-info">
                        {produtos.length} produto{produtos.length !== 1 ? 's' : ''} cadastrado{produtos.length !== 1 ? 's' : ''}
                    </span>
                    {pagina === 'produtos' && (
                        <input type="text" value={busca}
                            onChange={(e) => setBusca(e.target.value)}
                            placeholder="🔍 Buscar produto..."
                            className="busca-input" />
                    )}
                </div>
 
                <div className="cards">
                    <div className="card">
                        <span className="card-icon">📦</span>
                        <div>
                            <p className="card-label">Total de Produtos</p>
                            <p className="card-value">{totalProdutos}</p>
                        </div>
                    </div>
                    <div className="card">
                        <span className="card-icon">💰</span>
                        <div>
                            <p className="card-label">Valor em Estoque</p>
                            <p className="card-value">R$ {valorTotalEstoque.toFixed(2)}</p>
                        </div>
                    </div>
                    <div className="card">
                        <span className="card-icon">⭐</span>
                        <div>
                            <p className="card-label">Produto Mais Caro</p>
                            <p className="card-value">
                                {produtoMaisCaro ? produtoMaisCaro.nome : '—'}
                            </p>
                        </div>
                    </div>
                </div>
 
                {pagina === 'produtos' ? (
                    <div className="content">
                        <div className="formulario">
                            <input type="text" value={nome}
                                onChange={(e) => setNome(e.target.value)}
                                placeholder="Nome do produto" />
                            <input type="text" value={preco}
                                onChange={(e) => setPreco(e.target.value)}
                                placeholder="Preço" />
                            <input type="text" value={quantidade}
                                onChange={(e) => setQuantidade(e.target.value)}
                                placeholder="Quantidade" />
                            <button onClick={adicionarProduto}>+ Adicionar</button>
                        </div>
 
                        {mensagem && (
                            <div className={`mensagem mensagem-${mensagem.tipo}`}>
                                {mensagem.texto}
                            </div>
                        )}
 
                        <div className="tabela-container">
                            <div className="tabela-header">
                                <h3>Lista de Produtos</h3>
                                <span className="total-badge">{produtos.length} itens</span>
                            </div>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Nome</th>
                                        <th>Quantidade</th>
                                        <th>Preço</th>
                                        <th>Ação</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {produtosFiltrados.map(produto => (
                                        <tr key={produto.id} className={produto.quantidade < 5 ? 'estoque-baixo' : ''}>
                                            <td>
                                                {editandoId === produto.id
                                                    ? <input className="input-edit" value={editNome}
                                                        onChange={(e) => setEditNome(e.target.value)} />
                                                    : produto.nome}
                                            </td>
                                            <td>{produto.quantidade}</td>
                                            <td>
                                                {editandoId === produto.id
                                                    ? <input className="input-edit" value={editPreco}
                                                        onChange={(e) => setEditPreco(e.target.value)} />
                                                    : `R$ ${produto.preco.toFixed(2)}`}
                                            </td>
                                            <td>
                                                {editandoId === produto.id ? (
                                                    <>
                                                        <button className="btn-salvar"
                                                            onClick={() => salvarEdicao(produto.id)}>
                                                            Salvar
                                                        </button>
                                                        <button className="btn-cancelar"
                                                            onClick={() => setEditandoId(null)}>
                                                            Cancelar
                                                        </button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <button className="btn-editar"
                                                            onClick={() => iniciarEdicao(produto)}>
                                                            Editar
                                                        </button>
                                                        <button className="btn-remover"
                                                            onClick={() => removerProduto(produto.id)}>
                                                            Remover
                                                        </button>
                                                    </>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    <div className="content">
                        <div className="graficos">
                            <div className="grafico-container">
                                <h3>Quantidade por Produto</h3>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={produtos}>
                                        <XAxis dataKey="nome" stroke="#6b7280" />
                                        <YAxis stroke="#6b7280" />
                                        <Tooltip
                                            contentStyle={{ background: '#132218', border: '1px solid #1e3a28', borderRadius: '8px' }}
                                            labelStyle={{ color: '#4ade80' }}
                                        />
                                        <Bar dataKey="quantidade" fill="#4ade80" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                        </div>

                        <div className="grafico-container">
                                <h3>Valor em Estoque por Produto</h3>
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie
                                            data={produtos.map(p => ({
                                                name: p.nome,
                                                value: parseFloat((p.preco * p.quantidade).toFixed(2))
                                            }))}
                                            dataKey="value"
                                            nameKey="name"
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={100}
                                            label={({ name, percent }) =>
                                                `${name} ${(percent * 100).toFixed(0)}%`
                                            }
                                        >
                                            {produtos.map((_, index) => (
                                                <Cell key={index}
                                                    fill={['#4ade80', '#22c55e', '#16a34a', '#15803d', '#166534'][index % 5]} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{ background: '#132218', border: '1px solid #1e3a28', borderRadius: '8px' }}
                                            formatter={(value) => `R$ ${value}`}
                                        />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                    )}
               </div>
        </div>
    );
}
 
export default App;