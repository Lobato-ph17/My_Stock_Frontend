import { useState, useEffect } from 'react';

function App() {
    const [produtos, setProdutos] = useState([]);
    const [nome, setNome] = useState('');
    const [quantidade, setQuantidade] = useState('');
    const [preco, setPreco] = useState('');

    useEffect(() => {
    fetch('http://localhost:8080/produtos')
        .then(response => response.json())
        .then(data => setProdutos(data));
    }, []);

    function adicionarProduto() {
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
    });
}   

    function removerProduto(id) {
    fetch(`http://localhost:8080/produtos/${id}`, {
        method: 'DELETE'
    })
    .then(() => {
        setProdutos(produtos.filter(p => p.id !== id));
    });
}



    return (
      <div className="container">
          <h1>Sistema de Estoque</h1>
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
              <button onClick={adicionarProduto}>Adicionar</button>
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
                  {produtos.map(produto => (
                      <tr key={produto.id}>
                          <td>{produto.nome}</td>
                          <td>{produto.quantidade}</td>
                          <td>R$ {produto.preco.toFixed(2)}</td>
                          <td>
                              <button className="btn-remover"
                                  onClick={() => removerProduto(produto.id)}>
                                  Remover
                              </button>
                          </td>
                      </tr>
                  ))}
              </tbody>
          </table>
      </div>
    );
}


export default App;