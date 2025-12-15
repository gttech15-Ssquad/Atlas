import React from "react";
import MyVirtualCard, { CardBackground } from "./myvcard";

interface CardPreviewProps {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardholderName?: string;
  department?: string;
  showCVV?: boolean;
  onShowCVV?: (show: boolean) => void;
  className?: string;
}

export const CardPreview = ({
  cardNumber,
  expiryDate,
  cvv,
  cardholderName = "CARDHOLDER NAME",
  department,
  showCVV = false,
  onShowCVV,
  className = "",
}: CardPreviewProps) => {
  // const maskedNumber = cardNumber.replace(/\d(?=\d{4})/g, "*");

  const cardbg: CardBackground = {
    type: "gradient",
    value: "bg-gradient-to-br from-orange-500 via-yellow-500 to-red-500",
  };

  return (
    // <div
    //   className={cn(
    //     "bg-gradient-to-br from-primary to-primary/80 text-white rounded-xl p-6 shadow-lg w-full max-w-sm",
    //     className
    //   )}
    // >
    //   {/* GTBank Logo */}
    //   <div className="mb-8">
    //     <div className="font-bold text-xl">GTBank</div>
    //     {department && (
    //       <div className="text-xs text-white/70 mt-1">{department}</div>
    //     )}
    //   </div>

    //   {/* Card Number */}
    //   <div className="mb-8">
    //     <p className="text-xs text-white/70 mb-2">Card Number</p>
    //     <p className="text-lg font-mono tracking-wider flex items-center gap-2">
    //       {maskedNumber}
    //       <button
    //         className="text-white/50 hover:text-white transition"
    //         title="Copy card number"
    //       >
    //         <Copy size={14} />
    //       </button>
    //     </p>
    //   </div>

    //   {/* Bottom Row */}
    //   <div className="flex items-end justify-between">
    //     <div>
    //       <p className="text-xs text-white/70 mb-1">Cardholder</p>
    //       <p className="font-medium text-sm">{cardholderName}</p>
    //     </div>
    //     <div className="text-right">
    //       <p className="text-xs text-white/70 mb-1">Expires</p>
    //       <p className="font-mono text-sm">{expiryDate}</p>
    //     </div>
    //   </div>

    //   {/* CVV Section */}
    //   <div className="mt-6 pt-4 border-t border-white/20">
    //     <div className="flex items-center justify-between">
    //       <div>
    //         <p className="text-xs text-white/70">CVV</p>
    //         <p className="font-mono text-sm flex items-center gap-2">
    //           {showCVV ? cvv : "***"}
    //           {onShowCVV && (
    //             <button
    //               onClick={() => onShowCVV(!showCVV)}
    //               className="text-white/50 hover:text-white transition"
    //             >
    //               {showCVV ? <EyeOff size={14} /> : <Eye size={14} />}
    //             </button>
    //           )}
    //         </p>
    //       </div>
    //       <div className="text-xs text-white/50">Virtual</div>
    //     </div>
    //   </div>
    // </div>

    <div className="w-[500px] py-10">
      <MyVirtualCard
        background={cardbg}
        expiryDate={expiryDate}
        cardNumber={cardNumber}
        cardHolder={department}
        cvv={"123"}
        showCVV={showCVV}
        onShowCVV={onShowCVV}
        CardName={cardholderName}
      />
    </div>
  );
};
