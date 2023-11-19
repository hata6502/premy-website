import {
  ArrowDownTrayIcon,
  DocumentTextIcon,
  PaintBrushIcon,
  ShareIcon,
} from "@heroicons/react/24/outline";
import { FunctionComponent, MouseEventHandler, useState } from "react";
import { PremyDialog } from "./PremyDialog";

const faqs = [
  {
    title: "お題を見ながらお絵かきする",
    url: "https://scrapbox.io/hata6502/%E3%81%8A%E9%A1%8C%E3%82%92%E8%A6%8B%E3%81%AA%E3%81%8C%E3%82%89%E3%81%8A%E7%B5%B5%E3%81%8B%E3%81%8D%E3%81%99%E3%82%8B",
  },
  {
    title: "ChatGPTでアートセラピー",
    url: "https://scrapbox.io/hata6502/ChatGPT%E3%81%A7%E3%82%A2%E3%83%BC%E3%83%88%E3%82%BB%E3%83%A9%E3%83%94%E3%83%BC",
  },
  {
    title: "お絵かきをScrapboxで共有しよう",
    url: "https://scrapbox.io/hata6502/%E3%81%8A%E7%B5%B5%E3%81%8B%E3%81%8D%E3%82%92Scrapbox%E3%81%A7%E5%85%B1%E6%9C%89%E3%81%97%E3%82%88%E3%81%86",
  },
  {
    title: "premy免責事項",
    url: "https://scrapbox.io/hata6502/premy%E5%85%8D%E8%B2%AC%E4%BA%8B%E9%A0%85",
  },
];

let examples:
  | { projectName: string; title: string; image?: string }[]
  | undefined;
export const App: FunctionComponent<{
  premyDB?: IDBDatabase;
}> = ({ premyDB }) => {
  if (!examples) {
    throw (async () => {
      const premyResponse = await fetch("premy.json");
      if (!premyResponse.ok) {
        throw new Error("Failed to fetch premy.json");
      }
      const premy = await premyResponse.json();

      examples = premy.relatedPages.links1hop
        // @ts-expect-error
        .map((link) => ({
          ...link,
          projectName: "premy",
        }))
        .sort(() => Math.random() - 0.5)
        .slice(0, 15);
    })();
  }

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
      <div className="bg-white mx-auto max-w-4xl px-6 lg:px-8">
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

        <div className="pt-16 sm:pt-24">
          <div className="mt-2 grid grid-cols-1 gap-x-4 gap-y-4 md:grid-cols-3">
            {examples.map(({ projectName, title, image }) => (
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
        </div>

        <div className="pt-16 sm:pt-24">
          <Actions
            isAppInstalled={isAppInstalled}
            onOpenCanvasButtonClick={handleOpenCanvasButtonClick}
          />
        </div>

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

        <footer className="py-8">
          <p className="text-xs leading-5 text-gray-500">
            {`${new Date().getFullYear()} `}

            <a
              href="https://twitter.com/hata6502"
              target="_blank"
              className="hover:text-gray-600"
            >
              hata6502
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

    {isAppInstalled ? (
      <a
        href="https://scrapbox.io/premy/%E6%8A%95%E7%A8%BF%E3%81%99%E3%82%8B"
        target="_blank"
        className="inline-flex items-center gap-x-2 text-sm font-semibold text-gray-900"
      >
        投稿する
        <ShareIcon className="h-6 w-6" aria-hidden="true" />
      </a>
    ) : (
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
