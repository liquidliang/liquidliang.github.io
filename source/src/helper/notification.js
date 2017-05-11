BCD.addEvent('subscribePush', function (fabPushElement) {
  //Push notification button
  var tipsElement = fabPushElement.prev();
  //To check `push notification` is supported or not
  var isPushSupported = function () {
    //To check `push notification` permission is denied by user
    if (!window.Notification || Notification.permission === 'denied') {
      console.log('User has blocked push notification.');
      return;
    }

    //Check `push notification` is supported or not
    if (!('PushManager' in window)) {
      console.log('Sorry, Push notification isn\'t supported in your browser.');
      return;
    }
    //Click event for subscribe push
    fabPushElement.on('click', function () {
      var isSubscribed = (fabPushElement.val() === 'true');
      if (isSubscribed) {
        unsubscribePush();
      } else {
        subscribePush();
      }
    });
    //Get `push notification` subscription
    //If `serviceWorker` is registered and ready
    navigator.serviceWorker.ready
      .then(function (registration) {
        registration.pushManager.getSubscription()
          .then(function (subscription) {
            //If already access granted, enable push button status
            //Tell application server to delete subscription
            if (subscription) {
              changePushStatus(true);
            } else {
              changePushStatus(false);
            }
          })
          .catch(function (error) {
            console.error('Error occurred while enabling push ', error);
          });
      });
  }

  // Ask User if he/she wants to subscribe to push notifications and then
  // ..subscribe and send push notification
  function subscribePush() {
    navigator.serviceWorker.ready.then(function (registration) {
      if (!registration.pushManager) {
        console.log('Your browser doesn\'t support push notification.');
        return false;
      }

      //To subscribe `push notification` from push manager
      registration.pushManager.subscribe({
          userVisibleOnly: true //Always show notification when received
        })
        .then(function (subscription) {
          console.info('Push notification subscribed.');
          console.log(subscription);
          saveSubscriptionID(subscription);
          changePushStatus(true);
        })
        .catch(function (error) {
          changePushStatus(false);
          console.error('Push notification subscription error: ', error);
        });
    })
  }

  // Unsubscribe the user from push notifications
  function unsubscribePush() {
    navigator.serviceWorker.ready
      .then(function (registration) {
        //Get `push subscription`
        registration.pushManager.getSubscription()
          .then(function (subscription) {
            //If no `push subscription`, then return
            if (!subscription) {
              console.log('Unable to unregister push notification.');
              return;
            }

            //Unsubscribe `push notification`
            subscription.unsubscribe()
              .then(function () {
                console.info('Push notification unsubscribed.');
                console.log(subscription);
                deleteSubscriptionID(subscription);
                changePushStatus(false);
              })
              .catch(function (error) {
                console.error(error);
              });
          })
          .catch(function (error) {
            console.error('Failed to unsubscribe push notification.');
          });
      })
  }

  //To change status
  function changePushStatus(status) {
    fabPushElement.val(status);
    if (status) {
      tipsElement.html('您未订阅，订阅后您将可以收到更新提示');
      fabPushElement.removeClass('btn-warning').addClass('btn-success').html('订阅');
    } else {
      tipsElement.html('您已订阅，取消订阅后您将收不到更新提示！');
      fabPushElement.removeClass('btn-success').addClass('btn-warning').html('取消订阅');
    }
  }


  function saveSubscriptionID(subscription) {
    var subscription_id = subscription.endpoint.split('gcm/send/')[1];

    console.log("Subscription ID", subscription_id);

    fetch(' http://119.29.150.243:3333/api/users', {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user_id: subscription_id
      })
    });
  }

  function deleteSubscriptionID(subscription) {
    var subscription_id = subscription.endpoint.split('gcm/send/')[1];

    fetch(' http://119.29.150.243:3333/api/user/' + subscription_id, {
      method: 'delete',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
  }

  isPushSupported(); //Check for push notification support
});
