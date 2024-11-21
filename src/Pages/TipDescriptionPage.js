import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { textString } from "../assets/TextStrings";
import article1 from "../assets/article1.png";
import article2 from "../assets/article2.png";
import article3 from "../assets/article3.png";
import article4 from "../assets/article4.png";
import article5 from "../assets/article5.png";
import article6 from "../assets/article6.png";
import article7 from "../assets/article7.png";
function TipDescriptionPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    if (tipsArray?.length < id) {
      navigate("/tips");
    }
  });

  const tipsArray = [
    {
      title: textString.firstArticleHeading,
      imgLink: article1,
      id: 0,
      blogData: textString.firstArticle,
    },
    {
      title: textString.secArticleHeading,
      imgLink: article2,
      id: 1,
      blogData: textString.secArticle,
    },
    {
      title: textString.thirdArticleHeading,
      imgLink: article3,
      id: 2,
      blogData: textString.thirdArticle,
    },
    {
      title: textString.forthArticleHeading,
      imgLink: article4,
      id: 3,
      blogData: textString.forthArticle,
    },
    {
      title: textString.fifthArticleHeading,
      imgLink: article5,
      id: 4,
      blogData: textString.fifthArticle,
    },
    {
      title: textString.sixthArticleHeading,
      imgLink: article6,
      id: 5,
      blogData: textString.sixArticle,
    },
    {
      title: textString.seventhArticleHeading,
      imgLink: article7,
      id: 6,
      blogData: textString.seventhArticle,
    },
  ];
  // const finddata = tipsArray.filter(
  //   (dat) => dat?.title.replace(/ /g, "_") === id
  // );
  const finddata = tipsArray[id];
  //const result = finddata?.length > 0 ? finddata[0] : {};
  const result = finddata;
  return (
    <section className="container tipDescription my-4">
      <h1>{result?.title}</h1>
      <img src={result?.imgLink} className="my-4" alt="blogImage" />
      {result?.blogData?.description?.length > 0 && (
        <p className="descriptionPara">{result?.blogData?.description}</p>
      )}
      {result?.blogData?.descriptionHeading?.length > 0 && (
        <h2 className="descriptionHeading my-3">
          {result?.blogData?.descriptionHeading}
        </h2>
      )}
      {result?.blogData?.resonArr &&
        result?.blogData?.resonArr?.map((dac) => {
          return (
            <>
              <h3 className="reasonHeading">{dac?.heading}</h3>
              <p className="reasonPara">{dac?.description}</p>
              {dac?.bulletsPoints && (
                <ul className="resonBulletPoints">
                  {dac?.bulletsPoints?.map((dal) => (
                    <li key={dal.id}>{dal?.title}</li>
                  ))}
                </ul>
              )}
            </>
          );
        })}
      {result?.blogData?.boldHeading ? (
        result?.blogData?.boldHeading?.boldDesc ? (
          <p className="descriptionPara">
            <b>{result?.blogData?.boldHeading?.boldDesc}</b>
          </p>
        ) : null
      ) : null}
      {result?.blogData?.boldHeading?.bulletPoints && (
        <ul className="resonBulletPoints">
          {result?.blogData?.boldHeading?.bulletPoints.map((dat) => (
            <li key={dat.id}>{dat?.title}</li>
          ))}
        </ul>
      )}
      {result?.blogData?.conclutionHeading?.length > 0 && (
        <h3 className="descriptionHeading my-3">
          {result?.blogData?.conclutionHeading}
        </h3>
      )}
      {result?.blogData?.conclutionDescription?.length > 0 && (
        <p className="descriptionPara">
          {result?.blogData?.conclutionDescription}
        </p>
      )}
    </section>
  );
}

export default TipDescriptionPage;
