import React from "react";
import styled from "styled-components";

const Loader = () => {
  return (
    <div className="flex justify-center items-center w-full">
      <StyledWrapper>
        <div className="loader">
          <div className="react-star">
            <div className="nucleus" />
            <div className="electron electron1" />
            <div className="electron electron2" />
            <div className="electron electron3" />
          </div>
        </div>
      </StyledWrapper>
    </div>
  );
};

const StyledWrapper = styled.div`
  /* ---------- MAIN WRAPPER ---------- */
  .loader {
    width: 20rem;
    height: 20rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .react-star {
    position: relative;
    width: 15rem;
    height: 15rem;
    display: flex;
    align-items: center;
    justify-content: center;
    animation: rotate 3s linear infinite;
  }

  /* ---------- CENTER ---------- */
  .nucleus {
    position: absolute;
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    background: linear-gradient(#0738e8, cyan);
    animation: spin 1s linear infinite;
  }

  /* ---------- ELECTRONS ---------- */
  .electron {
    position: absolute;
    width: 15rem;
    height: 6rem;
    border-radius: 50%;
    border: 0.3rem solid #00ffff;
    animation: revolve 1s linear infinite;
  }

  .electron::before {
    content: "";
    position: absolute;
    width: 1rem;
    height: 1rem;
    background: cyan;
    border-radius: 50%;
    animation: moveElectron 1s linear infinite;
  }

  .electron2 {
    transform: rotate(60deg);
    animation-delay: -0.66s;
  }

  .electron2::before {
    animation-delay: -0.66s;
  }

  .electron3 {
    transform: rotate(-60deg);
  }

  /* ---------- ANIMATIONS ---------- */
  @keyframes rotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg) scale(1.1);
    }
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  @keyframes revolve {
    0% {
      border-right-color: transparent;
    }
    25% {
      border-bottom-color: transparent;
    }
    50% {
      border-left-color: transparent;
    }
    75% {
      border-top-color: transparent;
    }
    100% {
      border-right-color: transparent;
    }
  }

  @keyframes moveElectron {
    0% {
      top: 60%;
      left: 100%;
    }
    25% {
      top: 100%;
      left: 60%;
    }
    50% {
      top: 60%;
      left: 0%;
    }
    75% {
      top: 0%;
      left: 60%;
    }
    100% {
      top: 60%;
      left: 100%;
    }
  }

  /* ---------- RESPONSIVE ---------- */

  /* 📱 Mobile */
  @media (max-width: 640px) {
    .loader {
      width: 12rem;
      height: 12rem;
    }

    .react-star {
      width: 9rem;
      height: 9rem;
    }

    .electron {
      width: 9rem;
      height: 4rem;
      border-width: 0.2rem;
    }

    .nucleus {
      width: 1.4rem;
      height: 1.4rem;
    }
  }

  /* 📲 Tablet */
  @media (max-width: 1024px) {
    .loader {
      width: 16rem;
      height: 16rem;
    }

    .react-star {
      width: 12rem;
      height: 12rem;
    }

    .electron {
      width: 12rem;
      height: 5rem;
    }
  }
`;

export default Loader;
