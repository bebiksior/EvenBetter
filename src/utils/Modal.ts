type ModalContent = {
  title: string;
  content: string;
};

const generateModal = ({ title, content }: ModalContent): HTMLDivElement => {
  const modal = document.createElement("div");
  modal.classList.add("evenbetter-modal");

  modal.innerHTML = `
      <div class="evenbetter-modal__content">
          <div class="evenbetter-modal__content-header">
              <h2 class="evenbetter-modal__content-header-title"></h2>
          </div>
          <div class="evenbetter-modal__content-body">
              <p class="evenbetter-modal__content-body-text"></p>
              <button class="evenbetter-modal__content-body-close">
                  Close
              </button>
          </div>
      </div>
    `;

  modal.querySelector(".evenbetter-modal__content-header-title").textContent =
    title;
  modal.querySelector(".evenbetter-modal__content-body-text").innerHTML =
    content;

  modal.setAttribute("data-modal-title", title);

  modal
    .querySelector(".evenbetter-modal__content-body-close")
    ?.addEventListener("click", closeModal);

  return modal;
};

const htmlEncode = (str: string): string => {
  return String(str).replace(/[^\w. ]/gi, (c) => {
    return "&#" + c.charCodeAt(0) + ";";
  });
};

const isModalOpen = (): boolean => {
  return document.querySelector(".evenbetter-modal") !== null;
};

const closeModal = (): void => {
  const modal = document.querySelector(".evenbetter-modal");
  modal?.remove();
};

const openModal = ({ title, content }: ModalContent): void => {
  if (isModalOpen()) {
    closeModal();
  }

  const modal = generateModal({ title, content });
  document.body.appendChild(modal);
};

export { openModal };
