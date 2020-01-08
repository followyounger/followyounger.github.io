/**
 * SnackBar.js
 * 
 * This small component is borrowed from 
 * https://codepen.io/wibblymat/pen/avAjq
 */


var createSnackbar = (function() {
  // Any snackbar that is already shown
  var previous = null;
  
  return function(config) {
    var message = config.message,
      actionText = config.actionText,
      action = config.action,
      duration = config.duration,
      mode = config.mode;

    if (previous) {
      previous.dismiss();
    }
    var snackbar = document.createElement('div');
    snackbar.className = 'paper-snackbar';
    if (mode === 'error') snackbar.classList.add('snackbar-error');
    if (mode === 'warning') snackbar.classList.add('snackbar-warning');
    if (mode === 'success') snackbar.classList.add('snackbar-suc');
    snackbar.dismiss = function() {
      this.style.opacity = 0;
    };
    var text = document.createTextNode(message);
    snackbar.appendChild(text);
    if (actionText) {
      if (!action) {
        action = snackbar.dismiss.bind(snackbar);
      }
      var actionButton = document.createElement('button');
      // actionButton.className = 'action';
      actionButton.className = 'rkmd-btn btn-flat ripple-effect';
      actionButton.innerHTML = actionText;
      actionButton.addEventListener('click', action);
      snackbar.appendChild(actionButton);
    }
    setTimeout(function() {
      if (previous === this) {
        previous.dismiss();
      }
    }.bind(snackbar), duration || 5000);
    
    snackbar.addEventListener('transitionend', function(event, elapsed) {
      if (event.propertyName === 'opacity' && this.style.opacity == 0) {
        this.parentElement.removeChild(this);
        if (previous === this) {
          previous = null;
        }
      }
    }.bind(snackbar));

    previous = snackbar;
    document.body.appendChild(snackbar);
    // In order for the animations to trigger, I have to force the original style to be computed, and then change it.
    getComputedStyle(snackbar).bottom;
    snackbar.style.bottom = '0px';
    snackbar.style.opacity = 1;
  };
})();