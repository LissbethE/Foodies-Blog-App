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
const signupForm = document.querySelector('.form--signup');
const loginForm = document.querySelector('.form--login');
const logoutBtn = document.querySelector('.btn--Logout');

const formUserData = document.querySelector('.form-user-data');
const btnDeleteMe = document.getElementById('btn-deleteMe');

///////////////////////////////////
const signup = async function (name, email, password, passwordConfirm) {
  console.log('hola');

  await axios
    .post('/users/signup', {
      name,
      email,
      password,
      passwordConfirm,
    })
    .then(function (response) {
      showAlert('success', 'Inicio de sesión exitoso! 🎉');

      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    })
    .catch(function (error) {
      console.log(error);

      showAlert('error', `💥 ¡Algo salió muy mal!`);
    });
};

/*
const signup = async function (name, email, password, passwordConfirm) {
  try {
    console.log('hola');

    const res = await axios({
      method: 'POST',
      url: '/users/signup',
      data: {
        name,
        email,
        password,
        passwordConfirm,
      },
    });

    console.log(res, 'hola');

    if (res.data.status === 'success') {
      showAlert('success', 'Inicio de sesión exitoso! 🎉');

      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    console.log(err);
    showAlert('error', `💥 ¡Algo salió muy mal!`);
  }
};*/

const login = async function (email, password) {
  try {
    const res = await axios({
      method: 'POST',
      url: '/users/login',
      data: {
        email,
        password,
      },
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Inicio de sesión exitoso! 🎉');

      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    showAlert('error', `💥 Contraseña y email no coinciden`);
  }
};

const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: '/users/logout',
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Cierre de sesión completado con éxito! 🎉');

      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    showAlert('error', `${err.response.data.message} 💥¡Algo salió muy mal!`);
  }
};

//* Updating user data: name and photo
const updateSettings = async function (data) {
  try {
    const res = await axios.patch('/users/updateMe', data);

    if (res.data.status === 'success') {
      showAlert('success', 'Tus datos han sido actualizados con éxito!🎉');

      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    showAlert(
      'error',
      `${err.response.data.message}💥 No se pudo realizar la acción. Por favor, inténtalo de nuevo más tarde.`,
    );
  }
};

//* Eliminar cuenta
const deleteMe = async function () {
  await axios
    .delete('/users/deleteMe')
    .then((response) => {
      showAlert('success', 'Tu cuenta ha sido eliminada correctamente. 😢');

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
};

///////////////////////////////////
///////////////////////////////////

//* Signup Fomr
if (signupForm) {
  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('passwordConfirm').value;

    signup(name, email, password, passwordConfirm);
  });
}

//* Login Form
if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    login(email, password);
  });
}

//*  Logout user
if (logoutBtn) {
  logoutBtn.addEventListener('click', logout);
}

//* Updating user data: name and photo. form
if (formUserData) {
  formUserData.addEventListener('submit', function (e) {
    e.preventDefault();

    ///////////////////////////////////
    const form = new FormData();

    form.append('name', document.getElementById('name').value);
    form.append('photo', document.getElementById('photo').files[0]);

    ///////////////////////////////////
    updateSettings(form);
  });
}

//* btn para eliminar la cuenta
if (btnDeleteMe) {
  btnDeleteMe.addEventListener('click', deleteMe);
}
