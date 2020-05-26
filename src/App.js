import React from "react";
import ListView from "./ListView";
import styled from "styled-components";
import "./styles.css";

const DemoShow = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 320px;
  max-width: ${Math.min(window.screen.width, 414)}px;
  max-height: ${window.innerHeight}px;

  [role="radiogroup"] label {
    margin-bottom: 5px;
  }
`;
const Demo = styled.div`
  position: relative;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
`;

export default function App() {
  return (
    <DemoShow>
      <Demo>
        <ListView />
      </Demo>
    </DemoShow>
  );
}
