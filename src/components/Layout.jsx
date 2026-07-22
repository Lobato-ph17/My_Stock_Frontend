import { NavLink, Outlet } from 'react-router-dom'
import {
  LayoutDashboard,
  Package,
  ShoppingBasket,
  ClipboardList,
  Factory,
  ShoppingCart,
  Receipt
} from 'lucide-react'
import './Layout.css'

const menuItems = [
  { path: '/',           icon: LayoutDashboard, label: 'Dashboard'  },
  { path: '/ingredientes', icon: ShoppingBasket,  label: 'Ingredientes' },
  { path: '/produtos',   icon: Package,          label: 'Produtos'   },
  { path: '/receitas',   icon: ClipboardList,    label: 'Receitas'   },
  { path: '/producao',   icon: Factory,          label: 'Produção'   },
  { path: '/vendas',     icon: ShoppingCart,     label: 'Vendas'     },
  { path: '/despesas',   icon: Receipt,          label: 'Despesas'   },
]

export default function Layout() {
  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-logo">
          🍬 PLStock
        </div>
        <nav className="sidebar-nav">
          {menuItems.map(({ path, icon: Icon, label }) => (
            <NavLink
              key={path}
              to={path}
              end={path === '/'}
              className={({ isActive }) =>
                'nav-item' + (isActive ? ' nav-item--active' : '')
              }
            >
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="content">
        <Outlet />
      </main>
    </div>
  )
}