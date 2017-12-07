if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register('./serviceWorker.js', { scope: "./" }) //setting scope of sw
    .then(function(registration) {
      console.info('Service worker is registered!');
      checkForPageUpdate(registration); // To check if new content is updated or not
    })
    .catch(function(error) {
      console.error('Service worker failed ', error);
    });
  }