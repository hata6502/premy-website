import { FunctionComponent } from "react";

let examples: { title: string; image?: string }[] | undefined;
export const App: FunctionComponent = () => {
  if (!examples) {
    throw (async () => {
      const examplesResponse = await fetch("examples.json");
      if (!examplesResponse.ok) {
        throw new Error("Failed to fetch examples.json");
      }
      const { relatedPages } = await examplesResponse.json();
      examples = [...relatedPages.links1hop]
        .sort(() => Math.random() - 0.5)
        .slice(0, 15);
    })();
  }

  const isAppInstalled = !matchMedia("(display-mode: browser)").matches;

  return (
    <div className="bg-white mx-auto max-w-4xl px-6 lg:px-8">
      <div className="pt-24 sm:pt-32">
        <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
          premy
          <img src="favicon.png" className="inline w-24 ml-2" />
        </h2>

        <p className="mt-6 text-lg leading-8 text-gray-600">
          A drawing app for anyone.
        </p>

        <div className="mt-10 flex items-center gap-x-6">
          <a
            href="#"
            className="rounded-md bg-neutral-900 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-neutral-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900"
          >
            Open canvas
          </a>

          {!isAppInstalled && (
            <a
              href="#"
              className="text-sm font-semibold leading-6 text-gray-900"
            >
              Install app<span aria-hidden="true">→</span>
            </a>
          )}
        </div>
      </div>

      <div className="pt-16 sm:pt-24">
        <div className="mt-6 grid grid-cols-1 gap-x-4 gap-y-4 md:grid-cols-3">
          {examples.map(({ title, image }) => (
            <div key={title} className="group relative">
              <div className="h-56 w-full overflow-hidden rounded-md group-hover:opacity-75 lg:h-72 xl:h-80">
                <img
                  src={image}
                  alt={title}
                  className="h-full w-full object-contain object-top"
                />

                <a
                  href={`https://scrapbox.io/hata6502/${encodeURIComponent(
                    title
                  )}`}
                  target="_blank"
                  className="absolute inset-0"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-end">
          <a
            href="https://twitter.com/intent/follow?original_referer=https%3A%2F%2Fpremy.hata6502.com%2F&ref_src=twsrc%5Etfw%7Ctwcamp%5Ebuttonembed%7Ctwterm%5Efollow%7Ctwgr%5Epremy_draw&region=follow_link&screen_name=premy_draw"
            target="_blank"
            className="text-sm font-medium text-neutral-900 hover:text-neutral-800"
          >
            Follow Twitter
            <span aria-hidden="true"> &rarr;</span>
          </a>
        </div>
      </div>
    </div>
  );
};
