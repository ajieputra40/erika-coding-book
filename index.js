import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Sparkles, Search, Star, Heart, Gift, Cake, Laptop, Cloud, Balloon, CheckCircle2, ArrowLeft, ArrowRight, RotateCcw, Palette, PenLine } from "lucide-react";

const erikaAvatar = "data:image/jpeg;base64,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";

const brand = {
  blue: "#4285F4",
  red: "#EA4335",
  yellow: "#FBBC05",
  green: "#34A853",
  cream: "#FFF9F2",
  ink: "#1F2937",
};

const colorOptions = [brand.red, brand.blue, brand.yellow, brand.green, "#F9A8D4", "#A78BFA"];

function DotPattern() {
  return (
    <div className="absolute inset-0 opacity-25 pointer-events-none" aria-hidden>
      <div className="absolute top-8 left-8 h-3 w-3 rounded-full" style={{ background: brand.blue }} />
      <div className="absolute top-14 right-20 h-4 w-4 rounded-full" style={{ background: brand.red }} />
      <div className="absolute bottom-20 left-16 h-5 w-5 rounded-full" style={{ background: brand.yellow }} />
      <div className="absolute bottom-10 right-10 h-3 w-3 rounded-full" style={{ background: brand.green }} />
    </div>
  );
}

function PageFrame({ title, subtitle, children, page, total, accent = brand.blue }) {
  return (
    <motion.div
      key={title}
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.98 }}
      transition={{ duration: 0.35 }}
      className="w-full"
    >
      <Card className="relative overflow-hidden rounded-[2rem] border-0 shadow-2xl bg-white/95 backdrop-blur">
        <DotPattern />
        <div className="absolute inset-x-0 top-0 h-3" style={{ background: `linear-gradient(90deg, ${brand.blue}, ${brand.red}, ${brand.yellow}, ${brand.green})` }} />
        <CardContent className="relative p-6 md:p-8 min-h-[780px] flex flex-col gap-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold text-white shadow" style={{ background: accent }}>
                <Sparkles className="h-4 w-4" /> Page {page} of {total}
              </div>
              <h1 className="mt-4 text-3xl md:text-5xl font-black tracking-tight text-slate-800">{title}</h1>
              {subtitle ? <p className="mt-3 max-w-2xl text-base md:text-lg text-slate-600">{subtitle}</p> : null}
            </div>
            <motion.img
              src={erikaAvatar}
              alt="Erika"
              className="hidden md:block h-28 w-28 rounded-[1.5rem] border-4 object-cover shadow-lg"
              style={{ borderColor: accent }}
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 2.6, repeat: Infinity }}
            />
          </div>
          <div className="flex-1">{children}</div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function CoverPage() {
  return (
    <PageFrame title="Erika’s Little Coding Adventure" subtitle="A fun birthday activity book for my friends" page={1} total={12} accent={brand.blue}>
      <div className="grid md:grid-cols-[1.1fr_0.9fr] gap-6 h-full items-center">
        <div className="space-y-5">
          <div className="inline-flex flex-wrap gap-2">
            {["Google colors", "Age 3 friendly", "Birthday fun", "Interactive"] .map((item) => (
              <span key={item} className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">{item}</span>
            ))}
          </div>
          <div className="rounded-[2rem] p-6 shadow-inner border border-slate-100" style={{ background: "linear-gradient(135deg, #EFF6FF, #FEF3C7, #FCE7F3)" }}>
            <p className="text-lg md:text-xl leading-8 text-slate-700">
              Welcome to Erika’s magical mini coding world — full of colors, shapes, search bars, robots, icons, and birthday surprises.
            </p>
            <p className="mt-4 text-base text-slate-600">
              Tap through each page, play the games, and celebrate Erika turning <span className="font-black" style={{ color: brand.red }}>3 years old</span>.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Blue", color: brand.blue },
              { label: "Red", color: brand.red },
              { label: "Yellow", color: brand.yellow },
              { label: "Green", color: brand.green },
            ].map((item) => (
              <motion.div key={item.label} whileHover={{ scale: 1.04, rotate: -1 }} className="rounded-[1.5rem] p-5 text-white shadow-xl" style={{ background: item.color }}>
                <div className="text-sm opacity-90">Google color</div>
                <div className="text-2xl font-black">{item.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
        <div className="relative flex justify-center items-center">
          <motion.div className="absolute -top-4 right-6 rounded-full p-3 shadow-xl bg-white" animate={{ y: [0, -8, 0] }} transition={{ duration: 2, repeat: Infinity }}>
            <Cake className="h-7 w-7" style={{ color: brand.red }} />
          </motion.div>
          <motion.div className="absolute bottom-8 left-6 rounded-full p-3 shadow-xl bg-white" animate={{ x: [0, 10, 0] }} transition={{ duration: 2.6, repeat: Infinity }}>
            <Search className="h-7 w-7" style={{ color: brand.blue }} />
          </motion.div>
          <motion.img
            src={erikaAvatar}
            alt="Erika portrait"
            className="w-full max-w-md rounded-[2rem] border-8 bg-white object-cover shadow-2xl"
            style={{ borderColor: "#FDE68A" }}
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 2.8, repeat: Infinity }}
          />
        </div>
      </div>
    </PageFrame>
  );
}

function WelcomePage() {
  return (
    <PageFrame title="Welcome" subtitle="Hi, I’m Erika! Let’s play in my colorful coding world!" page={2} total={12} accent={brand.red}>
      <div className="grid md:grid-cols-2 gap-6 items-center">
        <motion.div className="rounded-[2rem] bg-gradient-to-br from-pink-50 to-yellow-50 p-6 border border-pink-100" animate={{ rotate: [0, 1, 0, -1, 0] }} transition={{ duration: 5, repeat: Infinity }}>
          <img src={erikaAvatar} alt="Erika smiling" className="mx-auto w-64 rounded-[2rem] shadow-xl" />
        </motion.div>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: Search, label: "Search" , color: brand.blue},
              { icon: Laptop, label: "Code" , color: brand.red},
              { icon: Star, label: "Play" , color: brand.yellow},
              { icon: Gift, label: "Birthday" , color: brand.green},
            ].map(({ icon: Icon, label, color }) => (
              <motion.div key={label} whileHover={{ y: -6 }} className="rounded-[1.5rem] bg-white p-5 shadow-md border border-slate-100">
                <div className="mb-3 inline-flex rounded-2xl p-3" style={{ background: `${color}20` }}>
                  <Icon className="h-6 w-6" style={{ color }} />
                </div>
                <div className="text-lg font-bold text-slate-800">{label}</div>
              </motion.div>
            ))}
          </div>
          <div className="rounded-[2rem] p-6 text-slate-700 leading-8 border border-slate-100 shadow-inner" style={{ background: "linear-gradient(180deg, #FFFFFF, #F8FAFC)" }}>
            This online book is made for Erika’s birthday hampers, with playful activities inspired by Google’s colorful world. Every page has something to tap, move, match, count, or imagine.
          </div>
        </div>
      </div>
    </PageFrame>
  );
}

function ColorSearchPage() {
  const [searchColor, setSearchColor] = useState("#ffffff");
  const [objects, setObjects] = useState([
    { id: 1, label: "star", icon: Star, color: brand.yellow },
    { id: 2, label: "heart", icon: Heart, color: "#F472B6" },
    { id: 3, label: "balloon", icon: Balloon, color: brand.red },
    { id: 4, label: "laptop", icon: Laptop, color: brand.blue },
  ]);

  const shuffleColors = () => {
    setObjects((prev) => prev.map((item, idx) => ({ ...item, color: colorOptions[(idx + Math.floor(Math.random() * colorOptions.length)) % colorOptions.length] })));
    setSearchColor(colorOptions[Math.floor(Math.random() * colorOptions.length)]);
  };

  return (
    <PageFrame title="Color the Search Page" subtitle="Tap the palette to recolor Erika’s big search bar and the cute objects around it." page={3} total={12} accent={brand.yellow}>
      <div className="space-y-6">
        <div className="flex flex-wrap gap-3">
          {colorOptions.map((c) => (
            <button key={c} onClick={() => setSearchColor(c)} className="h-11 w-11 rounded-full border-4 shadow transition hover:scale-110" style={{ background: c, borderColor: "white" }} aria-label={`Select color ${c}`} />
          ))}
          <Button className="rounded-full" variant="outline" onClick={shuffleColors}><Palette className="mr-2 h-4 w-4" /> Surprise colors</Button>
        </div>
        <div className="relative mx-auto mt-4 max-w-4xl rounded-[2rem] border bg-gradient-to-br from-sky-50 to-pink-50 p-8 min-h-[420px] overflow-hidden">
          <motion.div className="mx-auto flex max-w-3xl items-center gap-4 rounded-full border-4 px-6 py-5 shadow-xl" style={{ background: searchColor, borderColor: brand.blue }} animate={{ scale: [1, 1.01, 1] }} transition={{ duration: 2, repeat: Infinity }}>
            <Search className="h-7 w-7 text-slate-500" />
            <span className="text-xl font-bold text-slate-500">Search for birthday fun</span>
          </motion.div>
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
            {objects.map(({ id, label, icon: Icon, color }) => (
              <motion.button key={id} whileTap={{ scale: 0.92 }} onClick={() => setObjects((prev) => prev.map((obj) => obj.id === id ? { ...obj, color: colorOptions[Math.floor(Math.random() * colorOptions.length)] } : obj))} className="rounded-[1.5rem] bg-white p-5 shadow-lg border border-slate-100 flex flex-col items-center gap-3">
                <div className="rounded-full p-4" style={{ background: `${color}22` }}>
                  <Icon className="h-10 w-10" style={{ color }} />
                </div>
                <div className="capitalize font-bold text-slate-700">{label}</div>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </PageFrame>
  );
}

function TraceRobotPage() {
  const pathPoints = useMemo(() => [0, 18, 37, 54, 70, 84, 100], []);
  const [step, setStep] = useState(0);
  return (
    <PageFrame title="Trace the Path" subtitle="Help Erika’s robot reach the birthday cake. Tap Next Step to move it along the path." page={4} total={12} accent={brand.green}>
      <div className="space-y-6">
        <div className="rounded-[2rem] bg-slate-50 border p-6 relative overflow-hidden min-h-[430px]">
          <svg viewBox="0 0 1000 330" className="w-full h-[320px]">
            <path d="M60 250 C180 80, 260 80, 340 180 S540 290, 640 170 S820 80, 940 180" fill="none" stroke="#CBD5E1" strokeWidth="36" strokeLinecap="round" strokeDasharray="1 26" />
            <path d="M60 250 C180 80, 260 80, 340 180 S540 290, 640 170 S820 80, 940 180" fill="none" stroke="#93C5FD" strokeWidth="24" strokeLinecap="round" />
            <circle cx="60" cy="250" r="22" fill={brand.blue} />
            <circle cx="940" cy="180" r="28" fill={brand.red} />
          </svg>
          <motion.div className="absolute left-0 top-0" animate={{ left: `${pathPoints[step]}%`, top: step % 2 === 0 ? 160 : 90 }} transition={{ type: "spring", stiffness: 90, damping: 14 }}>
            <div className="relative -translate-x-1/2 rounded-[1.5rem] bg-white p-4 shadow-2xl border">
              <Laptop className="h-12 w-12" style={{ color: brand.blue }} />
              <div className="text-xs font-bold text-slate-600 mt-1">Robot</div>
            </div>
          </motion.div>
          <motion.div className="absolute right-10 top-24 rounded-[2rem] bg-white p-4 shadow-xl border" animate={{ rotate: [0, 5, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
            <Cake className="h-14 w-14" style={{ color: brand.red }} />
          </motion.div>
        </div>
        <div className="flex flex-wrap gap-3 items-center">
          <Button className="rounded-full" onClick={() => setStep((s) => Math.max(0, s - 1))}>Back Step</Button>
          <Button className="rounded-full" onClick={() => setStep((s) => Math.min(pathPoints.length - 1, s + 1))}>Next Step</Button>
          <Button className="rounded-full" variant="outline" onClick={() => setStep(0)}><RotateCcw className="mr-2 h-4 w-4" /> Reset</Button>
          {step === pathPoints.length - 1 && <span className="inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-2 font-semibold text-green-700"><CheckCircle2 className="h-4 w-4" /> Yay! The robot found the cake.</span>}
        </div>
      </div>
    </PageFrame>
  );
}

function MatchColorsPage() {
  const targets = [brand.red, brand.blue, brand.yellow, brand.green];
  const labels = ["Red", "Blue", "Yellow", "Green"];
  const [matches, setMatches] = useState([null, null, null, null]);
  const score = matches.filter((m, i) => m === targets[i]).length;

  return (
    <PageFrame title="Match the Colors" subtitle="Choose the right color for each word. Red, blue, yellow, green!" page={5} total={12} accent={brand.blue}>
      <div className="grid md:grid-cols-[1fr_220px] gap-6">
        <div className="space-y-4">
          {labels.map((label, idx) => (
            <div key={label} className="rounded-[1.5rem] border bg-white p-4 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="text-2xl font-black text-slate-800">{label}</div>
              <div className="flex gap-3 flex-wrap">
                {targets.map((color) => (
                  <button key={color} onClick={() => setMatches((prev) => prev.map((m, i) => i === idx ? color : m))} className={`h-12 w-12 rounded-full border-4 shadow ${matches[idx] === color ? 'scale-110' : ''}`} style={{ background: color, borderColor: matches[idx] === color ? '#111827' : 'white' }} />
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="rounded-[2rem] border bg-gradient-to-b from-sky-50 to-white p-6 shadow-xl flex flex-col justify-center">
          <div className="text-sm font-semibold uppercase tracking-wide text-slate-500">Score</div>
          <div className="mt-2 text-6xl font-black text-slate-800">{score}/4</div>
          <div className="mt-4 h-28 rounded-[1.5rem]" style={{ background: `linear-gradient(180deg, ${brand.red}, ${brand.blue}, ${brand.yellow}, ${brand.green})` }} />
          {score === 4 && <div className="mt-4 rounded-2xl bg-green-100 p-3 font-semibold text-green-700">Amazing! You matched every color.</div>}
        </div>
      </div>
    </PageFrame>
  );
}

function FindIconPage() {
  const items = useMemo(() => {
    const base = [
      { id: 1, type: 'star', Icon: Star, color: brand.yellow },
      { id: 2, type: 'heart', Icon: Heart, color: '#F472B6' },
      { id: 3, type: 'balloon', Icon: Balloon, color: brand.red },
      { id: 4, type: 'laptop', Icon: Laptop, color: brand.blue },
    ];
    const out = [];
    for (let i = 0; i < 4; i++) out.push(...base.map((item) => ({ ...item, id: `${item.type}-${i}` })));
    return out.sort(() => Math.random() - 0.5);
  }, []);
  const [selected, setSelected] = useState([]);
  const goal = 16;
  return (
    <PageFrame title="Find the Icon" subtitle="Tap the stars, hearts, balloons, and laptops to circle them." page={6} total={12} accent={brand.red}>
      <div className="space-y-5">
        <div className="rounded-[1.5rem] bg-slate-50 border p-4 font-medium text-slate-700">Found: {selected.length} / {goal}</div>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
          {items.map(({ id, type, Icon, color }) => {
            const active = selected.includes(id);
            return (
              <motion.button key={id} whileTap={{ scale: 0.92 }} onClick={() => setSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id])} className="aspect-square rounded-[1.5rem] border bg-white shadow-sm flex items-center justify-center relative">
                {active && <div className="absolute inset-1 rounded-[1.25rem] border-4 border-dashed" style={{ borderColor: brand.green }} />}
                <Icon className="h-10 w-10" style={{ color }} />
              </motion.button>
            );
          })}
        </div>
        {selected.length === goal && <div className="rounded-2xl bg-green-100 p-4 font-semibold text-green-700">Great job! You found all the icons.</div>}
      </div>
    </PageFrame>
  );
}

function PatternPuzzlePage() {
  const pattern = [brand.red, brand.blue, brand.yellow, brand.green];
  const [answers, setAnswers] = useState([null, null, null, null]);
  const correct = answers.every((a, i) => a === pattern[i]);
  return (
    <PageFrame title="Simple Pattern Puzzle" subtitle="The pattern is red-blue-yellow-green. Can you continue it?" page={7} total={12} accent={brand.yellow}>
      <div className="space-y-6">
        <div className="flex flex-wrap gap-4">
          {pattern.map((c, i) => <div key={i} className="h-20 w-20 rounded-[1.5rem] shadow-lg" style={{ background: c }} />)}
          <span className="self-center text-4xl font-black text-slate-400">→</span>
          {answers.map((a, i) => <div key={i} className="h-20 w-20 rounded-[1.5rem] border-4 border-dashed flex items-center justify-center shadow-sm" style={{ background: a || '#fff', borderColor: '#CBD5E1' }} />)}
        </div>
        <div className="flex flex-wrap gap-3">
          {pattern.map((c) => (
            <button key={c} onClick={() => setAnswers((prev) => {
              const idx = prev.findIndex((v) => v === null);
              if (idx === -1) return prev;
              return prev.map((v, i) => i === idx ? c : v);
            })} className="h-14 w-14 rounded-full border-4 shadow" style={{ background: c, borderColor: 'white' }} />
          ))}
          <Button variant="outline" className="rounded-full" onClick={() => setAnswers([null, null, null, null])}><RotateCcw className="mr-2 h-4 w-4" /> Clear</Button>
        </div>
        {correct && <div className="rounded-2xl bg-green-100 p-4 font-semibold text-green-700">Nice! You continued the pattern perfectly.</div>}
      </div>
    </PageFrame>
  );
}

function CountCuteThingsPage() {
  const counts = { cupcakes: 3, balloons: 4, computers: 2, clouds: 5 };
  const [answers, setAnswers] = useState({ cupcakes: '', balloons: '', computers: '', clouds: '' });
  const allCorrect = Object.entries(counts).every(([k, v]) => String(v) === answers[k]);
  const iconMap = {
    cupcakes: Cake,
    balloons: Balloon,
    computers: Laptop,
    clouds: Cloud,
  };
  const colorMap = {
    cupcakes: brand.red,
    balloons: brand.blue,
    computers: brand.green,
    clouds: brand.yellow,
  };
  return (
    <PageFrame title="Count the Cute Things" subtitle="Count cupcakes, balloons, computers, and clouds — then type the number." page={8} total={12} accent={brand.green}>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(counts).map(([key, value]) => {
            const Icon = iconMap[key];
            const color = colorMap[key];
            return (
              <div key={key} className="rounded-[1.5rem] border bg-white p-5 shadow-sm">
                <div className="capitalize text-lg font-black text-slate-800 mb-3">{key}</div>
                <div className="flex flex-wrap gap-2">
                  {Array.from({ length: value }).map((_, idx) => <Icon key={idx} className="h-8 w-8" style={{ color }} />)}
                </div>
              </div>
            );
          })}
        </div>
        <div className="rounded-[2rem] border bg-gradient-to-b from-pink-50 to-white p-6 shadow-xl space-y-4">
          {Object.keys(counts).map((key) => (
            <div key={key}>
              <label className="mb-2 block capitalize font-bold text-slate-700">How many {key}?</label>
              <Input value={answers[key]} onChange={(e) => setAnswers((prev) => ({ ...prev, [key]: e.target.value.replace(/\D/g, '').slice(0, 1) }))} className="h-12 rounded-2xl text-lg" />
            </div>
          ))}
          {allCorrect && <div className="rounded-2xl bg-green-100 p-4 font-semibold text-green-700">Perfect counting! You got every answer right.</div>}
        </div>
      </div>
    </PageFrame>
  );
}

function MazePage() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const goal = { x: 4, y: 4 };
  const size = 5;
  const walls = new Set(["1,0", "1,1", "3,1", "3,2", "1,3", "2,3"]);
  const move = (dx, dy) => setPos((prev) => {
    const next = { x: prev.x + dx, y: prev.y + dy };
    if (next.x < 0 || next.x >= size || next.y < 0 || next.y >= size) return prev;
    if (walls.has(`${next.x},${next.y}`)) return prev;
    return next;
  });
  const won = pos.x === goal.x && pos.y === goal.y;
  return (
    <PageFrame title="Maze Page" subtitle="Help Erika get to her birthday gift. Use the arrow buttons to move." page={9} total={12} accent={brand.blue}>
      <div className="grid md:grid-cols-[1fr_240px] gap-6 items-start">
        <div className="grid grid-cols-5 gap-2 max-w-xl">
          {Array.from({ length: size * size }).map((_, idx) => {
            const x = idx % size;
            const y = Math.floor(idx / size);
            const isWall = walls.has(`${x},${y}`);
            const isPlayer = pos.x === x && pos.y === y;
            const isGoal = goal.x === x && goal.y === y;
            return (
              <div key={idx} className="aspect-square rounded-[1rem] border flex items-center justify-center text-2xl font-black"
                style={{
                  background: isWall ? '#CBD5E1' : isGoal ? '#FEF3C7' : '#FFFFFF',
                  borderColor: '#E5E7EB'
                }}>
                {isPlayer ? '🤖' : isGoal ? '🎁' : ''}
              </div>
            );
          })}
        </div>
        <div className="rounded-[2rem] border bg-white p-5 shadow-xl">
          <div className="grid grid-cols-3 gap-3 max-w-[180px] mx-auto">
            <div />
            <Button className="rounded-2xl h-14" onClick={() => move(0, -1)}>↑</Button>
            <div />
            <Button className="rounded-2xl h-14" onClick={() => move(-1, 0)}>←</Button>
            <Button className="rounded-2xl h-14" variant="outline" onClick={() => setPos({ x: 0, y: 0 })}>⟳</Button>
            <Button className="rounded-2xl h-14" onClick={() => move(1, 0)}>→</Button>
            <div />
            <Button className="rounded-2xl h-14" onClick={() => move(0, 1)}>↓</Button>
            <div />
          </div>
          {won && <div className="mt-4 rounded-2xl bg-green-100 p-4 font-semibold text-green-700">You did it! Erika reached the gift.</div>}
        </div>
      </div>
    </PageFrame>
  );
}

function DrawYourselfPage() {
  const [stickers, setStickers] = useState([]);
  const addSticker = (emoji) => setStickers((prev) => [...prev, { emoji, x: 20 + (prev.length * 38) % 280, y: 24 + (prev.length * 30) % 220 }]);
  return (
    <PageFrame title="Sticker / Draw Yourself Page" subtitle="Draw yourself as a future coder! Add some fun stickers too." page={10} total={12} accent={brand.red}>
      <div className="space-y-5">
        <div className="flex flex-wrap gap-3">
          {["⭐", "💻", "🎂", "🎈", "☁️", "❤️"].map((emoji) => <Button key={emoji} className="rounded-full text-xl" variant="outline" onClick={() => addSticker(emoji)}>{emoji}</Button>)}
          <Button className="rounded-full" variant="outline" onClick={() => setStickers([])}><RotateCcw className="mr-2 h-4 w-4" /> Clear stickers</Button>
        </div>
        <div className="relative min-h-[420px] rounded-[2rem] border-4 border-dashed bg-white p-6 overflow-hidden" style={{ borderColor: '#F9A8D4' }}>
          <div className="text-center text-xl font-bold text-slate-400 mt-24">Imagine yourself here as a future coder ✨</div>
          <div className="text-center text-slate-400 mt-3">Tap the sticker buttons to decorate the page.</div>
          {stickers.map((sticker, idx) => (
            <motion.div key={`${sticker.emoji}-${idx}`} drag className="absolute text-4xl cursor-grab" initial={{ x: sticker.x, y: sticker.y }} whileDrag={{ scale: 1.1 }}>
              {sticker.emoji}
            </motion.div>
          ))}
        </div>
      </div>
    </PageFrame>
  );
}

function NameWritingPage() {
  const [name, setName] = useState("");
  return (
    <PageFrame title="Name Writing Page" subtitle="This book belongs to: _______" page={11} total={12} accent={brand.green}>
      <div className="grid md:grid-cols-2 gap-6 items-center">
        <div className="rounded-[2rem] border bg-gradient-to-br from-yellow-50 to-white p-6 shadow-inner">
          <label className="text-lg font-bold text-slate-700">Type your name here</label>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className="mt-4 h-14 rounded-2xl text-xl" />
          <div className="mt-6 rounded-[1.5rem] border-2 border-dashed p-5 text-2xl font-black text-slate-700 min-h-[120px] flex items-center justify-center text-center">
            {name ? `${name}'s coding book` : "Your name will appear here"}
          </div>
        </div>
        <div className="rounded-[2rem] border bg-white p-6 shadow-xl">
          <div className="text-sm uppercase tracking-wide text-slate-500 font-semibold">Practice line</div>
          <div className="mt-5 space-y-4">
            {Array.from({ length: 5 }).map((_, idx) => <div key={idx} className="h-0.5 w-full bg-slate-200" />)}
          </div>
          <div className="mt-8 inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 font-semibold text-blue-700"><PenLine className="h-4 w-4" /> You can also print this page for handwriting practice.</div>
        </div>
      </div>
    </PageFrame>
  );
}

function BackPage() {
  return (
    <PageFrame title="Thank You" subtitle="Thank you for celebrating Erika’s birthday!" page={12} total={12} accent={brand.yellow}>
      <div className="h-full grid place-items-center">
        <motion.div className="max-w-3xl rounded-[2.5rem] border bg-white p-10 shadow-2xl text-center" animate={{ y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity }}>
          <img src={erikaAvatar} alt="Erika" className="mx-auto h-40 w-40 rounded-[2rem] object-cover shadow-lg border-4" style={{ borderColor: brand.red }} />
          <h2 className="mt-6 text-4xl font-black text-slate-800">See you again in Erika’s colorful world!</h2>
          <p className="mt-4 text-lg leading-8 text-slate-600">Thanks for playing, tapping, matching, counting, and celebrating this special day. Keep dreaming big, keep learning, and keep creating.</p>
          <div className="mt-6 flex justify-center gap-3 flex-wrap">
            {[brand.blue, brand.red, brand.yellow, brand.green].map((c, idx) => <div key={idx} className="h-6 w-20 rounded-full" style={{ background: c }} />)}
          </div>
        </motion.div>
      </div>
    </PageFrame>
  );
}

const pages = [
  CoverPage,
  WelcomePage,
  ColorSearchPage,
  TraceRobotPage,
  MatchColorsPage,
  FindIconPage,
  PatternPuzzlePage,
  CountCuteThingsPage,
  MazePage,
  DrawYourselfPage,
  NameWritingPage,
  BackPage,
];

export default function ErikaCodingBook() {
  const [pageIndex, setPageIndex] = useState(0);
  const CurrentPage = pages[pageIndex];
  const progress = ((pageIndex + 1) / pages.length) * 100;

  return (
    <div className="min-h-screen w-full bg-[radial-gradient(circle_at_top,_#ffffff,_#dbeafe,_#fef3c7)] p-4 md:p-8">
      <div className="mx-auto max-w-6xl space-y-4">
        <div className="rounded-[2rem] bg-white/80 backdrop-blur border shadow-lg p-4 md:p-5 flex flex-col md:flex-row md:items-center gap-4 md:justify-between">
          <div>
            <div className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Erika turns 3</div>
            <div className="text-2xl md:text-3xl font-black text-slate-800">Interactive Birthday Coding Book</div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-40"><Progress value={progress} className="h-3 rounded-full" /></div>
            <div className="text-sm font-bold text-slate-600">{pageIndex + 1}/{pages.length}</div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <CurrentPage key={pageIndex} />
        </AnimatePresence>

        <div className="rounded-[2rem] bg-white/90 border shadow-lg p-4 flex items-center justify-between">
          <Button className="rounded-full" variant="outline" onClick={() => setPageIndex((p) => Math.max(0, p - 1))} disabled={pageIndex === 0}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Previous
          </Button>
          <div className="text-sm md:text-base font-semibold text-slate-600 text-center px-4">Tap through Erika’s Google-inspired mini adventure book</div>
          <Button className="rounded-full" onClick={() => setPageIndex((p) => Math.min(pages.length - 1, p + 1))} disabled={pageIndex === pages.length - 1}>
            Next <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
