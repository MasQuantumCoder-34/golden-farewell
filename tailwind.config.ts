import type { Config } from "tailwindcss";
export default { content:["./app/**/*.tsx","./components/**/*.tsx"],
 theme:{extend:{colors:{emerald:{DEFAULT:"#0B3D2E",deep:"#072A20"},cream:"#F6EFDC",gold:{DEFAULT:"#C9A24B",soft:"#E3C679"}},
 fontFamily:{serif:["var(--font-serif)","serif"],sans:["var(--font-sans)","sans-serif"]}}},plugins:[] } satisfies Config;
