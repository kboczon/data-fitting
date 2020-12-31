import React, {useState} from "react";
import "../tooltip.css"

type Props = {
  delay?: number;
  content: string;
  direction?: string;
}

const Tooltip: React.FC<Props> = ({content, delay , children, direction}) => {
  let timeout: NodeJS.Timeout;
  const [active, setActive] = useState(false);

  const showTip = () => {
    timeout = setTimeout(() => {
      setActive(true);
    }, delay || 0);
  };

  const hideTip = () => {
    clearInterval(timeout);
    setActive(false);
  };

  return (
    <div
      className="Tooltip-Wrapper"
      onMouseEnter={showTip}
      onMouseLeave={hideTip}
    >
      {/* Wrapping */}
      {children}
      {active && (
        <div className={`Tooltip-Tip ${direction || "right"}`}>
          {content}
        </div>
      )}
    </div>
  );
};

export default Tooltip;