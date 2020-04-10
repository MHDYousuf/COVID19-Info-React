import React from "react";
import styles from "./Header.module.scss";
function Header(props) {
  return (
    <div>
      <HeaderItem />
      {props.children}
    </div>
  );
}

function HeaderItem() {
  return (
    <div className={styles.brandContainer}>
      <h1 className={styles.brandHeading}>
        C<span>O</span>VID 19
      </h1>
    </div>
  );
}

export default Header;
