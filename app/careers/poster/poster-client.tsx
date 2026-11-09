"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import QRCode from "qrcode"
import { Download, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useOpenings } from "@/components/home/use-openings"

const SITE = "https://fossap.in"
const W = 1080
const H = 1350
// System fonts only, so the exported PNG matches the on-screen preview exactly.
const FONT = "Arial, Helvetica, sans-serif"

const NAVY = "#071426"
const BLUE = "#0057a8"
const CREAM = "#f6f1ea"
const GRAY = "#4b5563"

// Domains from the internship program announcement, used when no live data is available.
const DEFAULT_DOMAINS = [
  "Agentic AI",
  "Website Development",
  "Digital Marketing",
  "UI/UX Design",
  "AI Automation",
  "System Design",
  "DevOps",
]

const clip = (s: string, n = 26) => (s.length > n ? `${s.slice(0, n - 1)}…` : s)

async function toDataUrl(url: string): Promise<string> {
  const blob = await (await fetch(url)).blob()
  return await new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}

export function PosterClient() {
  const { openings, loading } = useOpenings()
  const [logo, setLogo] = useState<string>("")
  const [qr, setQr] = useState<string>("")
  const [busy, setBusy] = useState(false)
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    toDataUrl("/logos/foss-andhra-logo.png").then(setLogo).catch(() => setLogo(""))
    QRCode.toDataURL(`${SITE}/careers`, { margin: 1, width: 300, color: { dark: NAVY, light: "#ffffff" } })
      .then(setQr)
      .catch(() => setQr(""))
  }, [])

  const { eyebrow, line1, line2, sub, items } = useMemo(() => {
    const internships = openings.filter((o) => o.type === "internship")
    if (internships.length > 0 || openings.length === 0) {
      const names =
        internships.length > 0
          ? internships.map((o) => (o.title.replace(/\s*intern(ship)?$/i, "") || o.title).trim())
          : DEFAULT_DOMAINS
      return {
        eyebrow: "CAREERS & INTERNSHIPS",
        line1: "Internship Program",
        line2: "is now open.",
        sub: ["Learn, grow and gain practical", "experience with FOSS Andhra."],
        items: names,
      }
    }
    return {
      eyebrow: "CAREERS & OPPORTUNITIES",
      line1: "Openings at",
      line2: "FOSS Andhra.",
      sub: ["Jobs, fellowships and collaborations", "with Andhra Pradesh's FOSS community."],
      items: openings.map((o) => o.title),
    }
  }, [openings])

  const shown = items.slice(0, 8)

  const download = async () => {
    const svg = svgRef.current
    if (!svg) return
    setBusy(true)
    try {
      const xml = new XMLSerializer().serializeToString(svg)
      const url = URL.createObjectURL(new Blob([xml], { type: "image/svg+xml;charset=utf-8" }))
      const img = new Image()
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve()
        img.onerror = () => reject(new Error("render failed"))
        img.src = url
      })
      const scale = 2
      const canvas = document.createElement("canvas")
      canvas.width = W * scale
      canvas.height = H * scale
      const ctx = canvas.getContext("2d")
      if (!ctx) throw new Error("no canvas")
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      URL.revokeObjectURL(url)
      const blob: Blob | null = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"))
      if (!blob) throw new Error("export failed")
      const a = document.createElement("a")
      a.href = URL.createObjectURL(blob)
      a.download = "foss-andhra-openings-poster.png"
      a.click()
      setTimeout(() => URL.revokeObjectURL(a.href), 2000)
    } catch (e) {
      console.error(e)
      alert("Could not create the PNG. Try again, or take a screenshot of the poster.")
    } finally {
      setBusy(false)
    }
  }

  const colX = [60, 550]
  const rowY = (r: number) => 640 + r * 92

  return (
    <div className="mx-auto max-w-xl">
      <div className="overflow-hidden rounded-lg border border-border shadow-sm">
        <svg
          ref={svgRef}
          xmlns="http://www.w3.org/2000/svg"
          viewBox={`0 0 ${W} ${H}`}
          width="100%"
          role="img"
          aria-label="Poster: FOSS Andhra openings and internships"
          style={{ display: "block", background: CREAM }}
        >
          <rect width={W} height={H} fill={CREAM} />

          {/* Header */}
          <rect width={W} height={160} fill="#ffffff" />
          <rect y={158} width={W} height={4} fill={BLUE} />
          {logo && <image href={logo} x={60} y={35} width={201} height={90} preserveAspectRatio="xMidYMid meet" />}
          <text x={W - 60} y={92} textAnchor="end" fontFamily={FONT} fontSize={17} fontWeight={700} letterSpacing={2} fill={NAVY}>
            OPEN TECHNOLOGY FOR A
          </text>
          <text x={W - 60} y={118} textAnchor="end" fontFamily={FONT} fontSize={17} fontWeight={700} letterSpacing={2} fill={NAVY}>
            STRONGER ANDHRA PRADESH
          </text>

          {/* Headline */}
          <text x={60} y={250} fontFamily={FONT} fontSize={24} fontWeight={700} letterSpacing={5} fill={BLUE}>
            {eyebrow}
          </text>
          <text x={60} y={350} fontFamily={FONT} fontSize={92} fontWeight={800} fill={NAVY}>
            {line1}
          </text>
          <text x={60} y={450} fontFamily={FONT} fontSize={92} fontWeight={800} fill={BLUE}>
            {line2}
          </text>
          <text x={60} y={520} fontFamily={FONT} fontSize={34} fill={GRAY}>
            {sub[0]}
          </text>
          <text x={60} y={566} fontFamily={FONT} fontSize={34} fill={GRAY}>
            {sub[1]}
          </text>

          {/* Items */}
          {shown.map((name, i) => {
            const col = i % 2
            const row = Math.floor(i / 2)
            const x = colX[col]
            const y = rowY(row)
            return (
              <g key={`${name}-${i}`}>
                <rect x={x} y={y} width={470} height={72} rx={14} fill="#ffffff" stroke="#d9d2c7" strokeWidth={2} />
                <circle cx={x + 40} cy={y + 36} r={20} fill={BLUE} />
                <text x={x + 40} y={y + 44} textAnchor="middle" fontFamily={FONT} fontSize={22} fontWeight={700} fill="#ffffff">
                  {i + 1}
                </text>
                <text x={x + 76} y={y + 46} fontFamily={FONT} fontSize={30} fontWeight={700} fill={NAVY}>
                  {clip(name)}
                </text>
              </g>
            )
          })}

          {/* Members callout */}
          <rect x={60} y={1018} width={960} height={110} rx={18} fill={BLUE} />
          <text x={W / 2} y={1073} textAnchor="middle" fontFamily={FONT} fontSize={40} fontWeight={800} fill="#ffffff">
            Open to FOSStar members
          </text>
          <text x={W / 2} y={1111} textAnchor="middle" fontFamily={FONT} fontSize={28} fill="#dbeafe">
            Join at fossap.in/membership
          </text>

          {/* Apply + QR */}
          <text x={60} y={1205} fontFamily={FONT} fontSize={48} fontWeight={800} fill={NAVY}>
            Apply now
          </text>
          <text x={60} y={1252} fontFamily={FONT} fontSize={36} fontWeight={700} fill={BLUE}>
            fossap.in/careers
          </text>
          <text x={60} y={1292} fontFamily={FONT} fontSize={26} fill={GRAY}>
            Share with your classmates and friends.
          </text>
          <rect x={W - 60 - 160} y={1150} width={160} height={160} rx={10} fill="#ffffff" stroke="#d9d2c7" strokeWidth={2} />
          {qr && <image href={qr} x={W - 60 - 150} y={1155} width={150} height={150} />}

          <text x={W / 2} y={1336} textAnchor="middle" fontFamily={FONT} fontSize={20} fill={GRAY}>
            FOSS Andhra · Free &amp; Open Source Software community
          </text>
        </svg>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <Button onClick={download} disabled={busy || loading || !logo || !qr}>
          {busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
          Download PNG
        </Button>
        <p className="text-xs text-muted-foreground">
          1080 × 1350 (shared at 2×). The poster updates automatically with the current openings.
        </p>
      </div>
    </div>
  )
}
