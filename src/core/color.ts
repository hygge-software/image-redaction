type RGB = `${number} ${number} ${number}`;

class Color {
  constructor(public readonly variable: `--rd-color-rgb-${string}`, public readonly rgb: RGB) {}

  public get cssVariable(): string {
    return `var(${this.variable}, ${this.rgb})`;
  }
}

const ColorsMap = {
  PRIMARY: new Color('--rd-color-rgb-primary', '149 200 177'),
  ERROR: new Color('--rd-color-rgb-error', '185 46 0'),
  ACCENT: new Color('--rd-color-rgb-accent', '251 176 60'),
  TEXT_BACKGROUND: new Color('--rd-color-rgb-text-background', '255 255 255'),
  TEXT: new Color('--rd-color-rgb-text', '66 76 81'),
} as const;

export const getColorVariable = (token: keyof typeof ColorsMap): string => {
  return ColorsMap[token].cssVariable;
};
