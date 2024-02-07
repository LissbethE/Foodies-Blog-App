/* eslint-disable */

///////////////////////////////////
// A L E R T

export const hideAlert = () => {
  const el = document.querySelector('.alert');

  if (el) el.parentElement.removeChild(el);
};

// Type is "Success" or "Error"
export const showAlert = (type, message, time = 7) => {
  hideAlert();

  const markup = `<div class="alert alert--${type}">${message}</div>`;
  document.querySelector('body').insertAdjacentHTML('afterbegin', markup);

  window.setTimeout(hideAlert, time * 1000);
};

///////////////////////////////////
// DOM ElEMENTS
//const account__list = document.querySelector('.account__list');

const addIngredBtn = document.getElementById('addIngredBtn');
const form__recipeList = document.querySelector('.form__recipeList');
const form__recipeItem = document.querySelector('.form__recipeItem');

const formCreateRecipe = document.querySelector('.formCreateRecipe');
const deleteRecipe = document.getElementById('deleteRecipe');

///////////////////////////////////
if (addIngredBtn) {
  addIngredBtn.addEventListener('click', function () {
    const newIngred = form__recipeItem.cloneNode(true);

    let input0 = newIngred.children[0];
    let input1 = newIngred.children[1];
    input0.value = '';
    input1.value = '';

    form__recipeList.appendChild(newIngred);
  });
}

///////////////////////////////////

//* Create Recipe
const createRecipe = async function (data) {
  try {
    const res = await axios.post('/recipes/createRecipe', data);

    if (res.data.status === 'success' || res.status === 201) {
      showAlert('success', 'La receta se creó con éxito. 🎉');

      window.setTimeout(() => {
        location.assign('/myRecipe');
      }, 1500);
    }
  } catch (err) {
    showAlert(
      'error',
      `${err.response.data.message}💥 No se pudo realizar la acción. Por favor, inténtalo de nuevo más tarde.`,
    );
  }
};

//* Delete Recipe
if (deleteRecipe) {
  deleteRecipe.addEventListener('click', async function (e) {
    const clicked = e.target;

    if (!clicked) return;

    const recipeID = clicked.getAttribute('data-recipeid');

    await axios
      .delete(`/recipes/deleteRecipe/${recipeID}`)
      .then((response) => {
        showAlert('success', 'Tu receta ha sido eliminada con éxito. 🎉');

        window.setTimeout(() => {
          location.assign('/');
        }, 1500);
      })
      .catch((error) => {
        showAlert(
          'error',
          `${err.response.data.message}💥 No se pudo realizar la acción. Por favor, inténtalo de nuevo más tarde.`,
        );
      });
  });
}

///////////////////////////////////
if (formCreateRecipe) {
  formCreateRecipe.addEventListener('submit', function (e) {
    e.preventDefault();

    ///////////////////////////////////
    const form = new FormData();

    form.append('nombre', document.getElementById('nombre').value);
    form.append('recipePhoto', document.getElementById('recipePhoto').files[0]);
    form.append('tipo', document.getElementById('tipo').value);
    form.append('dificultad', document.getElementById('dificultad').value);
    form.append('comensales', document.getElementById('comensales').value);
    form.append('plato', document.getElementById('plato').value);
    form.append('duracion', document.getElementById('duracion').value);
    form.append('costo', document.getElementById('costo').value);
    form.append('resumen', document.getElementById('resumen').value);
    form.append('preparacion', document.getElementById('preparacion').value);
    form.append('secretRecipe', document.getElementById('visible').value);

    const userId = document.getElementById('dataUser').dataset.user;
    form.append('user', userId);

    ///////////////////////////////////
    const recipeItem = Array.from(
      document.querySelectorAll('.form__recipeItem'),
    );

    const ingredientes = recipeItem.map(
      (item) => `${item.children[0].value}\n ${item.children[1].value}`,
    );

    form.append('ingredientes', ingredientes);

    ///////////////////////////////////

    createRecipe(form);
  });
}

///////////////////////////////////
/*
account__list.addEventListener('click', (e) => {
  const clicked = e.target.closest('.account__item');

  if (!clicked) return;

  // Remove active classes
  //tabs.forEach((btn) => btn.classList.remove('menu-box__tab-active'));
  // tabsContent.forEach((c) => c.classList.remove('menu-box__content-active'));

  // Activate tabs
  clicked.classList.add('.account__item--active');
  // clicked.children.classList.add('.account__link--active');

  console.log('click', clicked, clicked.children);
});*/
