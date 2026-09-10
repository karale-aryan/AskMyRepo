import React from "react";
import { Code2 } from "lucide-react";
import type { IconType } from "react-icons";
import { FaJava } from "react-icons/fa6";
import {
  SiC,
  SiCplusplus,
  SiCss,
  SiDart,
  SiDocker,
  SiElixir,
  SiGo,
  SiGraphql,
  SiHaskell,
  SiHtml5,
  SiJavascript,
  SiJson,
  SiKotlin,
  SiLua,
  SiMarkdown,
  SiOpenjdk,
  SiPhp,
  SiPython,
  SiR,
  SiRuby,
  SiRust,
  SiScala,
  SiSharp,
  SiShell,
  SiSqlite,
  SiSwift,
  SiTypescript,
  SiVuedotjs,
  SiYaml,
} from "react-icons/si";

const LANGUAGE_ICON_MAP: Record<string, IconType> = {
  c: SiC,
  "c++": SiCplusplus,
  cpp: SiCplusplus,
  "c#": SiSharp,
  csharp: SiSharp,
  cs: SiSharp,
  css: SiCss,
  dart: SiDart,
  dockerfile: SiDocker,
  docker: SiDocker,
  elixir: SiElixir,
  go: SiGo,
  golang: SiGo,
  graphql: SiGraphql,
  gql: SiGraphql,
  haskell: SiHaskell,
  hs: SiHaskell,
  html: SiHtml5,
  java: FaJava,
  javascript: SiJavascript,
  js: SiJavascript,
  jsx: SiJavascript,
  json: SiJson,
  kotlin: SiKotlin,
  kt: SiKotlin,
  lua: SiLua,
  markdown: SiMarkdown,
  md: SiMarkdown,
  openjdk: SiOpenjdk,
  php: SiPhp,
  python: SiPython,
  py: SiPython,
  r: SiR,
  ruby: SiRuby,
  rb: SiRuby,
  rust: SiRust,
  rs: SiRust,
  scala: SiScala,
  shell: SiShell,
  sh: SiShell,
  bash: SiShell,
  zsh: SiShell,
  sql: SiSqlite,
  swift: SiSwift,
  typescript: SiTypescript,
  ts: SiTypescript,
  tsx: SiTypescript,
  vue: SiVuedotjs,
  yaml: SiYaml,
  yml: SiYaml,
};

interface LanguageIconProps extends React.SVGProps<SVGSVGElement> {
  language?: string | null;
  className?: string;
}

export function LanguageIcon({ language, className, ...props }: LanguageIconProps) {
  if (!language) {
    return <Code2 className={className} {...(props as React.ComponentProps<typeof Code2>)} />;
  }

  const normalized = language.trim().toLowerCase();
  const IconComponent = LANGUAGE_ICON_MAP[normalized];

  if (IconComponent) {
    return <IconComponent className={className} {...props} />;
  }

  return <Code2 className={className} {...(props as React.ComponentProps<typeof Code2>)} />;
}
