import { useEffect, useState } from "react";
import QRCode from "qrcode";

type Props = {
  roomId: string;
  joinUrl: string;
};

export function RoomQRCode({ roomId, joinUrl }: Props) {
  const [qr, setQr] = useState<string>();

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

  return (
    <section className="room-card">
      {qr && (
        <div className="qr">
          <img src={qr} alt={`Room ${roomId}`} />
        </div>
      )}

      <div className="room-id">{roomId}</div>

      <button className="join-url" onClick={openJoinUrl}>
        {joinUrl}
      </button>
    </section>
  );
}
