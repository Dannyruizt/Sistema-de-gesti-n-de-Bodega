import Sidebar from './Sidebar';
import TopBar from './TopBar';
import '../Styles/componentes/Layout.css';

function Layout({ role, title, subtitle, children }) {
  return (
    <div className="layout-container">
      <Sidebar role={role} />
      <div className="layout-main">
        <TopBar title={title} subtitle={subtitle} />
        <div className="layout-content">{children}</div>
      </div>
    </div>
  );
}

export default Layout;