import React from "react";
import styled, { keyframes } from "styled-components";

const reveal = keyframes`
  0%, 100% {
    opacity: 0.5;
    letter-spacing: -1em;
  }
  50% {
    opacity: 1;
    letter-spacing: 0em;
  }
`;

const LoaderWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  .loader {
    font-size: 2em;
    font-weight: 900;
    color: #000;
  }

  .loader span {
    display: inline-flex;
  }

  .loader span:nth-child(2) {
    overflow: hidden;
    animation: ${reveal} 1.5s cubic-bezier(0.645, 0.045, 0.355, 1)
      infinite alternate;
  }
`;

export default function Loader() {
  return (
    <LoaderWrapper>
      <div className="loader">
        <span>&lt;</span>
        <span>LOADING</span>
        <span>/&gt;</span>
      </div>
    </LoaderWrapper>
  );
}
