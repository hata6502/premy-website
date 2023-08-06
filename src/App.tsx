import {
  ArrowDownTrayIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";
import { FunctionComponent, useState } from "react";
import { PremyDialog } from "./PremyDialog";

const faqs = [
  {
    title: "A drawing app for anyone",
    url: "https://help.hata6502.com/--62645189218beb0020cfe38d",
  },
  {
    title: "画面分割でお題を見ながらお絵かきする",
    url: "https://help.hata6502.com/--63a6d632846866001dede17a",
  },
  {
    title: "お絵かき自己診断",
    url: "https://help.hata6502.com/--63a6d744e87e17001d2de628",
  },
  {
    title: "premy免責事項",
    url: "https://help.hata6502.com/--61818b0489e586002278f634",
  },
  {
    title: "お絵かきをScrapboxで公開しよう",
    url: "https://help.hata6502.com/--63a6d7b54f80c3001d3a6981",
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

          <div className="mt-10 flex items-center gap-x-6">
            {!isAppInstalled && (
              <a
                href="https://help.hata6502.com/--61818b0489e586002278f64c"
                target="_blank"
                className="inline-flex items-center gap-x-2 text-sm font-semibold leading-6 text-gray-900"
              >
                インストール
                <ArrowDownTrayIcon className="h-6 w-6" aria-hidden="true" />
              </a>
            )}

            <button
              type="button"
              onClick={handleOpenCanvasButtonClick}
              className="rounded-md bg-neutral-900 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-neutral-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900"
            >
              お絵かきする
            </button>
          </div>
        </div>

        <div className="pt-16 sm:pt-24">
          <a
            href="https://scrapbox.io/premy/"
            target="_blank"
            className="text-sm font-medium text-neutral-900 hover:text-neutral-800"
          >
            投稿する
            <span aria-hidden="true"> &rarr;</span>
          </a>
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
