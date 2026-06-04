import { GoogleLogin } from "@react-oauth/google";
import toast from "react-hot-toast";

const GoogleAuthButton = ({ onSuccess, text = "continue_with", disabled = false }) => {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  if (!clientId) {
    return null;
  }

  return (
    <div className={disabled ? "pointer-events-none opacity-60" : ""}>
      <GoogleLogin
        onError={() => toast.error("Google sign-in failed. Please try again or use email login.")}
        onSuccess={(response) => {
          if (response.credential) {
            onSuccess(response.credential);
          } else {
            toast.error("Google sign-in failed. Please try again or use email login.");
          }
        }}
        shape="rectangular"
        size="large"
        text={text}
        theme="filled_black"
        width="100%"
      />
    </div>
  );
};

export default GoogleAuthButton;
