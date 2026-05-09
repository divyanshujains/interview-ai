import { AsideHeader } from '@gravity-ui/navigation';
import { BookOpen, Map, Code, User, LogOut, FilePlus, History } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Sidebar = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const handleItemClick = async (item) => {
    if (item.id === 'logout') {
      await logout();
      navigate('/login');
    } else if (item.id === 'profile') {
      navigate('/profile');
    } else if (item.id === 'technical') {
      navigate('/');
    } else if (item.id === 'setup') {
      navigate('/setup');
    } else if (item.id === 'history') {
      navigate('/history');
    } else {
      // Handle other routes
    }
  };

  const getActiveItem = () => {
    if (location.pathname === '/profile') return 'profile';
    if (location.pathname === '/') return 'technical';
    if (location.pathname === '/setup') return 'setup';
    if (location.pathname === '/history') return 'history';
    return undefined;
  };

  return (
    <AsideHeader
      logo={{ text: 'Interview-AI' }}
      menuItems={[
        {
          id: 'technical',
          title: 'Dashboard',
          icon: Code,
          current: getActiveItem() === 'technical',
          onItemClick: () => handleItemClick({id: 'technical'})
        },
        {
          id: 'setup',
          title: 'Analyze New Data',
          icon: FilePlus,
          current: getActiveItem() === 'setup',
          onItemClick: () => handleItemClick({id: 'setup'})
        },
        {
          id: 'history',
          title: 'History',
          icon: History,
          current: getActiveItem() === 'history',
          onItemClick: () => handleItemClick({id: 'history'})
        },
        { type: 'divider' },
        {
          id: 'profile',
          title: 'Profile',
          icon: User,
          current: getActiveItem() === 'profile',
          onItemClick: () => handleItemClick({id: 'profile'})
        },
        {
          id: 'logout',
          title: 'Logout',
          icon: LogOut,
          onItemClick: () => handleItemClick({id: 'logout'})
        }
      ]}
      onItemClick={handleItemClick}
      renderContent={() => children}
    />
  );
};
