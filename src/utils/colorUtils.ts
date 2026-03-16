export const ColorHex = (color: string | undefined): string => {
    switch (color) {
      case "blue":
        return "#3B82F6"; 
      case "red":
        return "#EF4444"; 
      case "green":
        return "#10B981"; 
      case "yellow":
        return "#FACC15"; 
      default:
        return "#dbdbdb"; 
    }
  };
  