import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { MdCheck, MdContentCopy } from "react-icons/md";

type Props = {
  roomId: string;
  joinUrl: string;
};

export function RoomQRCode({ roomId, joinUrl }: Props) {
  const [qr, setQr] = useState<string>();
  const [copyOK, setCopyOK] = useState<boolean>(false);

  useEffect(() => {
    QRCode.toDataURL(joinUrl, {
      margin: 2,
      width: 320,
    })
      .then(setQr)
      .catch(console.error);
  }, [joinUrl]);

  function openJoinUrl() {
    window.roomAPI.openExternal(joinUrl);
  }

  const sleep = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  async function copyJoinUrl() {
    await navigator.clipboard.writeText(joinUrl);
    setCopyOK(true);
    await sleep(1000);
    setCopyOK(false);
  }

  return (
    <section className="room-card">
      {qr && (
        <div className="qr">
          <img src={qr} alt={`Room ${roomId}`} />
        </div>
      )}

      <div className="room-id">{roomId}</div>

      <div className="join-url">
        <button onClick={openJoinUrl}>{joinUrl}</button>
        <button onClick={copyJoinUrl}>
          {copyOK ? <MdCheck color="#FFF" /> : <MdContentCopy color="#FFF" />}
        </button>
      </div>
    </section>
  );
}
