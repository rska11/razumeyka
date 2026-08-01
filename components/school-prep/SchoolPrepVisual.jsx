"use client";

const palettes = {
  blue: ["#E9F3FF", "#CBE3FF", "#3478F6"],
  purple: ["#F2ECFF", "#DDCFFF", "#7957E8"],
  pink: ["#FFF0F7", "#FFD3E7", "#EA4C98"],
  orange: ["#FFF3E8", "#FFD9B6", "#F07A2B"],
  green: ["#EAFBF4", "#C6F1DF", "#21A77A"],
  yellow: ["#FFF8DE", "#FFE9A3", "#D99414"],
  cyan: ["#E8FBFF", "#C5F2FA", "#248EAA"],
};

const visualPalette = {
  notebook: "blue", pencil: "yellow", book: "purple", ruler: "cyan", folder: "blue",
  folderBlue: "blue", folderGreen: "green", toyCar: "orange", candy: "pink", eraser: "pink",
  sun: "yellow", wash: "cyan", breakfast: "orange", backpack: "purple", shoes: "blue",
  cat: "orange", house: "blue", tree: "green", cloud: "cyan", chair: "purple", butterfly: "pink", stone: "blue",
  ball: "blue", honey: "yellow", bowl: "cyan", poppy: "pink", bridge: "orange", mouse: "purple",
  juice: "orange", fox: "orange", nose: "pink", sparkle: "yellow", search: "blue",
  walk: "green", handshake: "purple", key: "yellow", map: "green", bell: "orange",
  compass: "blue", feather: "pink", lantern: "yellow", crystal: "cyan", crystalGold: "yellow",
  clap: "orange", crossMove: "purple", breathe: "cyan", idea: "yellow", materials: "blue",
  create: "green", decorate: "pink", check: "green", reread: "blue", example: "purple",
  ask: "orange", pause: "cyan", retry: "green", explorer: "orange",
};

function Icon({ name }) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2.1,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };

  switch (name) {
    case "notebook":
      return <><path {...common} d="M7 4.5h11v15H7zM10 4.5v15M5 7h3M5 11h3M5 15h3" /><path {...common} d="M13 9h3M13 13h3" /></>;
    case "pencil":
      return <><path {...common} d="m5 18 1-4L16.5 3.5l4 4L10 18l-5 1zM14.5 5.5l4 4M6 14l4 4" /></>;
    case "book":
      return <><path {...common} d="M4 5.5c3.3-.7 5.9.1 8 2v12c-2.1-1.9-4.7-2.7-8-2zM20 5.5c-3.3-.7-5.9.1-8 2v12c2.1-1.9 4.7-2.7 8-2z" /><path {...common} d="M12 7.5v12" /></>;
    case "ruler":
      return <><path {...common} d="m4 16 12-12 4 4L8 20zM13 7l2 2M10 10l2 2M7 13l2 2" /></>;
    case "folder":
    case "folderBlue":
    case "folderGreen":
      return <><path {...common} d="M3.5 7h6l2-2h9v14h-17z" /><path {...common} d="M3.5 9h17" /></>;
    case "toyCar":
      return <><path {...common} d="M4 15v-4l3-4h9l4 5v3zM7 11h10M7 18a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM17 18a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" /></>;
    case "candy":
      return <><path {...common} d="M8 9c2-2 6-2 8 0s2 4 0 6-6 2-8 0-2-4 0-6ZM8 10 3 7l1 5-1 5 5-3M16 10l5-3-1 5 1 5-5-3" /></>;
    case "eraser":
      return <><path {...common} d="m5 15 9-10 5 5-8 9H7zM11 19l-5-5M13 7l5 5" /></>;
    case "sun":
      return <><circle {...common} cx="12" cy="12" r="4" /><path {...common} d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9 7 7M17 17l2.1 2.1M19.1 4.9 17 7M7 17l-2.1 2.1" /></>;
    case "wash":
      return <><path {...common} d="M12 3S6 9.2 6 14a6 6 0 0 0 12 0c0-4.8-6-11-6-11Z" /><path {...common} d="M9 15c.7 1.7 2 2.5 4 2.5" /></>;
    case "breakfast":
      return <><path {...common} d="M5 9h12v4a6 6 0 0 1-12 0zM17 10h2a2 2 0 0 1 0 4h-2M7 20h10M8 5c0 1 1 1.3 1 2.3M12 4c0 1 1 1.3 1 2.3" /></>;
    case "backpack":
      return <><path {...common} d="M6 10a6 6 0 0 1 12 0v10H6zM9 7V5h6v2M8 13h8v5H8zM4 12v5M20 12v5" /></>;
    case "shoes":
      return <><path {...common} d="M4 15c3 .5 5-1 6-4 1 3 3 4 6 5l4 1v3H4zM5 9l4 2M15 7l-2 5" /></>;
    case "cat":
      return <><path {...common} d="m7 8 1-4 4 3 4-3 1 4a8 8 0 1 1-10 0Z" /><path {...common} d="M9 12h.1M15 12h.1M10 16c1.3 1 2.7 1 4 0M5 14H2M19 14h3" /></>;
    case "house":
      return <><path {...common} d="m3 11 9-8 9 8" /><path {...common} d="M5 10v10h14V10M9 20v-6h6v6M8 10h2M14 10h2" /></>;
    case "tree":
      return <><path {...common} d="M12 21v-6M9 21h6" /><path {...common} d="M12 3a5 5 0 0 0-4.8 3.5A4.5 4.5 0 0 0 8 15h8a4.5 4.5 0 0 0 .8-8.5A5 5 0 0 0 12 3Z" /></>;
    case "cloud":
      return <><path {...common} d="M5 18a4 4 0 0 1-.4-8A6 6 0 0 1 16 8a5 5 0 1 1 1 10z" /></>;
    case "chair":
      return <><path {...common} d="M7 12V5h10v7M5 12h14v4H5zM7 16v5M17 16v5" /></>;
    case "butterfly":
      return <><path {...common} d="M12 9c-2-5-8-5-8-1 0 3 3 5 8 6M12 9c2-5 8-5 8-1 0 3-3 5-8 6M12 9v10M9 20l3-3 3 3" /></>;
    case "stone":
      return <><path {...common} d="m4 17 3-8 5-4 6 3 2 9-4 3H8z" /><path {...common} d="m7 9 5 3 6-4M12 12v8" /></>;
    case "ball":
      return <><circle {...common} cx="12" cy="12" r="9" /><path {...common} d="M5 7c5 2 9 7 12 12M19 6c-3 5-8 8-15 9M11 3c2 5 1 12-2 17" /></>;
    case "honey":
      return <><path {...common} d="M7 8h10l-1 12H8zM8 5h8v3H8z" /><path {...common} d="M9 13c2-3 4 3 6 0v4c-2 3-4-3-6 0z" /></>;
    case "bowl":
      return <><path {...common} d="M4 10h16a8 8 0 0 1-16 0ZM8 20h8M7 7c1-2 2-2 3 0M12 7c1-2 2-2 3 0" /></>;
    case "poppy":
      return <><circle {...common} cx="12" cy="10" r="2" /><path {...common} d="M12 8c-5-7-9 2-2 3M14 11c7-1 3-10-2-3M12 12c-5 7-9-2-2-3M14 9c7 1 3 10-2 3M12 12v9M12 17l-4-2" /></>;
    case "bridge":
      return <><path {...common} d="M3 18h18M5 18V9h14v9M5 12c4-5 10-5 14 0M9 11v7M15 11v7" /></>;
    case "mouse":
      return <><path {...common} d="M7 8a3 3 0 1 1 4-3M17 8a3 3 0 1 0-4-3M6 12a6 6 0 0 1 12 0v3a6 6 0 0 1-12 0zM10 13h.1M14 13h.1M12 15v2M6 14H2M18 14h4" /></>;
    case "juice":
      return <><path {...common} d="M7 8h10l-1 12H8zM9 4h7l-2 5M8 12h8" /><path {...common} d="M11 15h2" /></>;
    case "fox":
    case "explorer":
      return <><path {...common} d="m5 7 2-4 4 3h2l4-3 2 4-2 11-5 3-5-3zM9 12h.1M15 12h.1M10 16c1.3 1 2.7 1 4 0" /></>;
    case "nose":
      return <><path {...common} d="M12 4c-1 5-4 8-3 12 1 3 7 3 8-1M10 17c-2 1-4 0-5-1" /></>;
    case "walk":
      return <><circle {...common} cx="12" cy="4" r="2" /><path {...common} d="m10 7 3 5 4 2M13 12l-1 5-4 4M12 17l5 4M10 9 6-1" /></>;
    case "sparkle":
      return <><path {...common} d="m12 2 1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8zM19 3v4M17 5h4" /></>;
    case "search":
      return <><circle {...common} cx="10" cy="10" r="6" /><path {...common} d="m14.5 14.5 6 6M8 8h4M10 6v4" /></>;
    case "handshake":
      return <><path {...common} d="m3 13 5-5 4 2 4-2 5 5-7 7-4-4-2 2zM8 8l3-3 4 3M7 15l3 3M11 16l3 2" /></>;
    case "key":
      return <><circle {...common} cx="8" cy="11" r="5" /><path {...common} d="m12 14 9 7M16 18l2-2M18 20l2-2" /></>;
    case "map":
      return <><path {...common} d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3zM9 3v15M15 6v15" /><path {...common} d="m11 10 2 2 4-4" /></>;
    case "bell":
      return <><path {...common} d="M6 17h12l-2-3V9a4 4 0 0 0-8 0v5zM10 20h4" /></>;
    case "compass":
      return <><circle {...common} cx="12" cy="12" r="9" /><path {...common} d="m15 9-2 5-5 2 2-5z" /></>;
    case "feather":
      return <><path {...common} d="M20 4C11 3 5 9 5 17l-2 4 4-2c8 0 14-6 13-15ZM7 17 17 7M10 14H6M13 11V7" /></>;
    case "lantern":
      return <><path {...common} d="M8 8h8l2 11H6zM9 4h6v4M8 12h8M10 15h4" /></>;
    case "crystalGold":
    case "crystal":
      return <><path {...common} d="m8 4-5 6 9 11 9-11-5-6zM3 10h18M8 4l4 6 4-6M12 10v11" /></>;
    case "clap":
      return <><path {...common} d="m7 14-2-6c-.5-2 2-3 3-1l2 4V4c0-2 3-2 3 0v6l2-4c1-2 3 0 2 2l-2 7c-.7 3-3 5-6 4-2-.7-3-2-4-4zM19 3l2-2M20 7h3M17 1V0" /></>;
    case "crossMove":
      return <><circle {...common} cx="12" cy="4" r="2" /><path {...common} d="M12 6v7M5 9l14 6M19 9 5 15M12 13l-4 8M12 13l4 8" /></>;
    case "breathe":
      return <><path {...common} d="M4 9c4-5 7-2 5 1s-5 0-2-2M4 15c5-4 9-1 6 2s-5 0-2-2M13 10c4-4 8-2 7 1s-4 2-5 1" /></>;
    case "idea":
      return <><path {...common} d="M8 14a6 6 0 1 1 8 0c-1 1-1 2-1 3H9c0-1 0-2-1-3ZM9 20h6M12 2V0M4 4 2 2M20 4l2-2" /></>;
    case "materials":
      return <><path {...common} d="M5 4h11v15H5zM8 8h5M8 12h5M8 16h3M16 8l4-4M17 11l4-4" /></>;
    case "create":
      return <><path {...common} d="M4 20h16M6 17l4-10 4 10M8 13h4M16 5l2-2 3 3-2 2z" /></>;
    case "decorate":
      return <><path {...common} d="m12 3 2.5 5 5.5.8-4 3.9.9 5.5-4.9-2.6-4.9 2.6.9-5.5-4-3.9 5.5-.8z" /></>;
    case "check":
      return <><circle {...common} cx="12" cy="12" r="9" /><path {...common} d="m7 12 3 3 7-7" /></>;
    case "reread":
      return <><path {...common} d="M4 5h7v14H4zM13 5h7v14h-7M7 9h2M15 9h2M7 13h2M15 13h2M3 3l2 2-2 2" /></>;
    case "example":
      return <><path {...common} d="M5 4h14v16H5zM8 8h8M8 12h5M8 16h7" /><path {...common} d="m15 11 2 2 3-4" /></>;
    case "ask":
      return <><circle {...common} cx="12" cy="12" r="9" /><path {...common} d="M9.8 9a2.4 2.4 0 1 1 3.7 2c-1 .6-1.5 1-1.5 2M12 17h.1" /></>;
    case "pause":
      return <><circle {...common} cx="12" cy="12" r="9" /><path {...common} d="M9 8v8M15 8v8" /></>;
    case "retry":
      return <><path {...common} d="M4 12a8 8 0 1 0 2-5.3M4 4v6h6" /></>;
    default:
      return <><circle {...common} cx="12" cy="12" r="8" /><path {...common} d="M8 12h8M12 8v8" /></>;
  }
}

export function SchoolPrepVisual({ name, label = "", compact = false, className = "" }) {
  const paletteName = visualPalette[name] || "blue";
  const [from, to, ink] = palettes[paletteName];
  return (
    <span
      className={`inline-grid shrink-0 place-items-center overflow-hidden rounded-[22px] border border-white/80 shadow-[inset_0_1px_0_rgba(255,255,255,.9),0_12px_28px_rgba(22,40,72,.09)] ${compact ? "h-11 w-11 rounded-[15px]" : "h-[74px] w-[74px] sm:h-[88px] sm:w-[88px]"} ${className}`}
      style={{ background: `linear-gradient(145deg, ${from}, ${to})`, color: ink }}
      role={label ? "img" : undefined}
      aria-label={label || undefined}
      aria-hidden={label ? undefined : "true"}
    >
      <svg viewBox="0 0 24 24" className={compact ? "h-7 w-7" : "h-11 w-11 sm:h-12 sm:w-12"} aria-hidden="true">
        <Icon name={name} />
      </svg>
    </span>
  );
}

const shapeColors = {
  blue: "#3478F6",
  yellow: "#F4B52E",
  pink: "#EA4C98",
  green: "#21A77A",
  orange: "#F07A2B",
  purple: "#7957E8",
};

export function SchoolPrepShape({ shape = "circle", color = "blue", size = "large", className = "" }) {
  const px = size === "small" ? 34 : size === "medium" ? 48 : 62;
  const fill = shapeColors[color] || shapeColors.blue;
  return (
    <span className={`inline-grid place-items-center ${className}`} style={{ width: px, height: px }} aria-hidden="true">
      <svg viewBox="0 0 64 64" className="h-full w-full drop-shadow-[0_8px_10px_rgba(31,46,79,.16)]">
        {shape === "triangle" && <path d="M32 7 59 55H5Z" fill={fill} stroke="white" strokeWidth="4" strokeLinejoin="round" />}
        {shape === "square" && <rect x="8" y="8" width="48" height="48" rx="9" fill={fill} stroke="white" strokeWidth="4" />}
        {shape === "diamond" && <path d="m32 5 27 27-27 27L5 32Z" fill={fill} stroke="white" strokeWidth="4" strokeLinejoin="round" />}
        {shape === "star" && <path d="m32 5 8 17 19 2-14 13 4 19-17-9-17 9 4-19L5 24l19-2Z" fill={fill} stroke="white" strokeWidth="4" strokeLinejoin="round" />}
        {shape === "circle" && <circle cx="32" cy="32" r="25" fill={fill} stroke="white" strokeWidth="4" />}
      </svg>
    </span>
  );
}

function SceneItem({ item }) {
  if (item.gap) return <span className="grid h-[72px] min-w-[64px] place-items-center rounded-[18px] border-2 border-dashed border-brand-purple/28 bg-white/70 text-3xl font-black text-brand-purple">?</span>;
  if (item.text) return <span className="grid min-h-[64px] min-w-[64px] place-items-center rounded-[18px] bg-white px-4 text-2xl font-black text-ink shadow-sm">{item.text}</span>;
  if (item.shape) return <SchoolPrepShape {...item} />;
  return <SchoolPrepVisual name={item.visual} label={item.label} compact={item.compact} />;
}

export function SchoolPrepScene({ scene }) {
  if (!scene) return null;

  if (scene.type === "counter") {
    const batches = scene.batches || [scene.count];
    return (
      <div className="mx-auto flex max-w-[760px] flex-wrap items-center justify-center gap-3 sm:gap-4" role="img" aria-label={scene.label}>
        {batches.map((amount, batchIndex) => (
          <div key={batchIndex} className="flex flex-wrap items-center justify-center gap-2 rounded-[20px] border border-white bg-white/82 p-3 shadow-sm">
            {Array.from({ length: amount }, (_, index) => (
              <SchoolPrepVisual key={index} name={scene.visual || "lantern"} compact />
            ))}
          </div>
        ))}
      </div>
    );
  }

  if (scene.type === "groups") {
    return (
      <div className="mx-auto grid max-w-[720px] gap-4 sm:grid-cols-2" role="img" aria-label={scene.label}>
        {scene.groups.map((group) => (
          <div key={group.label} className="rounded-[22px] border border-white bg-white/82 p-4 shadow-sm">
            <p className="mb-3 text-sm font-extrabold text-ink/62">{group.label}</p>
            <div className="flex flex-wrap justify-center gap-2.5">
              {group.items.map((item, index) => <SceneItem key={index} item={item} />)}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-[760px] flex-wrap items-center justify-center gap-3 sm:gap-4" role="img" aria-label={scene.label}>
      {scene.items.map((item, index) => (
        <span key={index} className="inline-flex items-center gap-3">
          <SceneItem item={item} />
          {item.after && <span className="text-2xl font-black text-ink/35">{item.after}</span>}
        </span>
      ))}
    </div>
  );
}
