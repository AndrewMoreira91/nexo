import { Avatar, ColorPaletteProp, VariantProp } from "@mui/joy";
import { FC } from "react";
import { useAuth } from "../context/auth.context";

type AvatarProps = {
  size?: "sm" | "md" | "lg";
  color?: ColorPaletteProp;
  variant?: VariantProp;
};

const ProfileAvatar: FC<AvatarProps> = ({ size, color, variant }) => {
  const { user } = useAuth();

  return (
    <Avatar
      alt={user?.name ? user.name : "usuário"}
      size={size}
      color={color}
      variant={variant}
    />
  );
};

export default ProfileAvatar;
