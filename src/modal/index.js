const generateModal = (title, content) => {
  const modal = document.createElement("div");
  modal.classList.add("evenbetter-modal");

  modal.innerHTML = `
    <div class="evenbetter-modal__content">
        <div class="evenbetter-modal__content-header">
            <h2 class="evenbetter-modal__content-header-title">${title}</h2>
        </div>
        <div class="evenbetter-modal__content-body">
            <p class="evenbetter-modal__content-body-text">${htmlEncode(
              content
            )}</p>
            <button class="evenbetter-modal__content-body-close">
                Close
            </button>
        </div>
    </div>
  `;

  modal
    .querySelector(".evenbetter-modal__content-body-close")
    .addEventListener("click", closeModal);

  return modal;
};

function htmlEncode(str) {
  return String(str).replace(/[^\w. ]/gi, function (c) {
    return "&#" + c.charCodeAt(0) + ";";
  });
}

const isModalOpen = () => {
  return document.querySelector(".evenbetter-modal") !== null;
};

const closeModal = () => {
  const modal = document.querySelector(".evenbetter-modal");
  modal.remove();
};

const openModal = (title, content) => {
  if (isModalOpen()) {
    closeModal();
  }

  const modal = generateModal(title, content);
  document.body.appendChild(modal);
};

export { openModal };
