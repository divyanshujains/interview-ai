import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { RightSidebar } from './RightSidebar';

export const Layout = () => {
  return (
    <Sidebar>
      <div className="flex h-screen w-full bg-[#F4F6F8] font-sans">
        {/* Main Content Area (Dynamic) */}
        <div className="flex-1 overflow-y-auto relative">
          <Outlet />
        </div>

        {/* Right Intelligence Panel (Static) */}
        <RightSidebar />
      </div>
    </Sidebar>
  );
};
