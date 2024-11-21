import React, { useState } from "react";
import { useSelector } from "react-redux";
import contactImage from "../assets/contact.png";
import { getTextString } from "../assets/TextStrings";
import { postData } from "../DataBase/databaseFunction";
import { toast } from "react-toastify";

function ContactPage() {
  const { isArabicLanguage } = useSelector((state) => state.auth);
  const textString = getTextString(isArabicLanguage);

  const [name, setname] = useState("");
  const [email, setemail] = useState("");
  const [phoneNumber, setphoneNumber] = useState("");
  const [mesg, setmesg] = useState("");

  const contactUsFormPost = async (e) => {
    e.preventDefault();
    await postData("contactUs", { name, email, phoneNumber, mesg })
      .then(() => {
        setemail("");
        setname("");
        setmesg("");
        setphoneNumber("");
        toast.success("Successfully Sent");
      })
      .catch((e) => {
        toast.error(e.message);
      });
  };

  return (
    <form onSubmit={contactUsFormPost} className={`container contactUsPage ${isArabicLanguage ? "rtl" : "ltr"}`}>
    <h1
    className="pageHeading my-4"
    style={{ direction: isArabicLanguage ? "rtl" : "ltr", textAlign: isArabicLanguage ? "right" : "left" }}
  >
    {textString.contactNavTxt}
  </h1>
      <div className="row">
        <div className="col-12 col-md-6 order-2 order-md-1 d-flex align-items-center justify-content-between flex-column">
          <input
            required
            minLength={5}
            value={name}
            onChange={(e) => setname(e.target.value)}
            placeholder={textString.nameInputTxt}
          />
          <input
            type="email"
            required
            minLength={12}
            value={email}
            onChange={(e) => setemail(e.target.value)}
            placeholder={textString.emailInputTxt}
          />
          <input
            required
            minLength={9}
            value={phoneNumber}
            onChange={(e) => setphoneNumber(e.target.value)}
            placeholder={textString.phoneInputTxt}
          />
          <textarea
            required
            minLength={40}
            value={mesg}
            onChange={(e) => setmesg(e.target.value)}
            placeholder={textString.messageInputTxt}
          />
        </div>
        <div className="col-12 col-md-6 order-1 order-md-2">
          <img
            src={contactImage}
            style={{ width: "100%", objectFit: "contain" }}
            alt="contact us"
          />
        </div>
      </div>
      <div className="mt-4 d-flex align-items-center justify-content-center w-100">
        <button type="submit" className="lastBtn">
          {textString.senBtnTxt}
        </button>
      </div>
    </form>
  );
}

export default ContactPage;
