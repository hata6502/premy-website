import {
  ChatBubbleLeftRightIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { PremyDialogElement, PremyHistoryChangeEvent } from "premy";
import { FunctionComponent, useEffect, useRef, useState } from "react";
import { Chat } from "./Chat";

export const PremyDialog: FunctionComponent<{
  open: boolean;
  premyDB?: IDBDatabase;
  onClose: () => void;
}> = ({ open, premyDB, onClose }) => {
  const [chatOpen, setChatOpen] = useState(false);
  const [sendCanvas, setSendCanvas] = useState("");

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
        Math.max(historyKeys.length - historyMaxLength, 0),
      );
      for (const historyKey of removedHistoryKeys) {
        historyStore.delete(historyKey);
      }
    };
    premyDialogElement.addEventListener(
      "premyHistoryChange",
      handlePremyHistoryChange,
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
        handlePremyHistoryChange,
      );
    };
  }, [open, premyDB, ref.current]);

  const handleOpenChatButtonClick = async () => {
    if (!localStorage.getItem("chat-user-id")) {
      if (
        !confirm(`お絵かきをAIに見せてチャットしますか?

AIサーバーに情報を送信・保持します
この機能は評価目的で提供され、性能や品質について保証はなく、一切の責任を負いません
`)
      ) {
        return;
      }

      localStorage.setItem("chat-user-id", crypto.randomUUID());
    }

    if (premyDB) {
      const transaction = premyDB.transaction(["history"], "readonly");
      const historyStore = transaction.objectStore("history");
      const historyGetAllRequest = historyStore.getAll();
      await new Promise((resolve, reject) => {
        historyGetAllRequest.onsuccess = resolve;
        historyGetAllRequest.onerror = reject;
      });
      const history = historyGetAllRequest.result;
      setSendCanvas(history.at(-1));
    }

    setChatOpen(true);
  };

  const handleCloseChatButtonClick = () => {
    setChatOpen(false);
  };

  return (
    <>
      <premy-dialog ref={ref} />

      {open && (
        <div className="premy-pointer-listener-ignore fixed right-2 bottom-2 z-[1310] flex flex-col items-end gap-4">
          {chatOpen && <Chat sendCanvas={sendCanvas} />}

          {chatOpen ? (
            <button
              type="button"
              onClick={handleCloseChatButtonClick}
              className="rounded-full bg-white p-3 text-gray-900 shadow-xs inset-ring inset-ring-gray-300 hover:bg-gray-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:bg-gray-50"
            >
              <XMarkIcon aria-hidden="true" className="w-7 h-7" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleOpenChatButtonClick}
              className="rounded-full bg-neutral-900 p-3 text-white shadow-xs hover:bg-neutral-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-800"
            >
              <ChatBubbleLeftRightIcon aria-hidden="true" className="w-7 h-7" />
            </button>
          )}
        </div>
      )}
    </>
  );
};
