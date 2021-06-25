function listener(details) {
  console.log('closing this zoombie', details);
  browser.tabs.remove(details.tabId);
} 

browser.webNavigation.onDOMContentLoaded.addListener(
  listener,
  {url: [
    { hostSuffix: "zoom.us" },
    { pathContains: "/postattendee?" }
  ]}
);
