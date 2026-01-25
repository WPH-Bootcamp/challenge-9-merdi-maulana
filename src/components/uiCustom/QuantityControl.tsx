import { Plus, Minus } from "lucide-react";

interface QuantityControlProps {
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
  size?: "sm" | "md";
}

export default function QuantityControl({
  quantity,
  onIncrement,
  onDecrement,
  size = "md",
}: QuantityControlProps) {
  const buttonSize = size === "sm" ? "w-7 h-7" : "w-8 h-8";
  const iconSize = size === "sm" ? 14 : 16;

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={onDecrement}
        className={`${buttonSize} rounded-full border flex items-center justify-center text-black hover:bg-gray-100 transition-colors`}
      >
        <Minus size={iconSize} />
      </button>
      <span className="font-bold text-[#C12116] min-w-[20px] text-center">
        {quantity}
      </span>
      <button
        onClick={onIncrement}
        className={`${buttonSize} rounded-full flex items-center justify-center text-white bg-[#C12116] hover:bg-[#a01812] transition-colors`}
      >
        <Plus size={iconSize} />
      </button>
    </div>
  );
}
