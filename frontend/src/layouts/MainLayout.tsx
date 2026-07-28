import { Outlet } from 'react-router-dom';
import './MainLayout.css';

export function MainLayout() {
  return (
    <div className="main-layout">
      <main className="main-layout__content">
        <Outlet />
      </main>
    </div>
  );
}
