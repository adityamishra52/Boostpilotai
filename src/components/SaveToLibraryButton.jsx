import { Save } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

import { libraryService } from "../services/libraryService";
import Button from "./Button";

const SaveToLibraryButton = ({ payload, children = "Save to Library", className = "", size = "sm", variant = "secondary" }) => {
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (!payload?.content) {
      toast.error("Nothing to save yet.");
      return;
    }

    setSaving(true);
    try {
      await libraryService.create(payload);
      toast.success("Saved to Content Library");
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not save to Content Library");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Button className={className} icon={Save} loading={saving} onClick={save} size={size} variant={variant}>
      {children}
    </Button>
  );
};

export default SaveToLibraryButton;
