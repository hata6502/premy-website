import {
  ArrowDownTrayIcon,
  DocumentTextIcon,
  PaintBrushIcon,
} from "@heroicons/react/24/outline";
import {
  FunctionComponent,
  MouseEventHandler,
  Suspense,
  useEffect,
  useRef,
  useState,
} from "react";
import { PremyDialog } from "./PremyDialog";

const faqs = [
  {
    title: "油彩ドット絵メーカー",
    url: "https://oil-pixel.hata6502.com/",
  },
  {
    title: "お題を見ながらお絵かきする",
    url: "https://scrapbox.io/hata6502/%E3%81%8A%E9%A1%8C%E3%82%92%E8%A6%8B%E3%81%AA%E3%81%8C%E3%82%89%E3%81%8A%E7%B5%B5%E3%81%8B%E3%81%8D%E3%81%99%E3%82%8B",
  },
  {
    title: "ChatGPTでアートセラピー",
    url: "https://scrapbox.io/hata6502/ChatGPT%E3%81%A7%E3%82%A2%E3%83%BC%E3%83%88%E3%82%BB%E3%83%A9%E3%83%94%E3%83%BC",
  },
];

const tweetIDsURL =
  "https://script.google.com/macros/s/AKfycbx1Lec0RXfLou1Ixz3-hg6lFHoQdkTDSCFhtYIwQ9_OyWx36f3JYIxGdia9kLdx4DYe/exec";

export const App: FunctionComponent<{
  premyDB?: IDBDatabase;
}> = ({ premyDB }) => {
  const [isPremyDialogOpen, setIsPremyDialogOpen] = useState(false);
  const isAppInstalled = !matchMedia("(display-mode: browser)").matches;

  const handleOpenCanvasButtonClick = () => {
    window.gtag?.("event", "open");
    setIsPremyDialogOpen(true);
  };

  const handlePremyDialogClose = () => {
    setIsPremyDialogOpen(false);
  };

  return (
    <>
      <div className="mx-auto mb-8 px-6 lg:px-8 max-w-4xl bg-white">
        <div className="pt-16 sm:pt-24">
          <h2 className="flex items-center gap-x-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            premy
            <img src="favicon.png" className="inline w-24" />
          </h2>

          <div className="mt-10">
            <Actions
              isAppInstalled={isAppInstalled}
              onOpenCanvasButtonClick={handleOpenCanvasButtonClick}
            />
          </div>
        </div>

        <Suspense>
          <div className="pt-16 sm:pt-24">
            <Tweets />
          </div>

          <div className="pt-16 sm:pt-24">
            <Actions
              isAppInstalled={isAppInstalled}
              onOpenCanvasButtonClick={handleOpenCanvasButtonClick}
            />
          </div>
        </Suspense>

        <div className="py-8">
          <div className="divide-y divide-gray-900/10">
            {faqs.map(({ title, url }) => (
              <a
                key={title}
                href={url}
                target="_blank"
                className="flex items-center gap-x-2 py-6 text-gray-900"
              >
                <DocumentTextIcon className="h-6 w-6" aria-hidden="true" />
                <span className="text-base font-semibold leading-7">
                  {title}
                </span>
              </a>
            ))}
          </div>
        </div>

        <footer className="pt-8">
          <p className="text-xs leading-5 text-gray-500">
            {new Date().getFullYear()}
            &nbsp;
            <a
              href="https://twitter.com/hata6502"
              target="_blank"
              className="hover:text-gray-600"
            >
              hata6502
            </a>
            &emsp;
            <a
              href="https://scrapbox.io/hata6502/premy%E5%85%8D%E8%B2%AC%E4%BA%8B%E9%A0%85"
              target="_blank"
              className="hover:text-gray-600"
            >
              免責事項
            </a>
          </p>
        </footer>
      </div>

      <PremyDialog
        open={isPremyDialogOpen}
        premyDB={premyDB}
        onClose={handlePremyDialogClose}
      />
    </>
  );
};

const Actions: FunctionComponent<{
  isAppInstalled: boolean;
  onOpenCanvasButtonClick: MouseEventHandler;
}> = ({ isAppInstalled, onOpenCanvasButtonClick }) => (
  <div className="flex flex-wrap items-center gap-6">
    <button
      type="button"
      onClick={onOpenCanvasButtonClick}
      className="inline-flex items-center gap-x-2 rounded-md bg-neutral-900 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-neutral-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900"
    >
      お絵かきする
      <PaintBrushIcon className="h-6 w-6" aria-hidden="true" />
    </button>

    {!isAppInstalled && (
      <a
        href="https://scrapbox.io/hata6502/premy%E3%82%A2%E3%83%97%E3%83%AA%E3%82%92%E3%82%A4%E3%83%B3%E3%82%B9%E3%83%88%E3%83%BC%E3%83%AB%E3%81%99%E3%82%8B"
        target="_blank"
        className="inline-flex items-center gap-x-2 text-sm font-semibold text-gray-900"
      >
        インストール
        <ArrowDownTrayIcon className="h-6 w-6" aria-hidden="true" />
      </a>
    )}
  </div>
);

let tweetIDs: string[] | undefined;
const Tweets: FunctionComponent = () => {
  if (!tweetIDs) {
    throw (async () => {
      try {
        const tweetIDsResponse = await fetch(tweetIDsURL);
        if (!tweetIDsResponse.ok) {
          throw new Error(tweetIDsResponse.statusText);
        }
        tweetIDs = await tweetIDsResponse.json();
      } catch (exception) {
        console.error(exception);
        tweetIDs = [];
      }
    })();
  }

  const tweetContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!tweetContainerRef.current || !tweetIDs) {
      return;
    }
    const tweetContainerElement = tweetContainerRef.current;

    for (const tweetID of tweetIDs) {
      const tweetElement = document.createElement("div");
      // @ts-expect-error
      twttr.widgets.createTweet(tweetID, tweetElement);

      tweetContainerElement.append(tweetElement);
    }
  }, []);

  return (
    <div
      ref={tweetContainerRef}
      className="mt-2 grid grid-cols-1 gap-4 md:grid-cols-3"
    />
  );
};
