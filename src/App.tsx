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
    title: "A drawing app for anyone",
    url: "https://scrapbox.io/hata6502/A_drawing_app_for_anyone",
  },
  {
    title: "画面分割でお題を見ながらお絵かきする",
    url: "https://scrapbox.io/hata6502/%E7%94%BB%E9%9D%A2%E5%88%86%E5%89%B2%E3%81%A7%E3%81%8A%E9%A1%8C%E3%82%92%E8%A6%8B%E3%81%AA%E3%81%8C%E3%82%89%E3%81%8A%E7%B5%B5%E3%81%8B%E3%81%8D%E3%81%99%E3%82%8B",
  },
  {
    title: "お絵かき自己診断",
    url: "https://scrapbox.io/hata6502/%E3%81%8A%E7%B5%B5%E3%81%8B%E3%81%8D%E8%87%AA%E5%B7%B1%E8%A8%BA%E6%96%AD",
  },
  {
    title: "premy免責事項",
    url: "https://scrapbox.io/hata6502/premy%E5%85%8D%E8%B2%AC%E4%BA%8B%E9%A0%85",
  },
  {
    title: "お絵かきをScrapboxで公開しよう",
    url: "https://scrapbox.io/hata6502/%E3%81%8A%E7%B5%B5%E3%81%8B%E3%81%8D%E3%82%92Scrapbox%E3%81%A7%E5%85%AC%E9%96%8B%E3%81%97%E3%82%88%E3%81%86",
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
      const hata6502Response = await fetch("hata6502.json");
      if (!hata6502Response.ok) {
        throw new Error("Failed to fetch hata6502.json");
      }
      const hata6502 = await hata6502Response.json();

      const premyResponse = await fetch("premy.json");
      if (!premyResponse.ok) {
        throw new Error("Failed to fetch premy.json");
      }
      const premy = await premyResponse.json();

      examples = [
        // @ts-expect-error
        ...hata6502.relatedPages.links1hop.map((link) => ({
          ...link,
          projectName: "hata6502",
        })),
        // @ts-expect-error
        ...premy.relatedPages.links1hop.map((link) => ({
          ...link,
          projectName: "premy",
        })),
      ]
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
              Tomoyuki Hata
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
