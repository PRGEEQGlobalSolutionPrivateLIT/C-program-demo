export interface TechnologyDefinition {
  id: string;
  name: string;
  monacoLanguage: string;
  extension: string;
}

export const TECHNOLOGIES: Record<string, TechnologyDefinition> = {
  c: {
    id: "c",
    name: "C",
    monacoLanguage: "c",
    extension: ".c",
  },
};

export const DEFAULT_C_CODE = `#include <stdio.h>

int main(void)
{
    printf("Hello, eLabs!\\n");

    return 0;
}
`;