import { useState } from "react";
import { Link } from "react-router-dom";

function Register(){
    return(
        <section className="login">
        <h2 className="login__title">Регистрация</h2>
        <form className="login__form">
            <input className="login__input" 
                   type="email"
                   placeholder="Email"
                   required/>
            <input className="login__input"
                   type="password"
                   placeholder="Пароль"
                   required/>
            <button className="login__button" type="submit">Зарегистрироваться</button>

        </form>
        <p className="login__text">Уже зарегистрированы? <Link to="/sign-in" className="login__link"> Войти </Link>
        </p>
        </section>
    )
}
export default Register