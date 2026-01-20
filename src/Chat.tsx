import { useEffect, useRef } from "react";
import type { FunctionComponent } from "react";
import { ChatKit, useChatKit } from "@openai/chatkit-react";
import type { OpenAIChatKit } from "@openai/chatkit-react";

export const Chat: FunctionComponent<{ sendCanvas: string }> = ({
  sendCanvas,
}) => {
  const ref = useRef<OpenAIChatKit>(null);

  useEffect(() => {
    if (!sendCanvas || !ref.current) {
      return;
    }
    const openAIChatKit = ref.current;

    const abortController = new AbortController();
    (async () => {
      const response = await fetch(sendCanvas);
      const blob = await response.blob();

      if (abortController.signal.aborted) {
        throw abortController.signal.reason;
      }
      await openAIChatKit.setComposerValue({
        files: [new File([blob], "canvas.png", { type: blob.type })],
      });
    })();

    return () => {
      abortController.abort();
    };
  }, [sendCanvas]);

  const { control } = useChatKit({
    api: {
      getClientSecret: async () => {
        await new Promise<void>((resolve) =>
          grecaptcha.enterprise.ready(resolve),
        );
        const recaptchaToken = await grecaptcha.enterprise.execute(
          "6LdOhk8sAAAAAMEeUuIG4SXY6k1NYjhtQatCb0CU",
          { action: "GET_CLIENT_SECRET" },
        );

        const userID = localStorage.getItem("chat-user-id");
        if (!userID) {
          throw new Error("Missing chat-user-id in localStorage");
        }

        const response = await fetch(
          "https://chatkit-session-911313130364.asia-northeast1.run.app/",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ recaptchaToken, userID }),
          },
        );
        if (!response.ok) {
          throw new Error(
            `Failed to create session: ${response.status} ${response.statusText}`,
          );
        }
        const { clientSecret } = await response.json();

        return clientSecret;
      },
    },
    composer: { attachments: { enabled: true } },
  });

  return (
    <ChatKit
      ref={ref}
      control={control}
      style={{ width: 360, height: 540 }}
      {...{
        class: "rounded-lg bg-white shadow-lg outline-1 outline-black/5",
      }}
    />
  );
};
