import React from "react";

interface Text {
  name: string;
}
const ProgramLangImg: React.FC<Text> = (Text) => {
  const imgSrc = "/images/" + Text.name + ".png";
  return <img src={imgSrc} />;
};

export default ProgramLangImg;
