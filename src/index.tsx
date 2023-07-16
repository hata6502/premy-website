import "premy";
import { FunctionComponent, StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";

if ("serviceWorker" in navigator) {
  await navigator.serviceWorker.register("./dist/serviceWorker.js", {
    type: "module",
  });
}

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

const container = document.createElement("div");
document.body.append(container);
createRoot(container).render(<Index />);
