// @flow
import React from "react";

import InputText from "universal/components/InputText";
import Checkbox from "universal/components/Checkbox";
import Button from "universal/components/Button";
import lockIcon from "universal/assets/icons/lock.svg";
import Logo from "../../assets/mirasava-logo.png";
import s from "./LoginUI.css";

const LoginUI = ({
  handleChange,
  onSubmit,
}: {
  onSubmit: (e: {
    preventDefault: () => void,
  }) => {},
  handleChange: (fieldName: string) => (value: string) => void,
}) => (
  <div className={s.wrapper}>
    <img className={s.logo} src={Logo} alt="Mirasava Logo" />
    <form onSubmit={onSubmit} className={s.form}>
      <InputText
        label="username"
        classNames={[s.marginBottom30]}
        onChange={handleChange("username")}
      />
      <InputText
        label="password"
        classNames={[s.marginBottom30]}
        onChange={handleChange("password")}
        type="password"
      />
      <div className={s.formFooter}>
        <Checkbox label="Remember Me" classNames={[s.blockLeft]} />
        <Button type="submit" icon={lockIcon} value="SIGN IN" />
      </div>
    </form>
  </div>
);

export default LoginUI;
