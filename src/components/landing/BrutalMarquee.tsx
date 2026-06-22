'use client'

const MARQUEE = [
  'JSON ONLY',
  'ZERO BOILERPLATE',
  'INSTANT DEPLOY',
  'NO BACKEND CODE',
  'SCHEMA DRIVEN',
  'RAW POWER',
  'BUILD NOW',
  'NO EXCUSES',
]

export default function BrutalMarquee() {
  const items = [...MARQUEE, ...MARQUEE]
  return (
    <div className="brutal-border bg-black text-[#ffe600] py-2.5 overflow-hidden border-x-0">
      <div className="flex animate-brutal-marquee w-max gap-10">
        {items.map((item, i) => (
          <span
            key={i}
            className="text-sm font-black uppercase tracking-[0.25em] whitespace-nowrap font-mono"
          >
            ★ {item} ★
          </span>
        ))}
      </div>
    </div>
  )
}
