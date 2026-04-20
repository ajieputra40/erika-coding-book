import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "./components/ui/button";

const google = {
  blue: "#4285F4",
  red: "#EA4335",
  yellow: "#FBBC05",
  green: "#34A853",
  ink: "#202124",
  line: "#E0E3E7",
  bg: "#F8FAFD",
};

const googlePalette = [google.blue, google.red, google.yellow, google.green];

const googleSectionBlocks = ["#E8F0FE", "#FCE8E6", "#FEF7E0", "#E6F4EA"];

function GoogleColorBlocks({ className = "" }) {
  return (
    <div className={`grid grid-cols-4 overflow-hidden rounded-full ${className}`.trim()}>
      {googlePalette.map((c) => (
        <div key={c} className="h-full" style={{ background: c }} />
      ))}
    </div>
  );
}

const ASSET_BASE = `${import.meta.env.BASE_URL}assets/`;
const ERIKA_CHARACTER = `${ASSET_BASE}erika-character.png`;
const ERIKA_CAKE = `${ASSET_BASE}erika-cake.png`;
const ERIKA_FACE = `${ASSET_BASE}erika-face.png`;
const ERIKA_FACE_SAME = `${ASSET_BASE}faces/erika-same.png`;
const ERIKA_FACE_DIFF = `${ASSET_BASE}faces/erika-different.png`;

function getFriendName() {
  const p = new URLSearchParams(window.location.search);
  return (p.get("friend") || p.get("name") || "Friend").trim();
}

function speakGreeting(friendName, { force = false, onStart, onEnd, onBoundary } = {}) {
  if (typeof window === "undefined") return;
  if (!("speechSynthesis" in window) || !("SpeechSynthesisUtterance" in window)) return;
  if (window.__erikaGreetingSpoken && !force) return;

  const synth = window.speechSynthesis;
  const text = `Hi ${friendName}. Welcome to Erika's birthday coding adventure. Thank you for being Erika's friend and celebrating this special day.`;
  let launched = false;

  const run = () => {
    if (launched) return;
    if (window.__erikaGreetingSpoken && !force) return;
    if (window.__erikaGreetingSpeaking && !force) return;
    if (synth.speaking && !force) return;
    launched = true;

    const voices = synth.getVoices();
    const googleEnVoice =
      voices.find((v) => /google/i.test(v.name) && /en/i.test(v.lang)) ||
      voices.find((v) => /google/i.test(v.name)) ||
      voices.find((v) => /en/i.test(v.lang));

    const utterance = new SpeechSynthesisUtterance(text);
    if (googleEnVoice) utterance.voice = googleEnVoice;
    utterance.rate = 0.95;
    utterance.pitch = 1;
    utterance.onstart = () => {
      window.__erikaGreetingSpeaking = true;
      window.__erikaGreetingSpoken = true;
      onStart?.(text);
    };
    utterance.onend = () => {
      window.__erikaGreetingSpeaking = false;
      onEnd?.();
    };
    utterance.onerror = () => {
      window.__erikaGreetingSpeaking = false;
      window.__erikaGreetingSpoken = false;
      onEnd?.();
    };
    utterance.onboundary = (event) => {
      if (typeof event.charIndex === "number") {
        onBoundary?.(event.charIndex, text);
      }
    };

    synth.cancel();
    synth.speak(utterance);
  };

  if (synth.getVoices().length > 0) {
    run();
    return;
  }

  const onVoicesChanged = () => {
    run();
    synth.removeEventListener?.("voiceschanged", onVoicesChanged);
  };

  synth.addEventListener?.("voiceschanged", onVoicesChanged);
  setTimeout(run, 400);
}

function speakSectionGuide(text, { force = false, speechKey } = {}) {
  if (typeof window === "undefined") return;
  if (!("speechSynthesis" in window) || !("SpeechSynthesisUtterance" in window)) return;
  if (!force && (window.__erikaSectionSpokenKey === speechKey || window.__erikaSectionRequestedKey === speechKey)) return;

  const synth = window.speechSynthesis;
  window.__erikaSectionRequestedKey = speechKey;
  let launched = false;

  const run = () => {
    if (launched) return;
    if (window.__erikaSectionSpokenKey === speechKey && !force) return;
    if (window.__erikaSectionSpeaking && !force) return;
    if (synth.speaking && !force) return;
    launched = true;

    const voices = synth.getVoices();
    const googleEnVoice =
      voices.find((v) => /google/i.test(v.name) && /en/i.test(v.lang)) ||
      voices.find((v) => /google/i.test(v.name)) ||
      voices.find((v) => /en/i.test(v.lang));

    const utterance = new SpeechSynthesisUtterance(text);
    if (googleEnVoice) utterance.voice = googleEnVoice;
    utterance.rate = 0.95;
    utterance.pitch = 1;
    utterance.onstart = () => {
      window.__erikaSectionSpeaking = true;
      window.__erikaSectionSpokenKey = speechKey;
      window.__erikaSectionRequestedKey = speechKey;
    };
    utterance.onend = () => {
      window.__erikaSectionSpeaking = false;
    };
    utterance.onerror = () => {
      window.__erikaSectionSpeaking = false;
      window.__erikaSectionSpokenKey = "";
      window.__erikaSectionRequestedKey = "";
    };

    synth.cancel();
    synth.speak(utterance);
  };

  if (synth.getVoices().length > 0) {
    run();
    return;
  }

  const onVoicesChanged = () => {
    run();
    synth.removeEventListener?.("voiceschanged", onVoicesChanged);
  };

  synth.addEventListener?.("voiceschanged", onVoicesChanged);
  setTimeout(run, 400);
}

function ImageFallback({ src, alt, className, fallback }) {
  const [error, setError] = useState(false);
  if (error) return <div className={`${className} grid place-items-center bg-slate-100`}>{fallback}</div>;
  return <img src={src} alt={alt} className={className} onError={() => setError(true)} />;
}

function ConfettiBurst({ burstKey }) {
  if (!burstKey) return null;
  const colors = [google.blue, google.red, google.yellow, google.green];
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: 28 }).map((_, i) => {
        const x = Math.random() * 100;
        const y = 25 + Math.random() * 35;
        const tx = (Math.random() - 0.5) * 220;
        const ty = 80 + Math.random() * 180;
        const rot = (Math.random() - 0.5) * 540;
        const color = colors[i % colors.length];
        return (
          <motion.span
            key={`${burstKey}-${i}`}
            className="absolute h-2 w-2 rounded-sm"
            style={{ left: `${x}%`, top: `${y}%`, background: color }}
            initial={{ opacity: 1, x: 0, y: 0, rotate: 0 }}
            animate={{ opacity: 0, x: tx, y: ty, rotate: rot }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        );
      })}
    </div>
  );
}

function FloatingBubbles() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: 12 }).map((_, i) => {
        const left = 6 + i * 8;
        const duration = 3 + (i % 4);
        return (
          <motion.span
            key={i}
            className="absolute bottom-[-24px] rounded-full border border-white/70 bg-white/30"
            style={{ left: `${left}%`, width: 10 + (i % 3) * 8, height: 10 + (i % 3) * 8 }}
            animate={{ y: [-4, -240], opacity: [0, 0.6, 0] }}
            transition={{ duration, repeat: Infinity, ease: "easeOut", delay: i * 0.2 }}
          />
        );
      })}
    </div>
  );
}

function Frame({ title, section, children }) {
  const sectionBlock = googleSectionBlocks[(section - 1) % googleSectionBlocks.length];
  return (
    <div className="relative overflow-hidden rounded-3xl border p-4 shadow-sm" style={{ borderColor: google.line, background: sectionBlock }}>
      <GoogleColorBlocks className="absolute inset-x-0 top-0 h-1.5" />
      <div className="mb-2 inline-flex rounded-full px-3 py-1 text-xs font-bold text-white" style={{ background: google.blue }}>
        Section {section}
      </div>
      <h2 className="text-xl font-black" style={{ color: google.ink }}>{title}</h2>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function Section1Greeting({ friendName }) {
  const subtitleText = useMemo(
    () =>
      `Hi ${friendName}. Welcome to Erika's birthday coding adventure. Thank you for being Erika's friend and celebrating this special day.`,
    [friendName]
  );
  const [subtitleIndex, setSubtitleIndex] = useState(subtitleText.length);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showPlayHint, setShowPlayHint] = useState(false);

  const startSpeech = (force = false) =>
    speakGreeting(friendName, {
      force,
      onStart: () => {
        setIsSpeaking(true);
        setShowPlayHint(false);
        setSubtitleIndex(0);
      },
      onBoundary: (charIndex) => {
        setSubtitleIndex(Math.max(0, Math.min(subtitleText.length, charIndex)));
      },
      onEnd: () => {
        setIsSpeaking(false);
        setSubtitleIndex(subtitleText.length);
      },
    });

  useEffect(() => {
    startSpeech(false);

    const startedAt = Date.now();
    const retryId = window.setInterval(() => {
      if (window.__erikaGreetingSpoken) {
        window.clearInterval(retryId);
        return;
      }
      if (Date.now() - startedAt > 6000) {
        window.clearInterval(retryId);
        if (!window.__erikaGreetingSpoken) setShowPlayHint(true);
        return;
      }
      startSpeech(false);
    }, 500);

    const onVisible = () => {
      if (document.visibilityState === "visible" && !window.__erikaGreetingSpoken) {
        startSpeech(false);
      }
    };
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      window.clearInterval(retryId);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [friendName]);

  useEffect(() => {
    if (!isSpeaking) return;
    const fallbackSubtitle = window.setInterval(() => {
      setSubtitleIndex((prev) => Math.min(subtitleText.length, prev + 1));
    }, 45);
    return () => window.clearInterval(fallbackSubtitle);
  }, [isSpeaking, subtitleText.length]);

  return (
    <Frame title="Greeting" section={1}>
      <div className="space-y-4">
        <ImageFallback src={ERIKA_CAKE} alt="Erika" className="mx-auto h-56 w-56 rounded-3xl object-cover" fallback="👧" />
        <div className="flex justify-center">
          <Button onClick={() => startSpeech(true)} style={{ background: google.blue }}>
            Play Voice
          </Button>
        </div>
        {showPlayHint && (
          <div className="rounded-xl p-3 text-sm text-white" style={{ background: google.blue }}>
            Tap Play Voice to start audio on this device.
          </div>
        )}
        <div
          className="min-h-[88px] rounded-2xl p-4 text-sm leading-7 text-white"
          style={{ background: "#EA4335" }}
        >
          <span>{subtitleText.slice(0, subtitleIndex)}</span>
          {isSpeaking && (
            <motion.span
              className="ml-1 inline-block"
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 0.8, repeat: Infinity }}
            >
              |
            </motion.span>
          )}
        </div>
      </div>
    </Frame>
  );
}

function Section2Maze() {
  const size = 5;
  const cell = 52;
  const board = size * cell;
  const goal = { x: 4, y: 4 };
  const walls = new Set(["1,0", "1,1", "3,1", "3,2", "1,3", "2,3"]);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [burst, setBurst] = useState(0);
  const won = pos.x === goal.x && pos.y === goal.y;

  useEffect(() => {
    if (won) setBurst((b) => b + 1);
  }, [won]);

  const move = (dx, dy) => {
    setPos((prev) => {
      const next = { x: prev.x + dx, y: prev.y + dy };
      if (next.x < 0 || next.y < 0 || next.x >= size || next.y >= size) return prev;
      if (walls.has(`${next.x},${next.y}`)) return prev;
      return next;
    });
  };

  return (
    <Frame title="Algorithm: Maze" section={2}>
      <div className="relative space-y-4">
        <div className="mx-auto relative" style={{ width: board, height: board }}>
          <div className="grid h-full w-full grid-cols-5 grid-rows-5 overflow-hidden rounded-2xl border" style={{ borderColor: google.line }}>
            {Array.from({ length: size * size }).map((_, idx) => {
              const x = idx % size;
              const y = Math.floor(idx / size);
              const isWall = walls.has(`${x},${y}`);
              const isGoal = x === goal.x && y === goal.y;
              return (
                <div
                  key={idx}
                  className="border grid place-items-center"
                  style={{
                    borderColor: "#ECEFF3",
                    background: isWall ? "#C7D2E0" : isGoal ? "#E6F4EA" : "#FFFFFF",
                  }}
                >
                  {isGoal ? "🚪" : ""}
                </div>
              );
            })}
          </div>

          <motion.div
            className="absolute left-0 top-0 z-10"
            animate={{ x: pos.x * cell, y: pos.y * cell, scale: won ? [1, 1.12, 1] : 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            style={{ width: cell, height: cell }}
          >
            <div className="grid h-full w-full place-items-center p-1">
              <ImageFallback src={ERIKA_FACE} alt="Erika face" className="h-10 w-10 rounded-full border-2 object-cover bg-white" fallback="👧" />
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-3 gap-2 max-w-[180px] mx-auto">
          <div />
          <Button onClick={() => move(0, -1)}>↑</Button>
          <div />
          <Button onClick={() => move(-1, 0)}>←</Button>
          <Button variant="outline" onClick={() => setPos({ x: 0, y: 0 })}>⟳</Button>
          <Button onClick={() => move(1, 0)}>→</Button>
          <div />
          <Button onClick={() => move(0, 1)}>↓</Button>
          <div />
        </div>

        {won && (
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl p-3 text-white font-bold" style={{ background: google.green }}>
            Erika finished the maze!
          </motion.div>
        )}
        <ConfettiBurst burstKey={burst} />
      </div>
    </Frame>
  );
}

function LetterBadge({ letter }) {
  return (
    <div className="relative h-14 w-14 overflow-hidden rounded-2xl border" style={{ borderColor: google.line }}>
      <ImageFallback src={ERIKA_FACE} alt="letter card" className="h-full w-full object-cover opacity-25" fallback="👧" />
      <div className="absolute inset-0 grid place-items-center text-xl font-black" style={{ color: google.ink }}>{letter}</div>
    </div>
  );
}

function Section3Sequence() {
  const [picked, setPicked] = useState({ 2: "", 5: "" });
  const [burst, setBurst] = useState(0);
  const correct = picked[2] === "C" && picked[5] === "F";

  useEffect(() => {
    if (correct) setBurst((b) => b + 1);
  }, [correct]);

  const options = ["B", "C", "E", "F", "G"];

  return (
    <Frame title="Sequence" section={3}>
      <div className="relative space-y-4">
        <p className="text-sm text-slate-600">Fill the missing alphabet sequence.</p>
        <div className="flex flex-wrap items-center justify-center gap-2">
          <LetterBadge letter="A" />
          <LetterBadge letter="B" />
          <button onClick={() => {}} className="h-14 w-14 rounded-2xl border-2 border-dashed text-lg font-bold" style={{ borderColor: google.blue }}>{picked[2] || "?"}</button>
          <LetterBadge letter="D" />
          <LetterBadge letter="E" />
          <button onClick={() => {}} className="h-14 w-14 rounded-2xl border-2 border-dashed text-lg font-bold" style={{ borderColor: google.blue }}>{picked[5] || "?"}</button>
          <LetterBadge letter="G" />
        </div>

        <div className="grid grid-cols-5 gap-2">
          {options.map((o) => (
            <motion.button
              key={o}
              whileTap={{ scale: 0.94 }}
              onClick={() => {
                setPicked((prev) => {
                  if (!prev[2]) return { ...prev, 2: o };
                  if (!prev[5]) return { ...prev, 5: o };
                  return prev;
                });
              }}
              className="rounded-xl border bg-white py-2"
              style={{ borderColor: google.line }}
            >
              <div className="mx-auto grid h-9 w-9 place-items-center rounded-lg" style={{ background: "#E8F0FE", color: google.blue, fontWeight: 800 }}>
                {o}
              </div>
            </motion.button>
          ))}
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setPicked({ 2: "", 5: "" })}>Clear</Button>
        </div>

        <AnimatePresence>
          {correct && (
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="rounded-xl p-3 text-white font-bold"
              style={{ background: google.green }}
            >
              Correct sequence!
            </motion.div>
          )}
        </AnimatePresence>
        <ConfettiBurst burstKey={burst} />
      </div>
    </Frame>
  );
}

function Section4Debugging() {
  const oddIndex = useMemo(() => Math.floor(Math.random() * 9), []);
  const [picked, setPicked] = useState(null);
  const [burst, setBurst] = useState(0);
  const correct = picked === oddIndex;

  useEffect(() => {
    if (correct) setBurst((b) => b + 1);
  }, [correct]);

  return (
    <Frame title="Debugging" section={4}>
      <div className="relative space-y-4">
        <p className="text-sm text-slate-600">Tap Erika with a different emotion.</p>
        <div className="grid grid-cols-3 gap-2">
          {Array.from({ length: 9 }).map((_, i) => (
            <motion.button
              whileTap={{ scale: 0.95 }}
              key={i}
              onClick={() => setPicked(i)}
              className="rounded-2xl border p-1"
              style={{ borderColor: picked === i ? google.blue : google.line }}
            >
              {i === oddIndex ? (
                <ImageFallback src={ERIKA_FACE_DIFF} alt="different emotion" className="h-20 w-full rounded-xl object-contain bg-white p-1" fallback="😮" />
              ) : (
                <ImageFallback src={ERIKA_FACE_SAME} alt="same emotion" className="h-20 w-full rounded-xl object-contain bg-white p-1" fallback="🙂" />
              )}
            </motion.button>
          ))}
        </div>
        {picked !== null && (
          <div className="rounded-xl p-3 text-white font-bold" style={{ background: correct ? google.green : google.red }}>
            {correct ? "Correct!" : "Try again."}
          </div>
        )}
        <ConfettiBurst burstKey={burst} />
      </div>
    </Frame>
  );
}

function Section5Variable() {
  const [items, setItems] = useState([
    { id: "apple", label: "Apple", emoji: "🍎", type: "fruit" },
    { id: "banana", label: "Banana", emoji: "🍌", type: "fruit" },
    { id: "carrot", label: "Carrot", emoji: "🥕", type: "veggie" },
    { id: "broccoli", label: "Broccoli", emoji: "🥦", type: "veggie" },
  ]);
  const [fruitBucket, setFruitBucket] = useState([]);
  const [veggieBucket, setVeggieBucket] = useState([]);
  const [dropPulse, setDropPulse] = useState("");
  const [selectedItemId, setSelectedItemId] = useState("");
  const [resultMsg, setResultMsg] = useState("");
  const [resultOk, setResultOk] = useState(false);
  const [burst, setBurst] = useState(0);

  const placeItem = (bucketType, id) => {
    const item = items.find((x) => x.id === id);
    if (!item) return;
    setItems((prev) => prev.filter((x) => x.id !== id));
    if (bucketType === "fruit") setFruitBucket((p) => [...p, item]);
    if (bucketType === "veggie") setVeggieBucket((p) => [...p, item]);
    const ok = item.type === bucketType;
    setResultOk(ok);
    setResultMsg(ok ? "Correct bucket!" : "Oops, wrong bucket.");
    setDropPulse(bucketType);
    setSelectedItemId("");
    setTimeout(() => setDropPulse(""), 350);
  };

  const selectedItem = items.find((x) => x.id === selectedItemId) || null;
  const allSorted = items.length === 0;
  const allCorrect =
    fruitBucket.every((x) => x.type === "fruit") &&
    veggieBucket.every((x) => x.type === "veggie") &&
    allSorted;

  useEffect(() => {
    if (allCorrect) setBurst((b) => b + 1);
  }, [allCorrect]);

  return (
    <Frame title="Variable: Fruits vs Veggies" section={5}>
      <div className="relative space-y-4">
        <div className="rounded-xl bg-white/80 p-3 text-sm" style={{ color: google.ink }}>
          Tap an item first, then tap a bucket button.
        </div>
        <div className="flex flex-wrap gap-2">
          <AnimatePresence>
            {items.map((item) => (
              <motion.div
                key={item.id}
                onClick={() => setSelectedItemId(item.id)}
                initial={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: -8 }}
                whileTap={{ scale: 0.96 }}
                className="cursor-pointer rounded-xl border bg-white px-3 py-2"
                style={{ borderColor: selectedItemId === item.id ? google.blue : google.line }}
              >
                {item.emoji} {item.label}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Button
            onClick={() => selectedItem && placeItem("fruit", selectedItem.id)}
            disabled={!selectedItem}
          >
            Put in Fruit
          </Button>
          <Button
            onClick={() => selectedItem && placeItem("veggie", selectedItem.id)}
            disabled={!selectedItem}
          >
            Put in Veggie
          </Button>
        </div>
        {selectedItem && (
          <div className="rounded-xl bg-white p-3 text-sm" style={{ border: `1px solid ${google.line}` }}>
            Selected: {selectedItem.emoji} {selectedItem.label}
          </div>
        )}
        {resultMsg && (
          <div className="rounded-xl p-3 text-white font-bold" style={{ background: resultOk ? google.green : google.red }}>
            {resultMsg}
          </div>
        )}
        {allSorted && (
          <div className="rounded-xl p-3 text-white font-bold" style={{ background: allCorrect ? google.green : google.red }}>
            {allCorrect ? "Great job! Everything is sorted correctly." : "Some items are in the wrong bucket."}
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <motion.div
            animate={dropPulse === "fruit" ? { scale: [1, 1.06, 1] } : { scale: 1 }}
            className="min-h-[130px] rounded-2xl p-3"
            style={{ background: "#FEF2F2" }}
          >
            <div className="font-black" style={{ color: google.red }}>Fruit Bucket</div>
            <div className="mt-2 text-2xl">{fruitBucket.map((i) => i.emoji).join(" ")}</div>
          </motion.div>

          <motion.div
            animate={dropPulse === "veggie" ? { scale: [1, 1.06, 1] } : { scale: 1 }}
            className="min-h-[130px] rounded-2xl p-3"
            style={{ background: "#E6F4EA" }}
          >
            <div className="font-black" style={{ color: google.green }}>Veggie Bucket</div>
            <div className="mt-2 text-2xl">{veggieBucket.map((i) => i.emoji).join(" ")}</div>
          </motion.div>
        </div>
        <ConfettiBurst burstKey={burst} />
      </div>
    </Frame>
  );
}

function Section6Condition() {
  const [flashlight, setFlashlight] = useState(false);
  const [lamp, setLamp] = useState(false);
  const [burst, setBurst] = useState(0);
  const lit = flashlight && lamp;
  const prevLit = useRef(false);

  useEffect(() => {
    if (lit && !prevLit.current) setBurst((b) => b + 1);
    prevLit.current = lit;
  }, [lit]);

  return (
    <Frame title="Condition: Light the Room" section={6}>
      <div className="relative space-y-4">
        <motion.div
          animate={{ backgroundColor: lit ? "#FFFDE7" : "#1F2937" }}
          className="rounded-2xl p-4 min-h-[200px]"
          style={{ color: lit ? google.ink : "#F9FAFB" }}
        >
          <div className="text-sm">Tap flashlight and lamp to light the room.</div>
          <div className="mt-8 text-center text-5xl">{lit ? "🏠✨" : "🏠🌑"}</div>
        </motion.div>

        <div className="grid grid-cols-2 gap-3">
          <button onClick={() => setFlashlight((v) => !v)} className="rounded-xl p-3 font-bold text-white" style={{ background: flashlight ? google.yellow : "#6B7280" }}>
            🔦 Flashlight {flashlight ? "ON" : "OFF"}
          </button>
          <button onClick={() => setLamp((v) => !v)} className="rounded-xl p-3 font-bold text-white" style={{ background: lamp ? google.blue : "#6B7280" }}>
            💡 Lamp {lamp ? "ON" : "OFF"}
          </button>
        </div>

        {lit && <div className="rounded-xl p-3 text-white font-bold" style={{ background: google.green }}>Room is bright again!</div>}
        <ConfettiBurst burstKey={burst} />
      </div>
    </Frame>
  );
}

function Section7Decomposition() {
  const [pick, setPick] = useState("");
  const [burst, setBurst] = useState(0);
  const ok = pick === "yellow";

  useEffect(() => {
    if (ok) setBurst((b) => b + 1);
  }, [ok]);

  return (
    <Frame title="Decomposition" section={7}>
      <div className="relative space-y-4">
        <div className="rounded-2xl border bg-white p-4" style={{ borderColor: google.line }}>
          <div className="text-sm text-slate-600">Pick the correct color for this object:</div>
          <div className="mt-2 text-center text-5xl">🍌</div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button onClick={() => setPick("red")} className="rounded-xl p-3 text-white font-bold" style={{ background: google.red }}>Red</button>
          <button onClick={() => setPick("yellow")} className="rounded-xl p-3 text-black font-bold" style={{ background: google.yellow }}>Yellow</button>
          <button onClick={() => setPick("blue")} className="rounded-xl p-3 text-white font-bold" style={{ background: google.blue }}>Blue</button>
          <button onClick={() => setPick("green")} className="rounded-xl p-3 text-white font-bold" style={{ background: google.green }}>Green</button>
        </div>
        {pick && <div className="rounded-xl p-3 text-white font-bold" style={{ background: ok ? google.green : google.red }}>{ok ? "Correct color." : "Not this one."}</div>}
        <ConfettiBurst burstKey={burst} />
      </div>
    </Frame>
  );
}

function Section8EncodeDecode() {
  const base = useMemo(() => ["🍎", "🍌", "🥕"], []);
  const cards = useMemo(() => [...base, ...base].sort(() => Math.random() - 0.5), [base]);
  const [open, setOpen] = useState([]);
  const [matched, setMatched] = useState([]);
  const [resultMsg, setResultMsg] = useState("");
  const [resultOk, setResultOk] = useState(false);
  const [burst, setBurst] = useState(0);

  const clickCard = (idx) => {
    if (open.includes(idx) || matched.includes(idx) || open.length === 2) return;
    const next = [...open, idx];
    setOpen(next);
    if (next.length === 2) {
      const [a, b] = next;
      if (cards[a] === cards[b]) {
        setResultOk(true);
        setResultMsg("Correct! It's a match.");
        setMatched((p) => [...p, a, b]);
        setTimeout(() => setOpen([]), 220);
      } else {
        setResultOk(false);
        setResultMsg("Not a match. Try again.");
        setTimeout(() => setOpen([]), 700);
      }
    }
  };

  useEffect(() => {
    if (matched.length === cards.length && cards.length > 0) {
      setBurst((b) => b + 1);
    }
  }, [matched, cards.length]);

  return (
    <Frame title="Encode & Decode" section={8}>
      <div className="relative space-y-4">
        <p className="text-sm text-slate-600">Open 2 same objects from 6 boxes.</p>
        <div className="grid grid-cols-3 gap-2">
          {cards.map((c, idx) => {
            const show = open.includes(idx) || matched.includes(idx);
            return (
              <motion.button
                key={idx}
                whileTap={{ scale: 0.95 }}
                onClick={() => clickCard(idx)}
                className="aspect-square rounded-2xl text-3xl font-bold"
                style={{ background: show ? "#FFFFFF" : google.blue, color: show ? google.ink : "#FFFFFF" }}
              >
                {show ? c : "?"}
              </motion.button>
            );
          })}
        </div>
        {resultMsg && (
          <div className="rounded-xl p-3 text-white font-bold" style={{ background: resultOk ? google.green : google.red }}>
            {resultMsg}
          </div>
        )}
        {matched.length === cards.length && cards.length > 0 && (
          <div className="rounded-xl p-3 text-white font-bold" style={{ background: google.green }}>
            Amazing! You found all matching pairs.
          </div>
        )}
        <ConfettiBurst burstKey={burst} />
      </div>
    </Frame>
  );
}

function Section9Loop() {
  const [answer, setAnswer] = useState("");
  const [burst, setBurst] = useState(0);
  const ok = answer === "🍌";

  useEffect(() => {
    if (ok) setBurst((b) => b + 1);
  }, [ok]);

  return (
    <Frame title="Loop Pattern" section={9}>
      <div className="relative space-y-4">
        <div className="rounded-2xl border bg-white p-4 text-center text-4xl" style={{ borderColor: google.line }}>
          🍎 🍌 🍎 🍌 🍎 ... ?
        </div>
        <div className="grid grid-cols-3 gap-2">
          {["🍎", "🍌", "🥕"].map((x) => (
            <button key={x} onClick={() => setAnswer(x)} className="rounded-xl border bg-white py-3 text-3xl" style={{ borderColor: google.line }}>{x}</button>
          ))}
        </div>
        {answer && <div className="rounded-xl p-3 text-white font-bold" style={{ background: ok ? google.green : google.red }}>{ok ? "Correct loop." : "Try again."}</div>}
        <ConfettiBurst burstKey={burst} />
      </div>
    </Frame>
  );
}

function Section10Closing({ friendName }) {
  return (
    <Frame title="Closing" section={10}>
      <div className="relative overflow-hidden rounded-2xl p-4" style={{ background: "#E8F0FE" }}>
        <FloatingBubbles />
        <div className="relative z-10 space-y-4 text-sm leading-7">
          <ImageFallback src={ERIKA_CHARACTER} alt="Erika" className="mx-auto h-36 w-36 rounded-3xl border-2 object-cover" fallback="👧" />
          <div className="rounded-2xl bg-white/85 p-4">
            Thank you <span className="font-black" style={{ color: google.green }}>{friendName}</span> for playing Erika's coding book.
            Erika is so happy to celebrate and learn with friends like you.
            Thank you for being Erika's friend.
          </div>
        </div>
      </div>
    </Frame>
  );
}

const sections = [
  Section1Greeting,
  Section2Maze,
  Section3Sequence,
  Section4Debugging,
  Section5Variable,
  Section6Condition,
  Section7Decomposition,
  Section8EncodeDecode,
  Section9Loop,
  Section10Closing,
];

export default function App() {
  const [index, setIndex] = useState(0);
  const friendName = useMemo(() => getFriendName(), []);
  const Current = sections[index];
  const sectionGuides = useMemo(
    () => [
      `Hi ${friendName}. Welcome to Erika's birthday coding adventure.`,
      "Algorithm section. Use the arrow buttons to move Erika through the maze and reach the exit door.",
      "Sequence section. Fill in the missing alphabet letters in the correct order.",
      "Debugging section. Find and tap the one Erika face with a different emotion.",
      "Variable section. Drag each item into the correct bucket: fruit or veggie.",
      "Condition section. Turn on flashlight and lamp so the room becomes bright.",
      "Decomposition section. Choose the correct color for the object shown.",
      "Encode and decode section. Open two boxes at a time and match all pairs.",
      "Loop section. Guess the next item in the repeating fruit pattern.",
      `Closing section. Thank you ${friendName} for playing Erika's coding book. Erika is so happy to celebrate and learn with friends like you. Thank you for being Erika's friend.`,
    ],
    [friendName]
  );

  useEffect(() => {
    if (index === 0) return;
    const speechKey = `section-${index}`;
    const text = sectionGuides[index];
    const startSpeech = (force = false) => speakSectionGuide(text, { force, speechKey });

    startSpeech(false);

    const retryId = window.setTimeout(() => {
      if (window.__erikaSectionSpokenKey !== speechKey) {
        startSpeech(false);
      }
    }, 700);

    const onVisible = () => {
      if (document.visibilityState === "visible" && window.__erikaSectionSpokenKey !== speechKey) {
        startSpeech(false);
      }
    };
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      window.clearTimeout(retryId);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [index, sectionGuides]);

  return (
    <div className="relative min-h-screen overflow-hidden p-3" style={{ background: "linear-gradient(180deg, #F8FAFD 0%, #EEF4FF 40%, #FFF9E8 100%)" }}>
      <div className="pointer-events-none absolute -left-16 top-10 h-56 w-56 rounded-full blur-3xl" style={{ background: "rgba(66,133,244,0.22)" }} />
      <div className="pointer-events-none absolute -right-16 top-40 h-52 w-52 rounded-full blur-3xl" style={{ background: "rgba(234,67,53,0.18)" }} />
      <div className="pointer-events-none absolute left-1/3 bottom-10 h-56 w-56 rounded-full blur-3xl" style={{ background: "rgba(251,188,5,0.18)" }} />
      <div className="pointer-events-none absolute right-1/4 bottom-28 h-52 w-52 rounded-full blur-3xl" style={{ background: "rgba(52,168,83,0.16)" }} />
      <div className="mx-auto max-w-md space-y-3">
        <div className="rounded-3xl border bg-white/95 p-4 shadow-sm backdrop-blur" style={{ borderColor: google.line }}>
          <div className="text-xs font-bold uppercase" style={{ color: "#5F6368" }}>Erika Coding Birthday Book</div>
          <div className="text-lg font-black" style={{ color: google.ink }}>Mobile Sections</div>
          <div className="mt-3 h-2 w-full rounded-full" style={{ background: "#E8EAED" }}>
            <motion.div
              className="h-2 rounded-full"
              style={{ background: google.blue }}
              animate={{ width: `${((index + 1) / sections.length) * 100}%` }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            />
          </div>
          <div className="mt-1 text-xs" style={{ color: "#5F6368" }}>{index + 1}/{sections.length}</div>
        </div>

        <Current friendName={friendName} />

        <div className="grid grid-cols-2 gap-2 pb-4">
          <Button variant="outline" disabled={index === 0} onClick={() => setIndex((i) => Math.max(0, i - 1))}>Previous</Button>
          <Button disabled={index === sections.length - 1} onClick={() => setIndex((i) => Math.min(sections.length - 1, i + 1))}>Next</Button>
        </div>
      </div>
    </div>
  );
}
