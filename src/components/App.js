
import React from "react";
import '../index.css';
import Header from './Header';
import Main from './Main';
import Footer from './Footer'
import ImagePopup from "./ImagePopup";
import CurrentUserContext from "../contexts/CurrentUserContext";
import api from '../utils/Api';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import DeleteConfirmPopup from "./DeleteConfirmPopup";

function App() {

  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = React.useState(false); //переменные состояния
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = React.useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
  const [isDeleteConfirmPopupOpen, setIsDeleteConfirmPopupOpen] = React.useState(false);
  const [deletedCard, setDeletedCard] = React.useState({});
  const [selectedCard, setSelectedCard] = React.useState({}); //стейт переменная для отображения большой картинки
  const [currentUser, setCurrentUser] = React.useState({}); 
  const [cards, setCards] = React.useState([]);
 

  React.useEffect(() => {
    api.getProfile()
    .then((profileUserInfo) => setCurrentUser(profileUserInfo))
    .catch((error) => console.log(`Ошибка: ${error}`))

    api.getInitialCards()
    .then((data) => {
       setCards(
        data.map((card) => ({
          _id: card._id,
          name: card.name,
          link: card.link,
          likes: card.likes,
          owner: card.owner,
        }))
      )
    })
    .catch((error) => console.log(`Ошибка: ${error}`))
  }, [])

  function handleEditProfileClick() {  //обработчики переменных состояния
     setIsEditProfilePopupOpen(true); //поменяли состояние
  }

   function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
   }

   function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);

   }

   //обработчик пропса onClose компонента PopupWithForm 
   function closeAllPopups() {
    setIsEditProfilePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsDeleteConfirmPopupOpen(false);
    setDeletedCard({})
    setSelectedCard({})

   }

    // Функция при клике на лайк
   function handleCardLike(card) {
    // проверяем, есть ли уже лайк на этой карточке
    const isLiked = card.likes.some(i => i._id === currentUser._id)

    if (isLiked) {
      api.deleteLike(card._id)
      .then((newCard) => 
        setCards((state) =>
        state.map((c) => (c._id === card._id ? newCard : c))
      )
      )
      .catch((error) => console.log(`Ошибка: ${error}`))  
   } else {
    api.addLike(card._id)
    .then((newCard) => 
        setCards((state) =>
        state.map((c) => (c._id === card._id ? newCard : c))
      )
      )
      .catch((error) => console.log(`Ошибка: ${error}`))
   }
  }
   //Функция удаления карточки
  function handleCardDelete(card) {
    api.deleteCard(card._id)
    .then(() => {
    setCards((state) => state.filter((item) => item._id !== card._id)) //методом filter: создала копию массива, исключив из него удалённую карточку. 
    closeAllPopups()  
  })
  .catch((error) => console.log(`Ошибка: ${error}`))
  }
  //обработчик обновления данных пользователя
  function handleUpdateUser(newUserInfo) {
    api.editProfile(newUserInfo)
    .then((data) => {
      setCurrentUser(data)
      closeAllPopups()
    })
    .catch((error) => console.log(`Ошибка: ${error}`))
  }
   //обновление аватара
  function handleUpdateAvatar(newAvatar) {
    api.changeUserAvatar(newAvatar)
      .then((data) => {
        setCurrentUser(data)
        closeAllPopups()
      })
      .catch((error) => console.log(`Ошибка: ${error}`))
      }
  //обработчик добавления новой карточки
  function handleAddPlaceSubmit(data) {
      api.addCard(data)
          .then((newCard) => {
            setCards([newCard, ...cards]) //обновила стейт cards с помощью расширенной копии текущего массива 
            closeAllPopups()
          })
          .catch((error) => console.log(`Ошибка: ${error}`))
      }
    
  return (
  <CurrentUserContext.Provider value={currentUser}>
  <div className="root">
    <div className="page">
      
      <Header />
      <Main
        onEditProfile={handleEditProfileClick} //пропсы Main
        onEditAvatar={handleEditAvatarClick}
        onAddPlace={handleAddPlaceClick}
        onDeleteConfirmPopup={setIsDeleteConfirmPopupOpen}
        onDeletedCard={setDeletedCard}   
        onCardClick={setSelectedCard}
        onCardLike={handleCardLike}
        
        cards={cards}    
      />
      <EditProfilePopup isOpen={isEditProfilePopupOpen} 
                      onClose={closeAllPopups}
                      onUpdateUser={handleUpdateUser} /> 

      <EditAvatarPopup isOpen={isEditAvatarPopupOpen} 
                     onClose={closeAllPopups}
                     onUpdateAvatar={handleUpdateAvatar} /> 
      <AddPlacePopup onAddPlace={handleAddPlaceSubmit}
                   isOpen={isAddPlacePopupOpen}
                   onClose={closeAllPopups} />  
      <DeleteConfirmPopup 
                      onClose={closeAllPopups}
                      isOpen={isDeleteConfirmPopupOpen}
                      onCardDelete={handleCardDelete}
                      card={deletedCard}/>              
   
      <ImagePopup card={selectedCard} onClose={closeAllPopups} />
        </div>
         <Footer />
       </div>
    </CurrentUserContext.Provider>

  );
}

export default App;
