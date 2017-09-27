
import React, {ProtoTypes} from 'react';
import {NavLink} from 'react-router-dom';

const Header = () => {
  return (
    <nav>
      <NavLink to="/" activeClassName="active">Home</NavLink>
      {" | "}
      <NavLink to="/courses" activeClassName="active">Environments</NavLink>
      {" | "}
      <NavLink to="/about" activeClassName="active">About</NavLink>
    </nav>
  );
};

export default Header;