import { useEffect, useState } from 'react'
import './Loading.css'

const mensagens = [
  'Acordando o servidor...',
  'Checando ingredientes...',
  'Calculando margens de lucro...',
  'Preparando o dashboard...',
  'Quase lá...',
]

export default function Loading() {
  const [progresso, setProgresso] = useState(0)
  const [msgIndex, setMsgIndex]   = useState(0)

  useEffect(() => {
    const intervaloProgresso = setInterval(() => {
      setProgresso(p => {
        if (p >= 85) return p 
        return p + Math.random() * 4
      })
    }, 400)

    const intervaloMensagem = setInterval(() => {
      setMsgIndex(i => (i + 1) % mensagens.length)
    }, 2500)

    return () => {
      clearInterval(intervaloProgresso)
      clearInterval(intervaloMensagem)
    }
  }, [])

  return (
    <div className="loading-wrapper">

      {/* Ilustração de fundo */}
      <svg className="loading-bg" viewBox="0 0 300 300" fill="none">
        <circle cx="80" cy="80" r="50" stroke="#2C1A0E" strokeWidth="2"/>
        <circle cx="80" cy="80" r="35" stroke="#2C1A0E" strokeWidth="1.5"/>
        <circle cx="80" cy="80" r="12" fill="#2C1A0E"/>
        <path d="M55 80 Q65 60 80 65 Q95 70 105 80" stroke="#2C1A0E" strokeWidth="1.5" fill="none"/>
        <ellipse cx="220" cy="200" rx="40" ry="20" stroke="#2C1A0E" strokeWidth="2"/>
        <ellipse cx="220" cy="190" rx="30" ry="14" stroke="#2C1A0E" strokeWidth="1.5"/>
        <path d="M195 195 Q220 175 245 195" stroke="#2C1A0E" strokeWidth="1.5" fill="none"/>
        <circle cx="100" cy="240" r="30" stroke="#2C1A0E" strokeWidth="2"/>
        <path d="M80 240 Q90 220 100 230 Q110 240 120 225 Q130 210 140 240" stroke="#2C1A0E" strokeWidth="1.5" fill="none"/>
      </svg>

      <div className="loading-conteudo">

        {/* Logo animado */}
        <div className="loading-logo">
          PL<span>Stock</span>
        </div>

        {/* Ícone de doce animado */}
        <div className="loading-icone">🍬</div>

        {/* Mensagem rotativa */}
        <p className="loading-mensagem" key={msgIndex}>
          {mensagens[msgIndex]}
        </p>

        {/* Barra de progresso */}
        <div className="loading-barra-wrapper">
          <div
            className="loading-barra-fill"
            style={{ width: `${progresso}%` }}
          />
        </div>

        {/* Aviso honesto */}
        <p className="loading-aviso">
          O servidor gratuito hiberna após inatividade.<br/>
          A primeira carga pode levar até 30 segundos.
        </p>
      </div>
    </div>
  )
}