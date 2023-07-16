import { PremyDialogElement, PremyHistoryChangeEvent } from "premy";
import { FunctionComponent, useEffect, useRef } from "react";

export const PremyDialog: FunctionComponent<{
  open: boolean;
  premyDB?: IDBDatabase;
  onClose: () => void;
}> = ({ open, premyDB, onClose }) => {
  const ref = useRef<PremyDialogElement>(null);

  useEffect(() => {
    if (!ref.current) {
      return;
    }
    const premyDialogElement = ref.current;

    premyDialogElement.addEventListener("premyClose", onClose);
    return () => {
      premyDialogElement.removeEventListener("premyClose", onClose);
    };
  }, [onClose, ref.current]);

  useEffect(() => {
    if (!ref.current) {
      return;
    }
    const premyDialogElement = ref.current;

    const handlePremyHistoryChange = async (event: PremyHistoryChangeEvent) => {
      if (!premyDB) {
        return;
      }
      const { historyMaxLength, pushed } = event.detail;

      const transaction = premyDB.transaction(["history"], "readwrite");
      const historyStore = transaction.objectStore("history");
      for (const dataURL of pushed) {
        historyStore.add(dataURL);
      }

      const historyGetAllKeysRequest = historyStore.getAllKeys();
      await new Promise((resolve, reject) => {
        historyGetAllKeysRequest.onsuccess = resolve;
        historyGetAllKeysRequest.onerror = reject;
      });
      const historyKeys = historyGetAllKeysRequest.result;
      const removedHistoryKeys = historyKeys.slice(
        0,
        Math.max(historyKeys.length - historyMaxLength, 0)
      );
      for (const historyKey of removedHistoryKeys) {
        historyStore.delete(historyKey);
      }
    };
    premyDialogElement.addEventListener(
      "premyHistoryChange",
      handlePremyHistoryChange
    );

    if (open) {
      (async () => {
        if (premyDB) {
          const transaction = premyDB.transaction(["history"], "readonly");
          const historyStore = transaction.objectStore("history");
          const historyGetAllRequest = historyStore.getAll();
          await new Promise((resolve, reject) => {
            historyGetAllRequest.onsuccess = resolve;
            historyGetAllRequest.onerror = reject;
          });
          const history = historyGetAllRequest.result;
          premyDialogElement.setHistory(history);
        }

        premyDialogElement.setAttribute("open", "");
      })();
    } else {
      premyDialogElement.removeAttribute("open");
    }

    return () => {
      premyDialogElement.removeEventListener(
        "premyHistoryChange",
        handlePremyHistoryChange
      );
    };
  }, [open, premyDB, ref.current]);

  return <premy-dialog ref={ref} />;
};
