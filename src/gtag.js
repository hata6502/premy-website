window.dataLayer = window.dataLayer || [];

function gtag() {
  dataLayer.push(arguments);
}

gtag("js", new Date());
gtag("config", "G-4FKY7GNNYY");

addEventListener("error", (event) => {
  gtag("event", "exception", {
    description: event.message,
    fatal: true,
  });
});

addEventListener("unhandledrejection", (event) => {
  gtag("event", "exception", {
    description: String(event.reason),
    fatal: false,
  });
});
