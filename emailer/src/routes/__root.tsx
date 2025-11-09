import { createRootRoute, Link, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'

export const Route = createRootRoute({
  component: () => (
    <>
      <div style={{ padding: '1rem', borderBottom: '1px solid #ccc' }}>
        <nav style={{ display: 'flex', gap: '1rem' }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            Home
          </Link>
          <Link to="/admin" style={{ textDecoration: 'none' }}>
            Admin
          </Link>
        </nav>
      </div>
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
})
