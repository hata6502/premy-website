import "./clarity";
import "./gtag";

import "premy";
import { FunctionComponent, StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";

declare global {
  interface Window {
    gtag?: Function;
  }
}

if ("serviceWorker" in navigator) {
  await navigator.serviceWorker.register("./serviceWorker.js", {
    type: "module",
  });
}

const container = document.createElement("div");
document.body.append(container);

const Index: FunctionComponent = () => {
  const [premyDB, setPremyDB] = useState<IDBDatabase>();

  useEffect(() => {
    const premyDBOpenRequest = indexedDB.open("premy", 2);

    premyDBOpenRequest.onsuccess = () => {
      setPremyDB(premyDBOpenRequest.result);
    };

    premyDBOpenRequest.onupgradeneeded = async (event) => {
      const premyDB = premyDBOpenRequest.result;
      const transaction = premyDBOpenRequest.transaction;
      if (!transaction) {
        throw new Error("transaction is null");
      }
      let version = event.oldVersion;

      if (version === 0) {
        const etcStore = premyDB.createObjectStore("etc");
        const image = localStorage.getItem("premy-image");
        if (image) {
          etcStore.put([image], "history");
        }
        localStorage.removeItem("premy-image");
        version++;
      }

      if (version === 1) {
        const etcStore = transaction.objectStore("etc");
        const historyGetRequest = etcStore.get("history");
        await new Promise((resolve, reject) => {
          historyGetRequest.onsuccess = resolve;
          historyGetRequest.onerror = reject;
        });
        const history = historyGetRequest.result ?? [];

        const historyStore = premyDB.createObjectStore("history", {
          autoIncrement: true,
        });
        for (const dataURL of history) {
          historyStore.add(dataURL);
        }

        premyDB.deleteObjectStore("etc");
        version++;
      }
    };
  }, []);

  useEffect(
    () => () => {
      premyDB?.close();
    },
    [premyDB]
  );

  return (
    <StrictMode>
      <App premyDB={premyDB} />
    </StrictMode>
  );
};

const mediaCache = await caches.open("media");
const sharedResponse = await mediaCache.match("shared");
if (sharedResponse) {
  const sharedType = sharedResponse.headers.get("Content-Type");
  const sharedName = sharedResponse.headers.get("X-Premy-Name");
  if (!sharedType || !sharedName) {
    throw new Error("shared response is missing headers");
  }

  const sharedBlob = await sharedResponse.blob();
  await mediaCache.delete("shared-image");

  // TODO: null check
  const gameID = sharedName.split("-").at(1)?.split(".").at(0);
  const text = `#${gameID} #premy`;

  createRoot(container).render(
    <>
      ハッシュタグ付きSwitch投稿実験
      <br />
      1, 2の順にボタンを押してTwitterに投稿してください
      <br />
      <button
        type="button"
        style={{ border: "1px solid lightgrey" }}
        onClick={async () => {
          await navigator.clipboard.writeText(text);
        }}
      >
        1. ハッシュタグをコピー
      </button>
      　
      <button
        type="button"
        style={{ border: "1px solid lightgrey" }}
        onClick={async () => {
          try {
            await navigator.share({
              files: [new File([sharedBlob], sharedName, { type: sharedType })],
            });
          } catch (exception) {
            alert(exception);
          }
        }}
      >
        2. Switch共有
      </button>
    </>
  );
} else {
  createRoot(container).render(<Index />);
}
