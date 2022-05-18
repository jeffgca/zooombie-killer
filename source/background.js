// Async function / closure so we can use await

(async () => {

  // functions

  // handler to catch data updates and update the action badge
  async function changeHandler(event) {
    console.log('changeHandler', event);
    await browser.browserAction.setBadgeText({ text: event.count.newValue });
  }

  async function listener(details) {
    let current = await browser.browserAction.getBadgeText({});
    let intCurrent = parseInt(current); // should only be an Int
    let next = intCurrent + 1;
    result.count = String(next);

    console.log('result', result);

    browser.storage.local.set(result);

    // console.log('>>>', current, intCurrent, next);
    // console.log('closing this zoombie', details);

    setTimeout(async () => {
      
      await browser.tabs.remove(details.tabId);
    }, 2000) // Pref?
  }

  // our extension homepage
  const homePage = './zooombie.html';

  // handle changes in the storage
  browser.storage.onChanged.addListener(changeHandler);

  // handle onclick by opening the extension page
  browser.browserAction.onClicked.addListener(async (tab, data) => {
    await browser.tabs.create({url: homePage });
  });

  // get some data from local storage
  let result = await browser.storage.local.get();

  if (!result || !result.count) {
    result = {count: "0"};
  }

  // initially set the badge Text
  browser.browserAction.setBadgeText({text: result.count});

  // set the badge text background 
  await browser.browserAction.setBadgeBackgroundColor({color: "rebeccapurple"});
  
  // handle when any tab loads the zoom postAttendee page eg
  // https://us02web.zoom.us/postattendee?mn=[...]
  browser.webNavigation.onDOMContentLoaded.addListener(
    listener,
    {url: [
      { hostSuffix: "zoom.us" },
      { pathContains: "/postattendee?" }
    ]}
  );
})()
