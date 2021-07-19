'use strict';

const SERVER_URL = `http://localhost:3000`;

const socket = io(SERVER_URL);

const lastOffersList = document.querySelector(`.tickets-list__last`);
const popularOffersList = document.querySelector(`.tickets-list__popular`);

const createOffer = (offer, index) => {

  const newOffer = document.createElement(`div`);

  newOffer.innerHTML = `
        <li class="tickets-list__item">
          <div class="ticket-card ticket-card--color${index >= 9 ? index + 1 : `0${index + 1}`}">
            <div class="ticket-card__img">
              <img src="${offer.picture !== `` ? `/img/${offer.picture}` : `/img/blank.png`}" alt=${offer.title}>
            </div>
            <div class="ticket-card__info">
              <span class="ticket-card__label">${offer.type === `OFFER` ? `Куплю` : `Продам`}</span>
              <div class="ticket-card__categories">
                ${offer.categories.reduce((acc, category) => `${acc}<a href="/offers/category/${category.id}">${category.name}</a>`, "")}
              </div>
              <div class="ticket-card__header">
                <h3 class="ticket-card__title"><a href="/offers/${offer.id}">${offer.title}</a></h3>
                <p class="ticket-card__price"><span class="js-sum">${offer.sum}</span> ₽</p>
              </div>
              <div class="ticket-card__desc">
                <p>${offer.description}</p>
              </div>
            </div>
          </div>
        </li>`

  return newOffer.firstElementChild;
}

socket.addEventListener(`last`, (offers) => {
  lastOffersList.innerHTML = ``;

  offers.forEach((offer, index) => {
    lastOffersList.appendChild(createOffer(offer, index));
  })
});

socket.addEventListener(`popular`, (offers) => {
  popularOffersList.innerHTML = ``;

  offers.forEach((offer, index) => {
    popularOffersList.appendChild(createOffer(offer, index));
  })
});

socket.addEventListener(`connect`, () => {
  console.log(`Подключено`);
});

socket.addEventListener(`disconnect`, () => {
  console.log(`Отключён`);
});
