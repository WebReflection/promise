const {AbortController, Promise} = require('../cjs');

const controller = new AbortController;
const promise = new Promise(
  (resolve, reject) => {
    setTimeout(resolve, 100, 'automatically');
  },
  controller
);

setTimeout(
  () => {
    const value = Math.random();
    controller.resolve(value);
    promise.then(result => {
      console.assert(result === value, 'controller.resolve(value)');
      let invoked = false;
      const controller = new AbortController;
      const promise = new Promise(
        (resolve, reject) => {
          const t = setTimeout(resolve, 100, 'automatically');
          return () => { clearTimeout(t); invoked = true; };
        },
        controller
      );
      promise.catch(({currentTarget: {reason}}) => {
        console.assert(invoked === 'invoked');
        console.assert(reason === 'nope');
        console.assert(
          new Promise(Object) instanceof Promise,
          'new Promise instanceof Promise'
        );
        console.assert(
          new Promise(Object).then(Object) instanceof Promise,
          'new Promise#then() instanceof Promise'
        );
        const controller = new AbortController;
        new Promise(
          (resolve, reject) => {
            setTimeout(resolve, 50, 'automatically');
          },
          controller
        ).then(result => {
          console.assert(result === 'automatically', 'resolved promise');
          new Promise(
            (resolve, reject) => {
              setTimeout(reject, 50, new Error('nope'));
            },
            controller
          ).catch(error => {
            console.assert(error.message === 'nope', 'rejected promise');
            Promise.resolve('yup').then(result => {
              console.assert(result === 'yup', 'Promise.resolve');
              console.log('\x1b[1mOK\x1b[0m');
            });
          });
        });
      });
      controller.abort('nope', 'controller.abort(value)');
    });
  },
  50
);
