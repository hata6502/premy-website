import {
  ArrowDownTrayIcon,
  DocumentTextIcon,
  PaintBrushIcon,
} from "@heroicons/react/24/outline";
import {
  FunctionComponent,
  MouseEventHandler,
  RefCallback,
  Suspense,
  useState,
} from "react";
import { PremyDialog } from "./PremyDialog";

const faqs = [
  {
    title: "油彩ドット絵メーカー",
    url: "https://oil-pixel.hata6502.com/",
  },
  {
    title: "写真地図",
    url: "https://almap.hata6502.com/",
  },
];

const tweetIDsURL =
  "https://script.google.com/macros/s/AKfycbyK3emdpEBLSHMZt9Osw_U7fvCvToYBrpyKQDQ4-uxmeWZbwBb3BybuT0h824ZEavUjuA/exec";

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
        <div className="mt-16">
          <h2 className="flex items-center gap-x-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            premy
            <img src="favicon.png" className="inline w-24" />
          </h2>

          <p className="mt-8">指スマホでもお絵かきできます。</p>

          <div className="mt-8">
            <Actions
              isAppInstalled={isAppInstalled}
              onOpenCanvasButtonClick={handleOpenCanvasButtonClick}
            />
          </div>
        </div>

        <div className="mt-8">
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

        <Suspense>
          <div className="mt-8">
            <Tweets />
          </div>

          <div className="mt-16">
            <Actions
              isAppInstalled={isAppInstalled}
              onOpenCanvasButtonClick={handleOpenCanvasButtonClick}
            />
          </div>
        </Suspense>

        <footer className="mt-16">
          <p className="text-xs leading-5 text-gray-500">
            {new Date().getFullYear()}
            &nbsp;
            <a
              href="https://twitter.com/hata6502"
              target="_blank"
              className="hover:text-gray-600"
            >
              ムギュウ
            </a>
            &emsp;
            <a
              href="https://kiyac.app/privacypolicy/DyJAghMFYlyPRtyxTB1X"
              target="_blank"
              className="hover:text-gray-600"
            >
              プライバシーポリシー
            </a>
          </p>
        </footer>

        <Suspense>
          <div className="mt-32">
            <Cosenses />
          </div>

          <div className="mt-16">
            <Actions
              isAppInstalled={isAppInstalled}
              onOpenCanvasButtonClick={handleOpenCanvasButtonClick}
            />
          </div>
        </Suspense>
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
        href="https://scrapbox.io/hata6502/premy%E3%82%A2%E3%83%97%E3%83%AA%E3%82%92%E3%82%B9%E3%83%9E%E3%83%9B%E3%81%AB%E3%82%A4%E3%83%B3%E3%82%B9%E3%83%88%E3%83%BC%E3%83%AB%E3%81%99%E3%82%8B"
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

  const refCallback: RefCallback<HTMLDivElement> = (ref) => {
    if (!ref || !tweetIDs) {
      return;
    }

    for (const tweetID of tweetIDs) {
      const tweetElement = document.createElement("div");
      // @ts-expect-error
      twttr.widgets.createTweet(tweetID, tweetElement);

      ref.append(tweetElement);
    }
  };

  return (
    <div
      ref={refCallback}
      className="mt-2 grid grid-cols-1 gap-4 md:grid-cols-3"
    />
  );
};

let cosenses:
  | { projectName: string; title: string; image?: string }[]
  | undefined;
const Cosenses: FunctionComponent = () => {
  if (!cosenses) {
    throw (async () => {
      try {
        const cosenseResponse = await fetch("cosense.json");
        if (!cosenseResponse.ok) {
          throw new Error("Failed to fetch cosense.json");
        }
        const cosense = await cosenseResponse.json();

        cosenses = shuffled(
          cosense.relatedPages.links1hop
            // @ts-expect-error
            .map((link) => ({ ...link, projectName: "hata6502" }))
        );
      } catch (exception) {
        console.error(exception);
        cosenses = [];
      }
    })();
  }

  return (
    <div className="grid grid-cols-1 gap-x-4 gap-y-4 md:grid-cols-3">
      {cosenses.map(({ projectName, title, image }) => (
        <div key={`${projectName}-${title}`} className="group relative">
          <span className="text-sm text-gray-700">{title}</span>

          <div className="h-56 w-full overflow-hidden rounded-md group-hover:opacity-75 lg:h-72 xl:h-80">
            <img
              src={image}
              alt={title}
              className="h-full w-full object-contain object-top"
            />

            <a
              href={`https://scrapbox.io/${encodeURIComponent(
                projectName
              )}/${encodeURIComponent(title)}`}
              target="_blank"
              className="absolute inset-0"
            />
          </div>
        </div>
      ))}
    </div>
  );
};

function shuffled<Type>(array: Type[]) {
  const copied = [...array];

  for (let i = copied.length - 1; i >= 1; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copied[i], copied[j]] = [copied[j], copied[i]];
  }

  return copied;
}
