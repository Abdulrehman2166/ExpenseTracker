import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, Wallet, User } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <Wallet className="logo-icon" />
          <span>ExpenseTracker</span>
        </div>
        
        <div className="navbar-user">
          <div className="user-info">
            <User className="user-icon" size={20} />
            <span>{user?.name}</span>
          </div>
          <button onClick={logout} className="btn-logout" title="Logout">
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
