import { css } from "@emotion/core";

export default {
  onButton: gameOn => css`
    .on-toggle-inner {
      float: ${gameOn ? "right" : "left"};
    }
  `,
  countBox: gameOn => css`
    color: ${gameOn ? "#c70000" : "#5d0505"};
  `,
  startLight: started => css`
    background: ${started ? "#f71313" : "#5d0505"};
  `,
  strictLight: strictMode => css`
    background: ${strictMode ? "#f9e920" : "#aaa200"};
  `
};
