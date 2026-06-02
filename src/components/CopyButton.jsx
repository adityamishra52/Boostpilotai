import { Check, Copy } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

import Button from "./Button";

const CopyButton = ({ className, text, label = "Copy" }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Copied to clipboard");
    window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <Button className={className} icon={copied ? Check : Copy} onClick={handleCopy} size="sm" variant="secondary">
      {copied ? "Copied" : label}
    </Button>
  );
};

export default CopyButton;
