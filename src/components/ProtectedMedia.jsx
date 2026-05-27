import { FileVideo, ImageOff, Loader2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import clsx from "clsx";

import { getMediaUrlFromFile, mediaService } from "../services/mediaService";

const getMediaKind = (file = {}, contentType = "") => {
  const value = file.fileType || file.mediaType || file.mimetype || contentType;

  if (value?.startsWith?.("video") || value === "video") {
    return "video";
  }

  return "image";
};

const ProtectedMedia = ({
  file,
  alt,
  className,
  controls = false,
  mediaClassName,
  placeholderClassName
}) => {
  const mediaUrl = getMediaUrlFromFile(file);
  const [state, setState] = useState({
    objectUrl: "",
    contentType: "",
    status: mediaUrl ? "loading" : "unavailable"
  });

  useEffect(() => {
    let mounted = true;
    let objectUrl = "";

    if (!mediaUrl) {
      setState({ objectUrl: "", contentType: "", status: "unavailable" });
      return undefined;
    }

    setState({ objectUrl: "", contentType: "", status: "loading" });

    mediaService
      .fetchBlob(mediaUrl)
      .then((response) => {
        objectUrl = URL.createObjectURL(response.data);

        if (mounted) {
          setState({
            objectUrl,
            contentType: response.headers["content-type"] || response.data.type || "",
            status: "ready"
          });
        }
      })
      .catch(() => {
        if (mounted) {
          setState({ objectUrl: "", contentType: "", status: "unavailable" });
        }
      });

    return () => {
      mounted = false;

      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [mediaUrl]);

  const mediaKind = useMemo(() => getMediaKind(file, state.contentType), [file, state.contentType]);

  const handleMediaError = () => {
    if (state.objectUrl) {
      URL.revokeObjectURL(state.objectUrl);
    }

    setState({ objectUrl: "", contentType: "", status: "unavailable" });
  };

  const unavailable = (
    <div
      className={clsx(
        "grid h-full min-h-24 w-full place-items-center bg-zinc-950 px-3 py-6 text-center text-xs font-semibold text-zinc-400",
        placeholderClassName
      )}
    >
      <div>
        {state.status === "loading" ? (
          <Loader2 className="mx-auto mb-2 animate-spin" size={20} />
        ) : mediaKind === "video" ? (
          <FileVideo className="mx-auto mb-2" size={20} />
        ) : (
          <ImageOff className="mx-auto mb-2" size={20} />
        )}
        <span>{state.status === "loading" ? "Loading preview" : "Preview unavailable"}</span>
      </div>
    </div>
  );

  return (
    <div className={clsx("overflow-hidden rounded-lg bg-zinc-950", className)}>
      {state.status === "ready" && state.objectUrl ? (
        mediaKind === "video" ? (
          <video
            className={mediaClassName}
            controls={controls}
            muted={!controls}
            playsInline
            preload="metadata"
            src={state.objectUrl}
            onError={handleMediaError}
          />
        ) : (
          <img
            alt={alt || file?.originalName || "Media preview"}
            className={mediaClassName}
            src={state.objectUrl}
            onError={handleMediaError}
          />
        )
      ) : (
        unavailable
      )}
    </div>
  );
};

export default ProtectedMedia;
