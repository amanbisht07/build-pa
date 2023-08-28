import React from "react";
import { useTranslation } from "react-i18next";
import "../../../../styles/layouts/layout1/userTimeLine.scss";

const userTimeLine = () => {
  const { t } = useTranslation();
  let jQliList = $("ul.steps li");
  // jQliList.on('click', function(){
  //     jQliList.removeClass('active');
  //     $(this).addClass('active');
  // });

  return (
    <div className="wrapper">
      <ul className="steps">
        <li>
          <a href="#">
            {t("step_one")} ({t("make_text_multiline")})
          </a>
        </li>
        <li>
          <a href="#">{t("Step Two")}</a>
        </li>
        <li className="active">
          <span>
            {t("step_three")} ({t("make_text_multiline")})
          </span>
        </li>
        <li>
          <span>{t("step_four")}</span>
        </li>
        <li>
          <span>{t("step_five")}</span>
        </li>
        <li>
          <span>{t("step_six")}</span>
        </li>
        <li>
          <span>
            {t("step_seven")} ({t("make_text_multiline")})
          </span>
        </li>
      </ul>
    </div>
  );
};
export default userTimeLine;
