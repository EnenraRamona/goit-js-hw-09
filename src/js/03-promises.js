import Notiflix from "notiflix";


function createPromise(position, delay) {
      return new Promise((resolve, reject) => {
        const shouldResolve = Math.random() > 0.3;
        setTimeout(() => {
          if (shouldResolve) {
            resolve({ position, delay });
          } else {
            reject({ position, delay });
          }
        }, delay);
      });
    }

const form = document.querySelector('.form');
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      const delayInput = document.querySelector('input[name="delay"]');
      const stepInput = document.querySelector('input[name="step"]');
      const amountInput = document.querySelector('input[name="amount"]');

      const delay = Number(delayInput.value);
      const step = Number(stepInput.value);
      const amount = Number(amountInput.value);

      if (delayInput.checkValidity() && stepInput.checkValidity() && amountInput.checkValidity()) {
        Notiflix.Loading.standard('Creating promises...');

        const promises = [];
        for (let i = 1; i <= amount; i++) {
          promises.push(createPromise(i, delay + (i - 1) * step));
        }

        Promise.allSettled(promises)
          .then(results => {
            results.forEach((result, index) => {
              const { position, delay } = result.value || result.reason;
              if (result.status === 'fulfilled') {
                Notiflix.Notify.success(`✅ Fulfilled promise ${position} in ${delay}ms`);
              } else {
                Notiflix.Notify.failure(`❌ Rejected promise ${position} in ${delay}ms`);
              }
            });
          })
          .catch(error => {
            console.error(error);
            Notiflix.Notify.failure('An error occurred while creating promises');
          })
          .finally(() => {
            Notiflix.Loading.remove(500);
          });
      }
    });