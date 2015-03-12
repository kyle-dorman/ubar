(function() {
'use strict';

var
  ubar_config = require('./config.js'),
  UbarStorage = require('./storage.js'),
  UbarDom = require('./dom.js'),
  device = require('./device.js'),
  ubarHelpers = require('./helpers.js'),
  Resolver = require('./resolver.js'),
  ubar_tracking = require('./tracking.js'),
  bean = require('bean'),
  moment = require('moment'),

  CONFIG = {},
  ubarStorage, // storage instance
  ubarDom, // dom instance
  resolver; // app deeplink resolver/handler

/**
 * Binds the events of Uber ON Banner Buttons
 *
 * @private
 * @method bindOnBannerButtonEvents
 */

function bindOnBannerButtonEvents () {
  var ubarComponentDiv    = document.querySelectorAll('.' + (CONFIG.component_class) )[0],
      onButton            = ubarComponentDiv.querySelectorAll('.' + (CONFIG.on_button_class) )[0],
      installAppButton    = ubarComponentDiv.querySelectorAll('.' +(CONFIG.install_class) )[0],
      closeBannerButton   = ubarComponentDiv.querySelectorAll('.' + (CONFIG.close_button_class) )[0];

  bean.on(onButton, 'touchstart', function (ev) {
    ev.preventDefault();

    ubarStorage.enable();

    ubar_tracking.turnUbarOn({ location : CONFIG.tracking_sending_banner});

    redirect(CONFIG.tracking_sending_banner);
  });

  bean.on(installAppButton, 'touchstart', function (ev) {
    ev.preventDefault();

    resolver.redirectToAppStore();
  });

  bean.on(closeBannerButton, 'touchstart', function (ev) {
    ev.preventDefault();

    ubarDom.remove();
    ubarStorage.disable();
  });
}

/**
 * Binds the events of Uber OFF Banner Buttons
 *
 * @private
 * @method bindOffBannerButtonEvents
 */
function bindOffBannerButtonEvents () {
  var ubarComponentDiv = document.querySelectorAll('.' + (CONFIG.component_class) )[0],
      offButton = ubarComponentDiv.querySelectorAll('.' + (CONFIG.off_class) )[0],
      openInAppButton = ubarComponentDiv.querySelectorAll('.' + (CONFIG.open_in_app_class) )[0],
      closeBannerButton = ubarComponentDiv.querySelectorAll('.' + (CONFIG.close_button_class) )[0];

  bean.on(offButton, 'touchstart', function (ev) {
    ev.preventDefault();

    ubarStorage.disable();
    ubar_tracking.turnUbarOff({ location: CONFIG.tracking_sending_banner });

  });

  bean.on(openInAppButton, 'touchstart', function (ev) {
    ev.preventDefault();

    redirect(CONFIG.tracking_returning_banner);
  });

  bean.on(closeBannerButton, 'touchstart', function (ev) {
    ev.preventDefault();

    ubarDom.remove();
    ubarStorage.clear();
  });
}

/**
* Attempts to redirect users to native app.
* If user remains in safari, presumes user
* doesn't have app, reset UBAR and redirect
* them to the app store.
*
* @private
* @method redirect
*/
function redirect (location) {
  var
    // successfully redirected to the app
    successCallback = function () { renderOffBanner(); },

     // fail to redirect to app, redirect to app store
    failureCallback = function () {
      ubarStorage.clear();
      ubar_tracking.attemptToRedirectToAppStore({ location: location });
    };

  ubarStorage.setRedirected();

  ubar_tracking.attemptToRedirectToApp({ location: location });

  resolver.redirectWithFallback(successCallback, failureCallback);

  ubarDom.remove();
}

/**
 * Renders the off banner and binds events
 *
 * @private
 * @method renderOffBanner
 */
function renderOffBanner() {
  ubarDom.renderBanner( CONFIG.returning_template_path ).then(function() {
    bindOffBannerButtonEvents();
    ubarDom.show();
    ubar_tracking.showReturningBanner();
  });
}

/**
 * Renders the on banner and binds events
 *
 * @private
 * @method renderOnBanner
 */
function renderOnBanner() {
  ubarDom.renderBanner( CONFIG.sending_template_path ).then(function() {
    bindOnBannerButtonEvents();
    ubarDom.show();
    ubar_tracking.showSendingBanner();
  });
}

/**
 * Set config times using Moment library
 *
 * @private
 * @method setConfigTime
 */
function setConfigTime (config) {
  config.enabled_time = ubarHelpers.getTimeInMoments( config.enabled_time );
  config.disabled_time = ubarHelpers.getTimeInMoments( config.disabled_time );
  config.manage_window_time = ubarHelpers.getTimeInMoments( config.manage_window_time );
  config.app_store_redirect = ubarHelpers.getTimeInMoments( config.app_store_redirect );

  return config;
}


/* Initialize UBAR with parameters set in config.js
 *
 * @public
 * @method init
 */
function init (user_config) {
  // TODO : user ubar = on param
  CONFIG = setConfigTime(ubarHelpers.extend( ubar_config, user_config ));

  if (device.isAppSupported(CONFIG)) {

    ubarStorage = new UbarStorage( CONFIG );
    ubarDom = new UbarDom( CONFIG );
    resolver = new Resolver( CONFIG );

    if (ubarStorage.isEnabled()) {

      ubarStorage.isUserRedirected() ? renderOffBanner() : redirect(CONFIG.tracking_immediate_redirection);

    } else if (!ubarStorage.isDisabled()) {
      renderOnBanner();
    }
  }
}

module.exports = {
  init : init,
  _bindOnBannerButtonEvents : bindOnBannerButtonEvents
};
})();
