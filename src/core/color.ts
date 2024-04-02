type RGB = `${number} ${number} ${number}`;

class Color {
  constructor(public readonly variable: `--rd-color-rgb-${string}`, public readonly rgb: RGB) {}

  public get cssVariable(): string {
    return `var(${this.variable}, ${this.rgb})`;
  }
}

const ColorsMap = {
  // label
  LABEL_TEXT: new Color('--rd-color-rgb-label-text', '66 76 81'),
  LABEL_BORDER: new Color('--rd-color-rgb-label-border', '149 200 177'),
  LABEL_BACKGROUND: new Color('--rd-color-rgb-label-background', '255 255 255'),

  LABEL_TEXT_ACTIVE: new Color('--rd-color-rgb-label-text-active', '66 76 81'),
  LABEL_BORDER_ACTIVE: new Color('--rd-color-rgb-label-border-active', '251 176 60'),
  LABEL_BACKGROUND_ACTIVE: new Color('--rd-color-rgb--label-background-active', '251 176 60'),

  // square
  SQUARE_ERROR: new Color('--rd-color-rgb-square-error', '185 46 0'),
  SQUARE_EDGE: new Color('--rd-color-rgb-square-edge', '149 200 177'),
  SQUARE_BACKGROUND: new Color('--rd-color-rgb-square-background', '149 200 177'),

  SQUARE_BLUR: new Color('--rd-color-rgb-square-blur', '149 200 177'),
  SQUARE_HIGHLIGHTED: new Color('--rd-color-rgb-square-highlighted', '149 200 177'),
  SQUARE_BLUR_AND_HIGHLIGHTED: new Color('--rd-color-rgb-square-blur-n-highlighted', '251 176 60'),
} as const;

export const getColorVariable = (token: keyof typeof ColorsMap): string => {
  return ColorsMap[token].cssVariable;
};
