import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export interface CardBackground {
  type: "gradient" | "color" | "image";
  value: string;
}

interface Props {
  background: CardBackground;
  cardNumber: string;
  expiryDate?: string;
  cardHolder?: string;
  showCVV?: boolean;
  onShowCVV?: (show: boolean) => void;
  cvv: string;
  CardName?: string;
}

export default function MyVirtualCard({
  background,
  cardNumber,
  expiryDate,
  cardHolder,
  //   showCVV = false,
  //   onShowCVV,
  cvv = "123",
  CardName,
}: Props) {
  const renderBackground = () => {
    if (background.type === "gradient") {
      return (
        <div className={`absolute inset-0 ${background.value}`}>
          <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-linear-to-t from-black/30 to-transparent"></div>
        </div>
      );
    }

    if (background.type === "color") {
      return (
        <div
          className="absolute inset-0"
          style={{ backgroundColor: background.value }}
        />
      );
    }

    if (background.type === "image") {
      return (
        <div className="absolute p-0 m-0 inset-0">
          <div
            className="w-[120%] p-0 -ml-10 h-full bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${background.value})` }}
          ></div>
        </div>
      );
    }

    return null;
  };

  const [showCVV, setShowCVV] = useState(false);
  const [showNumber, setShowNumber] = useState(false);

  const normalizedNumber = cardNumber?.replace(/\s/g, "");

  const maskedNumber = normalizedNumber
    ? normalizedNumber.replace(/\d(?=\d{4})/g, "*")
    : "";

  return (
    <div className="relative h-full rounded-xl overflow-hidden">
      {renderBackground()}

      <img
        src={"/images/gtLogo.png"}
        width={48}
        height={48}
        alt="Bank Logo"
        className="absolute top-8 right-8"
      />

      <div className="absolute top-1/2 -translate-y-1/2 left-8 w-12 h-10 bg-yellow-900 rounded"></div>

      <div className="absolute bottom-10 left-8">
        <div className="text-lg font-semibold ml-20 flex items-center gap-2 text-white">
          {showNumber ? normalizedNumber : maskedNumber}
          <button
            onClick={() => setShowNumber(!showNumber)}
            className="text-white hover:text-white transition"
          >
            {showNumber ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
        </div>
        <div className="text-lg font-semibold text-white">{cardHolder}</div>
      </div>

      <div className="absolute bottom-20 right-20">
        <div className="text-lg font-semibold flex gap-2 items-center text-white">
          <span className="font-light leading-none tracking-tighter text-sm">
            Valid <br /> Thru
          </span>{" "}
          {expiryDate}
        </div>
      </div>

      <div className="absolute bottom-32 right-20">
        <p className="text-sm text-white">CVV</p>
        <p className="font-mono text-md text-white flex items-center gap-2">
          {showCVV ? cvv : "***"}

          <button
            onClick={() => setShowCVV(!showCVV)}
            className="text-white hover:text-white transition"
          >
            {showCVV ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
        </p>
      </div>

      <img
        src={"/images/masterCardLogo.png"}
        width={62}
        height={41}
        alt="Bank Logo"
        className="absolute bottom-8 right-8"
      />
    </div>
  );
}

export function ViewCards({
  background,
  cardNumber,
  expiryDate,
  cardHolder,
}: Props) {
  const renderBackground = () => {
    if (background.type === "gradient") {
      return (
        <div className={`absolute inset-0 ${background.value}`}>
          <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-linear-to-t from-black/30 to-transparent"></div>
        </div>
      );
    }

    if (background.type === "color") {
      return (
        <div
          className="absolute inset-0"
          style={{ backgroundColor: background.value }}
        />
      );
    }

    if (background.type === "image") {
      return (
        <div className="absolute p-0 m-0 inset-0">
          <div
            className="w-[140%] p-0 -ml-10 h-full bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${background.value})` }}
          ></div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="relative h-full rounded-xl overflow-hidden">
      {renderBackground()}

      <img
        src={"/images/gtLogo.png"}
        width={12}
        height={12}
        alt="Bank Logo"
        className="absolute top-4 right-4"
      />

      <div className="absolute top-1/2 -translate-y-1/2 left-4 w-8 h-6 bg-yellow-900 rounded"></div>

      <div className="absolute bottom-8 left-4">
        <div className="text-sm font-medium text-white">{cardHolder}</div>
      </div>

      <img
        src={"/images/masterCardLogo.png"}
        width={20}
        height={14}
        alt="Bank Logo"
        className="absolute bottom-4 right-4"
      />

      {/* <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex gap-1">
        <div className="w-1 h-1 bg-white rounded-full" />
        <div className="w-1 h-1 bg-white rounded-full" />
        <div className="w-1 h-1 bg-white rounded-full" />
      </div> */}
    </div>
  );
}
