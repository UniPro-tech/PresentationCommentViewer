import { useEffect, useState } from "react";
import QRCode from "qrcode";

type Props = {
  roomId: string;
  joinUrl: string;
};

export function RoomQRCode({ roomId, joinUrl }: Props) {
  const [qr, setQr] = useState<string>();

  useEffect(() => {
    QRCode.toDataURL(joinUrl).then(setQr).catch(console.error);
  }, [joinUrl]);

  return (
    <div>
      {qr && <img src={qr} alt={`Room ${roomId}`} width={240} height={240} />}

      <div>{roomId}</div>
    </div>
  );
}
