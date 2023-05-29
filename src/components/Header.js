import React from "react";
import logo from '../images/logotip_mesto.svg'

function Header() {
  return(
    <header className="header">
      <img className="header__logo"
        src={logo} 
        alt="Лого Место" />
    </header>
    )
}
export default Header