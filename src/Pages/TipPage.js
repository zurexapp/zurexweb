import React from "react";
import { useSelector } from "react-redux";
import { getTextString } from "../assets/TextStrings";
import article1 from "../assets/article1.png";
import article2 from "../assets/article2.png";
import article3 from "../assets/article3.png";
import article4 from "../assets/article4.png";
import article5 from "../assets/article5.png";
import article6 from "../assets/article6.png";
import article7 from "../assets/article7.png";
import logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";

function TipPage() {
  const navigate = useNavigate();
  const { isArabicLanguage } = useSelector((state) => state.auth);
  const textString = getTextString(isArabicLanguage);

  const tipsArray = [
    { title: textString.firstArticleHeading, imgLink: article1, id: 0 },
    { title: textString.secArticleHeading, imgLink: article2, id: 1 },
    { title: textString.thirdArticleHeading, imgLink: article3, id: 2 },
    { title: textString.forthArticleHeading, imgLink: article4, id: 3 },
    { title: textString.fifthArticleHeading, imgLink: article5, id: 4 },
    { title: textString.sixthArticleHeading, imgLink: article6, id: 5 },
    { title: textString.seventhArticleHeading, imgLink: article7, id: 6 },
  ];

  return (
    <div className="container my-2">
      <img src={logo} className="topLogoPagediv" alt="logo" />
      <div className="row my-4">
        {tipsArray?.map((dat, index) => (
          <div
            key={index}
            onClick={() => navigate(`/tip/${dat?.id}`)}
            className="col-12 col-md-6 col-lg-4 mb-4"
          >
            <div className="tipsContainerDivCard mx-auto">
              <img src={dat.imgLink} alt="blogimage" />
              <span className={`${isArabicLanguage ? "rtl" : "ltr"}`}>
                {dat.title?.length > 73
                  ? dat?.title.substring(0, 54) + " ..."
                  : dat.title}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TipPage;
