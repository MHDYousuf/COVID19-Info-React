import React from "react";
import styles from "./Header.module.scss";
function Header(props) {
  return (
    <div>
      <Dev />
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
function Dev() {
  return (
    <div className={styles.devContainer}>
      <span>
        with <span role="img">💕</span> by{" "}
        <a
          href="https://www.linkedin.com/in/mhdyousuf97/"
          rel="noopener noreferrer"
          target="_blank"
        >
          MHDYousuf
        </a>
      </span>
    </div>
  );
}

export default Header;
