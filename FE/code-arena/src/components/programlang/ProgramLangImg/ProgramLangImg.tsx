import React from "react";

interface Text {
  name?: string;
}
const ProgramLangImg: React.FC<Text> = (Text) => {
  const imgSrc = "/images/" + Text.name + ".png";
  return <img src={imgSrc} style={{ width: "100%" }} />;
};

export default ProgramLangImg;
