import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom'
import * as sessionActions from '../../store/session';
import OpenModalButton from '../OpenModalButton';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';
import { useHistory } from 'react-router-dom'
import './Navigation.css'

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const history = useHistory();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();

  const openMenu = () => {
    if (showMenu) return;
    setShowMenu(true);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('click', closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
    closeMenu();
    history.push('/')
  };

  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

  return (
    <div className='full-profile'>
      <button className='bars-profile-button' onClick={openMenu}>
      <i class="fa-solid fa-bars"></i><i className="fas fa-user-circle" />
      </button>
      <ul className={ulClassName} ref={ulRef}>
        {user ? (
          <div className='open-button-loggedin'>
            <li className='upper-text'>Hello, {user.firstName}</li>
            <li className='upper-text'>{user.email}</li>
            <li><Link className='manage-spots-box' to='/spots/current'><p className='manage-spots-link'>Manage Spots</p></Link></li>
            <li className='log-out-box'>
              <button className='log-out' onClick={logout}>Log Out</button>
            </li>
          </div>
        ) : (
          <div className='open-button-loggedout'>
            <li className='log-in-text'>
              <OpenModalButton  textColor='black' className='log-in-button'
                buttonText="Log In"
                onButtonClick={closeMenu}
                modalComponent={<LoginFormModal />}
              />
            </li>
            <li>
              <OpenModalButton
                textColor='black'
                buttonText="Sign Up"
                onButtonClick={closeMenu}
                modalComponent={<SignupFormModal />}
              />
            </li>
          </div>
        )}
      </ul>
    </div>
  );
}

export default ProfileButton;