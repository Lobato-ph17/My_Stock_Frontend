import './EstadoVazio.css'

const CONFIGS = {
  ingredientes: {
    emoji: '🧂',
    titulo: 'Nenhum ingrediente cadastrado',
    descricao: 'Adicione seus insumos para começar a calcular custos de produção.',
  },
  produtos: {
    emoji: '🍬',
    titulo: 'Nenhum produto cadastrado',
    descricao: 'Cadastre seus doces para gerenciar estoque e margem de lucro.',
  },
  receitas: {
    emoji: '📋',
    titulo: 'Nenhuma receita cadastrada',
    descricao: 'Defina os ingredientes de cada doce para calcular o custo automaticamente.',
  },
  producao: {
    emoji: '🏭',
    titulo: 'Nenhum lote produzido',
    descricao: 'Registre sua produção para descontar ingredientes e adicionar doces ao estoque.',
  },
  vendas: {
    emoji: '🛒',
    titulo: 'Nenhuma venda registrada',
    descricao: 'Registre suas vendas para acompanhar faturamento e lucro.',
  },
  despesas: {
    emoji: '💰',
    titulo: 'Nenhuma despesa registrada',
    descricao: 'Registre seus gastos para ter um controle financeiro completo.',
  },
}

export default function EstadoVazio({ tipo, onAcao, labelAcao }) {
  const config = CONFIGS[tipo] || CONFIGS.ingredientes

  return (
    <div className="estado-vazio">
      <div className="estado-vazio-emoji">{config.emoji}</div>
      <h3 className="estado-vazio-titulo">{config.titulo}</h3>
      <p className="estado-vazio-descricao">{config.descricao}</p>
      {onAcao && (
        <button className="estado-vazio-btn" onClick={onAcao}>
          {labelAcao || 'Adicionar'}
        </button>
      )}
    </div>
  )
}